import { APIRequestContext } from '@playwright/test'

import { OasysDb, Ogrs } from 'fixtures'
import * as rest from './apiClasses'
import * as dbClasses from './data/dbClasses'
import * as restApi from './getApiResponse'
import * as checkApiResponse from './checkApiResponse'
import * as restApiDb from './data/restApiDb'


export class Api {

    constructor(private readonly oasysDb: OasysDb, private readonly request: APIRequestContext, private readonly ogrs: Ogrs) { }

    /** 
     * Tests all endpoints for all assessments for given offender CRN; returns an OffenderApisResult object including pass/fail, reporting output and timing stats.
     * All necessary data is pulled from the database to build expected responses.
     * 
     * @param crn (either probation or prison CRN as specified by the next parameter)
     * @param crnSource - 'prob' or 'pris'
     * @param skipPkOnlyCalls - if true, any APIs that are called with just an assessment PK will be skipped on the basis that the calling script is repeating an offender 
     *                      (selected this time using the prison CRN instead of probation) so these calls will be identical.
     * @param reportPasses - include details for all cases (or just failures) in the test report
     * @param limitEndpoints - if provided, limits the test to only the specified endpoints
     * @param excludeEndpoints - if provided, prevents calling the specified endpoints
     * @returns True for any failure
     */
    async testOneOffender(crn: string, crnSource: Provider, skipPkOnlyCalls: boolean, reportPasses: boolean, limitEndpoints: Endpoint[] = null, excludeEndpoints: Endpoint[] = null): Promise<boolean> {

        const v1Endpoints: Endpoint[] = [
            'offences',
            'riskScores',
            'allRiskScores',
            'rmp',
        ]

        const apEndpoints: Endpoint[] = [
            'apOffence',
            'apNeeds',
            'apRmp',
            'apRoshSum',
            'apRiskInd',
            'apRiskAss',
            'apHealth',
            'apRosh',
        ]

        const v4AssessmentEndpoints: Endpoint[] = [
            'v4section1',
            'v4section2',
            'v4section3',
            'v4section4',
            'v4section5',
            'v4section6',
            'v4section7',
            'v4section8',
            'v4section9',
            'v4section10',
            'v4section11',
            'v4section12',
            'v4section13',
            'v4Rmp',
            'v4RoshFull',
            'v4RoshSumm',
            'v4Victim',
            'v4RiskIndividual',
            'v4RiskScoresAss',
            'crimNeeds',
        ]

        const v4RsrEndpoints: Endpoint[] = [
            'v4RiskScoresRsr',
        ]

        // TODO restore this when defect fixed
        // if (crnSource == 'prob') {
        //     v4RsrEndpoints.push('tierPredictors')
        // }

        let failed = false

        // Get all relevant data from the OASys database
        const offenderData = await restApiDb.getOffenderWithAssessments(crnSource, crn, this.oasysDb)
        log('', ' ')
        log('', `Offender ${crnSource == 'prob' ? 'CRN' : 'NOMIS Id'}: ${crn}`)

        if (offenderData == null) {  // null return indicates no offender data or multiple offenders with the same CRN
            log('Skipping this offender - no offender data or multiple offender records with the same CRN')
            log('')

        } else {
            // Store the elapsed time for database querying
            statsLog('database', offenderData.dbElapsedTime)

            ////////////////////////////////////////////////////////////
            // Compile a set of parameters for calling the API functions
            const apiParams: EndpointParams[] = []

            if (crnSource == 'prob') { // Ignore 'pris' offenders for versions 1 to 3 endpoints

                // Add parameters for the V1 endpoints
                v1Endpoints.forEach((endpoint) => {
                    const params: EndpointParams = { endpoint: endpoint, crn: offenderData.probationCrn, laoPrivilege: 'ALLOW' }
                    apiParams.push(params)
                })

                // Add AP Initial
                const params: EndpointParams = { endpoint: 'apAsslist', crn: offenderData.probationCrn, laoPrivilege: 'ALLOW' }
                apiParams.push(params)

                // Add other AP endpoint params if the offender has assessments
                const apAssessments = offenderData.assessments.filter(rest.Ap.ApCommon.assessmentFilter)
                apAssessments.forEach((assessment) => this.addAssessment(apEndpoints, apiParams, offenderData.probationCrn, assessment))

                // Use latest complete or locked incomplete assessment for the AssSumm - only if initiated after 2020 to avoid incompatible data. In reality should only be used from release 6.46
                const assSummAssessments = offenderData.assessments.filter((ass) =>
                    !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType)
                    && ['COMPLETE', 'LOCKED_INCOMPLETE'].includes(ass.status)
                    && ass.initiationDate > '2020')
                if (assSummAssessments.length > 0) {
                    const assessment = assSummAssessments[assSummAssessments.length - 1]
                    apiParams.push({
                        endpoint: assessment['sanIndicator' as keyof dbClasses.DbAssessmentOrRsr] == 'Y' || assessment['spIndicator' as keyof dbClasses.DbAssessmentOrRsr] == 'Y'
                            ? 'assSummSan' : 'assSumm',
                        crn: offenderData.probationCrn, laoPrivilege: 'ALLOW', assessmentPk: assessment.assessmentPk, expectedStatus: assessment.status
                    })
                }
            }

            // Add V4 asslist
            const v4Asslistparams: EndpointParams = {
                endpoint: 'v4AssList',
                crnSource: crnSource,
                crn: crnSource == 'prob' ? offenderData.probationCrn : offenderData.nomisId,
                laoPrivilege: 'ALLOW'
            }
            apiParams.push(v4Asslistparams)

            if (crnSource == 'prob') {
                // Add V4 tierRiskFlag for probation only
                const v4TierRiskFlagparams: EndpointParams = {
                    endpoint: 'tierRiskFlag',
                    crn: offenderData.probationCrn,
                    laoPrivilege: 'ALLOW'
                }
                apiParams.push(v4TierRiskFlagparams)
            }

            // Add other V4 endpoint params if the offender has assessments and if skipPkOnlyCalls parameter is false
            if (!skipPkOnlyCalls) {

                // V4 timeline includes layer2 but the subsequents do not
                const relevantAssessments = offenderData.assessments.filter(rest.V4Common.assessmentFilter).filter((ass) => ass.assessmentType != 'LAYER2')

                relevantAssessments.forEach((assessment) => {

                    this.addAssessment(v4AssessmentEndpoints, apiParams, offenderData.probationCrn, assessment)

                    // Add tier predictors - only if initiated after 2024 to avoid incompatible data
                    if (assessment.initiationDate > '2024' && crnSource == 'prob') {
                        const tierPredictorsParams: EndpointParams = {
                            endpoint: 'tierPredictors',
                            assessmentPk: assessment.assessmentPk,
                            recordType: 'O',
                            laoPrivilege: 'ALLOW'
                        }
                        apiParams.push(tierPredictorsParams)
                    }
                })

                // Add RSRs
                const standaloneRsrs = offenderData.assessments.filter((ass) => ass.assessmentType == 'STANDALONE')

                standaloneRsrs.forEach((assessment) => {
                    this.addAssessment(v4RsrEndpoints, apiParams, offenderData.probationCrn, assessment)

                    // TODO add this back in
                    // Add tier predictors - only if initiated after 2024 to avoid incompatible data
                    // if (assessment.initiationDate > '2024' && crnSource == 'prob') {
                    //     const tierPredictorsParams: EndpointParams = {
                    //         endpoint: 'tierPredictors',
                    //         assessmentPk: assessment.assessmentPk,
                    //         recordType: 'R',
                    //         laoPrivilege: 'ALLOW'
                    //     }
                    //     apiParams.push(tierPredictorsParams)
                    // }
                })

            }

            // Add PNI - only if initiated after 2021 to avoid incompatible data
            const pniRelevantAssessments = offenderData.assessments.filter(rest.V4Common.pni.pniFilter).filter((ass) => ass.initiationDate > '2021')
            if (pniRelevantAssessments.length > 0) {
                const v4PniParams: EndpointParams = {
                    endpoint: 'pni',
                    crnSource: crnSource,
                    crn: crnSource == 'prob' ? offenderData.probationCrn : offenderData.nomisId,
                    additionalParameter: 'Y',
                    laoPrivilege: 'ALLOW'
                }
                apiParams.push(v4PniParams)
                const custodyParams = JSON.parse(JSON.stringify(v4PniParams)) as EndpointParams
                custodyParams.additionalParameter = 'N'
                apiParams.push(custodyParams)
            }

            // Filter to a limited list if specified, and remove anything in the exclusions list
            let filteredParamsList = limitEndpoints && limitEndpoints.length > 0 ? apiParams.filter((param) => limitEndpoints.includes(param.endpoint)) : apiParams
            filteredParamsList = excludeEndpoints ? filteredParamsList.filter((param) => !excludeEndpoints.includes(param.endpoint)) : filteredParamsList

            ///////////////////////////////////////////////////////////
            // Work out the expected responses, then call the endpoints
            const expectedValues = await rest.GetExpectedResponses.getExpectedResponses(offenderData, filteredParamsList, this.ogrs)
            const actualValues = await restApi.getMultipleApiResponses(filteredParamsList, this.request)

            ////////////////////////////////////
            // Compare results for each endpoint
            let lastPkReported = 0
            for (let i = 0; i < filteredParamsList.length; i++) {

                if (filteredParamsList[i].endpoint == 'apAsslist' || filteredParamsList[i].endpoint == 'v4AssList') {
                    delete actualValues[i].result['assessments']  // spurious empty array object gets added to the asslist and allasslist endpoints, ignore for this test
                }

                if (filteredParamsList[i].assessmentPk && (filteredParamsList[i].assessmentPk != lastPkReported)) {
                    // Write some assessment details to the log, including OASys version at initiation date
                    const assessmentData = offenderData.assessments.filter((ass) => ass.assessmentPk == filteredParamsList[i].assessmentPk)[0]
                    const assVersion = assessmentData.assessmentType == 'STANDALONE' ? '' : ` v${(assessmentData as dbClasses.DbAssessment).assessmentVersion}`
                    log('', `\n${assessmentData.assessmentType}${assVersion} assessment (${assessmentData.assessmentPk}), initiation date ${assessmentData.initiationDate.substring(0, 10)} (${assessmentData.appVersion})`)
                    fileLog(`${assessmentData.assessmentType}${assVersion} assessment (${assessmentData.assessmentPk}), initiation date ${assessmentData.initiationDate.substring(0, 10)} (${assessmentData.appVersion})`)
                    lastPkReported = filteredParamsList[i].assessmentPk
                }

                // Compare expected vs actuals and write results to the log
                const result = await checkApiResponse.checkApiResponse(expectedValues[i], actualValues[i], reportPasses)

                if (result) {
                    failed = true
                }

                // Check response time and add to stats table, mark as SLOW if > 99ms
                let slow = actualValues[i].responseTime > 500 ? '**** VERY SLOW ****' : actualValues[i].responseTime > 99 ? '**** SLOW ****' : ''
                if (slow != '') {
                    log(`${actualValues[i].responseTime}ms ${slow}`)
                }
                statsLog(filteredParamsList[i].endpoint, actualValues[i].responseTime)
                log('')
            }
        }

        return failed
    }

    private addAssessment(endpoints: Endpoint[], parameters: EndpointParams[], crn: string, assessment: dbClasses.DbAssessmentOrRsr) {

        endpoints.forEach((endpoint) => {
            const params: EndpointParams = {
                endpoint: endpoint, crn: crn,
                laoPrivilege: 'ALLOW', assessmentPk: assessment.assessmentPk, expectedStatus: assessment.status
            }
            parameters.push(params)
        })
    }

}