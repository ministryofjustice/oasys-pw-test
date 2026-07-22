import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section10EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section10EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section10Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section10Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section10Assessment extends v4Common.V4AssessmentCommon {

    difficultiesCoping: string
    currPsychologicalProblems: string
    socialIsolation: string
    attitudeToThemselves: string
    selfHarmSuicidal: string
    currPsychiatricProblems: string
    specialistReportRequired: string
    emoIssuesDetails: string
    emoLinkedToHarm: string
    emoLinkedToReoffending: string
    childhoodBehavourProblems: string
    failureToCooperateWithPsychiatricTreatment: string
    historyOfHeadInjuriesFitsEtc: string
    historyOfPsychiatricTreatment: string
    medicationForMentalHealth: string
    patientInSpecialHospitalOrRsu: string
    psychiatricTreatmentOrPending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.difficultiesCoping = dbAssessment.qaData.getString('10.1')
        this.currPsychologicalProblems = dbAssessment.qaData.getString('10.2')
        this.socialIsolation = dbAssessment.qaData.getString('10.3')
        this.attitudeToThemselves = dbAssessment.qaData.getString('10.4')
        this.selfHarmSuicidal = dbAssessment.qaData.getString('10.5')
        this.currPsychiatricProblems = dbAssessment.qaData.getString('10.6')
        this.specialistReportRequired = dbAssessment.qaData.getString('10.8')
        this.emoIssuesDetails = dbAssessment.qaData.getString('10.97')
        this.emoLinkedToHarm = dbAssessment.qaData.getString('10.98')
        this.emoLinkedToReoffending = dbAssessment.qaData.getString('10.99')

        if (oasysDateTime.checkIfAfter('6.35', dbAssessment.initiationDate)) {
            this.childhoodBehavourProblems = dbAssessment.qaData.getString('10.7_V2_CHILDHOOD')
            this.failureToCooperateWithPsychiatricTreatment = dbAssessment.qaData.getString('10.7_V2_FAILEDTOCOOP')
            this.historyOfHeadInjuriesFitsEtc = dbAssessment.qaData.getString('10.7_V2_HISTHEADINJ')
            this.historyOfPsychiatricTreatment = dbAssessment.qaData.getString('10.7_V2_HISTPSYCH')
            this.medicationForMentalHealth = dbAssessment.qaData.getString('10.7_V2_MEDICATION')
            this.patientInSpecialHospitalOrRsu = dbAssessment.qaData.getString('10.7_V2_PATIENT')
            this.psychiatricTreatmentOrPending = dbAssessment.qaData.getString('10.7_V2_PSYCHTREAT')
        } else {

            const reported = dbAssessment.qaData.getStringArray('10.7')
            if (reported != null && reported != undefined) {
                this.childhoodBehavourProblems = reported.includes('Evidence of childhood behavioural problems (optional)') ? 'Yes' : null
                this.failureToCooperateWithPsychiatricTreatment = reported.includes('Previously failed to co-operate with psychiatric treatment (optional)') ? 'Yes' : null
                this.historyOfHeadInjuriesFitsEtc = reported.includes('History of severe head injuries, fits, periods of unconsciousness (optional)') ? 'Yes' : null
                this.historyOfPsychiatricTreatment = reported.includes('History of psychiatric treatment (optional)') ? 'Yes' : null
                this.medicationForMentalHealth = reported.includes('Ever been on medication for mental health problems in the past (optional)') ? 'Yes' : null
                this.patientInSpecialHospitalOrRsu = reported.includes('Ever been a patient in a Special Hospital or Regional Secure Unit (optional)') ? 'Yes' : null
                this.psychiatricTreatmentOrPending = reported.includes('Current psychiatric treatment or treatment pending') ? 'Yes' : null
            } else {
                this.childhoodBehavourProblems = null
                this.failureToCooperateWithPsychiatricTreatment = null
                this.historyOfHeadInjuriesFitsEtc = null
                this.historyOfPsychiatricTreatment = null
                this.medicationForMentalHealth = null
                this.patientInSpecialHospitalOrRsu = null
                this.psychiatricTreatmentOrPending = null
            }
        }
    }
}
