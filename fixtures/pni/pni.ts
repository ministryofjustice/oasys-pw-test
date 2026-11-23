import { Assessment, OasysDb } from 'fixtures'
import { Data } from './data/data'
import { pniCalc } from './pniCalc'
import { connectCalc } from './connectCalc'
import { ConnectCalcResult } from './data/connectCalcResult'
import { PniCalcResult } from './data/pniCalcResult'

export class Pni {

    constructor(private readonly oasysDb: OasysDb, private readonly assessment: Assessment) { }

    private readonly data = new Data(this.oasysDb)

    async checkAssessmentCalc(probationCrn: string, pk: number) {

        const testParams = await this.data.getPniTestParameters(probationCrn, pk)

        // Building choices
        const pniResult = pniCalc(testParams.pniParams)

        log(JSON.stringify(testParams.pniParams))
        log(JSON.stringify(pniResult))

        await this.assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
            pni_func_proc: 'Y',
            pni_calculation: pniResult.pniCalculation,
            pni_missing_fields_txt: pniResult.missingFields ? `\n${pniResult.missingFields}` : null,
        })

        // Connect
        const connectResult = connectCalc(testParams.connectParams)

        log(JSON.stringify(testParams.connectParams))
        log(JSON.stringify(connectResult))

        // await this.assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {  // TODO add oasys_set columns
        //     // pni_func_proc: 'Y',
        //     // pni_calculation: pniResult.pniCalculation,
        //     // pni_missing_fields_txt: pniResult.missingFields ? `\n${pniResult.missingFields.join('\n')}` : null,
        // })
    }

    async testCalculators(probationCrn: string, offenderPk: number, reportPasses: boolean): Promise<{ count: number, failed: number }> {

        const assessmentQuery = `select os.oasys_set_pk from eor.oasys_set os, eor.oasys_assessment_group og
                                    where og.offender_pk = ${offenderPk} 
                                    and og.oasys_assessment_group_pk = os.oasys_assessment_group_pk 
                                    and os.deleted_date is null
                                    and os.ref_ass_version_code = 'LAYER3'
                                    order by initiation_date desc`

        const assessments = await this.oasysDb.getData(assessmentQuery)
        if (assessments.length == 0) {
            if (reportPasses) {
                log('No layer 3 assessment', `CRN: ${probationCrn}`)
            }
            return { count: 0, failed: 0 }
        }

        let count = 0
        let failed = 0
        for (let i = 0; i < assessments.length; i++) {
            count++
            const assessmentPk = Number.parseInt(assessments[i][0])

            const testParams = await this.data.getPniTestParameters(probationCrn, assessmentPk)

            // Building choices
            const pniResult = pniCalc(testParams.pniParams)
            const pniFunctionCall = testParams.pniParams.oracleFunctionCall()
            const oraclePniResponse = await this.oasysDb.callFunction(pniFunctionCall)
            const oraclePniResult = new PniCalcResult()
            oraclePniResult.loadOracleOutputValues(oraclePniResponse.split('|'))

            const pniFailed = comparePniResults(pniResult, oraclePniResult)

            if (pniFailed) {
                failed++
                log(`Params:  ${JSON.stringify(testParams.pniParams)}.  Expected ${JSON.stringify(pniResult)}, got ${JSON.stringify(oraclePniResult)}`,
                    `CRN: ${probationCrn}, Offender PK: ${offenderPk}, Assessment PK: ${assessmentPk} PNI **** FAILED ****`)
            } else if (reportPasses) {
                log(`Params:  ${JSON.stringify(testParams.pniParams)}.  Expected ${pniResult.pniCalculation} ${pniResult.missingFields}, got ${JSON.stringify(oraclePniResult)}`,
                    `CRN: ${probationCrn}, PK: ${assessmentPk} PNI PASSED`)
            }

            if (testParams.oasysSetValues.pniFuncProc && testParams.oasysSetValues.assessmentStatus == 'COMPLETE' && oasysDateTime.checkIfAfter('7.7', testParams.oasysSetValues.initiationDate)) {
                // Check against the assessment values if there is a calculation and the assessment is recent (avoid data/formatting issues)
                const pnioOasysSetCheckFailed = await this.assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${assessmentPk}`, {
                    pni_func_proc: 'Y',
                    pni_calculation: pniResult.pniCalculation,
                    pni_missing_fields_txt: pniResult.missingFields ? pniResult.missingFields : null,
                }, true)

                if (pnioOasysSetCheckFailed) {
                    failed++
                    log('**** FAILED ****')
                }
            }

            // Connect  // TODO add this when NOD-1393 is implemented
            // const connectResult = connectCalc(testParams.connectParams)
            // const connectFunctionCall = testParams.connectParams.oracleFunctionCall()
            // const oracleConnectResponse = await this.oasysDb.callFunction(connectFunctionCall)
            // const oracleConnectResult = new ConnectCalcResult()
            // oracleConnectResult.loadOracleOutputValues(oracleConnectResponse.split('|'))

            // const connectFailed = compareConnectResults(connectResult, oracleConnectResult)
            // if (connectFailed) {
            //     failed++
            //     log(`Params:  ${JSON.stringify(testParams.connectParams)}.  Expected ${JSON.stringify(connectResult)}, got ${JSON.stringify(oracleConnectResult)}`,
            //         `CRN: ${probationCrn}, Offender PK: ${offenderPk}, Assessment PK: ${assessmentPk} Connect **** FAILED ****`)
            // } else if (reportPasses) {
            //     log(`Params:  ${JSON.stringify(testParams.connectParams)}.  Expected ${JSON.stringify(connectResult)}, got ${JSON.stringify(oracleConnectResult)}`,
            //         `CRN: ${probationCrn}, PK: ${assessmentPk} Connect PASSED`)
            // }
        }
        return { count: count, failed: failed }
    }

}

function comparePniResults(pw: PniCalcResult, oracle: PniCalcResult): boolean {

    let failed = false

    failed = pw.sexDomainLevel != oracle.sexDomainLevel || failed
    failed = pw.sexDomainScore != oracle.sexDomainScore || failed
    failed = pw.thinkingDomainLevel != oracle.thinkingDomainLevel || failed
    failed = pw.thinkingDomainScore != oracle.thinkingDomainScore || failed
    failed = pw.relationshipDomainLevel != oracle.relationshipDomainLevel || failed
    failed = pw.relationshipDomainScore != oracle.relationshipDomainScore || failed
    failed = pw.selfManagementDomainLevel != oracle.selfManagementDomainLevel || failed
    failed = pw.selfManagementDomainScore != oracle.selfManagementDomainScore || failed
    failed = pw.totalDomainScore != oracle.totalDomainScore || failed
    failed = pw.overallNeedLevel != oracle.overallNeedLevel || failed
    failed = pw.riskLevel != oracle.riskLevel || failed
    failed = pw.pniCalculation != oracle.pniCalculation || failed
    failed = pw.missingFields != oracle.missingFields || failed

    return failed
}

function compareConnectResults(pw: ConnectCalcResult, oracle: ConnectCalcResult): boolean {

    let failed = false

    failed = pw.sexDomainLevel != oracle.sexDomainLevel || failed
    failed = pw.sexDomainScore != oracle.sexDomainScore || failed
    failed = pw.thinkingDomainLevel != oracle.thinkingDomainLevel || failed
    failed = pw.thinkingDomainScore != oracle.thinkingDomainScore || failed
    failed = pw.relationshipDomainLevel != oracle.relationshipDomainLevel || failed
    failed = pw.relationshipDomainScore != oracle.relationshipDomainScore || failed
    failed = pw.selfManagementDomainLevel != oracle.selfManagementDomainLevel || failed
    failed = pw.selfManagementDomainScore != oracle.selfManagementDomainScore || failed
    failed = pw.totalDomainScore != oracle.totalDomainScore || failed
    failed = pw.overallNeedLevel != oracle.overallNeedLevel || failed
    failed = pw.connectResult != oracle.connectResult || failed
    failed = pw.missingFields != oracle.missingFields || failed

    return failed
}



