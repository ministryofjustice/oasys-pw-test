import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section13EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section13EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section13Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section13Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section13Assessment extends v4Common.V4AssessmentCommon {

    generalHealth: string
    healthConditions: string
    tickHealthCommunity: string
    healthCommunity: string
    tickLifestyleCommunity: string
    tickReligiousCommunity: string
    tickTransportCommunity: string
    tickEmploymentCommunity: string
    tickEducationCommunity: string
    tickChildCareCommunity: string
    tickDisabilityCommunity: string
    tickPsychiatricCommunity: string
    tickMotivationCommunity: string
    tickLearningCommunity: string
    tickLiteracyCommunity: string
    tickCommunicationCommunity: string
    tickInterpreterCommunity: string
    tickAlcoholCommunity: string
    generalHeathSpecify: string
    elecMonSpecify: string
    tickHealthEM: string
    healthEM: string
    drugsCommunity: string
    tickDrugsEM: string
    drugsEM: string
    drugsProgramme: string
    lifestyleCommunity: string
    tickLifestyleEM: string
    lifestyleEM: string
    lifestyleProgramme: string
    religiousCommunity: string
    tickReligiousEM: string
    religiousEM: string
    religiousProgramme: string
    transportCommunity: string
    tickTransportEM: string
    transportEM: string
    transportProgramme: string
    employmentCommunity: string
    tickEmploymentEM: string
    employmentEM: string
    employmentProgramme: string
    educationCommunity: string
    tickEducationEM: string
    educationEM: string
    educationProgramme: string
    childCareCommunity: string
    tickChildCareEM: string
    childCareEM: string
    childCareProgramme: string
    disabilityCommunity: string
    tickDisabilityEM: string
    disabilityEM: string
    disabilityProgramme: string
    psychiatricCommunity: string
    tickPsychiatricEM: string
    psychiatricEM: string
    psychiatricProgramme: string
    motivationCommunity: string
    tickMotivationEM: string
    motivationEM: string
    motivationProgramme: string
    learningCommunity: string
    tickLearningEM: string
    learningEM: string
    learningProgramme: string
    literacyCommunity: string
    tickLiteracyEM: string
    literacyEM: string
    literacyProgramme: string
    communicationCommunity: string
    tickCommunicationEM: string
    communicationEM: string
    communicationProgramme: string
    interpreterCommunity: string
    tickInterpreterEM: string
    interpreterEM: string
    interpreterProgramme: string
    alcoholCommunity: string
    tickAlcoholEM: string
    alcoholEM: string
    alcoholProgramme: string
    tickHealthProgramme: string
    healthProgramme: string
    tickDrugsProgramme: string
    tickLifestyleProgramme: string
    tickReligiousProgramme: string
    tickTransportProgramme: string
    tickEmploymentProgramme: string
    tickEducationProgramme: string
    tickChildCareProgramme: string
    tickDisabilityProgramme: string
    tickPsychiatricProgramme: string
    tickMotivationProgramme: string
    tickLearningProgramme: string
    tickLiteracyProgramme: string
    tickCommunicationProgramme: string
    tickInterpreterProgramme: string
    tickalcoholProgramme: string
    elecMon: string
    elecMonAdverseImpact: string
    elecMonElectricity: string
    understandsImportanceOfCompletingProgramme: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {
        this.generalHealth = dbAssessment.qaData.getString('13.1')
        this.healthConditions = dbAssessment.qaData.getString('13.1.t_V2')
        this.tickHealthCommunity = dbAssessment.qaData.getString('13.3.1.1')
        this.healthCommunity = dbAssessment.qaData.getString('13.3.1.1.t')
        this.tickLifestyleCommunity = dbAssessment.qaData.getString('13.3.11.1')
        this.tickReligiousCommunity = dbAssessment.qaData.getString('13.3.12.1')
        this.tickTransportCommunity = dbAssessment.qaData.getString('13.3.13.1')
        this.tickEmploymentCommunity = dbAssessment.qaData.getString('13.3.14.1')
        this.tickEducationCommunity = dbAssessment.qaData.getString('13.3.15.1')
        this.tickChildCareCommunity = dbAssessment.qaData.getString('13.3.16.1')
        this.tickDisabilityCommunity = dbAssessment.qaData.getString('13.3.2.1')
        this.tickPsychiatricCommunity = dbAssessment.qaData.getString('13.3.3.1')
        this.tickMotivationCommunity = dbAssessment.qaData.getString('13.3.4.1')
        this.tickLearningCommunity = dbAssessment.qaData.getString('13.3.5.1')
        this.tickLiteracyCommunity = dbAssessment.qaData.getString('13.3.6.1')
        this.tickCommunicationCommunity = dbAssessment.qaData.getString('13.3.7.1')
        this.tickInterpreterCommunity = dbAssessment.qaData.getString('13.3.8.1')
        this.tickAlcoholCommunity = dbAssessment.qaData.getString('13.3.9.1')
        this.generalHeathSpecify = dbAssessment.qaData.getString('13.1.t')
        this.elecMonSpecify = dbAssessment.qaData.getString('13.2.t')
        this.tickHealthEM = dbAssessment.qaData.getString('13.3.1.2')
        this.healthEM = dbAssessment.qaData.getString('13.3.1.2.t')
        this.drugsCommunity = dbAssessment.qaData.getString('13.3.10.1.t')
        this.tickDrugsEM = dbAssessment.qaData.getString('13.3.10.2')
        this.drugsEM = dbAssessment.qaData.getString('13.3.10.2.t')
        this.drugsProgramme = dbAssessment.qaData.getString('13.3.10.3.t')
        this.lifestyleCommunity = dbAssessment.qaData.getString('13.3.11.1.t')
        this.tickLifestyleEM = dbAssessment.qaData.getString('13.3.11.2')
        this.lifestyleEM = dbAssessment.qaData.getString('13.3.11.2.t')
        this.lifestyleProgramme = dbAssessment.qaData.getString('13.3.11.3.t')
        this.religiousCommunity = dbAssessment.qaData.getString('13.3.12.1.t')
        this.tickReligiousEM = dbAssessment.qaData.getString('13.3.12.2')
        this.religiousEM = dbAssessment.qaData.getString('13.3.12.2.t')
        this.religiousProgramme = dbAssessment.qaData.getString('13.3.12.3.t')
        this.transportCommunity = dbAssessment.qaData.getString('13.3.13.1.t')
        this.tickTransportEM = dbAssessment.qaData.getString('13.3.13.2')
        this.transportEM = dbAssessment.qaData.getString('13.3.13.2.t')
        this.transportProgramme = dbAssessment.qaData.getString('13.3.13.3.t')
        this.employmentCommunity = dbAssessment.qaData.getString('13.3.14.1.t')
        this.tickEmploymentEM = dbAssessment.qaData.getString('13.3.14.2')
        this.employmentEM = dbAssessment.qaData.getString('13.3.14.2.t')
        this.employmentProgramme = dbAssessment.qaData.getString('13.3.14.3.t')
        this.educationCommunity = dbAssessment.qaData.getString('13.3.15.1.t')
        this.tickEducationEM = dbAssessment.qaData.getString('13.3.15.2')
        this.educationEM = dbAssessment.qaData.getString('13.3.15.2.t')
        this.educationProgramme = dbAssessment.qaData.getString('13.3.15.3.t')
        this.childCareCommunity = dbAssessment.qaData.getString('13.3.16.1.t')
        this.tickChildCareEM = dbAssessment.qaData.getString('13.3.16.2')
        this.childCareEM = dbAssessment.qaData.getString('13.3.16.2.t')
        this.childCareProgramme = dbAssessment.qaData.getString('13.3.16.3.t')
        this.disabilityCommunity = dbAssessment.qaData.getString('13.3.2.1.t')
        this.tickDisabilityEM = dbAssessment.qaData.getString('13.3.2.2')
        this.disabilityEM = dbAssessment.qaData.getString('13.3.2.2.t')
        this.disabilityProgramme = dbAssessment.qaData.getString('13.3.2.3.t')
        this.psychiatricCommunity = dbAssessment.qaData.getString('13.3.3.1.t')
        this.tickPsychiatricEM = dbAssessment.qaData.getString('13.3.3.2')
        this.psychiatricEM = dbAssessment.qaData.getString('13.3.3.2.t')
        this.psychiatricProgramme = dbAssessment.qaData.getString('13.3.3.3.t')
        this.motivationCommunity = dbAssessment.qaData.getString('13.3.4.1.t')
        this.tickMotivationEM = dbAssessment.qaData.getString('13.3.4.2')
        this.motivationEM = dbAssessment.qaData.getString('13.3.4.2.t')
        this.motivationProgramme = dbAssessment.qaData.getString('13.3.4.3.t')
        this.learningCommunity = dbAssessment.qaData.getString('13.3.5.1.t')
        this.tickLearningEM = dbAssessment.qaData.getString('13.3.5.2')
        this.learningEM = dbAssessment.qaData.getString('13.3.5.2.t')
        this.learningProgramme = dbAssessment.qaData.getString('13.3.5.3.t')
        this.literacyCommunity = dbAssessment.qaData.getString('13.3.6.1.t')
        this.tickLiteracyEM = dbAssessment.qaData.getString('13.3.6.2')
        this.literacyEM = dbAssessment.qaData.getString('13.3.6.2.t')
        this.literacyProgramme = dbAssessment.qaData.getString('13.3.6.3.t')
        this.communicationCommunity = dbAssessment.qaData.getString('13.3.7.1.t')
        this.tickCommunicationEM = dbAssessment.qaData.getString('13.3.7.2')
        this.communicationEM = dbAssessment.qaData.getString('13.3.7.2.t')
        this.communicationProgramme = dbAssessment.qaData.getString('13.3.7.3.t')
        this.interpreterCommunity = dbAssessment.qaData.getString('13.3.8.1.t')
        this.tickInterpreterEM = dbAssessment.qaData.getString('13.3.8.2')
        this.interpreterEM = dbAssessment.qaData.getString('13.3.8.2.t')
        this.interpreterProgramme = dbAssessment.qaData.getString('13.3.8.3.t')
        this.alcoholCommunity = dbAssessment.qaData.getString('13.3.9.1.t')
        this.tickAlcoholEM = dbAssessment.qaData.getString('13.3.9.2')
        this.alcoholEM = dbAssessment.qaData.getString('13.3.9.2.t')
        this.alcoholProgramme = dbAssessment.qaData.getString('13.3.9.3.t')
        this.tickHealthProgramme = dbAssessment.qaData.getString('13.3.1.3')
        this.healthProgramme = dbAssessment.qaData.getString('13.3.1.3.t')
        this.tickDrugsProgramme = dbAssessment.qaData.getString('13.3.10.3')
        this.tickLifestyleProgramme = dbAssessment.qaData.getString('13.3.11.3')
        this.tickReligiousProgramme = dbAssessment.qaData.getString('13.3.12.3')
        this.tickTransportProgramme = dbAssessment.qaData.getString('13.3.13.3')
        this.tickEmploymentProgramme = dbAssessment.qaData.getString('13.3.14.3')
        this.tickEducationProgramme = dbAssessment.qaData.getString('13.3.15.3')
        this.tickChildCareProgramme = dbAssessment.qaData.getString('13.3.16.3')
        this.tickDisabilityProgramme = dbAssessment.qaData.getString('13.3.2.3')
        this.tickPsychiatricProgramme = dbAssessment.qaData.getString('13.3.3.3')
        this.tickMotivationProgramme = dbAssessment.qaData.getString('13.3.4.3')
        this.tickLearningProgramme = dbAssessment.qaData.getString('13.3.5.3')
        this.tickLiteracyProgramme = dbAssessment.qaData.getString('13.3.6.3')
        this.tickCommunicationProgramme = dbAssessment.qaData.getString('13.3.7.3')
        this.tickInterpreterProgramme = dbAssessment.qaData.getString('13.3.8.3')
        this.tickalcoholProgramme = dbAssessment.qaData.getString('13.3.9.3')
        this.elecMon = dbAssessment.qaData.getString('13.2')
        this.elecMonAdverseImpact = dbAssessment.qaData.getString('13.2.1')
        this.elecMonElectricity = dbAssessment.qaData.getString('13.2.2')
        this.understandsImportanceOfCompletingProgramme = dbAssessment.qaData.getString('13.4')

    }
}
