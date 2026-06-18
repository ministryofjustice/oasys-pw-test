import * as apCommon from './apCommon'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new APRiskIndEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        return result
    }
}

export class APRiskIndEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APRiskIndAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APRiskIndAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addRiskIndDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APRiskIndAssessment extends apCommon.APAssessmentCommon {

    concernsRiskOfSuicide: string
    concernsRiskOfSelfHarm: string
    concernsCopingInCustody: string
    concernsVulnerability: string
    concernsEscapeAscond: string
    currentConcernsRiskOfSuicide: string
    currentConcernsRiskOfSelfHarm: string
    currentConcernsSelfHarmSuicide: string
    previousConcernsSelfHarmSuicide: string
    currentCustodyHostelCoping: string
    previousCustodyHostelCoping: string
    currentVulnerability: string
    previousVulnerability: string
    riskOfSeriousHarm: string
    concernsBreachOfTrust: string
    currentConcernsBreachOfTrust: string
    currentConcernsBreachOfTrustText: string
    currentControlBehaveTrust: string
    analysisSuicideSelfharm: string
    analysisCoping: string
    analysisVulnerabilities: string
    analysisControlBehaveTrust: string



    addRiskIndDetails(assessment: dbClasses.DbAssessment) {

        this.concernsRiskOfSuicide = assessment.qaData.getString('R3.1')
        this.concernsRiskOfSelfHarm = assessment.qaData.getString('R3.2')
        this.concernsCopingInCustody = assessment.qaData.getString('R3.3')
        this.concernsVulnerability = assessment.qaData.getString('R3.4')
        this.concernsEscapeAscond = assessment.qaData.getString('R4.1')
        this.concernsBreachOfTrust = assessment.qaData.getString('R4.3')
        this.currentControlBehaveTrust = assessment.qaData.getString('R4.6')
        this.currentConcernsRiskOfSuicide = assessment.qaData.getString('FA31')
        this.currentConcernsRiskOfSelfHarm = assessment.qaData.getString('FA32')
        this.currentConcernsSelfHarmSuicide = assessment.qaData.getString('FA33')
        this.previousConcernsSelfHarmSuicide = assessment.qaData.getString('FA38')
        this.currentCustodyHostelCoping = assessment.qaData.getString('FA41')
        this.previousCustodyHostelCoping = assessment.qaData.getString('FA44')
        this.currentVulnerability = assessment.qaData.getString('FA45.t')
        this.previousVulnerability = assessment.qaData.getString('FA47.t')
        this.riskOfSeriousHarm = assessment.qaData.getString('FA49.t')
        this.currentConcernsBreachOfTrust = assessment.qaData.getString('FA58')
        this.currentConcernsBreachOfTrustText = assessment.qaData.getString('FA58.t')
        this.analysisSuicideSelfharm = assessment.qaData.getString('FA62')
        this.analysisCoping = assessment.qaData.getString('FA63')
        this.analysisVulnerabilities = assessment.qaData.getString('FA64')
        this.analysisControlBehaveTrust = assessment.qaData.getString('FA66')

    }
}
