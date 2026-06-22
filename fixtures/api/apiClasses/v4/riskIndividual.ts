import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new RiskIndividualEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class RiskIndividualEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: RiskIndividualAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, RiskIndividualAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class RiskIndividualAssessment extends v4Common.V4AssessmentCommon {

    concernsRiskOfSuicide: string
    concernsRiskOfSelfHarm: string
    concernsCopingInCustody: string
    concernsVulnerability: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        // Remove standard stuff not included in this endpoint
        delete this.assessmentPk
        delete this.assessmentVersion
        delete this.assessmentType
        delete this.dateCompleted
        delete this.assessorSignedDate
        delete this.initiationDate
        delete this.assessmentStatus
        delete this.superStatus
        delete this.laterWIPAssessmentExists
        delete this.latestWIPDate
        delete this.laterSignLockAssessmentExists
        delete this.latestSignLockDate
        delete this.laterPartCompSignedAssessmentExists
        delete this.latestPartCompSignedDate
        delete this.laterPartCompUnsignedAssessmentExists
        delete this.latestPartCompUnsignedDate
        delete this.laterCompleteAssessmentExists
        delete this.latestCompleteDate
        delete this.assessor

        this.concernsRiskOfSuicide = dbAssessment.qaData.getString('R3.1')
        this.concernsRiskOfSelfHarm = dbAssessment.qaData.getString('R3.2')
        this.concernsCopingInCustody = dbAssessment.qaData.getString('R3.3')
        this.concernsVulnerability = dbAssessment.qaData.getString('R3.4')
    }
}

