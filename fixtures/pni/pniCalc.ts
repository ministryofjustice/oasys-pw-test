export function pniCalc(pniParams: PniParams): PniCalcResult {

    const result: PniCalcResult = {
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
        riskLevel: 'O',
        pniCalculation: 'O',
        missingFields: [],
        partResult: null,
    }

    // First just calculate domains scores rather than look for trump conditions
    // The domain levels have to be reported
    // Calculate the SEX DOMAIN SCORE
    let sexDomainScore = 0
    let sexDomainProject = 0

    if (pniParams.s1_30 == null && pniParams.s6_11 == 'No') {
        sexDomainProject = 6 // Project the max if it had been answered.  6 to project highest domain score(of 2)
        result.missingFields.push('1.30 Have they ever committed a sexual or sexually motivated offence?') // 1.9 added && removed below

    } else if (pniParams.s1_30 == 'Yes' || pniParams.s6_11 == 'Yes') { // We can continue to look at the sex domain scores
        if (pniParams.s11_12 == null) { // Offence related sexual interest has not been answered
            sexDomainProject = 6
            result.missingFields.push('11.12 Offence Related Sexual Interests')
        } else if (pniParams.s11_12 == 2) {
            sexDomainScore = 6 // 6 DUE TO TRUMP
            sexDomainProject = 6
        } else {
            sexDomainScore += pniParams.s11_12
            sexDomainProject += pniParams.s11_12
        }

        if (pniParams.s11_11 == null) {
            sexDomainProject += 2 // Project the max as not answered
            result.missingFields.push('11.11 Sexual Pre-Occupation')
        } else {
            sexDomainScore += pniParams.s11_11
            sexDomainProject += pniParams.s11_11
        }

        if (pniParams.s6_12 == null) {
            sexDomainProject += 2 // Project the max as not answered
            result.missingFields.push('6.12 Emotional Congruence with Children/ Feeling Closer to Children than Adults')
        } else {
            sexDomainScore += pniParams.s6_12
            sexDomainProject += pniParams.s6_12
        }
    }

    result.sexDomainScore = sexDomainScore < 2 ? 0 : sexDomainScore < 4 ? 1 : 2
    result.sexDomainLevel = result.sexDomainScore == 0 ? 'L' : result.sexDomainScore == 1 ? 'M' : 'H'
    sexDomainProject = sexDomainProject < 2 ? 0 : sexDomainProject < 4 ? 1 : 2

    // THINKING DOMAIN
    let thinkingDomainScore = 0
    let thinkingDomainProject = 0

    if (pniParams.s12_1 == null) {
        thinkingDomainProject = 4 // Project trump condition
        result.missingFields.push('12.1 Pro-criminal attitudes')
    } else if (pniParams.s12_1 == 2) {
        thinkingDomainScore = 4 // Trump Condition
        thinkingDomainProject = 4
    } else {
        thinkingDomainScore = pniParams.s12_1
        thinkingDomainProject = pniParams.s12_1
    }

    if (pniParams.s12_1 != 2) { // There is no trump
        if (pniParams.s12_9 == null) {
            thinkingDomainProject = thinkingDomainProject + 2
            result.missingFields.push('12.9 Hostile orientation')
        } else {
            thinkingDomainScore = thinkingDomainScore + pniParams.s12_9
            thinkingDomainProject = thinkingDomainProject + pniParams.s12_9
        }
    }

    result.thinkingDomainScore = thinkingDomainScore < 1 ? 0 : thinkingDomainScore < 3 ? 1 : 2
    result.thinkingDomainLevel = result.thinkingDomainScore == 0 ? 'L' : result.thinkingDomainScore == 1 ? 'M' : 'H'
    thinkingDomainProject = thinkingDomainProject < 1 ? 0 : thinkingDomainProject < 3 ? 1 : 2

    // RELATIONSHIPS DOMAIN
    let relationshipsDomainScore = 0
    let relationshipDomainScoreProject = 0

    if (pniParams.s6_1 == null) {
        relationshipDomainScoreProject = 2
        result.missingFields.push('6.1 Current relationship with close family member')
    } else {
        relationshipsDomainScore = pniParams.s6_1
        relationshipDomainScoreProject = pniParams.s6_1
    }

    if (pniParams.s6_6 == null) {
        relationshipDomainScoreProject = relationshipDomainScoreProject + 2
        result.missingFields.push('6.6 Previous experience of close relationships')
    } else {
        relationshipsDomainScore = relationshipsDomainScore + pniParams.s6_6
        relationshipDomainScoreProject = relationshipDomainScoreProject + pniParams.s6_6
    }

    if (pniParams.s7_3 == null) {
        relationshipDomainScoreProject = relationshipDomainScoreProject + 2
        result.missingFields.push('7.3 Easily influenced by criminal associates')
    } else {
        relationshipsDomainScore = relationshipsDomainScore + pniParams.s7_3
        relationshipDomainScoreProject = relationshipDomainScoreProject + pniParams.s7_3
    }

    if (pniParams.s11_3 == null) {
        relationshipDomainScoreProject = relationshipDomainScoreProject + 2
        result.missingFields.push('11.3 Aggressive controlling behaviour')
    } else {
        relationshipsDomainScore = relationshipsDomainScore + pniParams.s11_3
        relationshipDomainScoreProject = relationshipDomainScoreProject + pniParams.s11_3
    }

    result.relationshipDomainScore = relationshipsDomainScore < 2 ? 0 : relationshipsDomainScore < 5 ? 1 : 2
    result.relationshipDomainLevel = result.relationshipDomainScore == 0 ? 'L' : result.relationshipDomainScore == 1 ? 'M' : 'H'
    relationshipDomainScoreProject = relationshipDomainScoreProject < 2 ? 0 : relationshipDomainScoreProject < 5 ? 1 : 2

    // SELF MANAGEMENT DOMAIN
    let selfManagementDomainScore = 0
    let selfManagementDomainScoreProject = 0

    if (pniParams.s11_2 == null) {
        selfManagementDomainScoreProject = 2
        result.missingFields.push('11.2 Impulsivity')
    } else {
        selfManagementDomainScore = pniParams.s11_2
        selfManagementDomainScoreProject = pniParams.s11_2
    }

    if (pniParams.s11_4 == null) {
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + 2
        result.missingFields.push('11.4 Temper Control')
    } else {
        selfManagementDomainScore = selfManagementDomainScore + pniParams.s11_4
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + pniParams.s11_4
    }

    if (pniParams.s11_6 == null) {
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + 2
        result.missingFields.push('11.6 Problem solving skills')
    } else {
        selfManagementDomainScore = selfManagementDomainScore + pniParams.s11_6
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + pniParams.s11_6
    }

    if (pniParams.s10_1 == null) {
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + 2
        result.missingFields.push('10.1 Difficulties coping')
    } else {
        selfManagementDomainScore = selfManagementDomainScore + pniParams.s10_1
        selfManagementDomainScoreProject = selfManagementDomainScoreProject + pniParams.s10_1
    }

    result.selfManagementDomainScore = selfManagementDomainScore < 2 ? 0 : selfManagementDomainScore < 5 ? 1 : 2
    result.selfManagementDomainLevel = result.selfManagementDomainScore == 0 ? 'L' : result.selfManagementDomainScore == 1 ? 'M' : 'H'
    selfManagementDomainScoreProject = selfManagementDomainScoreProject < 2 ? 0 : selfManagementDomainScoreProject < 5 ? 1 : 2

    // PART_RESULT  =  SELF_MANAGEMENT_DOMAIN_SCORE
    result.totalDomainScore = result.sexDomainScore + result.thinkingDomainScore + result.relationshipDomainScore + result.selfManagementDomainScore
    const totalDomainScoreProject = sexDomainProject + thinkingDomainProject + relationshipDomainScoreProject + selfManagementDomainScoreProject
    result.overallNeedLevel = result.totalDomainScore < 3 ? 'L' : result.totalDomainScore < 6 ? 'M' : 'H'
    const overallNeedLevelProject = totalDomainScoreProject < 3 ? 'L' : totalDomainScoreProject < 6 ? 'M' : 'H'

    // RISKS
    const rsrRiskLevel: 'L' | 'M' | 'H' = pniParams.rsrPercentageScore == null ? null
        : pniParams.rsrPercentageScore >= 3 ? 'H'
            : pniParams.rsrPercentageScore >= 1 ? 'M'
                : 'L'

    let riskLevelProject = 'O'

    if (pniParams.arpBand == null) {
        riskLevelProject = 'H'
        result.missingFields.push('OGRS')
    }
    if (pniParams.vrpBand == null) {
        riskLevelProject = 'H'
        result.missingFields.push('OVP')
    }
    if (pniParams.ospDc == null) {
        riskLevelProject = 'H'
        result.missingFields.push('OSP-DC')
    }
    if (pniParams.ospIic == null) {
        riskLevelProject = 'H'
        result.missingFields.push('OSP-IIC')
    }
    if (pniParams.ospDc == 'NA' && pniParams.ospIic == 'NA' && rsrRiskLevel == null) {
        riskLevelProject = 'H'
        result.missingFields.push('RSR')
    }

    let saraTrump = false
    if (pniParams.saraRiskPartner == null) {
        riskLevelProject = 'H'
        saraTrump = true
        result.missingFields.push('SARA risk to partner')
    }
    if (pniParams.saraRiskOther == null) {
        riskLevelProject = 'H'
        saraTrump = true
        result.missingFields.push('SARA risk to other')
    }

    // Now calculate the risk domain
    if (['H', 'V'].includes(pniParams.arpBand) || ['H', 'V'].includes(pniParams.vrpBand) || ['H', 'V'].includes(pniParams.ospDc) || pniParams.ospIic == 'H' ||
        (pniParams.ospDc == 'NA' && pniParams.ospIic == 'NA' && rsrRiskLevel == 'H') || pniParams.saraRiskPartner == 3 || pniParams.saraRiskOther == 3) {
        result.riskLevel = 'H'
        riskLevelProject = 'H'
    } else if (pniParams.arpBand == 'M' || pniParams.vrpBand == 'M' || pniParams.ospDc == 'M' || pniParams.ospIic == 'M' || (pniParams.ospDc == 'NA' && pniParams.ospIic == 'NA' && rsrRiskLevel == 'M') || pniParams.saraRiskPartner == 2 || pniParams.saraRiskOther == 2) {
        result.riskLevel = 'M'
    } else {
        result.riskLevel = 'L'
    }

    if (riskLevelProject == 'O') { // All the risk fields were present so projection not set
        riskLevelProject = result.riskLevel // Assign projection same as reality
    }

    // Now use Risk Level with Overall Need Level to produce a PNI Calculation
    // Medium or low need with High OGRS + High OVP or High SARA has already been dealt with
    let interimResult = 'A'
    if (result.riskLevel == 'H' && result.overallNeedLevel == 'H') {
        interimResult = 'H'
    } else if (result.overallNeedLevel == 'M' && result.riskLevel == 'H') {
        interimResult = 'M'
    } else if (result.overallNeedLevel == 'H' && result.riskLevel == 'M') {
        interimResult = 'M'
    } else if (result.overallNeedLevel == 'M' && result.riskLevel == 'M') {
        interimResult = 'M'
    } else if (pniParams.saraRiskPartner > 1 || pniParams.saraRiskOther > 1) {
        interimResult = 'M'
    }

    let interimResultProject = 'A'
    if (riskLevelProject == 'H' && overallNeedLevelProject == 'H') {
        interimResultProject = 'H'
    } else if (overallNeedLevelProject == 'M' && riskLevelProject == 'H') {
        interimResultProject = 'M'
    } else if (overallNeedLevelProject == 'H' && riskLevelProject == 'M') {
        interimResultProject = 'M'
    } else if (overallNeedLevelProject == 'M' && riskLevelProject == 'M') {
        interimResultProject = 'M'
    } else if (pniParams.saraRiskPartner > 1 || pniParams.saraRiskOther > 1) {
        interimResultProject = 'M'
    }

    // Step 3 Output a PNI calculation
    // Check for trumps
    // High OGRS with High OVP or High SARA as this returns High Intensity && it is job done
    let calcComplete = false

    if (['H', 'V'].includes(pniParams.arpBand) && (['H', 'V'].includes(pniParams.vrpBand) || pniParams.saraRiskPartner == 3 || pniParams.saraRiskOther == 3)) { // They are High OGRS
        result.pniCalculation = pniParams.community ? 'M' : 'H'
        calcComplete = true
    }

    // High or Medium SARA in community returns moderate intensity && it is job done
    if (!calcComplete && pniParams.community && (pniParams.saraRiskPartner > 1 || pniParams.saraRiskOther > 1)) {
        result.pniCalculation = 'M'
        calcComplete = true
    }

    if (!calcComplete && !pniParams.community && interimResult == 'H') {
        result.pniCalculation = 'H'
        calcComplete = true
    }
    if (!calcComplete && pniParams.community && ['M', 'H'].includes(interimResult)) { // Community with Medium or High
        result.pniCalculation = 'M' // Possibly downgrade the result
        calcComplete = true
    }
    if (!calcComplete) {
        // projection is 'A' the missing fields won't increase it
        if (interimResultProject == 'A' && pniParams.saraRiskPartner != null && pniParams.saraRiskOther != null) {
            result.pniCalculation = 'A'
            calcComplete = true
        }
    }

    let omission = false

    if (!calcComplete) { // Not found a PNI
        if (saraTrump && ['A', 'L'].includes(interimResult)) { // Low interim score but NULL SARA so missing
            omission = true
        } else if (result.overallNeedLevel != overallNeedLevelProject || result.riskLevel != riskLevelProject) { // There is a difference
            omission = true
        }
        // SARA mising && community case with alternative pathway
        if (pniParams.community && interimResult == 'A' && (pniParams.saraRiskPartner == null || pniParams.saraRiskOther == null)) {
            omission = true
        }
    }

    if (omission) {
        result.pniCalculation = 'O'
    } else {
        result.missingFields = null
    }

    if (!calcComplete && !omission) {
        result.pniCalculation = interimResult
    }

    return result
}
