import * as apCommon from './apCommon'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new APRoshEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        return result
    }
}

export class APRoshEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APRoSHAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APRoSHAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addRoshSumDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APRoSHAssessment extends apCommon.APAssessmentCommon {

    riskChildrenCommunity: string
    riskPublicCommunity: string
    riskKnownAdultCommunity: string
    riskStaffCommunity: string
    riskChildrenCustody: string
    riskPublicCustody: string
    riskKnownAdultCustody: string
    riskStaffCustody: string
    riskPrisonersCustody: string


    addRoshSumDetails(assessment: dbClasses.DbAssessment) {

        this.riskChildrenCommunity = assessment.qaData.getString('SUM6.1.1')
        this.riskPublicCommunity = assessment.qaData.getString('SUM6.2.1')
        this.riskKnownAdultCommunity = assessment.qaData.getString('SUM6.3.1')
        this.riskStaffCommunity = assessment.qaData.getString('SUM6.4.1')
        this.riskChildrenCustody = assessment.qaData.getString('SUM6.1.2')
        this.riskPublicCustody = assessment.qaData.getString('SUM6.2.2')
        this.riskKnownAdultCustody = assessment.qaData.getString('SUM6.3.2')
        this.riskStaffCustody = assessment.qaData.getString('SUM6.4.2')
        this.riskPrisonersCustody = assessment.qaData.getString('SUM6.5.2')
    }
}
