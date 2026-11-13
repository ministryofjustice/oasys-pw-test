import * as fs from 'fs-extra'

import { Ogrs } from 'fixtures'
import { OgrsInputParams, OgrsOutputParams } from 'fixtures/ogrs/types'
import { addCalculatedInputParameters } from 'fixtures/ogrs/data/common'


// Load input parameters from a CSV file
export async function ogrsCsvTest(dataFile: string, staticFlag: 'Y' | 'N', mephedrone: 'Y' | null, reportMode: ReportMode, outputFile: string, ogrs: Ogrs) {

    let failures = 0
    let cases = 0
    let outputData: string[] = []

    const inputParameterFile = await fs.readFile(dataFile, 'utf8')
    const inputParameters = inputParameterFile.split('\r\n')

    for (let i = 0; i <= inputParameters.length - 1; i++) {
        cases++
        const testCaseParams = ogrs.createInputFromCsvLine(inputParameters[i])

        testCaseParams.STATIC_CALC = staticFlag
        // testCaseParams.MEPHEDRONE = mephedrone  // TODO add mephedrone for NOD-1387

        // Call the calculator in Oracle
        // TODO temporary hack until release 7.12 goes in to correct the 4.2 parameter and revert the coefficients
        testCaseParams.FOUR_POINT_TWO = testCaseParams.FOUR_POINT_TWO == null ? null : testCaseParams.FOUR_POINT_TWO / 2

        const functionCall = ogrs.getFunctionCall(testCaseParams)
        const oracleTestCaseResult = await ogrs.getOracleResult(functionCall)

        // TODO temporary hack until release 7.12 goes in to correct the 4.2 parameter and revert the coefficients
        testCaseParams.FOUR_POINT_TWO = testCaseParams.FOUR_POINT_TWO == null ? null : testCaseParams.FOUR_POINT_TWO * 2

        const testCaseIdentifier = (i)?.toString() ?? 'null'
        const testCaseResult = ogrs.calculateOgrsAndCompare(testCaseParams, oracleTestCaseResult, testCaseIdentifier, reportMode)

        outputData.push(createOutputCsvLine(testCaseIdentifier, oracleTestCaseResult))

        if (testCaseResult.failed) {
            failures++
            console.log(testCaseResult.identifier)
        }

    }

    await fs.writeFile(outputFile, outputData.join('\n'))

    log(' ')
    log(' ')
    log(`Cases: ${cases}, failures: ${failures}.`, 'Summary')
    expect(failures).toBe(0)
}


// Create test cases using OASys assessment data
export async function ogrsOracleTest(type: AssessmentOrCsrp, count: number, whereClause: string, reportMode: ReportMode, ogrs: Ogrs) {

    let failures = 0
    let cases = 0

    const oasysData = await ogrs.getOasysData(type, count, whereClause)

    for (const assessmentOrRsr of oasysData) {

        const testCaseParams = ogrs.getInputParams(type, assessmentOrRsr)

        // Run twice, for MEPHEDRONE Y and null     // TODO replace with Oracle values when there's some test data available after release of 7.13
        // for (let mephedrone of ['Y', null]) { // TODO add mephedrone for NOD-1387

        // Run twice, for static flag Y and N
        for (let staticFlag of ['Y', 'N']) {

            cases++
            // testCaseParams.MEPHEDRONE = mephedrone
            testCaseParams.STATIC_CALC = staticFlag

            // Call the calculator in Oracle
            // TODO temporary hack until release 7.12 goes in to correct the 4.2 parameter and revert the coefficients
            testCaseParams.FOUR_POINT_TWO = testCaseParams.FOUR_POINT_TWO == null ? null : testCaseParams.FOUR_POINT_TWO / 2

            const functionCall = ogrs.getFunctionCall(testCaseParams)
            const oracleTestCaseResult = await ogrs.getOracleResult(functionCall)

            // TODO temporary hack until release 7.12 goes in to correct the 4.2 parameter and revert the coefficients
            testCaseParams.FOUR_POINT_TWO = testCaseParams.FOUR_POINT_TWO == null ? null : testCaseParams.FOUR_POINT_TWO * 2

            // Call the calculator in Playwright and compare against the Oracle result
            const testCaseResult = ogrs.calculateOgrsAndCompare(testCaseParams, oracleTestCaseResult, assessmentOrRsr.pk.toString(), reportMode)

            if (testCaseResult.failed) {
                failures++
                console.log(testCaseResult.identifier)
            }

        }
        // }
    }

    log(' ')
    log(' ')
    log(`Cases: ${cases}, failures: ${failures}.`, 'Summary')
    expect(failures).toBe(0)
}

// Create test cases using OASys assessment data with a list of PKs
export async function ogrsPkCsvTest(dataFile: string, staticFlag: 'Y' | 'N', count: number, reportMode: ReportMode, outputFile: string, ogrs: Ogrs, assessmentDate?: string) {

    let failures = 0
    let cases = 0
    const outputData: string[] = []
    outputData.push(createOutputCsvHeader('OASYS_SET_PK', outputColumnsAllScores))

    const pkFile = await fs.readFile(dataFile, 'utf8')
    const pks = pkFile.split('\r\n')
    let numTests = pks.length
    if (count > 0 && count < numTests) {
        numTests = count
    }

    for (let i = 0; i < numTests; i++) {

        if (i % 1000 == 0) {
            console.log(i)
        }
        const oasysData = await ogrs.getOasysData('assessment', 1, `oasys_set_pk = ${pks[i]}`)
        const testCaseParams = ogrs.getInputParams('assessment', oasysData[0], assessmentDate)

        cases++
        testCaseParams.STATIC_CALC = staticFlag

        // Call the calculator in Oracle
        // TODO temporary hack until release 7.12 goes in to correct the 4.2 parameter and revert the coefficients
        testCaseParams.FOUR_POINT_TWO = testCaseParams.FOUR_POINT_TWO == null ? null : testCaseParams.FOUR_POINT_TWO / 2
        const functionCall = ogrs.getFunctionCall(testCaseParams)
        const oracleTestCaseResult = await ogrs.getOracleResult(functionCall)

        // TODO temporary hack until release 7.12 goes in to correct the 4.2 parameter and revert the coefficients
        testCaseParams.FOUR_POINT_TWO = testCaseParams.FOUR_POINT_TWO == null ? null : testCaseParams.FOUR_POINT_TWO * 2

        // Call the calculator in Playwright and compare against the Oracle result
        const testCaseResult = ogrs.calculateOgrsAndCompare(testCaseParams, oracleTestCaseResult, pks[i], reportMode)

        if (testCaseResult.failed) {
            failures++
            console.log(testCaseResult.identifier)
        }

        outputData.push(createOutputCsvLine(pks[i], oracleTestCaseResult, outputColumnsAllScores))
    }

    await fs.writeFile(outputFile, outputData.join('\n'))

    log(' ')
    log(' ')
    log(`Cases: ${cases}, failures: ${failures}.`, 'Summary')
    expect(failures).toBe(0)
}

const minimalOutputColumns: (keyof OgrsOutputParams)[] = [
    'SNSV_PERCENTAGE_STATIC',
    'SNSV_PERCENTAGE_DYNAMIC',
    'OGRS4V_PERCENTAGE',
    'OVP2_PERCENTAGE',
    'OGRS4G_PERCENTAGE',
    'OGP2_PERCENTAGE',
]

function createOutputCsvLine(identifier: string, outputParams: OgrsOutputParams, outputColumns = minimalOutputColumns): string {

    const line: string[] = []

    line.push(identifier)
    outputColumns.forEach((key) => {
        const value = outputParams[key]?.toString()
        line.push(value ?? '')
    })

    return line.join()
}

function createOutputCsvHeader(identifierTitle: string, outputColumns: string[]): string {

    const line: string[] = []

    line.push(identifierTitle)
    outputColumns.forEach((key) => {
        line.push(key)
    })

    return line.join()
}


const outputColumnsAllScores: (keyof OgrsOutputParams)[] = [
    'OGP2_BAND',
    'OGP2_PERCENTAGE',
    'OGRS4G_BAND',
    'OGRS4G_PERCENTAGE',
    'OGRS4V_BAND',
    'OGRS4V_PERCENTAGE',
    'OSP_DC_BAND',
    'OSP_DC_PERCENTAGE',
    'OSP_DC_RISK_REDUCTION',
    'OSP_IIC_BAND',
    'OSP_IIC_PERCENTAGE',
    'OVP2_BAND',
    'OVP2_PERCENTAGE',
    'RSR_BAND',
    'RSR_DYNAMIC',
    'RSR_PERCENTAGE',
    'SNSV_BAND_DYNAMIC',
    'SNSV_BAND_STATIC',
    'SNSV_PERCENTAGE_DYNAMIC',
    'SNSV_PERCENTAGE_STATIC',
]

// Load input parameters from a CSV file
export async function ogrsDf453Test(dataFile: string, count: number, reportMode: ReportMode, outputFile: string, ogrs: Ogrs, specificPks: string[] = null) {

    let failures = 0
    let cases = 0
    let outputData: string[] = []
    // outputData.push(createOutputCsvHeader('OASYS_SET_PK', outputColumnsAllScores))

    const inputParameterFile = await fs.readFile(dataFile, 'utf8')
    const inputParameters = inputParameterFile.split('\r\n')
    let numTests = inputParameters.length
    if (count > 0 && count < numTests) {
        numTests = count + 1
    }

    for (let i = 1; i < numTests; i++) {  // Skip header line
        cases++
        if (i % 1000 == 0) {
            console.log(i)
        }
        const parameters = inputParameters[i].split(',')
        const testCaseIdentifier = parameters[3]  // OASYS_SET_PK

        if (!specificPks || specificPks.includes(testCaseIdentifier)) {
            const testCaseParams = loadParameterSetFromDf453(parameters)

            // Call the calculator in Oracle
            // TODO temporary hack until release 7.12 goes in to correct the 4.2 parameter and revert the coefficients
            testCaseParams.FOUR_POINT_TWO = testCaseParams.FOUR_POINT_TWO == null ? null : testCaseParams.FOUR_POINT_TWO / 2

            const functionCall = ogrs.getFunctionCall(testCaseParams)
            const oracleTestCaseResult = await ogrs.getOracleResult(functionCall)

            // TODO temporary hack until release 7.12 goes in to correct the 4.2 parameter and revert the coefficients
            testCaseParams.FOUR_POINT_TWO = testCaseParams.FOUR_POINT_TWO == null ? null : testCaseParams.FOUR_POINT_TWO * 2

            const testCaseResult = ogrs.calculateOgrsAndCompare(testCaseParams, oracleTestCaseResult, testCaseIdentifier, reportMode)

            if (testCaseResult.failed) {
                failures++
                console.log(testCaseResult.identifier)
            }

            // if (oracleTestCaseResult.OSP_DC_CALCULATED == 'A') {  // Hack to match DF453 results format
            //     oracleTestCaseResult.OSP_DC_BAND = 'Not Applicable'
            // }
            // if (oracleTestCaseResult.OSP_IIC_CALCULATED == 'A') {
            //     oracleTestCaseResult.OSP_IIC_BAND = 'Not Applicable'
            // }
            // if (oracleTestCaseResult.RSR_CALCULATED == 'Y') {
            //     oracleTestCaseResult.RSR_DYNAMIC = oracleTestCaseResult.RSR_DYNAMIC == 'Y' ? 'DYNAMIC' : oracleTestCaseResult.RSR_DYNAMIC == 'N' ? 'STATIC' : null
            // } else {
            //     oracleTestCaseResult.RSR_DYNAMIC = ''
            // }
            outputData.push(createOutputCsvLine(testCaseIdentifier, oracleTestCaseResult, outputColumnsAllScores))
        }
    }

    await fs.writeFile(outputFile, outputData.join('\n'))

    log(' ')
    log(' ')
    log(`Cases: ${cases}, failures: ${failures}.`, 'Summary')
    expect(failures).toBe(0)
}

function loadParameterSetFromDf453(parameters: string[]): OgrsInputParams {


    let i = 18

    const p: OgrsInputParams = {
        ASSESSMENT_DATE: oasysDateTime.stringToDate(parameters[i++]),
        STATIC_CALC: utils.getString(parameters[i++]),
        DOB: oasysDateTime.stringToDate(parameters[i++]),
        GENDER: utils.getString(parameters[i++]),
        OFFENCE_CODE: utils.getString(parameters[i++]),
        TOTAL_SANCTIONS_COUNT: utils.getInteger(parameters[i++]),
        TOTAL_VIOLENT_SANCTIONS: utils.getInteger(parameters[i++]),
        CONTACT_ADULT_SANCTIONS: utils.getInteger(parameters[i++]),
        CONTACT_CHILD_SANCTIONS: utils.getInteger(parameters[i++]),
        INDECENT_IMAGE_SANCTIONS: utils.getInteger(parameters[i++]),
        PARAPHILIA_SANCTIONS: utils.getInteger(parameters[i++]),
        STRANGER_VICTIM: utils.getString(parameters[i++]),
        AGE_AT_FIRST_SANCTION: utils.getInteger(parameters[i++]),
        LAST_SANCTION_DATE: oasysDateTime.stringToDate(parameters[i++]),
        DATE_RECENT_SEXUAL_OFFENCE: oasysDateTime.stringToDate(parameters[i++]),
        CURR_SEX_OFF_MOTIVATION: utils.getString(parameters[i++]),
        MOST_RECENT_OFFENCE: oasysDateTime.stringToDate(parameters[i++]),
        COMMUNITY_DATE: oasysDateTime.stringToDate(parameters[i++]),
        ONE_POINT_THIRTY: utils.getString(parameters[i++]),
        TWO_POINT_TWO: utils.getInteger(parameters[i++]),
        THREE_POINT_FOUR: utils.getInteger(parameters[i++]),
        FOUR_POINT_TWO: utils.getInteger(parameters[i++]),
        SIX_POINT_FOUR: utils.getInteger(parameters[i++]),
        SIX_POINT_SEVEN: utils.getInteger(parameters[i++]),
        SIX_POINT_EIGHT: utils.getInteger(parameters[i++]),
        SEVEN_POINT_TWO: utils.getInteger(parameters[i++]),
        DAILY_DRUG_USER: utils.getString(parameters[i++]),
        AMPHETAMINES: utils.getString(parameters[i++]),
        BENZODIAZIPINES: utils.getString(parameters[i++]),
        CANNABIS: utils.getString(parameters[i++]),
        CRACK_COCAINE: utils.getString(parameters[i++]),
        ECSTASY: utils.getString(parameters[i++]),
        HALLUCINOGENS: utils.getString(parameters[i++]),
        HEROIN: utils.getString(parameters[i++]),
        KETAMINE: utils.getString(parameters[i++]),
        // MEPHEDRONE: null,           // TODO add mephedrone for NOD-1387
        METHADONE: utils.getString(parameters[i++]),
        MISUSED_PRESCRIBED: utils.getString(parameters[i++]),
        OTHER_OPIATE: utils.getString(parameters[i++]),
        POWDER_COCAINE: utils.getString(parameters[i++]),
        SOLVENTS: utils.getString(parameters[i++]),
        SPICE: utils.getString(parameters[i++]),
        STEROIDS: utils.getString(parameters[i++]),
        OTHER_DRUGS: utils.getString(parameters[i++]),
        EIGHT_POINT_EIGHT: utils.getInteger(parameters[i++]),
        NINE_POINT_ONE: utils.getInteger(parameters[i++]),
        NINE_POINT_TWO: utils.getInteger(parameters[i++]),
        ELEVEN_POINT_TWO: utils.getInteger(parameters[i++]),
        ELEVEN_POINT_FOUR: utils.getInteger(parameters[i++]),
        TWELVE_POINT_ONE: utils.getInteger(parameters[i++]),
        OGRS4G_ALGO_VERSION: utils.getInteger(parameters[i++]),
        OGRS4V_ALGO_VERSION: utils.getInteger(parameters[i++]),
        OGP2_ALGO_VERSION: utils.getInteger(parameters[i++]),
        OVP2_ALGO_VERSION: utils.getInteger(parameters[i++]),
        OSP_ALGO_VERSION: utils.getInteger(parameters[i++]),
        SNSV_ALGO_VERSION: utils.getInteger(parameters[i++]),
        AGGRAVATED_BURGLARY: utils.getInteger(parameters[i++]),
        ARSON: utils.getInteger(parameters[i++]),
        CRIMINAL_DAMAGE_LIFE: utils.getInteger(parameters[i++]),
        FIREARMS: utils.getInteger(parameters[i++]),
        GBH: utils.getInteger(parameters[i++]),
        HOMICIDE: utils.getInteger(parameters[i++]),
        KIDNAP: utils.getInteger(parameters[i++]),
        ROBBERY: utils.getInteger(parameters[i++]),
        WEAPONS_NOT_FIREARMS: utils.getInteger(parameters[i++]),
        CUSTODY_IND: utils.getString(parameters[i++]),
    }

    addCalculatedInputParameters(p)
    return p
}
