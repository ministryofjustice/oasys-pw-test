import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new TierPredictorsEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class TierPredictorsEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: TierPredictorsAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, TierPredictorsAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment)
        }
    }

}

export class TierPredictorsAssessment extends v4Common.V4AssessmentCommon {

    everCommittedSexualOffence: string
    tierPredictors: TierPredictorGroup

    addDetails(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        // Remove standard stuff not included in this endpoint
        delete this.dateCompleted
        delete this.assessorSignedDate
        delete this.initiationDate
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

        if (dbAssessment.assessmentType == 'STANDALONE') {
            this.everCommittedSexualOffence = (dbAssessment as dbClasses.DbRsr).everCommittedSexualOffence // TODO convert to Yes/No?
        }
        else {
            this.everCommittedSexualOffence = (dbAssessment as dbClasses.DbAssessment).qaData.getString('1.30')
        }
        this.tierPredictors = new TierPredictorGroup(dbAssessment)
    }
}

class TierPredictorGroup {

    newActuarialPredictors: RecalculatedNewActuarialPredictors
    rsr: Rsr
    osp: Osp

    constructor(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        this.newActuarialPredictors = new RecalculatedNewActuarialPredictors(dbAssessment)
        this.rsr = new Rsr(dbAssessment)
        this.osp = new Osp(dbAssessment)
    }

}

class RecalculatedNewActuarialPredictors {

    ogrs4gYr2: number
    ogrs4gBand: string
    ogrs4gCalculated: string
    ogp2Yr2: number
    ogp2Band: string
    ogp2Calculated: string

    constructor(dbAssessment: dbClasses.DbAssessmentOrRsr) {


    }
}

class Rsr {

    rsrStaticOrDynamic: string
    rsrPercentageScore: number
    rsrScoreLevel: string
    rsrExceptionError: string

    constructor(dbAssessment: dbClasses.DbAssessmentOrRsr) {


    }
}

class Osp {

    ospDirectContactPercentageScore: number
    ospDirectContactScoreLevel: string
    ospDirectContactRiskReduction: string

    constructor(dbAssessment: dbClasses.DbAssessmentOrRsr) {


    }
}