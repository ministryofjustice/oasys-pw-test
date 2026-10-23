import { Assessment, OasysDb } from 'fixtures'
import { Data } from './data'
import { pniCalc } from './pniCalc'
import { connectCalc } from './connectCalc'
import { connectFunctionCall, loadOracleOutputValues } from './connectFunctionCall'

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
            pni_missing_fields_txt: pniResult.missingFields ? `\n${pniResult.missingFields.join('\n')}` : null,
        })

        // Connect
        const connectResult = connectCalc(testParams.connectParams)

        log(JSON.stringify(testParams.connectParams))
        log(JSON.stringify(connectResult))

        await this.assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {  // TODO add oasys_set columns
            // pni_func_proc: 'Y',
            // pni_calculation: pniResult.pniCalculation,
            // pni_missing_fields_txt: pniResult.missingFields ? `\n${pniResult.missingFields.join('\n')}` : null,
        })
    }

    async testConnectCalculator(whereClause: string, count: number) {

        const testData = await this.data.getConnectCalcTestData(whereClause, count)
        let failed = 0

        for (const testCase of testData) {

            const connectResult = connectCalc(testCase)
            const functionCall = connectFunctionCall(testCase)
            const oracleResponse = await this.oasysDb.callFunction(functionCall)
            const oracleResult = loadOracleOutputValues(oracleResponse.split('|'))

            const caseFailed = compareConnectResults(connectResult, oracleResult)
            if (caseFailed) {
                failed++
                log(`Expected ${JSON.stringify(connectResult)}, got ${JSON.stringify(oracleResult)}`, JSON.stringify(testCase))
            }
        }

        expect(failed).toBe(0)
    }

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