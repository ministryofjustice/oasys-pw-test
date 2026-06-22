import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new VictimEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class VictimEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: VictimAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, VictimAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class VictimAssessment extends v4Common.V4AssessmentCommon {

    victims: Victim[] = null

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

        if (dbAssessment.victims.length > 0) {
            this.victims = []
            dbAssessment.victims.forEach((victim) => this.victims.push(new Victim(victim)))
        }
    }
}

export class Victim {

    victimDisplaySort: number
    victimAge: string
    victimGender: string
    victimEthnicity: string
    victimPerpRelationship: string

    constructor(dbVictim: dbClasses.DbVictim) {

        this.victimDisplaySort = dbVictim.displaySort
        this.victimAge = dbVictim.age
        this.victimGender = dbVictim.gender
        this.victimEthnicity = dbVictim.ethnicCategory
        this.victimPerpRelationship = dbVictim.victimRelation
    }
}