import * as common from '../common'
import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../restApiUrls'
import { QaData } from 'fixtures/api/data/qaData'
import { pniCalc } from 'fixtures/pni/pniCalc'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const relevantAssessments = offenderData.assessments.filter(pniFilter)
    if (relevantAssessments.length == 0) {
        return env.restErrorResults.noAssessments
    } else {
        const result = new PniEndpointResponse(offenderData, parameters)

        const assessment = relevantAssessments[relevantAssessments.length - 1]
        result.addAssessment(assessment)
        delete result.timeline

        const saraDateLimit = oasysDateTime.stringToDate(assessment.completedDate).subtract({ weeks: 6 }).toString()

        const saraAssessments = offenderData.assessments.filter(  // Pass all SARAs for this offender that are complete or locked in 6 weeks up to the main assessment date
            (ass) => ass.assessmentType == 'SARA'
                && ['COMPLETE', 'LOCKED_INCOMPLETE'].includes(ass.status)
                && ass.completedDate.substring(0, 10) >= saraDateLimit && ass.completedDate <= assessment.completedDate
        )

        result.pniCalc.push(new PniCalc(
            offenderData,
            assessment as dbClasses.DbAssessment,
            saraAssessments as dbClasses.DbAssessment[],
            parameters.additionalParameter == 'Y'
        ))
        return result
    }
}

export function pniFilter(dbAssessment: dbClasses.DbAssessmentOrRsr): boolean {

    return dbAssessment.assessmentType == 'LAYER3' && dbAssessment.status == 'COMPLETE' && (dbAssessment as dbClasses.DbAssessment).pOAssessment != '620'
}

export class PniEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: PniAssessment[] = []
    pniCalc: PniCalc[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, PniAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class PniAssessment extends v4Common.V4AssessmentCommon {

    everCommittedSexualOffence: string
    openSexualOffendingQuestions: string
    sexualPreOccupation: string
    offenceRelatedSexualInterests: string
    emotionalCongruence: string
    proCriminalAttitudes: string
    hostileOrientation: string
    relCloseFamily: string
    prevCloseRelationships: string
    easilyInfluenced: string
    aggressiveControllingBehavour: string
    impulsivity: string
    temperControl: string
    problemSolvingSkills: string
    difficultiesCoping: string

    ogpOvp: OgpOvp
    ldcData: LdcData
    rsrOspData: RsrOspData

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        delete this.assessor

        this.everCommittedSexualOffence = dbAssessment.qaData.getString('1.30')
        this.openSexualOffendingQuestions = dbAssessment.qaData.getString('6.11')
        this.sexualPreOccupation = dbAssessment.qaData.getString('11.11')
        this.offenceRelatedSexualInterests = dbAssessment.qaData.getString('11.12')
        this.emotionalCongruence = dbAssessment.qaData.getString('6.12')
        this.proCriminalAttitudes = dbAssessment.qaData.getString('12.1')
        this.hostileOrientation = dbAssessment.qaData.getString('12.9')
        this.relCloseFamily = dbAssessment.qaData.getString('6.1')
        this.prevCloseRelationships = dbAssessment.qaData.getString('6.6')
        this.easilyInfluenced = dbAssessment.qaData.getString('7.3')
        this.aggressiveControllingBehavour = dbAssessment.qaData.getString('11.3')
        this.impulsivity = dbAssessment.qaData.getString('11.2')
        this.temperControl = dbAssessment.qaData.getString('11.4')
        this.problemSolvingSkills = dbAssessment.qaData.getString('11.6')
        this.difficultiesCoping = dbAssessment.qaData.getString('10.1')

        this.ogpOvp = new OgpOvp(dbAssessment.riskDetails)
        this.ldcData = new LdcData(dbAssessment)
        this.rsrOspData = new RsrOspData(dbAssessment)
    }
}

class PniCalc {

    offenderPk: number
    pniCalculation: string
    missingFields: string[]
    riskLevel: string
    sexDomainLevel: string
    sexDomainScore: number
    thinkingDomainLevel: string
    thinkingDomainScore: number
    relationshipDomainLevel: string
    relationshipDomainScore: number
    selfManagementDomainLevel: string
    selfManagementDomainScore: number
    totalDomainScore: number
    overallNeedLevel: string
    saraRiskLevelToPartner: number
    saraRiskLevelToOther: number

    constructor(offenderData: dbClasses.DbOffenderWithAssessments,
        dbAssessment: dbClasses.DbAssessment,
        saraAssessments: dbClasses.DbAssessment[],
        community: boolean) {

        /*
            2.3 means physical violence against partner = YES
            6.7 means DA perp against partner = YES (allow for pre and post 6.30 versions)

            1. Age at initiation date <18 - both 1
            2. Completed SARA associated with the assessment - both as answered in SARA
            3. SARA prompted but declined (OASYS_SET.NO_SARA_DATE is not null).  If not 6.7 and not 2.3, both 1
            4. Associated SARA is locked incomplete and (6.7 or 2.3), then check SARA answers.  If both answered, or one is 2 or 3, then pass both as answered.
                    Otherwise: find any earlier non-deleted SARA in 6 weeks prior to completion date.
                                If any found, apply rules as above, stop if answers found.
                                Otherwise - both 1
            5. Otherwise, both 1.
        */

        const age = oasysDateTime.dateDiffString(dbAssessment.dateOfBirth, dbAssessment.initiationDate, 'year')

        // Rule 1
        if (age < 18) {
            this.saraRiskLevelToPartner = 1
            this.saraRiskLevelToOther = 1
        } else {
            const associatedSaras = offenderData.assessments.filter((ass) =>
                ass.assessmentType == 'SARA' &&
                (ass as dbClasses.DbAssessment).parentAssessmentPk == dbAssessment.assessmentPk
            )
            const associatedSara = associatedSaras.length > 0 ? associatedSaras[0] as dbClasses.DbAssessment : null

            const associatedSaraRiskToPartner = associatedSara?.qaData.getRiskAsNumber('SR76.1.1')
            const associatedSaraRiskToOther = associatedSara?.qaData.getRiskAsNumber('SR77.1.1')

            // Rule 2
            if (associatedSara?.status == 'COMPLETE' && !dbAssessment.noSaraDate) {
                this.saraRiskLevelToPartner = associatedSaraRiskToPartner
                this.saraRiskLevelToOther = associatedSaraRiskToOther

            } else {
                const q2_3 = dbAssessment.qaData.getStringArray('2.3')?.includes('Physical violence towards partner')
                const after6_30 = oasysDateTime.checkIfAfterReleaseNode('6.30', dbAssessment.initiationDate)
                const q6_7 = da(dbAssessment.qaData, after6_30)

                // Rule 3
                if (associatedSara == null && dbAssessment.noSaraDate != null && !q2_3 && !q6_7) {

                    this.saraRiskLevelToPartner = 1
                    this.saraRiskLevelToOther = 1

                    // Rule 4
                } else if (associatedSara?.status == 'LOCKED_INCOMPLETE' || dbAssessment.noSaraDate != null) {  // SARA was part complete or rejected
                    if (((q2_3 || q6_7) && associatedSaraRiskToPartner != null && associatedSaraRiskToOther != null)
                        && (associatedSaraRiskToPartner > 1 || associatedSaraRiskToOther > 1)) {
                        this.saraRiskLevelToPartner = associatedSaraRiskToPartner
                        this.saraRiskLevelToOther = associatedSaraRiskToOther
                    } else {
                        for (let i = saraAssessments.length - 1; i >= 0; i--) {  // Step backwards through the other SARAs, use the values and drop out if applicable
                            if (saraAssessments[i].parentAssessmentPk != dbAssessment.assessmentPk) {
                                const riskToPartner = saraAssessments[i].qaData.getRiskAsNumber('SR76.1.1')
                                const riskToOther = saraAssessments[i].qaData.getRiskAsNumber('SR77.1.1')
                                if ((riskToPartner != null && riskToOther != null) || riskToPartner > 1 || riskToOther > 1) {
                                    this.saraRiskLevelToPartner = riskToPartner
                                    this.saraRiskLevelToOther = riskToOther
                                    break
                                }
                            }
                        }
                    }
                }
            }
        }
        // Rule 5
        if (this.saraRiskLevelToPartner == null) {
            this.saraRiskLevelToPartner = 1
        }
        if (this.saraRiskLevelToOther == null) {
            this.saraRiskLevelToOther = 1
        }

        // Set up the parameters and call the calculator
        // const pniCalcResult = pniCalc(dbAssessment, community, this.saraRiskLevelToPartner, this.saraRiskLevelToOther)
        const after649 = oasysDateTime.checkIfAfterReleaseNode('6.49', dbAssessment.initiationDate)

        const pniParams: PniParams = {
            s1_30: dbAssessment.qaData.getString('1.30'),
            s6_1: dbAssessment.qaData.getOasysScore('6.1'),
            s6_6: dbAssessment.qaData.getOasysScore('6.6'),
            s6_11: dbAssessment.qaData.getString('6.11') ?? 'No',
            s6_12: dbAssessment.qaData.getOasysScore('6.12'),
            s7_3: dbAssessment.qaData.getOasysScore('7.3'),
            s10_1: dbAssessment.qaData.getOasysScore('10.1'),
            s11_11: dbAssessment.qaData.getOasysScore('11.11'),
            s11_12: dbAssessment.qaData.getOasysScore('11.12'),
            s11_3: dbAssessment.qaData.getOasysScore('11.3'),
            s11_2: dbAssessment.qaData.getOasysScore('11.2'),
            s11_4: dbAssessment.qaData.getOasysScore('11.4'),
            s11_6: dbAssessment.qaData.getOasysScore('11.6'),
            s12_1: dbAssessment.qaData.getOasysScore('12.1'),
            s12_9: dbAssessment.qaData.getOasysScore('12.9'),
            ogrs3RiskRecon: dbAssessment.riskDetails.ogrs3RiskRecon,
            ovpRisk: dbAssessment.riskDetails.ovpRisk,
            ospDc: after649 ? dbAssessment.riskDetails.ospDcRisk : dbAssessment.riskDetails.ospCRisk,
            ospIic: after649 ? dbAssessment.riskDetails.ospIicRisk : dbAssessment.riskDetails.ospIRisk,
            rsrPercentageScore: dbAssessment.riskDetails.rsrPercentageScore,
            community: community,
            saraRiskPartner: this.saraRiskLevelToPartner,
            saraRiskOther: this.saraRiskLevelToOther,
        }

        const pniCalcResult = pniCalc(pniParams)

        this.offenderPk = offenderData.offenderPk
        this.pniCalculation = pniCalcResult.pniCalculation
        this.missingFields = pniCalcResult.missingFields
        this.riskLevel = pniCalcResult.riskLevel
        this.sexDomainLevel = pniCalcResult.sexDomainLevel
        this.sexDomainScore = pniCalcResult.sexDomainScore
        this.thinkingDomainLevel = pniCalcResult.thinkingDomainLevel
        this.thinkingDomainScore = pniCalcResult.thinkingDomainScore
        this.relationshipDomainLevel = pniCalcResult.relationshipDomainLevel
        this.relationshipDomainScore = pniCalcResult.relationshipDomainScore
        this.selfManagementDomainLevel = pniCalcResult.selfManagementDomainLevel
        this.selfManagementDomainScore = pniCalcResult.selfManagementDomainScore
        this.totalDomainScore = pniCalcResult.totalDomainScore
        this.overallNeedLevel = pniCalcResult.overallNeedLevel

    }
}

function da(qaData: QaData, after6_30: boolean): boolean {

    if (after6_30) {
        const q67 = qaData.getString('6.7da')
        if (q67 != 'Yes') {
            return false
        } else {
            return qaData.getString('6.7.2.1da') == 'Yes'
        }
    } else {
        const q67 = qaData.getString('6.7')
        if (q67 != 'Yes') {
            return false
        } else {
            return qaData.getString('6.7.1')?.includes('Perpetrator') ?? false
        }
    }
}

class OgpOvp {

    ogrs3RiskRecon: string
    ovpRisk: string

    constructor(dbRiskDetails: dbClasses.DbRiskDetails) {

        this.ogrs3RiskRecon = common.riskLabel(dbRiskDetails.ogrs3RiskRecon)
        this.ovpRisk = common.riskLabel(dbRiskDetails.ovpRisk)
    }
}

class LdcData {

    ldc: number
    ldcSubTotal: number
    ldcMsg: string = null

    constructor(dbAssessment: dbClasses.DbAssessment) {

        this.ldc = dbAssessment.learningToolScore
        this.ldcSubTotal = dbAssessment.ldcSubTotal
        if (dbAssessment.ldcFuncProc == null) {
            this.ldcMsg = 'Learning Screening Tool not switched on'
        } else if (dbAssessment.ldcFuncProc == 'Y' && dbAssessment.learningToolScore == null) {
            this.ldcMsg = 'Insufficient data to calculate'
        }
    }
}

class RsrOspData {

    ospCdcScoreLevel: string
    ospIiicScoreLevel: string
    rsrPercentageScore: number
    rsrAlgorithmVersion: number
    offenderAge: number

    constructor(dbAssessment: dbClasses.DbAssessment) {

        this.ospCdcScoreLevel = common.riskLabel(dbAssessment.riskDetails.ospDcRisk) ?? common.riskLabel(dbAssessment.riskDetails.ospCRisk)  // For pre-6.49 assessments
        this.ospIiicScoreLevel = common.riskLabel(dbAssessment.riskDetails.ospIicRisk) ?? common.riskLabel(dbAssessment.riskDetails.ospIRisk)  // For pre-6.49 assessments
        this.rsrPercentageScore = common.fixDp(dbAssessment.riskDetails.rsrPercentageScore)
        this.rsrAlgorithmVersion = dbAssessment.riskDetails.rsrAlgorithmVersion
        this.offenderAge = oasysDateTime.dateDiffString(dbAssessment.dateOfBirth, dbAssessment.initiationDate, 'year')
    }
}
