import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'
import * as common from '../common'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const relevantAssessments = offenderData.assessments.filter((ass) => !(['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType)))

    if (relevantAssessments.length == 0) {
        return env.restErrorResults.noAssessments

    } else {
        const assessment = relevantAssessments[relevantAssessments.length - 1]
        const result = new TierRiskFlagAssEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline
        delete result.prisNumber

        return result
    }
}

export class TierRiskFlagAssEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: TierRiskFlagAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, TierRiskFlagAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class TierRiskFlagAssessment extends v4Common.V4AssessmentCommon {

    riskLevel: {
        riskScoreLevel: string
    }

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        // Remove standard stuff not included in this endpoint
        delete this.assessor

        this.riskLevel = { riskScoreLevel: common.riskLabel(dbAssessment.tierRiskLevel) }
    }
}

