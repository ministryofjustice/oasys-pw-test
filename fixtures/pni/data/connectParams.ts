import { getOasysScore, OasysSetValues, yn } from "./data"

export class ConnectParams {

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
    arpPercentageScore: number
    rsrPercentageScore: number
    rosh: string
    community: boolean

    constructor(oasysSetValues: OasysSetValues, qaValues: { [key: string]: string }, community: boolean) {

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
        this.arpPercentageScore = oasysSetValues.arpPercentageScore
        this.rsrPercentageScore = oasysSetValues.rsrPercentageScore
        this.rosh = oasysSetValues.rosh
        this.community = community
    }


    oracleFunctionCall(): string {

        let result: string[] = []

        result.push(`eor.CONNECT_CALCULATOR(${this.community ? `'N'` : `'Y'`}`)
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
        result.push(utils.numericParameterToString(this.arpPercentageScore))
        result.push(utils.numericParameterToString(this.rsrPercentageScore))
        result.push(`${utils.stringParameterToString(this.rosh)})`)

        return createCallString(result.join(','))
    }
}

function createCallString(query: string): string {

    return `
            DECLARE result eor.connect_type;
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
                    result.CONNECT_CALCULATION || '|' ||
                    result.MISSING_FIELDS || '|';
                END;`
}
