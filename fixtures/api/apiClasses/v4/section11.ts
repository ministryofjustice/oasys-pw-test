import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section11EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section11EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section11Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section11Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section11Assessment extends v4Common.V4AssessmentCommon {

    interpersonalSkills: string
    impulsivity: string
    aggressiveControllingBehavour: string
    temperControl: string
    recogniseProblems: string
    problemSolvingSkills: string
    awarenessOfConsequences: string
    achieveGoals: string
    understandsViewsOfOthers: string
    concreteAbstractThinking: string
    sexualPreOccupation: string
    offenceRelatedSexualInterests: string
    thinkIssuesDetails: string
    thinkLinkedToHarm: string
    thinkLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.interpersonalSkills = dbAssessment.qaData.getString('11.1')
        this.impulsivity = dbAssessment.qaData.getString('11.2')
        this.aggressiveControllingBehavour = dbAssessment.qaData.getString('11.3')
        this.temperControl = dbAssessment.qaData.getString('11.4')
        this.recogniseProblems = dbAssessment.qaData.getString('11.5')
        this.problemSolvingSkills = dbAssessment.qaData.getString('11.6')
        this.awarenessOfConsequences = dbAssessment.qaData.getString('11.7')
        this.achieveGoals = dbAssessment.qaData.getString('11.8')
        this.understandsViewsOfOthers = dbAssessment.qaData.getString('11.9')
        this.concreteAbstractThinking = dbAssessment.qaData.getString('11.10')
        this.sexualPreOccupation = dbAssessment.qaData.getString('11.11')
        this.offenceRelatedSexualInterests = dbAssessment.qaData.getString('11.12')
        this.thinkIssuesDetails = dbAssessment.qaData.getString('11.97')
        this.thinkLinkedToHarm = dbAssessment.qaData.getString('11.98')
        this.thinkLinkedToReoffending = dbAssessment.qaData.getString('11.99')
    }
}
