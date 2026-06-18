import * as apCommon from './apCommon'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new APHealthEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        return result
    }
}

export class APHealthEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APHealthAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APHealthAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addHealthDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APHealthAssessment extends apCommon.APAssessmentCommon {

    generalHealth: string = null
    generalHeathSpecify: string = null
    healthConditions: string = null
    elecMon: string = null
    elecMonSpecify: string = null
    elecMonElectricity: string = null
    healthCommunity: string = null
    healthEM: string = null
    healthProgramme: string = null
    drugsCommunity: string = null
    drugsEM: string = null
    drugsProgramme: string = null
    lifestyleCommunity: string = null
    lifestyleEM: string = null
    lifestyleProgramme: string = null
    religiousCommunity: string = null
    religiousEM: string = null
    religiousProgramme: string = null
    transportCommunity: string = null
    transportEM: string = null
    transportProgramme: string = null
    employmentCommunity: string = null
    employmentEM: string = null
    employmentProgramme: string = null
    educationCommunity: string = null
    educationEM: string = null
    educationProgramme: string = null
    childCareCommunity: string = null
    childCareEM: string = null
    childCareProgramme: string = null
    disabilityCommunity: string = null
    disabilityEM: string = null
    disabilityProgramme: string = null
    psychiatricCommunity: string = null
    psychiatricEM: string = null
    psychiatricProgramme: string = null
    motivationCommunity: string = null
    motivationEM: string = null
    motivationProgramme: string = null
    learningCommunity: string = null
    learningEM: string = null
    learningProgramme: string = null
    literacyCommunity: string = null
    literacyEM: string = null
    literacyProgramme: string = null
    communicationCommunity: string = null
    communicationEM: string = null
    communicationProgramme: string = null
    interpreterCommunity: string = null
    interpreterEM: string = null
    interpreterProgramme: string = null
    alcoholCommunity: string = null
    alcoholEM: string = null
    alcoholProgramme: string = null



    addHealthDetails(assessment: dbClasses.DbAssessment) {

        this.generalHealth = assessment.qaData.getString('13.1')
        this.generalHeathSpecify = assessment.qaData.getString('13.1.t')
        this.healthConditions = assessment.qaData.getString('13.1.t_V2')
        this.elecMon = assessment.qaData.getString('13.2')
        this.elecMonSpecify = assessment.qaData.getString('13.2.t')
        this.elecMonElectricity = assessment.qaData.getString('13.2.2')
        this.healthCommunity = assessment.qaData.getString('13.3.1.1.t')
        this.healthEM = assessment.qaData.getString('13.3.1.2.t')
        this.healthProgramme = assessment.qaData.getString('13.3.1.3.t')
        this.drugsCommunity = assessment.qaData.getString('13.3.10.1.t')
        this.drugsEM = assessment.qaData.getString('13.3.10.2.t')
        this.drugsProgramme = assessment.qaData.getString('13.3.10.3.t')
        this.lifestyleCommunity = assessment.qaData.getString('13.3.11.1.t')
        this.lifestyleEM = assessment.qaData.getString('13.3.11.2.t')
        this.lifestyleProgramme = assessment.qaData.getString('13.3.11.3.t')
        this.religiousCommunity = assessment.qaData.getString('13.3.12.1.t')
        this.religiousEM = assessment.qaData.getString('13.3.12.2.t')
        this.religiousProgramme = assessment.qaData.getString('13.3.12.3.t')
        this.transportCommunity = assessment.qaData.getString('13.3.13.1.t')
        this.transportEM = assessment.qaData.getString('13.3.13.2.t')
        this.transportProgramme = assessment.qaData.getString('13.3.13.3.t')
        this.employmentCommunity = assessment.qaData.getString('13.3.14.1.t')
        this.employmentEM = assessment.qaData.getString('13.3.14.2.t')
        this.employmentProgramme = assessment.qaData.getString('13.3.14.3.t')
        this.educationCommunity = assessment.qaData.getString('13.3.15.1.t')
        this.educationEM = assessment.qaData.getString('13.3.15.2.t')
        this.educationProgramme = assessment.qaData.getString('13.3.15.3.t')
        this.childCareCommunity = assessment.qaData.getString('13.3.16.1.t')
        this.childCareEM = assessment.qaData.getString('13.3.16.2.t')
        this.childCareProgramme = assessment.qaData.getString('13.3.16.3.t')
        this.disabilityCommunity = assessment.qaData.getString('13.3.2.1.t')
        this.disabilityEM = assessment.qaData.getString('13.3.2.2.t')
        this.disabilityProgramme = assessment.qaData.getString('13.3.2.3.t')
        this.psychiatricCommunity = assessment.qaData.getString('13.3.3.1.t')
        this.psychiatricEM = assessment.qaData.getString('13.3.3.2.t')
        this.psychiatricProgramme = assessment.qaData.getString('13.3.3.3.t')
        this.motivationCommunity = assessment.qaData.getString('13.3.4.1.t')
        this.motivationEM = assessment.qaData.getString('13.3.4.2.t')
        this.motivationProgramme = assessment.qaData.getString('13.3.4.3.t')
        this.learningCommunity = assessment.qaData.getString('13.3.5.1.t')
        this.learningEM = assessment.qaData.getString('13.3.5.2.t')
        this.learningProgramme = assessment.qaData.getString('13.3.5.3.t')
        this.literacyCommunity = assessment.qaData.getString('13.3.6.1.t')
        this.literacyEM = assessment.qaData.getString('13.3.6.2.t')
        this.literacyProgramme = assessment.qaData.getString('13.3.6.3.t')
        this.communicationCommunity = assessment.qaData.getString('13.3.7.1.t')
        this.communicationEM = assessment.qaData.getString('13.3.7.2.t')
        this.communicationProgramme = assessment.qaData.getString('13.3.7.3.t')
        this.interpreterCommunity = assessment.qaData.getString('13.3.8.1.t')
        this.interpreterEM = assessment.qaData.getString('13.3.8.2.t')
        this.interpreterProgramme = assessment.qaData.getString('13.3.8.3.t')
        this.alcoholCommunity = assessment.qaData.getString('13.3.9.1.t')
        this.alcoholEM = assessment.qaData.getString('13.3.9.2.t')
        this.alcoholProgramme = assessment.qaData.getString('13.3.9.3.t')
    }
}
