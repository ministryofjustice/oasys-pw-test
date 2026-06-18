import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new RoshFullEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class RoshFullEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: RoshFullAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, RoshFullAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class RoshFullAssessment extends v4Common.V4AssessmentCommon {

    currentOffenceDetails: string
    situationWithRiskToIdentifiableChildren: string
    currentConcernsRiskOfSuicide: string
    currentConcernsRiskOfSelfHarm: string
    currentConcernsHostel: string
    previousConcernsHostelCoping: string
    situationGiveDetails: string
    currentWhereAndWhen: string
    childProtectionConferencesDetails: string
    currentCustodyHostelCoping: string
    previousCustodyHostelCoping: string
    currentVulnerability: string
    previousVulnerability: string
    riskOfSeriousHarm: string
    currentConcernsEscapeText: string
    previousConcernsEscapeText: string
    currentConcernsDisruptiveText: string
    previousConcernsDisruptiveText: string
    currentConcernsBreachOfTrustText: string
    previousConcernsBreachOfTrustText: string
    currentHowDone: string
    currentConcernsSelfHarmSuicide: string
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
    riskToIdentifiableChildren: string
    childProtectionConferences: string
    localAuthorityKeyWorker: string
    otherAgencies: string
    additionalInformation: string
    dateChildProtectionIssuesKnownToAssessor: string
    dateChildSafeguardingIssuesKnownToAssessor: string
    currentACCT: string
    bookNumber: string
    pastSuicideConcerns: string
    pastSelfHarmConcerns: string
    previousConcernsSelfHarmSuicide: string
    currentConcernsCustody: string
    previousConcernsCustodyCoping: string
    currentConcernsVulnerability: string
    previousConcernsVulnerability: string
    tickRiskOfSeriousHarm: string
    currentConcernsEscape: string
    previousConcernsEscape: string
    currentConcernsDisruptive: string
    previousConcernsDisruptive: string
    currentConcernsBreachOfTrust: string
    previousConcernsBreachOfTrust: string
    identifyBehavioursIncidents: string
    analysisSuicideSelfharm: string
    analysisCoping: string
    analysisVulnerabilities: string
    analysisEscapeAbscond: string
    analysisControlBehaveTrust: string
    analysisBehavioursIncidents: string
    concernsRiskOfSuicide: string
    concernsRiskOfSelfHarm: string
    concernsCopingInCustody: string
    concernsVulnerability: string
    concernsEscapeAscond: string
    currentControlBehaveTrust: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.currentOffenceDetails = utils.jsonString(dbAssessment.qaData.getString('FA1'), { remove002: true })
        this.situationWithRiskToIdentifiableChildren = dbAssessment.qaData.getString('FA16')
        this.currentConcernsRiskOfSuicide = dbAssessment.qaData.getString('FA31')
        this.currentConcernsRiskOfSelfHarm = dbAssessment.qaData.getString('FA32')
        this.currentConcernsHostel = dbAssessment.qaData.getString('FA40')
        this.previousConcernsHostelCoping = dbAssessment.qaData.getString('FA43')
        this.situationGiveDetails = dbAssessment.qaData.getString('FA17')
        this.currentWhereAndWhen = dbAssessment.qaData.getString('FA2')
        this.childProtectionConferencesDetails = dbAssessment.qaData.getString('FA26.t')
        this.currentCustodyHostelCoping = dbAssessment.qaData.getString('FA41')
        this.previousCustodyHostelCoping = dbAssessment.qaData.getString('FA44')
        this.currentVulnerability = dbAssessment.qaData.getString('FA45.t')
        this.previousVulnerability = dbAssessment.qaData.getString('FA47.t')
        this.riskOfSeriousHarm = dbAssessment.qaData.getString('FA49.t')
        this.currentConcernsEscapeText = dbAssessment.qaData.getString('FA51.t')
        this.previousConcernsEscapeText = dbAssessment.qaData.getString('FA53.t')
        this.currentConcernsDisruptiveText = dbAssessment.qaData.getString('FA55.t')
        this.previousConcernsDisruptiveText = dbAssessment.qaData.getString('FA56.t')
        this.currentConcernsBreachOfTrustText = dbAssessment.qaData.getString('FA58.t')
        this.previousConcernsBreachOfTrustText = dbAssessment.qaData.getString('FA60.t')
        this.currentHowDone = dbAssessment.qaData.getString('FA3')
        this.currentConcernsSelfHarmSuicide = dbAssessment.qaData.getString('FA33')
        this.currentWhoVictims = dbAssessment.qaData.getString('FA4')
        this.currentAnyoneElsePresent = dbAssessment.qaData.getString('FA5')
        this.currentWhyDone = dbAssessment.qaData.getString('FA6')
        this.currentSources = dbAssessment.qaData.getString('FA7')
        this.previousWhatDone = dbAssessment.qaData.getString('FA8')
        this.previousWhereAndWhen = dbAssessment.qaData.getString('FA9')
        this.previousHowDone = dbAssessment.qaData.getString('FA10')
        this.previousWhoVictims = dbAssessment.qaData.getString('FA11')
        this.previousAnyoneElsePresent = dbAssessment.qaData.getString('FA12')
        this.previousWhyDone = dbAssessment.qaData.getString('FA13')
        this.previousSources = dbAssessment.qaData.getString('FA14')
        this.riskToIdentifiableChildren = dbAssessment.qaData.getString('FA15')
        this.childProtectionConferences = dbAssessment.qaData.getString('FA26')
        this.localAuthorityKeyWorker = dbAssessment.qaData.getString('FA27')
        this.otherAgencies = dbAssessment.qaData.getString('FA28')
        this.additionalInformation = dbAssessment.qaData.getString('FA29')
        this.dateChildProtectionIssuesKnownToAssessor = dbAssessment.qaData.getString('FA30')
        this.dateChildSafeguardingIssuesKnownToAssessor = dbAssessment.qaData.getString('FA302')
        this.currentACCT = dbAssessment.qaData.getString('FA34')
        this.bookNumber = dbAssessment.qaData.getString('FA35')
        this.pastSuicideConcerns = dbAssessment.qaData.getString('FA36')
        this.pastSelfHarmConcerns = dbAssessment.qaData.getString('FA37')
        this.previousConcernsSelfHarmSuicide = dbAssessment.qaData.getString('FA38')
        this.currentConcernsCustody = dbAssessment.qaData.getString('FA39')
        this.previousConcernsCustodyCoping = dbAssessment.qaData.getString('FA42')
        this.currentConcernsVulnerability = dbAssessment.qaData.getString('FA45')
        this.previousConcernsVulnerability = dbAssessment.qaData.getString('FA47')
        this.tickRiskOfSeriousHarm = dbAssessment.qaData.getString('FA49')
        this.currentConcernsEscape = dbAssessment.qaData.getString('FA51')
        this.previousConcernsEscape = dbAssessment.qaData.getString('FA53')
        this.currentConcernsDisruptive = dbAssessment.qaData.getString('FA55')
        this.previousConcernsDisruptive = dbAssessment.qaData.getString('FA56')
        this.currentConcernsBreachOfTrust = dbAssessment.qaData.getString('FA58')
        this.previousConcernsBreachOfTrust = dbAssessment.qaData.getString('FA60')
        this.identifyBehavioursIncidents = dbAssessment.qaData.getString('FA61')
        this.analysisSuicideSelfharm = dbAssessment.qaData.getString('FA62')
        this.analysisCoping = dbAssessment.qaData.getString('FA63')
        this.analysisVulnerabilities = dbAssessment.qaData.getString('FA64')
        this.analysisEscapeAbscond = dbAssessment.qaData.getString('FA65')
        this.analysisControlBehaveTrust = dbAssessment.qaData.getString('FA66')
        this.analysisBehavioursIncidents = dbAssessment.qaData.getString('FA67')
        this.concernsRiskOfSuicide = dbAssessment.qaData.getString('R3.1')
        this.concernsRiskOfSelfHarm = dbAssessment.qaData.getString('R3.2')
        this.concernsCopingInCustody = dbAssessment.qaData.getString('R3.3')
        this.concernsVulnerability = dbAssessment.qaData.getString('R3.4')
        this.concernsEscapeAscond = dbAssessment.qaData.getString('R4.1')
        this.currentControlBehaveTrust = dbAssessment.qaData.getString('R4.6')
    }
}
