import * as apCommon from './apCommon'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new APRoshSumEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        return result
    }
}

export class APRoshSumEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APRoshSumAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APRoshSumAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addRoshSumDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APRoshSumAssessment extends apCommon.APAssessmentCommon {

    whoAtRisk: string
    natureOfRisk: string
    riskGreatest: string
    factorsLikelyToIncreaseRisk: string
    factorsLikelyToReduceRisk: string
    factorsAnalysisOfRisk: string
    factorsStrengthsAndProtective: string
    factorsSituationsLikelyToOffend: string


    addRoshSumDetails(assessment: dbClasses.DbAssessment) {

        this.whoAtRisk = assessment.qaData.getString('SUM1')
        this.natureOfRisk = assessment.qaData.getString('SUM2')
        this.riskGreatest = assessment.qaData.getString('SUM3')
        this.factorsLikelyToIncreaseRisk = assessment.qaData.getString('ROSHSUM-SUM4')
        this.factorsLikelyToReduceRisk = assessment.qaData.getString('ROSHSUM-SUM5')
        this.factorsAnalysisOfRisk = assessment.qaData.getString('SUM9')
        this.factorsStrengthsAndProtective = assessment.qaData.getString('ROSHSUM-SUM10')
        this.factorsSituationsLikelyToOffend = assessment.qaData.getString('SUM11')
    }
}
