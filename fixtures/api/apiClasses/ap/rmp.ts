import * as apCommon from './apCommon'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new APRmpEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        return result
    }
}

export class APRmpEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APRmpAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APRmpAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addRmpDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APRmpAssessment extends apCommon.APAssessmentCommon {

    keyInformationAboutCurrentSituation: string
    furtherConsiderations: string
    supervision: string
    monitoringAndControl: string
    interventionsAndTreatment: string
    victimSafetyPlanning: string
    contingencyPlans: string
    additionalComments: string


    addRmpDetails(assessment: dbClasses.DbAssessment) {

        if (['M', 'H', 'V'].includes(assessment.roshLevel)) {

            this.keyInformationAboutCurrentSituation = assessment.qaData.getString('RM28.1')
            this.furtherConsiderations = assessment.qaData.getString('RM28')
            this.supervision = assessment.qaData.getString('RM30')
            this.monitoringAndControl = assessment.qaData.getString('RM31')
            this.interventionsAndTreatment = assessment.qaData.getString('RM32')
            this.victimSafetyPlanning = assessment.qaData.getString('RM33')
            this.contingencyPlans = assessment.qaData.getString('RM34')
            this.additionalComments = assessment.qaData.getString('RM35')
        } else {
            delete this.keyInformationAboutCurrentSituation
            delete this.furtherConsiderations
            delete this.supervision
            delete this.monitoringAndControl
            delete this.interventionsAndTreatment
            delete this.victimSafetyPlanning
            delete this.contingencyPlans
            delete this.additionalComments
        }
    }
}
