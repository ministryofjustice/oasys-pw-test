import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section9EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section9EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section9Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section9Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section9Assessment extends v4Common.V4AssessmentCommon {

    alcoholProblemDescription: string
    currentUse: string
    bingeDrinking: string
    frequencyAndLevel: string
    alcoholViolentBehaviour: string
    alcoholTackleMotivation: string
    alcoholIssuesDetails: string
    alcoholLinkedToHarm: string
    alcoholLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.alcoholProblemDescription = dbAssessment.qaData.getString('9.1.t')
        this.currentUse = dbAssessment.qaData.getString('9.1')
        this.bingeDrinking = dbAssessment.qaData.getString('9.2')
        this.frequencyAndLevel = dbAssessment.qaData.getString('9.3')
        this.alcoholViolentBehaviour = dbAssessment.qaData.getString('9.4')
        this.alcoholTackleMotivation = dbAssessment.qaData.getString('9.5')
        this.alcoholIssuesDetails = dbAssessment.qaData.getString('9.97')
        this.alcoholLinkedToHarm = dbAssessment.qaData.getString('9.98')
        this.alcoholLinkedToReoffending = dbAssessment.qaData.getString('9.99')
    }
}
