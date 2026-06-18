import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new RoshSummEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class RoshSummEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: RoshSummAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, RoshSummAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class RoshSummAssessment extends v4Common.V4AssessmentCommon {

    whoAtRisk: string
    riskChildrenCommunity: string
    riskPublicCommunity: string
    riskKnownAdultCommunity: string
    riskStaffCommunity: string
    natureOfRisk: string
    riskChildrenCustody: string
    riskPublicCustody: string
    riskKnownAdultCustody: string
    riskStaffCustody: string
    riskPrisonersCustody: string
    riskGreatest: string
    factorsLikelyToIncreaseRisk: string
    factorsLikelyToReduceRisk: string
    factorsAnalysisOfRisk: string
    factorsStrengthsAndProtective: string
    factorsSituationsLikelyToOffend: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.whoAtRisk = dbAssessment.qaData.getString('SUM1')
        this.riskChildrenCommunity = dbAssessment.qaData.getString('SUM6.1.1')
        this.riskPublicCommunity = dbAssessment.qaData.getString('SUM6.2.1')
        this.riskKnownAdultCommunity = dbAssessment.qaData.getString('SUM6.3.1')
        this.riskStaffCommunity = dbAssessment.qaData.getString('SUM6.4.1')
        this.natureOfRisk = dbAssessment.qaData.getString('SUM2')
        this.riskChildrenCustody = dbAssessment.qaData.getString('SUM6.1.2')
        this.riskPublicCustody = dbAssessment.qaData.getString('SUM6.2.2')
        this.riskKnownAdultCustody = dbAssessment.qaData.getString('SUM6.3.2')
        this.riskStaffCustody = dbAssessment.qaData.getString('SUM6.4.2')
        this.riskPrisonersCustody = dbAssessment.qaData.getString('SUM6.5.2')
        this.riskGreatest = dbAssessment.qaData.getString('SUM3')
        this.factorsLikelyToIncreaseRisk = dbAssessment.qaData.getString('ROSHSUM-SUM4')
        this.factorsLikelyToReduceRisk = dbAssessment.qaData.getString('ROSHSUM-SUM5')
        this.factorsAnalysisOfRisk = dbAssessment.qaData.getString('SUM9')
        this.factorsStrengthsAndProtective = dbAssessment.qaData.getString('ROSHSUM-SUM10')
        this.factorsSituationsLikelyToOffend = dbAssessment.qaData.getString('SUM11')

    }
}

