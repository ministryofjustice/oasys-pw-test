import { Decimal } from 'decimal.js'
import { Temporal } from '@js-temporal/polyfill'

import { OasysDb, Offender, Risk, Sections } from 'fixtures'
import { Calculator } from './calculator/calculator'
import { Data } from './data/data'
import { Rescoring } from './rescoring/rescoring'
import { Tiering } from './tiering/tiering'
import { OgrsAssessment, OgrsRsr } from './data/dbClasses'
import { OgrsInputParams, TestCaseResult, OgrsOutputParams, Ogrs4CalcResult } from './types'
import { createAssessmentInputParams } from 'fixtures/ogrs/data/createAssessmentTestCase'
import { createCsrpInputParams } from 'fixtures/ogrs/data/createCsrpTestCase'
import { ogrsFunctionCall } from './data/ogrsFunctionCall'
import { loadParameterSet } from './data/loadTestData'
import { Text } from 'classes/elements'
import { RescoringLic } from './rescoringLic/rescoringLic'

const tolerance = new Decimal('1E-37')
const precision = 40

export class Ogrs {

    constructor(private readonly oasysDb: OasysDb, private readonly offender: Offender, private readonly sections: Sections, private readonly risk: Risk) { }

    private readonly calculator = new Calculator()
    private readonly data = new Data(this.oasysDb)
    readonly rescoring = new Rescoring(this.oasysDb)
    readonly tiering = new Tiering(this.oasysDb)
    readonly rescoringLic = new RescoringLic(this.oasysDb)

    /**
     * Calculate OGRS results from a set of input parameters
     */
    calculate(calculatorParams: OgrsInputParams): OgrsOutputParams {

        return this.calculator.calculate(calculatorParams)
    }

    async getOasysData(type: AssessmentOrCsrp, count: number, whereClause: string): Promise<OgrsAssessment[] | OgrsRsr[]> {

        const result = type == 'assessment' ? await this.data.getAssessmentTestData(count, whereClause) : await this.data.getCsrpTestData(count, whereClause)
        return result
    }

    getInputParams(type: AssessmentOrCsrp, assessmentOrRsr: OgrsAssessment | OgrsRsr, dateParam: string | Temporal.PlainDate = null): OgrsInputParams {

        const result = type == 'assessment' ? this.data.getAssessmentInputParams(assessmentOrRsr as OgrsAssessment, dateParam) : this.data.getRsrInputParams(assessmentOrRsr as OgrsRsr)
        return result
    }

    getFunctionCall(params: OgrsInputParams) {

        return ogrsFunctionCall(params)
    }

    async getOracleResult(functionCall: string): Promise<OgrsOutputParams> {

        const oracleResponse = await this.oasysDb.callFunction(functionCall)
        return this.data.loadOracleOutputValues(oracleResponse.split('|'))
    }

    createInputFromCsvLine(line: string): OgrsInputParams {
        return loadParameterSet(line)
    }

    /**
     * Checks the calculation stored in oasys_set for a given pk.
     * Returns an Ogrs4CalcResult object
     */
    async checkOgrsInOasysSet(assessmentPk: number): Promise<Ogrs4CalcResult> {

        const assessment = await this.data.getOneAssessment(assessmentPk)
        const calculatorParams = createAssessmentInputParams(assessment)

        const result: Ogrs4CalcResult = {
            outputParams: this.calculate(calculatorParams),
        }

        this.compileAndCheckResult(result)

        log('', 'Checking OGRS4 calculations')
        let failed = checkScore('ARP static score', result.outputParams.OGRS4G_PERCENTAGE?.toNumber() ?? null, assessment.ogrs4gYr2)
        failed = checkScore('ARP static band', result.outputParams.OGRS4G_BAND?.substring(0, 1) ?? null, assessment.ogrs4gBand) || failed
        failed = checkScore('ARP static calculated', result.outputParams.OGRS4G_CALCULATED, assessment.ogrs4gCalculated) || failed
        failed = checkScore('ARP dynamic score', result.outputParams.OGP2_PERCENTAGE?.toNumber() ?? null, assessment.ogp2Yr2) || failed
        failed = checkScore('ARP dynamic band', result.outputParams.OGP2_BAND?.substring(0, 1) ?? null, assessment.ogp2Band) || failed
        failed = checkScore('ARP dynamic calculated', result.outputParams.OGP2_CALCULATED, assessment.ogp2Calculated) || failed
        failed = checkScore('VRP static score', result.outputParams.OGRS4V_PERCENTAGE?.toNumber() ?? null, assessment.ogrs4vYr2) || failed
        failed = checkScore('VRP static band', result.outputParams.OGRS4V_BAND?.substring(0, 1) ?? null, assessment.ogrs4vBand) || failed
        failed = checkScore('VRP static calculated', result.outputParams.OGRS4V_CALCULATED, assessment.ogrs4vCalculated) || failed
        failed = checkScore('VRP dynamic score', result.outputParams.OVP2_PERCENTAGE?.toNumber() ?? null, assessment.ovp2Yr2) || failed
        failed = checkScore('VRP dynamic band', result.outputParams.OVP2_BAND?.substring(0, 1) ?? null, assessment.ovp2Band) || failed
        failed = checkScore('VRP dynamic calculated', result.outputParams.OVP2_CALCULATED, assessment.ovp2Calculated) || failed
        failed = checkScore('SVRP static score', result.outputParams.SNSV_PERCENTAGE_STATIC?.toNumber() ?? null, assessment.snsvStaticYr2) || failed
        failed = checkScore('SVRP static band', result.outputParams.SNSV_BAND_STATIC?.substring(0, 1) ?? null, assessment.snsvStaticYr2Band) || failed
        failed = checkScore('SVRP static calculated', result.outputParams.SNSV_CALCULATED_STATIC, assessment.snsvStaticCalculated) || failed
        failed = checkScore('SVRP dynamic score', result.outputParams.SNSV_PERCENTAGE_DYNAMIC?.toNumber() ?? null, assessment.snsvDynamicYr2) || failed
        failed = checkScore('SVRP dynamic band', result.outputParams.SNSV_BAND_DYNAMIC?.substring(0, 1) ?? null, assessment.snsvDynamicYr2Band) || failed
        failed = checkScore('SVRP dynamic calculated', result.outputParams.SNSV_CALCULATED_DYNAMIC, assessment.snsvDynamicCalculated) || failed

        if (failed) {
            log(JSON.stringify(calculatorParams))
            log(JSON.stringify(result))
        }
        expect(failed).toBeFalsy()
        return result
    }

    /**
      * Checks the calculation stored in offender_rsr_scores for a given pk.
      * Returns an Ogrs4CalcResult object
      */
    async checkOgrsInStandaloneCsrp(csrpPk: number): Promise<Ogrs4CalcResult>
    async checkOgrsInStandaloneCsrp(probationCrn: string): Promise<Ogrs4CalcResult>
    async checkOgrsInStandaloneCsrp(p1: number | string): Promise<Ogrs4CalcResult> {

        let csrpPk: number
        if (typeof p1 == 'string') {
            csrpPk = await this.offender.queries.getLatestStandaloneCsrpPk(p1)
        } else {
            csrpPk = p1
        }
        const csrp = await this.data.getOneCsrp(csrpPk)
        const calculatorParams = createCsrpInputParams(csrp)

        const result: Ogrs4CalcResult = {
            outputParams: this.calculate(calculatorParams),
        }

        this.compileAndCheckResult(result, true)

        log('', 'Checking OGRS4 calculations')
        let failed = checkScore('ARP static score', result.outputParams.OGRS4G_PERCENTAGE?.toNumber() ?? null, csrp.ogrs4gYr2)
        failed = checkScore('ARP static band', result.outputParams.OGRS4G_BAND?.substring(0, 1) ?? null, csrp.ogrs4gBand) || failed
        failed = checkScore('ARP static calculated', result.outputParams.OGRS4G_CALCULATED, csrp.ogrs4gCalculated) || failed
        failed = checkScore('ARP dynamic score', result.outputParams.OGP2_PERCENTAGE?.toNumber() ?? null, csrp.ogp2Yr2) || failed
        failed = checkScore('ARP dynamic band', result.outputParams.OGP2_BAND?.substring(0, 1) ?? null, csrp.ogp2Band) || failed
        failed = checkScore('ARP dynamic calculated', result.outputParams.OGP2_CALCULATED, csrp.ogp2Calculated) || failed
        failed = checkScore('VRP static score', result.outputParams.OGRS4V_PERCENTAGE?.toNumber() ?? null, csrp.ogrs4vYr2) || failed
        failed = checkScore('VRP static band', result.outputParams.OGRS4V_BAND?.substring(0, 1) ?? null, csrp.ogrs4vBand) || failed
        failed = checkScore('VRP static calculated', result.outputParams.OGRS4V_CALCULATED, csrp.ogrs4vCalculated) || failed
        failed = checkScore('VRP dynamic score', result.outputParams.OVP2_PERCENTAGE?.toNumber() ?? null, csrp.ovp2Yr2) || failed
        failed = checkScore('VRP dynamic band', result.outputParams.OVP2_BAND?.substring(0, 1) ?? null, csrp.ovp2Band) || failed
        failed = checkScore('VRP dynamic calculated', result.outputParams.OVP2_CALCULATED, csrp.ovp2Calculated) || failed
        failed = checkScore('SVRP static score', result.outputParams.SNSV_PERCENTAGE_STATIC?.toNumber() ?? null, csrp.snsvStaticYr2) || failed
        failed = checkScore('SVRP static band', result.outputParams.SNSV_BAND_STATIC?.substring(0, 1) ?? null, csrp.snsvStaticYr2Band) || failed
        failed = checkScore('SVRP static calculated', result.outputParams.SNSV_CALCULATED_STATIC, csrp.snsvStaticCalculated) || failed
        failed = checkScore('SVRP dynamic score', result.outputParams.SNSV_PERCENTAGE_DYNAMIC?.toNumber() ?? null, csrp.snsvDynamicYr2) || failed
        failed = checkScore('SVRP dynamic band', result.outputParams.SNSV_BAND_DYNAMIC?.substring(0, 1) ?? null, csrp.snsvDynamicYr2Band) || failed
        failed = checkScore('SVRP dynamic calculated', result.outputParams.SNSV_CALCULATED_DYNAMIC, csrp.snsvDynamicCalculated) || failed

        if (failed) {
            log(JSON.stringify(calculatorParams))
            log(JSON.stringify(result))
        }
        expect(failed).toBeFalsy()
        return result
    }

    private compileAndCheckResult(result: Ogrs4CalcResult, standaloneCsrp = false) {

        const padding = standaloneCsrp ? 6 : 5

        // Compile results
        const arp = result.outputParams.OGP2_CALCULATED == 'Y' ? result.outputParams.OGP2_PERCENTAGE : result.outputParams.OGRS4G_PERCENTAGE
        const arpBand = result.outputParams.OGP2_CALCULATED == 'Y' ? result.outputParams.OGP2_BAND : result.outputParams.OGRS4G_BAND
        const arpType = result.outputParams.OGP2_CALCULATED == 'Y' ? 'DYNAMIC' : result.outputParams.OGRS4G_CALCULATED ? 'STATIC' : ''
        result.arpText = arp ? `${arpType}  ${arp.toFixed(2).padStart(padding)}%   ${arpBand}` : 'Unable to calculate due to'

        const vrp = result.outputParams.OVP2_CALCULATED == 'Y' ? result.outputParams.OVP2_PERCENTAGE : result.outputParams.OGRS4V_PERCENTAGE
        const vrpBand = result.outputParams.OVP2_CALCULATED == 'Y' ? result.outputParams.OVP2_BAND : result.outputParams.OGRS4V_BAND
        const vrpType = result.outputParams.OVP2_CALCULATED == 'Y' ? 'DYNAMIC' : result.outputParams.OGRS4V_CALCULATED ? 'STATIC' : ''
        result.vrpText = vrp ? `${vrpType}  ${vrp.toFixed(2).padStart(padding)}%   ${vrpBand}` : 'Unable to calculate due to'

        const svrp = result.outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? result.outputParams.SNSV_PERCENTAGE_DYNAMIC : result.outputParams.SNSV_PERCENTAGE_STATIC
        const svrpBand = result.outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? result.outputParams.SNSV_BAND_DYNAMIC : result.outputParams.SNSV_BAND_STATIC
        const svrpType = result.outputParams.SNSV_CALCULATED_DYNAMIC == 'Y' ? 'DYNAMIC' : result.outputParams.SNSV_CALCULATED_STATIC ? 'STATIC' : ''
        result.svrpText = svrp ? `${svrpType}  ${svrp.toFixed(2).padStart(padding)}%   ${svrpBand}` : 'Unable to calculate due to'

        result.dcSrpBand = result.outputParams.OSP_DC_BAND?.toUpperCase() ?? null
        result.dcSrpText = result.dcSrpBand ? '' : 'Unable to calculate'
        result.iicSrpBand = result.outputParams.OSP_IIC_BAND?.toUpperCase() ?? null
        result.iicSrpText = result.iicSrpBand ? '' : 'Unable to calculate'

        result.csrpBand = result.outputParams.RSR_BAND?.toUpperCase() ?? null
        result.csrpType = result.outputParams.RSR_DYNAMIC == 'Y' ? 'DYNAMIC' : result.outputParams.RSR_CALCULATED == 'Y' ? 'STATIC' : ''
        result.csrpScore = result.csrpBand ? `${result.outputParams.RSR_PERCENTAGE.toFixed(2).padStart(6)}% ` : ''
        result.csrpText = result.csrpBand ? '' : 'Unable to calculate'

    }

    /**
     * Generate a calculation for a specified set of inputs, and compare it to a known set of outputs
     */
    calculateOgrsAndCompare(testCaseParams: OgrsInputParams, expectedResults: OgrsOutputParams, testCaseRef: string, reportMode: ReportMode): TestCaseResult {

        Decimal.set({ precision: precision })
        const testCaseResult: TestCaseResult = {
            failed: false,
            inputParams: testCaseParams,
            outputParams: this.calculate(testCaseParams),
            identifier: testCaseRef,
        }

        testCaseResult.outputParams.ASSESSMENT_DATE = oasysDateTime.dateToOracleFormatString(testCaseParams.ASSESSMENT_DATE)

        // Compare and report results
        const logText: string[] = []
        testCaseResult.failed = checkResults(expectedResults, testCaseResult.outputParams, reportMode, logText)

        if ((testCaseResult.failed || reportMode != 'minimal') && reportMode != 'none') {
            log(' ')
            fileLog('')
            log('', `Test case ${testCaseRef}, static flag ${testCaseParams.STATIC_CALC} - ${testCaseResult.failed ? ' *** FAILED ***' : ' PASSED'}`)
            fileLog(`Test case ${testCaseRef}, static flag ${testCaseParams.STATIC_CALC} - ${testCaseResult.failed ? ' *** FAILED ***' : ' PASSED'}`)
            fileLog(`    Input parameters: ${JSON.stringify(testCaseParams)}`)
            fileLog(`    Oracle result:    ${JSON.stringify(expectedResults)}`)
            fileLog(`    Cypress result:   ${JSON.stringify(testCaseResult.outputParams)}`)
            if (testCaseResult.failed || reportMode == 'verbose') {
                log(' ')
                for (const l of logText) {
                    log(l)
                }
            }
        }

        // Report invalid offence codes
        if (testCaseParams.OFFENCE_CODE && !testCaseParams.offenceCat && reportMode != 'none') {
            if (reportMode == 'minimal') {
                log(`Test case ${testCaseRef}: invalid offence code ${testCaseParams.OFFENCE_CODE}`)
            } else {
                log(`Invalid offence code: ${testCaseParams.OFFENCE_CODE}`)
            }
        }
        return testCaseResult
    }

    async checkResultsOnPredictorsScreen(ogrsResult: Ogrs4CalcResult) {

        await this.sections.predictors.goto()
        await this.sections.predictors.arpText.checkValue(ogrsResult.arpText, true)
        await this.sections.predictors.vrpText.checkValue(ogrsResult.vrpText, true)
        await this.sections.predictors.svrpText.checkValue(ogrsResult.svrpText, true)
        if (ogrsResult.dcSrpBand) {
            await this.sections.predictors.dcSrpBand.checkValue(ogrsResult.dcSrpBand)
        } else {
            await this.sections.predictors.dcSrpText.checkValue('Not Applicable')
        }
        if (ogrsResult.iicSrpBand) {
            await this.sections.predictors.iicSrpBand.checkValue(ogrsResult.iicSrpBand)
        } else {
            await this.sections.predictors.iicSrpText.checkValue('Not Applicable')
        }
        if (ogrsResult.csrpBand) {
            await this.sections.predictors.csrpBand.checkValue(ogrsResult.csrpBand)
            await this.sections.predictors.csrpType.checkValue(ogrsResult.csrpType)
            await this.sections.predictors.csrpScore.checkValue(ogrsResult.csrpScore)
        } else {
            await this.sections.predictors.csrpText.checkValue('Unable to calculate due to', true)
        }
    }

    async checkResultsOnRoshaPredictorsScreen(ogrsResult: Ogrs4CalcResult) {

        await this.sections.roshaPredictors.goto()
        await this.sections.roshaPredictors.arpText.checkValue(ogrsResult.arpText, true)
        await this.sections.roshaPredictors.vrpText.checkValue(ogrsResult.vrpText, true)
        await this.sections.roshaPredictors.svrpText.checkValue(ogrsResult.svrpText, true)
        if (ogrsResult.dcSrpBand) {
            await this.sections.roshaPredictors.dcSrpBand.checkValue(ogrsResult.dcSrpBand)
        } else {
            await this.sections.roshaPredictors.dcSrpText.checkValue('Not Applicable')
        }
        if (ogrsResult.iicSrpBand) {
            await this.sections.roshaPredictors.iicSrpBand.checkValue(ogrsResult.iicSrpBand)
        } else {
            await this.sections.roshaPredictors.iicSrpText.checkValue('Not Applicable')
        }
        if (ogrsResult.csrpBand) {
            await this.sections.roshaPredictors.csrpBand.checkValue(ogrsResult.csrpBand)
            await this.sections.roshaPredictors.csrpType.checkValue(ogrsResult.csrpType)
            await this.sections.roshaPredictors.csrpScore.checkValue(ogrsResult.csrpScore)
        } else {
            await this.sections.roshaPredictors.csrpText.checkValue('Unable to calculate due to', true)
        }
    }

    async checkResultsOnStandaloneCsrpScreen(ogrsResult: Ogrs4CalcResult) {

        await this.offender.standaloneCsrp.arpText.checkValue(ogrsResult.arpText, true)
        await this.offender.standaloneCsrp.vrpText.checkValue(ogrsResult.vrpText, true)
        await this.offender.standaloneCsrp.svrpText.checkValue(ogrsResult.svrpText, true)
        if (ogrsResult.dcSrpBand) {
            await this.offender.standaloneCsrp.dcSrpBand.checkValue(ogrsResult.dcSrpBand)
        } else {
            await this.offender.standaloneCsrp.dcSrpText.checkValue('Not Applicable')
        }
        if (ogrsResult.iicSrpBand) {
            await this.offender.standaloneCsrp.iicSrpBand.checkValue(ogrsResult.iicSrpBand)
        } else {
            await this.offender.standaloneCsrp.iicSrpText.checkValue('Not Applicable')
        }
        if (ogrsResult.csrpBand) {
            await this.offender.standaloneCsrp.csrpBand.checkValue(ogrsResult.csrpBand)
            await this.offender.standaloneCsrp.csrpType.checkValue(ogrsResult.csrpType)
            await this.offender.standaloneCsrp.csrpScore.checkValue(ogrsResult.csrpScore)
        } else {
            await this.offender.standaloneCsrp.csrpText.checkValue('Unable to calculate due to', true)
        }

        if (ogrsResult.outputParams.OGRS4G_CALCULATED == 'Y') {
            await checkErrors(this.offender.standaloneCsrp.arpErrorText, ogrsResult.outputParams.OGP2_MISSING_QUESTIONS, 'Unable to calculate DYNAMIC All Reoffending Predictor score due to:')
        }
        if (ogrsResult.outputParams.OGRS4V_CALCULATED == 'Y') {
            await checkErrors(this.offender.standaloneCsrp.vrpErrorText, ogrsResult.outputParams.OVP2_MISSING_QUESTIONS, 'Unable to calculate DYNAMIC Violent Reoffending Predictor score due to:')
        }
        if (ogrsResult.outputParams.SNSV_CALCULATED_STATIC == 'Y') {
            await checkErrors(this.offender.standaloneCsrp.svrpErrorText, ogrsResult.outputParams.SNSV_MISSING_QUESTIONS_DYNAMIC, 'Unable to calculate DYNAMIC Serious Violent Reoffending Predictor score due to:')
        }
        if (ogrsResult.outputParams.RSR_CALCULATED == 'Y' && ogrsResult.outputParams.RSR_DYNAMIC == 'N') {
            await checkErrors(this.offender.standaloneCsrp.csrpErrorText, ogrsResult.outputParams.RSR_MISSING_QUESTIONS, 'Unable to calculate DYNAMIC CSRP score due to:')
        }
    }

    async checkResultsOnRiskSummary(ogrsResult: Ogrs4CalcResult) {

        await this.risk.summary.goto(true)
        if (ogrsResult.csrpBand == null) {
            await this.risk.summary.csrpText.checkValue(ogrsResult.csrpText, true)
        } else {
            await this.risk.summary.csrpBand.checkValue(ogrsResult.csrpBand)
            await this.risk.summary.csrpType.checkValue(ogrsResult.csrpType)
            await this.risk.summary.csrpScore.checkValue(ogrsResult.csrpScore)
        }
        if (ogrsResult.dcSrpBand == null) {
            await this.risk.summary.dcSrpText.checkValue(ogrsResult.dcSrpText, true)
        } else {
            await this.risk.summary.dcSrpBand.checkValue(ogrsResult.dcSrpBand)
        }
        if (ogrsResult.iicSrpBand == null) {
            await this.risk.summary.iicSrpText.checkValue(ogrsResult.iicSrpText, true)
        } else {
            await this.risk.summary.iicSrpBand.checkValue(ogrsResult.iicSrpBand)
        }
    }

    async checkNonMFResultOnPredictorsPage() {

        await this.sections.predictors.goto()
        await this.sections.predictors.predictorsText.checkValue(`The All Reoffending Predictor and the Violent Reoffending Predictor scores cannot be calculated when the Gender selected for the offender is not 'Male' or 'Female'.`, true)
        await this.sections.predictors.arpText.checkStatus('notVisible')
        await this.sections.predictors.vrpText.checkStatus('notVisible')
        await this.sections.predictors.dcSrpText.checkValue('Not Applicable')
        await this.sections.predictors.iicSrpText.checkValue('Not Applicable')
        await this.sections.predictors.csrpText.checkValue(`Combined Serious Reoffending Predictor can't be calculated on gender other than Male and Female.`, true)
    }

    async checkNonMFResultOnRoshaPredictorsPage() {

        await this.sections.roshaPredictors.goto()
        await this.sections.roshaPredictors.predictorsText.checkValue(`The All Reoffending Predictor and the Violent Reoffending Predictor scores cannot be calculated when the Gender selected for the offender is not 'Male' or 'Female'.`)
        await this.sections.roshaPredictors.arpText.checkStatus('notVisible')
        await this.sections.roshaPredictors.vrpText.checkStatus('notVisible')
        await this.sections.roshaPredictors.dcSrpText.checkValue('Not Applicable')
        await this.sections.roshaPredictors.iicSrpText.checkValue('Not Applicable')
        await this.sections.roshaPredictors.csrpText.checkValue(`Combined Serious Reoffending Predictor can't be calculated on gender other than Male and Female.`, true)
    }

    async checkFeatureLines(ogrsResult: Ogrs4CalcResult, pk: number, type: AssessmentOrCsrp = 'assessment') {

        log('', `Checking OGRS4 feature lines for PK ${pk}`)
        let query = 'select '
        for (const key of Object.keys(featureColumns)) {
            query = `${query}${key},`
        }
        query = `${query.slice(0, -1)} from eor.predictor_feature_lines where ${type == 'assessment' ? 'oasys_set_pk' : 'offender_rsr_scores_pk'} = ${pk}`

        const row = (await this.oasysDb.getData(query))[0]

        let i = 0
        let failed = false
        for (const key of Object.keys(featureColumns)) {
            const expected = ogrsResult.outputParams[featureColumns[key]]?.toString()?.replaceAll(`'`, '') ?? ''
            const actual = row[i++] ?? ''
            if (expected.substring(0, 10) != actual.substring(0, 10)) {  // Ignore minor precision differences
                log(`${key}: expected ${expected}, found ${actual}`)
                failed = true
            }
        }
        expect(failed).toBeFalsy()
    }
}

async function checkErrors(text: Text, missingQuestions: string, header: string) {

    await text.checkValue(header, true)
    for (const error of missingQuestions.substring(1, missingQuestions.length - 2).split('\n')) {
        await text.checkValue(error, true)
    }
}

function checkScore(description: string, expectedValue: string | number, actualValue: string | number): boolean {

    const failed = expectedValue != actualValue
    if (failed) {
        log(`${description}: expected ${expectedValue}, got ${actualValue}. FAILED`)
    }
    return failed
}

function checkResults(expectedResults: OgrsOutputParams, actualResults: OgrsOutputParams, reportMode: ReportMode, logText: string[]): boolean {

    // Compare the complete result set for a single test case, line by line, to determine failure and generate report

    let failed = false

    Object.keys(expectedResults).forEach((param) => {

        // tolerance check for _SCORE and _COPAS, decimal check for all other numbers except _COUNT, array check for _MISSING_QUESTIONS, simple equality for everything else
        let mode: 'decimal' | 'tolerance' | 'simple' | 'missing' = 'simple'

        // @ts-expect-error
        if (!Number.isNaN(Number.parseFloat(expectedResults[param])) && !Number.isNaN(Number.parseFloat(actualResults[param]))) {  // numeric comparison required

            if ((param.includes('_SCORE') && param != 'OSP_DC_SCORE') || param.includes('_COPAS')) {
                mode = 'tolerance'
            } else if (!param.includes('_COUNT')) {
                mode = 'decimal'
            }
        } else if (param.includes('MISSING_QUESTIONS')) {
            mode = 'missing'
        }

        // check Decimal values - with tolerance for scores
        if (mode == 'decimal' || mode == 'tolerance') {
            // @ts-expect-error
            const diff = expectedResults[param].minus(actualResults[param]).abs()
            if ((mode == 'tolerance' && diff.greaterThan(tolerance)) || (mode == 'decimal' && diff.greaterThan(0))) {
                failed = true
                if (mode == 'tolerance' || (mode == 'decimal' && diff.greaterThan(0))) {
                    // @ts-expect-error
                    logText.push(`      ${param} *** failed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}, difference: ${diff}`)
                }
            } else if (mode == 'tolerance' && reportMode != 'minimal' && reportMode != 'none') {
                // @ts-expect-error
                logText.push(`      ${param} passed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}, difference: ${diff}`)
            } else if (reportMode == 'verbose') {
                // @ts-expect-error
                logText.push(`      ${param} passed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}`)
            }

            // missing questions list
        } else if (mode == 'missing') {
            // @ts-expect-error
            const expectedMissing = JSON.stringify(expectedResults[param])
            // @ts-expect-error
            const actualMissing = JSON.stringify(actualResults[param])
            if (expectedMissing != actualMissing) {
                logText.push(`      ${param} *** failed: Oracle ${expectedMissing}, Cypress ${actualMissing}`)
                failed = true
            }
            else if (reportMode == 'verbose') {
                logText.push(`      ${param} passed: Oracle ${expectedMissing}`)
            }

            // simple equality check
            // @ts-expect-error
        } else if (actualResults[param] != expectedResults[param]) {
            failed = true
            // @ts-expect-error
            logText.push(`      ${param} *** failed: Oracle ${expectedResults[param]}, Cypress ${actualResults[param]}`)

            // otherwise passed
        } else if (reportMode == 'verbose') {
            // @ts-expect-error
            logText.push(`      ${param} passed: ${expectedResults[param]}`)
        }
    })

    return failed
}

const featureColumns: { [key: string]: keyof OgrsOutputParams } = {

    OGP2_AAEAD: 'OGP2_AAEAD',
    OGP2_AMPHETAMINES: 'OGP2_AMPHETAMINES',
    OGP2_BAND: 'OGP2_BAND',
    OGP2_BENZODIAZEPINES: 'OGP2_BENZODIAZEPINES',
    OGP2_BINGE_DRINKER: 'OGP2_BINGE_DRINKER',
    OGP2_CALCULATED: 'OGP2_CALCULATED',
    OGP2_CANNABIS: 'OGP2_CANNABIS',
    OGP2_CHRONIC_DRINKER: 'OGP2_CHRONIC_DRINKER',
    OGP2_COCAINE: 'OGP2_COCAINE',
    OGP2_COPASG: 'OGP2_COPASG',
    OGP2_COPASG_SQUARED: 'OGP2_COPASG_SQUARED',
    OGP2_CRACK: 'OGP2_CRACK',
    OGP2_CRIMINAL_ATTITUDE: 'OGP2_CRIMINAL_ATTITUDE',
    OGP2_DAILY_DRUG_USER: 'OGP2_DAILY_DRUG_USER',
    OGP2_DRUG_MOTIVATION: 'OGP2_DRUG_MOTIVATION',
    OGP2_DV: 'OGP2_DV',
    OGP2_ECSTASY: 'OGP2_ECSTASY',
    OGP2_FEMALE: 'OGP2_FEMALE',
    OGP2_FIRST_SANCTION: 'OGP2_FIRST_SANCTION',
    OGP2_HEROIN: 'OGP2_HEROIN',
    OGP2_IMPULSIVE: 'OGP2_IMPULSIVE',
    OGP2_LIVE_IN_RELATIONSHIP: 'OGP2_LIVE_IN_RELATIONSHIP',
    OGP2_METHADONE: 'OGP2_METHADONE',
    OGP2_MISSING_COUNT: 'OGP2_MISSING_COUNT',
    OGP2_MISSING_QUESTIONS: 'OGP2_MISSING_QUESTIONS',
    OGP2_MISUSE_PRESCRIBED: 'OGP2_MISUSE_PRESCRIBED',
    OGP2_MULTIPLIC_RELATIONSHIP: 'OGP2_MULTIPLIC_RELATIONSHIP',
    OGP2_OFFENCE: 'OGP2_OFFENCE',
    OGP2_OFM: 'OGP2_OFM',
    OGP2_OTHER_DRUGS: 'OGP2_OTHER_DRUGS',
    OGP2_OTHER_OPIATE: 'OGP2_OTHER_OPIATE',
    OGP2_PERCENTAGE: 'OGP2_PERCENTAGE',
    OGP2_REGULAR_ACTIVITIES: 'OGP2_REGULAR_ACTIVITIES',
    OGP2_RELATIONSHIP: 'OGP2_RELATIONSHIP',
    OGP2_SECOND_SANCTION: 'OGP2_SECOND_SANCTION',
    OGP2_SECOND_SANCTION_GAP: 'OGP2_SECOND_SANCTION_GAP',
    OGP2_STEROIDS: 'OGP2_STEROIDS',
    OGP2_SUITABLE_ACC: 'OGP2_SUITABLE_ACC',
    OGP2_TOTAL_SANCTIONS: 'OGP2_TOTAL_SANCTIONS',
    OGP2_TOTAL_SCORE: 'OGP2_TOTAL_SCORE',
    OGP2_UNEMPLOYED: 'OGP2_UNEMPLOYED',
    OGP2_YEAR_TWO: 'OGP2_YEAR_TWO',
    OGRS4G_AAEAD: 'OGRS4G_AAEAD',
    OGRS4G_BAND: 'OGRS4G_BAND',
    OGRS4G_CALCULATED: 'OGRS4G_CALCULATED',
    OGRS4G_COPASG: 'OGRS4G_COPASG',
    OGRS4G_COPASG_SQUARED: 'OGRS4G_COPASG_SQUARED',
    OGRS4G_FEMALE: 'OGRS4G_FEMALE',
    OGRS4G_FIRST_SANCTION: 'OGRS4G_FIRST_SANCTION',
    OGRS4G_MISSING_COUNT: 'OGRS4G_MISSING_COUNT',
    OGRS4G_MISSING_QUESTIONS: 'OGRS4G_MISSING_QUESTIONS',
    OGRS4G_OFFENCE: 'OGRS4G_OFFENCE',
    OGRS4G_OFM: 'OGRS4G_OFM',
    OGRS4G_PERCENTAGE: 'OGRS4G_PERCENTAGE',
    OGRS4G_SCORE: 'OGRS4G_SCORE',
    OGRS4G_SECOND_SANCTION: 'OGRS4G_SECOND_SANCTION',
    OGRS4G_SECOND_SANCTION_GAP: 'OGRS4G_SECOND_SANCTION_GAP',
    OGRS4G_TOTAL_SANCTIONS: 'OGRS4G_TOTAL_SANCTIONS',
    OGRS4G_YEAR_TWO: 'OGRS4G_YEAR_TWO',
    OGRS4V_AAEAD: 'OGRS4V_AAEAD',
    OGRS4V_BAND: 'OGRS4V_BAND',
    OGRS4V_CALCULATED: 'OGRS4V_CALCULATED',
    OGRS4V_COPASV: 'OGRS4V_COPASV',
    OGRS4V_COPAS_VIOLENT: 'OGRS4V_COPAS_VIOLENT',
    OGRS4V_FEMALE: 'OGRS4V_FEMALE',
    OGRS4V_FIRST_SANCTION: 'OGRS4V_FIRST_SANCTION',
    OGRS4V_MISSING_COUNT: 'OGRS4V_MISSING_COUNT',
    OGRS4V_MISSING_QUESTIONS: 'OGRS4V_MISSING_QUESTIONS',
    OGRS4V_NEVER_VIOLENT: 'OGRS4V_NEVER_VIOLENT',
    OGRS4V_OFFENCE: 'OGRS4V_OFFENCE',
    OGRS4V_OFM: 'OGRS4V_OFM',
    OGRS4V_ONCE_VIOLENT: 'OGRS4V_ONCE_VIOLENT',
    OGRS4V_PERCENTAGE: 'OGRS4V_PERCENTAGE',
    OGRS4V_SCORE: 'OGRS4V_SCORE',
    OGRS4V_SECOND_SANCTION: 'OGRS4V_SECOND_SANCTION',
    OGRS4V_SECOND_SANCTION_GAP: 'OGRS4V_SECOND_SANCTION_GAP',
    OGRS4V_TOTAL_SANCTIONS: 'OGRS4V_TOTAL_SANCTIONS',
    OGRS4V_TOT_VIOLENT_SANCTIONS: 'OGRS4V_TOT_VIOLENT_SANCTIONS',
    OGRS4V_YEAR_TWO: 'OGRS4V_YEAR_TWO',
    OSP_DC_BAND: 'OSP_DC_BAND',
    OSP_DC_CALCULATED: 'OSP_DC_CALCULATED',
    OSP_DC_MISSING_COUNT: 'OSP_DC_MISSING_COUNT',
    OSP_DC_MISSING_QUESTIONS: 'OSP_DC_MISSING_QUESTIONS',
    OSP_DC_PERCENTAGE: 'OSP_DC_PERCENTAGE',
    OSP_DC_RISK_REDUCTION: 'OSP_DC_RISK_REDUCTION',
    OSP_DC_SCORE: 'OSP_DC_SCORE',
    OSP_IIC_BAND: 'OSP_IIC_BAND',
    OSP_IIC_CALCULATED: 'OSP_IIC_CALCULATED',
    OSP_IIC_MISSING_COUNT: 'OSP_IIC_MISSING_COUNT',
    OSP_IIC_MISSING_QUESTIONS: 'OSP_IIC_MISSING_QUESTIONS',
    OSP_IIC_PERCENTAGE: 'OSP_IIC_PERCENTAGE',
    OVP2_AAEAD: 'OVP2_AAEAD',
    OVP2_AMPHETAMINES: 'OVP2_AMPHETAMINES',
    OVP2_BAND: 'OVP2_BAND',
    OVP2_BENZODIAZEPINES: 'OVP2_BENZODIAZEPINES',
    OVP2_BINGE_DRINKER: 'OVP2_BINGE_DRINKER',
    OVP2_CALCULATED: 'OVP2_CALCULATED',
    OVP2_CANNABIS: 'OVP2_CANNABIS',
    OVP2_CHRONIC_DRINKER: 'OVP2_CHRONIC_DRINKER',
    OVP2_COCAINE: 'OVP2_COCAINE',
    OVP2_COPASV: 'OVP2_COPASV',
    OVP2_COPAS_VIOLENT: 'OVP2_COPAS_VIOLENT',
    OVP2_CRACK: 'OVP2_CRACK',
    OVP2_CRIMINAL_ATTITUDE: 'OVP2_CRIMINAL_ATTITUDE',
    OVP2_DRUG_MOTIVATION: 'OVP2_DRUG_MOTIVATION',
    OVP2_DV: 'OVP2_DV',
    OVP2_ECSTASY: 'OVP2_ECSTASY',
    OVP2_FEMALE: 'OVP2_FEMALE',
    OVP2_FIRST_SANCTION: 'OVP2_FIRST_SANCTION',
    OVP2_HEROIN: 'OVP2_HEROIN',
    OVP2_IMPULSIVE: 'OVP2_IMPULSIVE',
    OVP2_LIVE_IN_RELATIONSHIP: 'OVP2_LIVE_IN_RELATIONSHIP',
    OVP2_MISSING_COUNT: 'OVP2_MISSING_COUNT',
    OVP2_MISSING_QUESTIONS: 'OVP2_MISSING_QUESTIONS',
    OVP2_MISUSE_PRESCRIBED: 'OVP2_MISUSE_PRESCRIBED',
    OVP2_MULTIPLIC_RELATIONSHIP: 'OVP2_MULTIPLIC_RELATIONSHIP',
    OVP2_NEVER_VIOLENT: 'OVP2_NEVER_VIOLENT',
    OVP2_OFFENCE: 'OVP2_OFFENCE',
    OVP2_OFM: 'OVP2_OFM',
    OVP2_ONCE_VIOLENT: 'OVP2_ONCE_VIOLENT',
    OVP2_PERCENTAGE: 'OVP2_PERCENTAGE',
    OVP2_REGULAR_ACTIVITIES: 'OVP2_REGULAR_ACTIVITIES',
    OVP2_RELATIONSHIP: 'OVP2_RELATIONSHIP',
    OVP2_SECOND_SANCTION: 'OVP2_SECOND_SANCTION',
    OVP2_SECOND_SANCTION_GAP: 'OVP2_SECOND_SANCTION_GAP',
    OVP2_STEROIDS: 'OVP2_STEROIDS',
    OVP2_SUITABLE_ACC: 'OVP2_SUITABLE_ACC',
    OVP2_TEMPER: 'OVP2_TEMPER',
    OVP2_TOTAL_SANCTIONS: 'OVP2_TOTAL_SANCTIONS',
    OVP2_TOTAL_SCORE: 'OVP2_TOTAL_SCORE',
    OVP2_TOTAL_VIOLENT_SANCTIONS: 'OVP2_TOTAL_VIOLENT_SANCTIONS',
    OVP2_UNEMPLOYED: 'OVP2_UNEMPLOYED',
    OVP2_YEAR_TWO: 'OVP2_YEAR_TWO',
    RSR_BAND: 'RSR_BAND',
    RSR_CALCULATED: 'RSR_CALCULATED',
    RSR_DYNAMIC: 'RSR_DYNAMIC',
    RSR_MISSING_COUNT: 'RSR_MISSING_COUNT',
    RSR_MISSING_QUESTIONS: 'RSR_MISSING_QUESTIONS',
    RSR_PERCENTAGE: 'RSR_PERCENTAGE',
    SNSV_AAEAD_DYNAMIC: 'SNSV_AAEAD_DYNAMIC',
    SNSV_AAEAD_STATIC: 'SNSV_AAEAD_STATIC',
    SNSV_AGG_BURGLARY_DYNAMIC: 'SNSV_AGG_BURGLARY_DYNAMIC',
    SNSV_ARSON_DYNAMIC: 'SNSV_ARSON_DYNAMIC',
    SNSV_BAND_DYNAMIC: 'SNSV_BAND_DYNAMIC',
    SNSV_BAND_STATIC: 'SNSV_BAND_STATIC',
    SNSV_BINGE_DRINKER_DYNAMIC: 'SNSV_BINGE_DRINKER_DYNAMIC',
    SNSV_CALCULATED_DYNAMIC: 'SNSV_CALCULATED_DYNAMIC',
    SNSV_CALCULATED_STATIC: 'SNSV_CALCULATED_STATIC',
    SNSV_CHRONIC_DRINKER_DYNAMIC: 'SNSV_CHRONIC_DRINKER_DYNAMIC',
    SNSV_COPASV_DYNAMIC: 'SNSV_COPASV_DYNAMIC',
    SNSV_COPASV_STATIC: 'SNSV_COPASV_STATIC',
    SNSV_COPAS_VIOLENT_DYNAMIC: 'SNSV_COPAS_VIOLENT_DYNAMIC',
    SNSV_COPAS_VIOLENT_STATIC: 'SNSV_COPAS_VIOLENT_STATIC',
    SNSV_CRIM_ATTITUDE_DYNAMIC: 'SNSV_CRIM_ATTITUDE_DYNAMIC',
    SNSV_CRIM_DAMAGE_LIFE_DYNAMIC: 'SNSV_CRIM_DAMAGE_LIFE_DYNAMIC',
    SNSV_DV_DYNAMIC: 'SNSV_DV_DYNAMIC',
    SNSV_FEMALE_DYNAMIC: 'SNSV_FEMALE_DYNAMIC',
    SNSV_FEMALE_STATIC: 'SNSV_FEMALE_STATIC',
    SNSV_FIREARMS_DYNAMIC: 'SNSV_FIREARMS_DYNAMIC',
    SNSV_FIRST_SANCTION_DYNAMIC: 'SNSV_FIRST_SANCTION_DYNAMIC',
    SNSV_FIRST_SANCTION_STATIC: 'SNSV_FIRST_SANCTION_STATIC',
    SNSV_GBH_DYNAMIC: 'SNSV_GBH_DYNAMIC',
    SNSV_HOMICIDE_DYNAMIC: 'SNSV_HOMICIDE_DYNAMIC',
    SNSV_IMPULSIVE_DYNAMIC: 'SNSV_IMPULSIVE_DYNAMIC',
    SNSV_KIDNAP_DYNAMIC: 'SNSV_KIDNAP_DYNAMIC',
    SNSV_MISSING_COUNT_DYNAMIC: 'SNSV_MISSING_COUNT_DYNAMIC',
    SNSV_MISSING_COUNT_STATIC: 'SNSV_MISSING_COUNT_STATIC',
    SNSV_MISSING_QUESTIONS_DYNAMIC: 'SNSV_MISSING_QUESTIONS_DYNAMIC',
    SNSV_MISSING_QUESTIONS_STATIC: 'SNSV_MISSING_QUESTIONS_STATIC',
    SNSV_NEVER_VIOLENT_DYNAMIC: 'SNSV_NEVER_VIOLENT_DYNAMIC',
    SNSV_NEVER_VIOLENT_STATIC: 'SNSV_NEVER_VIOLENT_STATIC',
    SNSV_OFFENCE_DYNAMIC: 'SNSV_OFFENCE_DYNAMIC',
    SNSV_OFFENCE_STATIC: 'SNSV_OFFENCE_STATIC',
    SNSV_OFM_DYNAMIC: 'SNSV_OFM_DYNAMIC',
    SNSV_OFM_STATIC: 'SNSV_OFM_STATIC',
    SNSV_ONCE_VIOLENT_DYNAMIC: 'SNSV_ONCE_VIOLENT_DYNAMIC',
    SNSV_ONCE_VIOLENT_STATIC: 'SNSV_ONCE_VIOLENT_STATIC',
    SNSV_PERCENTAGE_DYNAMIC: 'SNSV_PERCENTAGE_DYNAMIC',
    SNSV_PERCENTAGE_STATIC: 'SNSV_PERCENTAGE_STATIC',
    SNSV_RELATION_QUALITY_DYNAMIC: 'SNSV_RELATION_QUALITY_DYNAMIC',
    SNSV_ROBBERY_DYNAMIC: 'SNSV_ROBBERY_DYNAMIC',
    SNSV_SCORE_DYNAMIC: 'SNSV_SCORE_DYNAMIC',
    SNSV_SCORE_STATIC: 'SNSV_SCORE_STATIC',
    SNSV_SECOND_SANCTION_DYNAMIC: 'SNSV_SECOND_SANCTION_DYNAMIC',
    SNSV_SECOND_SANCTION_STATIC: 'SNSV_SECOND_SANCTION_STATIC',
    SNSV_SECOND_SANC_GAP_DYNAMIC: 'SNSV_SECOND_SANC_GAP_DYNAMIC',
    SNSV_SECOND_SANC_GAP_STATIC: 'SNSV_SECOND_SANC_GAP_STATIC',
    SNSV_SUITABLE_ACC_DYNAMIC: 'SNSV_SUITABLE_ACC_DYNAMIC',
    SNSV_TEMPER_DYNAMIC: 'SNSV_TEMPER_DYNAMIC',
    SNSV_TOTAL_SANCTIONS_DYNAMIC: 'SNSV_TOTAL_SANCTIONS_DYNAMIC',
    SNSV_TOTAL_SANCTIONS_STATIC: 'SNSV_TOTAL_SANCTIONS_STATIC',
    SNSV_TOT_VIOLENT_SANC_DYNAMIC: 'SNSV_TOT_VIOLENT_SANC_DYNAMIC',
    SNSV_TOT_VIOLENT_SANC_STATIC: 'SNSV_TOT_VIOLENT_SANC_STATIC',
    SNSV_UNEMPLOYED_DYNAMIC: 'SNSV_UNEMPLOYED_DYNAMIC',
    SNSV_WEAPONS_NOT_GUNS_DYNAMIC: 'SNSV_WEAPONS_NOT_GUNS_DYNAMIC',
    SNSV_WEAPON_DYNAMIC: 'SNSV_WEAPON_DYNAMIC',
    SNSV_YEAR_TWO_DYNAMIC: 'SNSV_YEAR_TWO_DYNAMIC',
    SNSV_YEAR_TWO_STATIC: 'SNSV_YEAR_TWO_STATIC',
    OVP2_METHADONE: 'OVP2_METHADONE',
    OVP2_OTHER_DRUG: 'OVP2_OTHER_DRUGS',
    OVP2_OTHER_OPIATE: 'OVP2_OTHER_OPIATE',
}