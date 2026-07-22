import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section6EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        const saraAssessments = offenderData.assessments.filter(
            (assessment) =>
                assessment.assessmentType == 'SARA' && (assessment as dbClasses.DbAssessment).parentAssessmentPk == parameters.assessmentPk
        )
        if (saraAssessments.length > 0) {
            result.addSaraDetails(saraAssessments[0] as dbClasses.DbAssessment)
        }
        else {
            result.addSaraDetails(null)
        }
        return result
    }
}

export class Section6EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section6Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section6Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

    addSaraDetails(saraAssessment: dbClasses.DbAssessment) {

        this.assessments[0].SARA = new Sara(saraAssessment)
    }

}

export class Section6Assessment extends v4Common.V4AssessmentCommon {

    relCloseFamily: string
    victimOfPartner: string
    victimOfFamily: string
    perpAgainstPartner: string
    perpAgainstFamily: string
    experienceOfChildhood: string
    relCurrRelationshipStatus: string
    relationshipWithPartner: string
    prevCloseRelationships: string
    prevOrCurrentDomesticAbuse: string
    relParentalResponsibilities: string
    parentalRespProblem: string
    openSexualOffendingQuestions: string
    emotionalCongruence: string
    relIssuesDetails: string
    relLinkedToHarm: string
    relLinkedToReoffending: string

    SARA: Sara

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.relCloseFamily = dbAssessment.qaData.getString('6.1')
        this.experienceOfChildhood = dbAssessment.qaData.getString('6.3')
        this.relCurrRelationshipStatus = dbAssessment.qaData.getString('6.8')
        this.relationshipWithPartner = dbAssessment.qaData.getString('6.4')
        this.prevCloseRelationships = dbAssessment.qaData.getString('6.6')
        this.relParentalResponsibilities = dbAssessment.qaData.getString('6.9')
        this.parentalRespProblem = dbAssessment.qaData.getString('6.10')
        this.openSexualOffendingQuestions = dbAssessment.qaData.getString('6.11')
        this.emotionalCongruence = dbAssessment.qaData.getString('6.12')
        this.relIssuesDetails = dbAssessment.qaData.getString('6.97')
        this.relLinkedToHarm = dbAssessment.qaData.getString('6.98')
        this.relLinkedToReoffending = dbAssessment.qaData.getString('6.99')

        if (oasysDateTime.checkIfAfter('6.30', dbAssessment.initiationDate)) {
            this.prevOrCurrentDomesticAbuse = dbAssessment.qaData.getString('6.7da')
            this.victimOfPartner = dbAssessment.qaData.getString('6.7.1.1da')
            this.victimOfFamily = dbAssessment.qaData.getString('6.7.1.2da')
            this.perpAgainstPartner = dbAssessment.qaData.getString('6.7.2.1da')
            this.perpAgainstFamily = dbAssessment.qaData.getString('6.7.2.2da')
        } else {
            this.prevOrCurrentDomesticAbuse = dbAssessment.qaData.getString('6.7')

            const da = dbAssessment.qaData.getStringArray('6.7.1')
            if (da != null && da != undefined) {
                this.perpAgainstPartner = da.includes('Perpetrator') ? 'Yes' : null
                this.victimOfPartner = da.includes('Victim') ? 'Yes' : null
            } else {
                this.perpAgainstPartner = null
                this.victimOfPartner = null
            }
            this.perpAgainstFamily = null
            this.victimOfFamily = null
        }
    }

}

export class Sara {

    imminentRiskOfViolenceTowardsPartner: string = null
    imminentRiskOfViolenceTowardsOthers: string = null

    constructor(saraAssessment: dbClasses.DbAssessment) {

        if (saraAssessment != null) {
            this.imminentRiskOfViolenceTowardsPartner = saraAssessment.qaData.getString('SR76.1.1')
            this.imminentRiskOfViolenceTowardsOthers = saraAssessment.qaData.getString('SR77.1.1')
        }
    }
}
