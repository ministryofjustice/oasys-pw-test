import * as apCommon from './apCommon'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new APRiskAssEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        return result
    }
}

export class APRiskAssEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APRiskAssAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APRiskAssAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addRiskIndDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APRiskAssAssessment extends apCommon.APAssessmentCommon {

    currentOffenceDetails: string
    currentWhereAndWhen: string
    currentHowDone: string
    currentWhoVictims: string
    currentAnyoneElsePresent: string
    currentWhyDone: string
    currentSources: string
    previousWhatDone: string
    previousWhereAndWhen: string
    previousHowDone: string
    previousWhoVictims: string
    previousAnyoneElsePresent: string
    previousWhyDone: string
    previousSources: string
    identifyBehavioursIncidents: string
    analysisBehavioursIncidents: string



    addRiskIndDetails(assessment: dbClasses.DbAssessment) {

        this.currentOffenceDetails = assessment.qaData.getString('FA1')
        this.currentWhereAndWhen = assessment.qaData.getString('FA2')
        this.currentHowDone = assessment.qaData.getString('FA3')
        this.currentWhoVictims = assessment.qaData.getString('FA4')
        this.currentAnyoneElsePresent = assessment.qaData.getString('FA5')
        this.currentWhyDone = assessment.qaData.getString('FA6')
        this.currentSources = assessment.qaData.getString('FA7')
        this.previousWhatDone = assessment.qaData.getString('FA8')
        this.previousWhereAndWhen = assessment.qaData.getString('FA9')
        this.previousHowDone = assessment.qaData.getString('FA10')
        this.previousWhoVictims = assessment.qaData.getString('FA11')
        this.previousAnyoneElsePresent = assessment.qaData.getString('FA12')
        this.previousWhyDone = assessment.qaData.getString('FA13')
        this.previousSources = assessment.qaData.getString('FA14')
        this.identifyBehavioursIncidents = assessment.qaData.getString('FA61')
        this.analysisBehavioursIncidents = assessment.qaData.getString('FA67')
    }
}
