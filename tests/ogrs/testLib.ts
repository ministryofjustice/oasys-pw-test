import * as fs from 'fs-extra'

import { Ogrs } from 'fixtures'
import { OgrsInputParams, OgrsOutputParams } from 'fixtures/ogrs/types'


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

                // Call the calculator in Cypress and compare against the Oracle result
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

const outputColumns: (keyof OgrsOutputParams)[] = [
    'SNSV_PERCENTAGE_STATIC',
    'SNSV_PERCENTAGE_DYNAMIC',
    'OGRS4V_PERCENTAGE',
    'OVP2_PERCENTAGE',
    'OGRS4G_PERCENTAGE',
    'OGP2_PERCENTAGE',
]

function createOutputCsvLine(identifier: string, outputParams: OgrsOutputParams): string {

    const line: string[] = []

    line.push(identifier)
    outputColumns.forEach((key) => {
        const value = outputParams[key]?.toString()
        line.push(value ?? '')
    })

    return line.join()
}
