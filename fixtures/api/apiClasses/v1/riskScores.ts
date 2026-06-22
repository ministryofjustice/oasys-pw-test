import { OGP, OVP, OGRS, RSR, OSP, NewActuarialPredictors } from '../riskScoreClasses'
import * as v1Common from './v1Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const relevantAssessments = offenderData.assessments.filter((ass) => !(['SARA', 'RM2000', 'BCS', 'TR_BCS'].includes(ass.assessmentType)))

    if (relevantAssessments.filter((ass) => ass.status == 'COMPLETE').length == 0) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new RiskScoresEndpointResponse(offenderData, parameters)

        result.addTimeline(relevantAssessments)
        result.addAssessments(relevantAssessments, parameters.endpoint == 'riskScores')  // latest only for riskScores, all for allRiskScores

        result.inputs['status'] = 'COMPLETE'  // Additional 'inputs' are reported by these endpoints
        result.inputs['nth'] = parameters.endpoint == 'allRiskScores' ? '0' : '1'

        return result
    }
}


export class RiskScoresEndpointResponse extends v1Common.V1EndpointResponse {

    assessments: RiskScoresAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessments(dbAssessments: dbClasses.DbAssessmentOrRsr[], latestOnly: boolean) {

        if (latestOnly) {
            super.addLatestAssessment(dbAssessments, RiskScoresAssessment, true)
        }
        else {
            super.addAllAssessments(dbAssessments, RiskScoresAssessment, true)
        }

        this.assessments.forEach((assessment) => {
            const dbAssessment = dbAssessments.filter((a) => a.assessmentPk == assessment.assessmentPk)[0]
            assessment.addRiskDetails(dbAssessment.riskDetails)
        })

    }
}

class RiskScoresAssessment extends v1Common.V1AssessmentCommon {

    OGP: OGP
    OVP: OVP
    OGRS: OGRS
    RSR: RSR
    OSP: OSP
    newActuarialPredictors: NewActuarialPredictors

    addRiskDetails(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.OGP = new OGP(dbRiskDetails)
        this.OVP = new OVP(dbRiskDetails)
        this.OGRS = new OGRS(dbRiskDetails)
        this.RSR = new RSR(dbRiskDetails)
        this.OSP = new OSP(dbRiskDetails)
        this.newActuarialPredictors = new NewActuarialPredictors(dbRiskDetails)

        // scoreLevel used instead of rsrScoreLevel in this endpoint
        delete this.RSR.rsrScoreLevel
    }
}

