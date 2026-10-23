export function connectFunctionCall(params: ConnectParams): string {

    let result: string[] = []

    result.push(`eor.pni_calc_pkg.CONNECT_CALCULATOR(${params.community ? 'Y' : 'N'}`)
    result.push(utils.stringParameterToString(params.s1_30))
    result.push(utils.stringParameterToString(params.s6_11))
    result.push(utils.numericParameterToString(params.s11_11))
    result.push(utils.numericParameterToString(params.s11_12))
    result.push(utils.numericParameterToString(params.s6_12))
    result.push(utils.numericParameterToString(params.s12_1))
    result.push(utils.numericParameterToString(params.s12_9))
    result.push(utils.numericParameterToString(params.s6_1))
    result.push(utils.numericParameterToString(params.s6_6))
    result.push(utils.numericParameterToString(params.s7_3))
    result.push(utils.numericParameterToString(params.s11_3))
    result.push(utils.numericParameterToString(params.s11_2))
    result.push(utils.numericParameterToString(params.s11_4))
    result.push(utils.numericParameterToString(params.s11_6))
    result.push(utils.numericParameterToString(params.s10_1))
    result.push(utils.numericParameterToString(params.arpPercentageScore))
    result.push(utils.numericParameterToString(params.rsrPercentageScore))
    result.push(`${utils.stringParameterToString(params.rosh)})`)

    return createCallString(result.join(','))
}

function createCallString(query: string): string {

    return `
            DECLARE result eor.connect_type;
            BEGIN
                result := ${query};
                :ret := 

                    '''' || result.SEX_DOMAIN_LEVEL || '''|' ||
                    result.SEX_DOMAIN_END_SCORE || '|' ||
                    '''' || result.THINKING_DOMAIN_LEVEL || '''|' ||
                    result.THINKING_DOMAIN_END_SCORE || '|' ||
                    '''' || result.RELATIONSHIPS_DOMAIN_LEVEL || '''|' ||
                    result.RELATIONSHIPS_DOMAIN_END_SCORE || '|' ||
                    '''' || result.SELF_MANAGEMENT_DOMAIN_LEVEL || '''|' ||
                    result.SELF_MANAGEMENT_DOMAIN_END_SCORE || '|' ||
                    result.TOTAL_DOMAIN_SCORE || '|' ||
                    '''' || result.OVERALL_NEED_LEVEL || '''|' ||
                    '''' || result.CONNECT_RESULT || '''|' ||
                    '''' || result.MISSING_FIELDS || '''|' ||

                    ;
                END;`
}

export function loadOracleOutputValues(values: string[]): ConnectCalcResult {

    const result = {}

    let i = 0
    Object.keys(result).forEach((param) => {
        const stringValue = values[i++]
        const isNumeric = !Number.isNaN(Number.parseFloat(stringValue))
        // @ts-expect-error
        result[param] = isNumeric ? new Decimal(stringValue) : stringValue == '' ? null : stringValue
    })

    return result as ConnectCalcResult
}
