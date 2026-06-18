import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section8EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section8EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section8Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section8Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section8Assessment extends v4Common.V4AssessmentCommon {

    drugsEverMisused: string
    heroinCurrentUsage: string
    ecstasyCurrentUsage: string
    cannabisCurrentUsage: string
    solventsCurrentUsage: string
    steroidsCurrentUsage: string
    spiceCurrentUsage: string
    otherCurrentUsage: string
    methadoneCurrentUsage: string
    otherOpiatesCurrentUsage: string
    crackCocaineCurrentUsage: string
    cocaineHydrochlorideCurrentUsage: string
    misusedPrescribedDrugsCurrentUsage: string
    benzodiazepinesCurrentUsage: string
    amphetaminesCurrentUsage: string
    hallucinogensCurrentUsage: string
    ketamineCurrentUsage: string
    heroinCurrentInject: string
    steroidsCurrentInject: string
    otherCurrentInject: string
    methadoneCurrentInject: string
    otherOpiatesCurrentInject: string
    crackCocaineCurrentInject: string
    cocaineHydrochlorideCurrentInject: string
    misusedPrescribedDrugsCurrentInject: string
    benzodiazepinesCurrentInject: string
    amphetaminesCurrentInject: string
    ketamineCurrentInject: string
    heroinPreviousUsage: string
    ecstasyPreviousUsage: string
    cannabisPreviousUsage: string
    solventsPreviousUsage: string
    steroidsPreviousUsage: string
    spicePreviousUsage: string
    otherPreviousUsage: string
    methadonePreviousUsage: string
    otherOpiatesPreviousUsage: string
    crackCocainePreviousUsage: string
    cocaineHydrochloridePreviousUsage: string
    misusedPrescribedDrugsPreviousUsage: string
    benzodiazepinesPreviousUsage: string
    amphetaminesPreviousUsage: string
    hallucinogensPreviousUsage: string
    ketaminePreviousUsage: string
    heroinPreviousInject: string
    steroidsPreviousInject: string
    otherPreviousInject: string
    methadonePreviousInject: string
    otherOpiatesPreviousInject: string
    crackCocainePreviousInject: string
    cocaineHydrochloridePreviousInject: string
    misusedPrescribedDrugsPreviousInject: string
    benzodiazepinesPreviousInject: string
    amphetaminesPreviousInject: string
    ketaminePreviousInject: string
    currentDrugNoted: string
    LevelOfUseOfMainDrug: string
    everInjectedDrugs: string
    motivationToTackleDrugMisuse: string
    DrugsMajorActivity: string
    otherDrugs: string
    drugIssuesDetails: string
    drugLinkedToHarm: string
    drugLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.drugsEverMisused = dbAssessment.qaData.getString('8.1')
        this.heroinCurrentUsage = dbAssessment.qaData.getString('8.2.1.1')
        this.ecstasyCurrentUsage = dbAssessment.qaData.getString('8.2.10.1')
        this.cannabisCurrentUsage = dbAssessment.qaData.getString('8.2.11.1')
        this.solventsCurrentUsage = dbAssessment.qaData.getString('8.2.12.1')
        this.steroidsCurrentUsage = dbAssessment.qaData.getString('8.2.13.1')
        this.spiceCurrentUsage = dbAssessment.qaData.getString('8.2.15.1')
        this.otherCurrentUsage = dbAssessment.qaData.getString('8.2.14.1')
        this.methadoneCurrentUsage = dbAssessment.qaData.getString('8.2.2.1')
        this.otherOpiatesCurrentUsage = dbAssessment.qaData.getString('8.2.3.1')
        this.crackCocaineCurrentUsage = dbAssessment.qaData.getString('8.2.4.1')
        this.cocaineHydrochlorideCurrentUsage = dbAssessment.qaData.getString('8.2.5.1')
        this.misusedPrescribedDrugsCurrentUsage = dbAssessment.qaData.getString('8.2.6.1')
        this.benzodiazepinesCurrentUsage = dbAssessment.qaData.getString('8.2.7.1')
        this.amphetaminesCurrentUsage = dbAssessment.qaData.getString('8.2.8.1')
        this.hallucinogensCurrentUsage = dbAssessment.qaData.getString('8.2.9.1')
        this.ketamineCurrentUsage = dbAssessment.qaData.getString('8.2.16.1')
        this.heroinCurrentInject = dbAssessment.qaData.getString('8.2.1.2')
        this.steroidsCurrentInject = dbAssessment.qaData.getString('8.2.13.2')
        this.otherCurrentInject = dbAssessment.qaData.getString('8.2.14.2')
        this.methadoneCurrentInject = dbAssessment.qaData.getString('8.2.2.2')
        this.otherOpiatesCurrentInject = dbAssessment.qaData.getString('8.2.3.2')
        this.crackCocaineCurrentInject = dbAssessment.qaData.getString('8.2.4.2')
        this.cocaineHydrochlorideCurrentInject = dbAssessment.qaData.getString('8.2.5.2')
        this.misusedPrescribedDrugsCurrentInject = dbAssessment.qaData.getString('8.2.6.2')
        this.benzodiazepinesCurrentInject = dbAssessment.qaData.getString('8.2.7.2')
        this.amphetaminesCurrentInject = dbAssessment.qaData.getString('8.2.8.2')
        this.ketamineCurrentInject = dbAssessment.qaData.getString('8.2.16.2')
        this.heroinPreviousUsage = dbAssessment.qaData.getString('8.2.1.3')
        this.ecstasyPreviousUsage = dbAssessment.qaData.getString('8.2.10.3')
        this.cannabisPreviousUsage = dbAssessment.qaData.getString('8.2.11.3')
        this.solventsPreviousUsage = dbAssessment.qaData.getString('8.2.12.3')
        this.steroidsPreviousUsage = dbAssessment.qaData.getString('8.2.13.3')
        this.spicePreviousUsage = dbAssessment.qaData.getString('8.2.15.3')
        this.otherPreviousUsage = dbAssessment.qaData.getString('8.2.14.3')
        this.methadonePreviousUsage = dbAssessment.qaData.getString('8.2.2.3')
        this.otherOpiatesPreviousUsage = dbAssessment.qaData.getString('8.2.3.3')
        this.crackCocainePreviousUsage = dbAssessment.qaData.getString('8.2.4.3')
        this.cocaineHydrochloridePreviousUsage = dbAssessment.qaData.getString('8.2.5.3')
        this.misusedPrescribedDrugsPreviousUsage = dbAssessment.qaData.getString('8.2.6.3')
        this.benzodiazepinesPreviousUsage = dbAssessment.qaData.getString('8.2.7.3')
        this.amphetaminesPreviousUsage = dbAssessment.qaData.getString('8.2.8.3')
        this.hallucinogensPreviousUsage = dbAssessment.qaData.getString('8.2.9.3')
        this.ketaminePreviousUsage = dbAssessment.qaData.getString('8.2.16.3')
        this.heroinPreviousInject = dbAssessment.qaData.getString('8.2.1.4')
        this.steroidsPreviousInject = dbAssessment.qaData.getString('8.2.13.4')
        this.otherPreviousInject = dbAssessment.qaData.getString('8.2.14.4')
        this.methadonePreviousInject = dbAssessment.qaData.getString('8.2.2.4')
        this.otherOpiatesPreviousInject = dbAssessment.qaData.getString('8.2.3.4')
        this.crackCocainePreviousInject = dbAssessment.qaData.getString('8.2.4.4')
        this.cocaineHydrochloridePreviousInject = dbAssessment.qaData.getString('8.2.5.4')
        this.misusedPrescribedDrugsPreviousInject = dbAssessment.qaData.getString('8.2.6.4')
        this.benzodiazepinesPreviousInject = dbAssessment.qaData.getString('8.2.7.4')
        this.amphetaminesPreviousInject = dbAssessment.qaData.getString('8.2.8.4')
        this.ketaminePreviousInject = dbAssessment.qaData.getString('8.2.16.4')
        this.currentDrugNoted = dbAssessment.qaData.getString('8.4')
        this.LevelOfUseOfMainDrug = dbAssessment.qaData.getString('8.5')
        this.everInjectedDrugs = dbAssessment.qaData.getString('8.6')
        this.motivationToTackleDrugMisuse = dbAssessment.qaData.getString('8.8')
        this.DrugsMajorActivity = dbAssessment.qaData.getString('8.9')
        this.otherDrugs = dbAssessment.qaData.getString('8.2.14.t')
        this.drugIssuesDetails = dbAssessment.qaData.getString('8.97')
        this.drugLinkedToHarm = dbAssessment.qaData.getString('8.98')
        this.drugLinkedToReoffending = dbAssessment.qaData.getString('8.99')
    }
}
