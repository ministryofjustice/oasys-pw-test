import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new RmpEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class RmpEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: RmpAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, RmpAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class RmpAssessment extends v4Common.V4AssessmentCommon {

    referredToMappaLevel2: string
    referredToMappaLevel3: string
    tickUseOfWeapons: string
    shouldBeCriticalPublicProtectionCaseNow: string
    registeredUnderSexOffenderAct: string
    arson: string
    shouldBeReferredToMappaLevel2: string
    shouldBeCriticalPublicProtectionCasePreRelease: string
    tickAccommodation: string
    shouldBeReferredToMappaLevel3: string
    tickEte: string
    tickFinances: string
    criticalPublicProtectionCase: string
    tickRelationships: string
    tickLifestyleAndAssociates: string
    tickDrugMisuse: string
    requiredToRegisterUnderSexOffenderAct: string
    tickAlcoholMisuse: string
    disqualifiedFromWorkingWithChildren: string
    tickEmotionalWellbeing: string
    presentOrPreviousConvictionAgainstChild: string
    tickThinkingAndBehaviour: string
    ongoingRiskToChildren: string
    tickAttitudes: string
    notifyPriorToRelease: string
    tickDomesticAbuse: string
    publicProtectionManualRestrictions: string
    tickHateCrime: string
    conditionallyDischargedPatient: string
    tickStalking: string
    lifeLicence: string
    tickIntegratedChildSafeguardingPlan: string
    extendedSentence: string
    tickSelfHarmSuicide: string
    eligibleForEarlyAllocation: string
    tickCopingInCustody: string
    tickVulnerability: string
    tickEscapeAbscondRisks: string
    tickRiskToChildren: string
    tickRiskToKnownAdult: string
    tickRiskToPrisoners: string
    tickRiskToStaff: string
    tickRiskToPublic: string
    tickEmotionalCongruenceWithChildren: string
    tickSexualPreOccupation: string
    tickOffenceRelatedSexualInterests: string
    tickHostileOrientation: string
    tickVictimSafetyPlanning: string
    tickSanEmploymentAndEducation: string
    tickSanPersonalRelationshipsAndCommunity: string
    tickSanDrugUse: string
    tickSanAlcoholUse: string
    tickSanHealthAndWellbeing: string
    tickSanThinkingBehavioursAndAttitudes: string
    keyInformationAboutCurrentSituation: string
    furtherConsiderations: string
    supervision: string
    monitoringAndControl: string
    reduceRisk: string
    interventionsAndTreatment: string
    victimSafetyPlanning: string
    increaseRisk: string
    contingencyPlans: string
    additionalComments: string
    factorsStrengthsAndProtective: string
    pre4PillarsCurrentSituation: string
    pre4PillarsOtherAgencies: string
    pre4PillarsExistingSupport: string
    pre4PillarsAddedMeasures: string
    pre4PillarsWho: string
    pre4PillarsAdditionalConditions: string
    pre4PillarsLevelOfContact: string
    pre4PillarsContingency: string
    pre4PillarsAdditionalComments: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.referredToMappaLevel2 = dbAssessment.qaData.getString('RM1')
        this.referredToMappaLevel3 = dbAssessment.qaData.getString('RM2')
        this.tickUseOfWeapons = dbAssessment.qaData.getString('RM28.0.1.1')
        this.shouldBeCriticalPublicProtectionCaseNow = dbAssessment.qaData.getString('RM6')
        this.registeredUnderSexOffenderAct = dbAssessment.qaData.getString('RM9')
        this.arson = dbAssessment.qaData.getString('RM28.0.2.1')
        this.shouldBeReferredToMappaLevel2 = dbAssessment.qaData.getString('RM3')
        this.shouldBeCriticalPublicProtectionCasePreRelease = dbAssessment.qaData.getString('RM7')
        this.tickAccommodation = dbAssessment.qaData.getString('RM28.0.3.1')
        this.shouldBeReferredToMappaLevel3 = dbAssessment.qaData.getString('RM4')
        this.tickEte = dbAssessment.qaData.getString('RM28.0.4.1')
        this.tickFinances = dbAssessment.qaData.getString('RM28.0.5.1')
        this.criticalPublicProtectionCase = dbAssessment.qaData.getString('RM5')
        this.tickRelationships = dbAssessment.qaData.getString('RM28.0.6.1')
        this.tickLifestyleAndAssociates = dbAssessment.qaData.getString('RM28.0.7.1')
        this.tickDrugMisuse = dbAssessment.qaData.getString('RM28.0.8.1')
        this.requiredToRegisterUnderSexOffenderAct = dbAssessment.qaData.getString('RM8')
        this.tickAlcoholMisuse = dbAssessment.qaData.getString('RM28.0.9.1')
        this.disqualifiedFromWorkingWithChildren = dbAssessment.qaData.getString('RM10')
        this.tickEmotionalWellbeing = dbAssessment.qaData.getString('RM28.0.10.1')
        this.presentOrPreviousConvictionAgainstChild = dbAssessment.qaData.getString('RM11')
        this.tickThinkingAndBehaviour = dbAssessment.qaData.getString('RM28.0.11.1')
        this.ongoingRiskToChildren = dbAssessment.qaData.getString('RM12')
        this.tickAttitudes = dbAssessment.qaData.getString('RM28.0.12.1')
        this.notifyPriorToRelease = dbAssessment.qaData.getString('RM13')
        this.tickDomesticAbuse = dbAssessment.qaData.getString('RM28.0.13.1')
        this.publicProtectionManualRestrictions = dbAssessment.qaData.getString('RM14')
        this.tickHateCrime = dbAssessment.qaData.getString('RM28.0.14.1')
        this.conditionallyDischargedPatient = dbAssessment.qaData.getString('RM15')
        this.tickStalking = dbAssessment.qaData.getString('RM28.0.15.1')
        this.lifeLicence = dbAssessment.qaData.getString('RM16')
        this.tickIntegratedChildSafeguardingPlan = dbAssessment.qaData.getString('RM28.0.16.1')
        this.extendedSentence = dbAssessment.qaData.getString('RM17')
        this.tickSelfHarmSuicide = dbAssessment.qaData.getString('RM28.0.17.1')
        this.eligibleForEarlyAllocation = dbAssessment.qaData.getString('RM11.13')
        this.tickCopingInCustody = dbAssessment.qaData.getString('RM28.0.18.1')
        this.tickVulnerability = dbAssessment.qaData.getString('RM28.0.19.1')
        this.tickEscapeAbscondRisks = dbAssessment.qaData.getString('RM28.0.20.1')
        this.tickRiskToChildren = dbAssessment.qaData.getString('RM28.0.21.1')
        this.tickRiskToKnownAdult = dbAssessment.qaData.getString('RM28.0.22.1')
        this.tickRiskToPrisoners = dbAssessment.qaData.getString('RM28.0.23.1')
        this.tickRiskToStaff = dbAssessment.qaData.getString('RM28.0.24.1')
        this.tickRiskToPublic = dbAssessment.qaData.getString('RM28.0.30.1')
        this.tickEmotionalCongruenceWithChildren = dbAssessment.qaData.getString('RM28.0.25.1')
        this.tickSexualPreOccupation = dbAssessment.qaData.getString('RM28.0.26.1')
        this.tickOffenceRelatedSexualInterests = dbAssessment.qaData.getString('RM28.0.27.1')
        this.tickHostileOrientation = dbAssessment.qaData.getString('RM28.0.28.1')
        this.tickVictimSafetyPlanning = dbAssessment.qaData.getString('RM28.0.29.1')
        this.tickSanEmploymentAndEducation = dbAssessment.qaData.getString('RM28.0.4.1_SAN')
        this.tickSanPersonalRelationshipsAndCommunity = dbAssessment.qaData.getString('RM28.0.6.1_SAN')
        this.tickSanDrugUse = dbAssessment.qaData.getString('RM28.0.8.1_SAN')
        this.tickSanAlcoholUse = dbAssessment.qaData.getString('RM28.0.9.1_SAN')
        this.tickSanHealthAndWellbeing = dbAssessment.qaData.getString('RM28.0.10.1_SAN')
        this.tickSanThinkingBehavioursAndAttitudes = dbAssessment.qaData.getString('RM28.0.30.1_SAN')
        this.keyInformationAboutCurrentSituation = dbAssessment.qaData.getString('RM28.1')
        this.furtherConsiderations = dbAssessment.qaData.getString('RM28')
        this.supervision = dbAssessment.qaData.getString('RM30')
        this.monitoringAndControl = dbAssessment.qaData.getString('RM31')
        this.reduceRisk = dbAssessment.qaData.getString('RMP-SUM5')
        this.interventionsAndTreatment = dbAssessment.qaData.getString('RM32')
        this.victimSafetyPlanning = dbAssessment.qaData.getString('RM33')
        this.increaseRisk = dbAssessment.qaData.getString('RMP-SUM4')
        this.contingencyPlans = dbAssessment.qaData.getString('RM34')
        this.additionalComments = dbAssessment.qaData.getString('RM35')
        this.factorsStrengthsAndProtective = dbAssessment.qaData.getString('RMP-SUM10')
        this.pre4PillarsCurrentSituation = dbAssessment.qaData.getString('RM18')
        this.pre4PillarsOtherAgencies = dbAssessment.qaData.getString('RM20')
        this.pre4PillarsExistingSupport = dbAssessment.qaData.getString('RM21')
        this.pre4PillarsAddedMeasures = dbAssessment.qaData.getString('RM22')
        this.pre4PillarsWho = dbAssessment.qaData.getString('RM23')
        this.pre4PillarsAdditionalConditions = dbAssessment.qaData.getString('RM24')
        this.pre4PillarsLevelOfContact = dbAssessment.qaData.getString('RM25')
        this.pre4PillarsContingency = dbAssessment.qaData.getString('RM26')
        this.pre4PillarsAdditionalComments = dbAssessment.qaData.getString('RM27')
    }
}
