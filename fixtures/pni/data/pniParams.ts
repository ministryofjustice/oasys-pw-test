import { DbAssessment } from 'fixtures/api/data/dbClasses'
import { getOasysScore, OasysSetValues, yn } from "./data"

export class PniParams {

    s1_30: string
    s6_1: number
    s6_6: number
    s6_11: string
    s6_12: number
    s7_3: number
    s10_1: number
    s11_11: number
    s11_12: number
    s11_3: number
    s11_2: number
    s11_4: number
    s11_6: number
    s12_1: number
    s12_9: number
    arpBand: string
    vrpBand: string
    ospDc: string
    ospIic: string
    rsrPercentageScore: number
    community: boolean
    saraRiskPartner: number
    saraRiskOther: number

    populateForCalculatorTest(oasysSetValues: OasysSetValues, qaValues: { [key: string]: string }, sara: SaraParams, community: boolean) {

        const after649 = oasysDateTime.checkIfAfter('6.49', oasysSetValues.initiationDate)
        const after77 = oasysDateTime.checkIfAfter('7.7', oasysSetValues.initiationDate)

        this.s1_30 = yn(qaValues['1.30'])
        this.s6_1 = getOasysScore(qaValues['6.1'])
        this.s6_6 = getOasysScore(qaValues['6.6'])
        this.s6_11 = yn(qaValues['6.11'])
        this.s6_12 = getOasysScore(qaValues['6.12'])
        this.s7_3 = getOasysScore(qaValues['7.3'])
        this.s10_1 = getOasysScore(qaValues['10.1'])
        this.s11_11 = getOasysScore(qaValues['11.11'])
        this.s11_12 = getOasysScore(qaValues['11.12'])
        this.s11_3 = getOasysScore(qaValues['11.3'])
        this.s11_2 = getOasysScore(qaValues['11.2'])
        this.s11_4 = getOasysScore(qaValues['11.4'])
        this.s11_6 = getOasysScore(qaValues['11.6'])
        this.s12_1 = getOasysScore(qaValues['12.1'])
        this.s12_9 = getOasysScore(qaValues['12.9'])
        if (after77) {
            this.arpBand = oasysSetValues.arpDynamicBand ?? oasysSetValues.arpStaticBand
            this.vrpBand = oasysSetValues.vrpDynamicBand ?? oasysSetValues.vrpStaticBand
        } else {
            this.arpBand = oasysSetValues.ogrs3Band
            this.vrpBand = oasysSetValues.ovpBand
        }
        this.ospDc = after649 ? oasysSetValues.ospDc : oasysSetValues.ospC
        this.ospIic = after649 ? oasysSetValues.ospIic : oasysSetValues.ospI
        this.rsrPercentageScore = oasysSetValues.rsrPercentageScore
        this.saraRiskPartner = sara.saraRiskLevelToPartner
        this.saraRiskOther = sara.saraRiskLevelToOther
        this.community = community
    }

    populateForApiTest(dbAssessment: DbAssessment, community: boolean, saraRiskLevelToPartner: number, saraRiskLevelToOther: number) {

        const after649 = oasysDateTime.checkIfAfter('6.49', dbAssessment.initiationDate)

        this.s1_30 = dbAssessment.qaData.getString('1.30')
        this.s6_1 = dbAssessment.qaData.getOasysScore('6.1')
        this.s6_6 = dbAssessment.qaData.getOasysScore('6.6')
        this.s6_11 = dbAssessment.qaData.getString('6.11') ?? 'No'
        this.s6_12 = dbAssessment.qaData.getOasysScore('6.12')
        this.s7_3 = dbAssessment.qaData.getOasysScore('7.3')
        this.s10_1 = dbAssessment.qaData.getOasysScore('10.1')
        this.s11_11 = dbAssessment.qaData.getOasysScore('11.11')
        this.s11_12 = dbAssessment.qaData.getOasysScore('11.12')
        this.s11_3 = dbAssessment.qaData.getOasysScore('11.3')
        this.s11_2 = dbAssessment.qaData.getOasysScore('11.2')
        this.s11_4 = dbAssessment.qaData.getOasysScore('11.4')
        this.s11_6 = dbAssessment.qaData.getOasysScore('11.6')
        this.s12_1 = dbAssessment.qaData.getOasysScore('12.1')
        this.s12_9 = dbAssessment.qaData.getOasysScore('12.9')
        this.arpBand = dbAssessment.riskDetails.ogp2Risk ?? dbAssessment.riskDetails.ogrs4gRisk
        this.vrpBand = dbAssessment.riskDetails.ovp2Risk ?? dbAssessment.riskDetails.ogrs4vRisk
        this.ospDc = after649 ? dbAssessment.riskDetails.ospDcRisk : dbAssessment.riskDetails.ospCRisk
        this.ospIic = after649 ? dbAssessment.riskDetails.ospIicRisk : dbAssessment.riskDetails.ospIRisk
        this.rsrPercentageScore = dbAssessment.riskDetails.rsrPercentageScore
        this.community = community
        this.saraRiskPartner = saraRiskLevelToPartner
        this.saraRiskOther = saraRiskLevelToOther
    }

    oracleFunctionCall(): string {

        let result: string[] = []

        result.push(`eor.pni_pkg.PNI_CALCULATOR(${this.community ? `'YES'` : `'NO'`}`)
        result.push(utils.stringParameterToString(this.s1_30).toUpperCase())
        result.push(utils.stringParameterToString(this.s6_11).toUpperCase())
        result.push(utils.numericParameterToString(this.s11_11))
        result.push(utils.numericParameterToString(this.s11_12))
        result.push(utils.numericParameterToString(this.s6_12))
        result.push(utils.numericParameterToString(this.s12_1))
        result.push(utils.numericParameterToString(this.s12_9))
        result.push(utils.numericParameterToString(this.s6_1))
        result.push(utils.numericParameterToString(this.s6_6))
        result.push(utils.numericParameterToString(this.s7_3))
        result.push(utils.numericParameterToString(this.s11_3))
        result.push(utils.numericParameterToString(this.s11_2))
        result.push(utils.numericParameterToString(this.s11_4))
        result.push(utils.numericParameterToString(this.s11_6))
        result.push(utils.numericParameterToString(this.s10_1))
        result.push(utils.stringParameterToString(this.arpBand))
        result.push(utils.stringParameterToString(this.vrpBand))
        result.push(utils.stringParameterToString(this.ospDc))
        result.push(utils.stringParameterToString(this.ospIic))
        result.push(utils.numericParameterToString(this.rsrPercentageScore))
        result.push(utils.numericParameterToString(this.saraRiskPartner))
        result.push(utils.numericParameterToString(this.saraRiskOther))
        result.push(`${utils.stringParameterToString('Y')})`)    // TODO handle pre-7.7.0.0 OGRS4 release

        return createCallString(result.join(','))
    }
}

function createCallString(query: string): string {

    return `
            DECLARE result eor.pni_type;
            BEGIN
                result := ${query};
                :ret :=
                    result.SEX_DOMAIN_LEVEL || '|' ||
                    result.SEX_DOMAIN_END_SCORE || '|' ||
                    result.THINKING_DOMAIN_LEVEL || '|' ||
                    result.THINKING_DOMAIN_END_SCORE || '|' ||
                    result.RELATIONSHIPS_DOMAIN_LEVEL || '|' ||
                    result.RELATIONSHIPS_DOMAIN_END_SCORE || '|' ||
                    result.SELF_MANAGEMENT_DOMAIN_LEVEL || '|' ||
                    result.SELF_MANAGEMENT_DOMAIN_END_SCORE || '|' ||
                    result.TOTAL_DOMAIN_SCORE || '|' ||
                    result.OVERALL_NEED_LEVEL || '|' ||
                    result.RISK_LEVEL || '|' ||
                    result.PNI_CALCULATION || '|' ||
                    result.MISSING_FIELDS;
                END;`
}
