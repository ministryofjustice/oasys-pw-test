import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section7EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section7EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section7Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section7Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section7Assessment extends v4Common.V4AssessmentCommon {

    communityIntegration: string
    regActivitiesEncourageOffending: string
    easilyInfluenced: string
    manipulativePredatory: string
    recklessness: string
    lifestyleIssuesDetails: string
    lifestyleLinkedToHarm: string
    lifestyleLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.communityIntegration = dbAssessment.qaData.getString('7.1')
        this.regActivitiesEncourageOffending = dbAssessment.qaData.getString('7.2')
        this.easilyInfluenced = dbAssessment.qaData.getString('7.3')
        this.manipulativePredatory = dbAssessment.qaData.getString('7.4')
        this.recklessness = dbAssessment.qaData.getString('7.5')
        this.lifestyleIssuesDetails = dbAssessment.qaData.getString('7.97')
        this.lifestyleLinkedToHarm = dbAssessment.qaData.getString('7.98')
        this.lifestyleLinkedToReoffending = dbAssessment.qaData.getString('7.99')
    }
}
