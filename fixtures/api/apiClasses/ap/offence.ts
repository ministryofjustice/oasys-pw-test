import * as apCommon from './apCommon'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new APOffenceEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        return result
    }
}

export class APOffenceEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APOffenceAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APOffenceAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addOffencesDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APOffenceAssessment extends apCommon.APAssessmentCommon {

    offenceAnalysis: string
    victimPerpetratorRel: string
    victimInfo: string
    victimImpact: string
    othersInvolved: string
    offenceMotivation: string
    acceptsResponsibility: string
    patternOffending: string
    issueContributingToRisk: string


    addOffencesDetails(assessment: dbClasses.DbAssessment) {

        this.offenceAnalysis = assessment.qaData.getString('2.1')
        this.victimPerpetratorRel = assessment.qaData.getString('2.4.2')
        this.victimInfo = assessment.qaData.getString('2.4.1')
        this.victimImpact = assessment.qaData.getString('2.5')
        this.othersInvolved = assessment.qaData.getString('2.7.3')
        this.offenceMotivation = assessment.qaData.getString('2.8')
        this.acceptsResponsibility = assessment.qaData.getString('2.11.t')
        this.patternOffending = assessment.qaData.getString('2.12')
        this.issueContributingToRisk = assessment.qaData.getString('2.98')
    }
}

