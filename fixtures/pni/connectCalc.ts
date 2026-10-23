export function connectCalc(connectParams: ConnectParams): ConnectCalcResult {

    const result: ConnectCalcResult = {
        sexDomainLevel: null,
        sexDomainScore: 0,
        thinkingDomainLevel: null,
        thinkingDomainScore: 0,
        relationshipDomainLevel: null,
        relationshipDomainScore: 0,
        selfManagementDomainLevel: null,
        selfManagementDomainScore: 0,
        totalDomainScore: 0,
        overallNeedLevel: null,
        connectResult: null,
        missingFields: [],
    }

    // SEX DOMAIN
    let sexDomainScore = 0

    if (connectParams.s1_30 == null && connectParams.s6_11 == 'No') {
        result.missingFields.push('1.30 Have they ever committed a sexual or sexually motivated offence?')

    } else if (connectParams.s1_30 == 'Yes' || connectParams.s6_11 == 'Yes') { // We can continue to look at the sex domain scores
        if (connectParams.s11_12 == null) {
            result.missingFields.push('11.12 Offence Related Sexual Interests')
        } else if (connectParams.s11_12 == 2) {
            sexDomainScore = 6
        } else {
            sexDomainScore += connectParams.s11_12
        }

        if (connectParams.s11_11 == null) {
            result.missingFields.push('11.11 Sexual Pre-Occupation')
        } else {
            sexDomainScore += connectParams.s11_11
        }

        if (connectParams.s6_12 == null) {
            result.missingFields.push('6.12 Emotional Congruence with Children/ Feeling Closer to Children than Adults')
        } else {
            sexDomainScore += connectParams.s6_12
        }
    }

    result.sexDomainScore = sexDomainScore < 2 ? 0 : sexDomainScore < 4 ? 1 : 2
    result.sexDomainLevel = result.sexDomainScore == 0 ? 'L' : result.sexDomainScore == 1 ? 'M' : 'H'

    // THINKING DOMAIN
    let thinkingDomainScore = 0

    if (connectParams.s12_1 == null) {
        result.missingFields.push('12.1 Pro-criminal attitudes')
    } else if (connectParams.s12_1 == 2) {
        thinkingDomainScore = 4
    } else {
        thinkingDomainScore = connectParams.s12_1
    }

    if (connectParams.s12_1 != 2) {
        if (connectParams.s12_9 == null) {
            result.missingFields.push('12.9 Hostile orientation')
        } else {
            thinkingDomainScore = thinkingDomainScore + connectParams.s12_9
        }
    }

    result.thinkingDomainScore = thinkingDomainScore < 1 ? 0 : thinkingDomainScore < 3 ? 1 : 2
    result.thinkingDomainLevel = result.thinkingDomainScore == 0 ? 'L' : result.thinkingDomainScore == 1 ? 'M' : 'H'

    // RELATIONSHIPS DOMAIN
    let relationshipsDomainScore = 0

    if (connectParams.s6_1 == null) {
        result.missingFields.push('6.1 Current relationship with close family member')
    } else {
        relationshipsDomainScore = connectParams.s6_1
    }

    if (connectParams.s6_6 == null) {
        result.missingFields.push('6.6 Previous experience of close relationships')
    } else {
        relationshipsDomainScore = relationshipsDomainScore + connectParams.s6_6
    }

    if (connectParams.s7_3 == null) {
        result.missingFields.push('7.3 Easily influenced by criminal associates')
    } else {
        relationshipsDomainScore = relationshipsDomainScore + connectParams.s7_3
    }

    if (connectParams.s11_3 == null) {
        result.missingFields.push('11.3 Aggressive controlling behaviour')
    } else {
        relationshipsDomainScore = relationshipsDomainScore + connectParams.s11_3
    }

    result.relationshipDomainScore = relationshipsDomainScore < 2 ? 0 : relationshipsDomainScore < 5 ? 1 : 2
    result.relationshipDomainLevel = result.relationshipDomainScore == 0 ? 'L' : result.relationshipDomainScore == 1 ? 'M' : 'H'

    // SELF MANAGEMENT DOMAIN
    let selfManagementDomainScore = 0

    if (connectParams.s11_2 == null) {
        result.missingFields.push('11.2 Impulsivity')
    } else {
        selfManagementDomainScore = connectParams.s11_2
    }

    if (connectParams.s11_4 == null) {
        result.missingFields.push('11.4 Temper Control')
    } else {
        selfManagementDomainScore = selfManagementDomainScore + connectParams.s11_4
    }

    if (connectParams.s11_6 == null) {
        result.missingFields.push('11.6 Problem solving skills')
    } else {
        selfManagementDomainScore = selfManagementDomainScore + connectParams.s11_6
    }

    if (connectParams.s10_1 == null) {
        result.missingFields.push('10.1 Difficulties coping')
    } else {
        selfManagementDomainScore = selfManagementDomainScore + connectParams.s10_1
    }

    result.selfManagementDomainScore = selfManagementDomainScore < 2 ? 0 : selfManagementDomainScore < 5 ? 1 : 2
    result.selfManagementDomainLevel = result.selfManagementDomainScore == 0 ? 'L' : result.selfManagementDomainScore == 1 ? 'M' : 'H'

    // TOTAL
    result.totalDomainScore = result.sexDomainScore + result.thinkingDomainScore + result.relationshipDomainScore + result.selfManagementDomainScore
    result.overallNeedLevel = result.totalDomainScore < 3 ? 'L' : result.totalDomainScore < 6 ? 'M' : 'H'

    // Check RoSH, ARP and CSRP for eligibility
    let eligible = true
    if (connectParams.rosh == null) {
        eligible = false
        result.missingFields.push('Risk of Serious Harm')
    } else if (connectParams.rosh != 'M') {
        eligible = false
    }
    if (connectParams.arpPercentageScore == null) {
        eligible = false
        result.missingFields.push('Dynamic ARP Score')
    } else if (connectParams.arpPercentageScore < 25 || connectParams.arpPercentageScore >= 50) {
        eligible = false
    }
    if (connectParams.rsrPercentageScore == null) {
        eligible = false
        result.missingFields.push('Dynamic CSRP Score')
    } else if (connectParams.rsrPercentageScore < 1 || connectParams.rsrPercentageScore >= 3) {
        eligible = false
    }

    const prefix = connectParams.community ? 'P' : 'C'

    // Determine result based on eligibility and score
    if (eligible) {
        result.connectResult = result.totalDomainScore >= 3 ? `${prefix}P` : result.missingFields.length == 0 ? `${prefix}F` : 'M'
    } else {
        result.connectResult = `${prefix}F`
    }

    return result
}
