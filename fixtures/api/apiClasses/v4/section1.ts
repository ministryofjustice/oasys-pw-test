import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../restApiUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section1EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section1EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section1Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section1Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section1Assessment extends v4Common.V4AssessmentCommon {

    countersigner: { name: string } = { name: '' }
    numberOfPreviousCautionsEtc: number
    numberPrevConvictionsViolentOffences: number
    numSanctionsViolentOffences: number
    dateOfCurrentConviction: string
    everCommittedSexualOffence: string
    contactAgainstStrangerVictim: string
    totOfSanctions: number
    dateSanctionOfSexualOffence: string
    numSanctionsContactAdult: number
    numSanctionsContactChild: number
    numSanctionsIndecentImagesChild: number
    numSanctionsNonContactSexual: number
    dateCommSentenceOrEarliestRelease: string
    currOffenceSexualMotivation: string
    currOffenceAgainstStranger: string
    committedFurtherOffences: string
    courtAppearancesUnder18: number
    courtAppearancesOver18: number
    ageAtFirstConviction: number
    ageAtFirstSanction: number
    courtAppearancesUnder18Score: string
    courtAppearancesOver18Score: string
    ageAtFirstConvictionScore: string
    dateOfFirstSanctionScore: string
    dateOfFirstSanction: string
    ospIRisk: string
    ospCRisk: string
    likelihoodOfSeriousReoffendingNext2Years: string
    sexualElementCommitted16orOver: number
    auditOfDateIntoCommunity: string
    currDirectContactOffenceAgainstStranger: string
    numDirectContactSanctionsChild: number
    numSanctionsIndecentChildImageOrIndirectContact: number
    ospIICRisk: string
    ospDCRisk: string

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.countersigner.name = dbAssessment.countersignerName
        this.numberOfPreviousCautionsEtc = dbAssessment.qaData.getNumber('1.24')
        this.numberPrevConvictionsViolentOffences = dbAssessment.qaData.getNumber('1.26')
        this.numSanctionsViolentOffences = dbAssessment.qaData.getNumber('1.40')
        this.dateOfCurrentConviction = dbAssessment.qaData.getString('1.29')
        this.everCommittedSexualOffence = dbAssessment.qaData.getString('1.30')
        this.contactAgainstStrangerVictim = dbAssessment.qaData.getString('1.31')
        this.totOfSanctions = dbAssessment.qaData.getNumber('1.32')
        this.dateSanctionOfSexualOffence = dbAssessment.qaData.getString('1.33')
        this.numSanctionsContactAdult = dbAssessment.qaData.getNumber('1.34')
        this.numSanctionsContactChild = dbAssessment.qaData.getNumber('1.35')
        this.numSanctionsIndecentImagesChild = dbAssessment.qaData.getNumber('1.36')
        this.numSanctionsNonContactSexual = dbAssessment.qaData.getNumber('1.37')
        this.dateCommSentenceOrEarliestRelease = dbAssessment.qaData.getString('1.38')
        this.currOffenceSexualMotivation = dbAssessment.qaData.getString('1.41')
        this.currOffenceAgainstStranger = dbAssessment.qaData.getString('1.42')
        this.committedFurtherOffences = dbAssessment.qaData.getString('1.43')
        this.courtAppearancesUnder18 = dbAssessment.qaData.getNumber('1.5')
        this.courtAppearancesOver18 = dbAssessment.qaData.getNumber('1.6')
        this.ageAtFirstConviction = dbAssessment.qaData.getNumber('1.7')
        this.ageAtFirstSanction = dbAssessment.qaData.getNumber('1.8')
        this.courtAppearancesUnder18Score = dbAssessment.qaData.getString('1.5.1')
        this.courtAppearancesOver18Score = dbAssessment.qaData.getString('1.6.1')
        this.ageAtFirstConvictionScore = dbAssessment.qaData.getString('1.7.1')
        this.dateOfFirstSanctionScore = dbAssessment.qaData.getString('1.8.1')
        this.dateOfFirstSanction = dbAssessment.qaData.getString('1.8.2')
        if (this.dateOfFirstSanction == '') {
            this.dateOfFirstSanction = dbAssessment.qaData.getString('1.7.2')
        }
        this.ospIRisk = dbAssessment.qaData.getString('D1')
        this.ospCRisk = dbAssessment.qaData.getString('D2')
        this.likelihoodOfSeriousReoffendingNext2Years = dbAssessment.qaData.getString('D3')
        this.sexualElementCommitted16orOver = dbAssessment.qaData.getNumber('S1.54')
        this.auditOfDateIntoCommunity = dbAssessment.qaData.getString('1.38.t')
        this.currDirectContactOffenceAgainstStranger = dbAssessment.qaData.getString('1.44')
        this.numDirectContactSanctionsChild = dbAssessment.qaData.getNumber('1.45')
        this.numSanctionsIndecentChildImageOrIndirectContact = dbAssessment.qaData.getNumber('1.46')
        this.ospIICRisk = dbAssessment.qaData.getString('D5')
        this.ospDCRisk = dbAssessment.qaData.getString('D6')
    }
}
