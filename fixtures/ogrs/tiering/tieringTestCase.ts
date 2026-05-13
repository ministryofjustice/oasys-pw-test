import { TieringCase } from './dbClasses'


export function testTieringCase(tieringCase: TieringCase, includeStatic: boolean, logText: string[]): Tier {

    // Get CSRP score depending on static parameter
    let csrpScore = tieringCase.arpCsrp.ncRsrPercentageScore
    if (!includeStatic && tieringCase.arpCsrp.rsrStaticOrDynamic != 'DYNAMIC') {
        csrpScore = null
    }

    // Get ARP score depending on static parameter
    let arpScore = tieringCase.arpCsrp.ogp2Percentage2yr
    if (arpScore == null && includeStatic) {
        arpScore = tieringCase.arpCsrp.ogrs4gPercentage2yr
    }

    // OSP percentage and band - use DC if available, otherwise the old C version
    const oldOsp = tieringCase.srp.ncOspDcPercentageScore == null
    const ospContactRisk = oldOsp ? tieringCase.oldOsp.ospCPercentageScore : tieringCase.srp.ncOspDcPercentageScore
    const ospContactBand = oldOsp ? tieringCase.oldOsp.ospCRiskReconElm : tieringCase.srp.ncOspDcRiskReconElm

    // RoSH flag - use Delius flag if available, otherwise take the one from oasys_set
    const rosh = (tieringCase.rosh == null) ? tieringCase.roshLevelElm : tieringCase.rosh

    // Initial tier calculations - dynamic ARP, dynamic CSRP
    const arpCsrp = calculateArpCsrp(arpScore, csrpScore)
    const dc = calculateDc(ospContactRisk, ospContactBand, oldOsp)

    // Determine the initial result
    let initialResult = getHigherTier(arpCsrp, dc)

    // Final result calculations
    const roshMappa = calculateRoshMappa(rosh, tieringCase.mappa)
    const lifer = calculateLifer(tieringCase)
    const daStalkingCp = calculateDaStalkingCp(tieringCase)
    const pCoSos = calculatePCoSos(tieringCase)

    // Determine the final result
    let finalResult = getHigherTier(initialResult, roshMappa)
    finalResult = getHigherTier(finalResult, lifer)
    finalResult = getHigherTier(finalResult, daStalkingCp)
    finalResult = getHigherTier(finalResult, pCoSos)

    // If no CSRP, only accept the final result if it's A
    if (arpCsrp == null && finalResult != 'A') {
        finalResult = null
    }

    logText.push(`        ARP/CSRP   - ${arpCsrp}`)
    logText.push(`        DC-SRP     - ${dc}`)
    logText.push(`        RoSH/MAPPA - ${roshMappa}`)
    logText.push(`        Lifer      - ${lifer}`)
    logText.push(`        DA, st, CP - ${daStalkingCp}`)

    return finalResult ?? 'M'
}

function calculateArpCsrp(arp: number, csrp: number): Tier {

    if (arp == null || csrp == null) {
        return null
    }

    const arpCol = arp >= 90 ? 0 : arp >= 75 ? 1 : arp >= 50 ? 2 : arp >= 25 ? 3 : arp >= 15 ? 4 : 5

    const resultLookup: { [keys: string]: Tier[] } = {
        row1: ['A', 'A', 'B', 'B', 'B', 'B'],
        row2: ['A', 'B', 'C', 'C', 'C', 'C'],
        row3: ['B', 'C', 'D', 'E', 'E', 'E'],
        row4: ['C', 'D', 'E', 'E', 'F', 'F'],
        row5: ['D', 'D', 'E', 'F', 'F', 'G'],
    }

    if (csrp >= 6.9) return resultLookup.row1[arpCol]
    if (csrp >= 3) return resultLookup.row2[arpCol]
    if (csrp >= 1) return resultLookup.row3[arpCol]
    if (csrp >= 0.5) return resultLookup.row4[arpCol]
    return resultLookup.row5[arpCol]

}

function calculateDc(ospRisk: number, ospContactBand: string, oldOsp: boolean): Tier {

    if (ospRisk == null || ospContactBand == null) {
        return null
    }

    const topMediumReduced = oldOsp ? 2 : 3.36
    const bottomMediumReduced = oldOsp ? 1.37 : 2.11
    const topMediumStd = oldOsp ? 0.82 : 1.12

    switch (ospContactBand.substring(0, 1)) {
        case 'V':
            return 'A'
        case 'H':
            return 'B'
        case 'M':
            if (ospRisk >= topMediumReduced) {
                return 'C'
            }
            if (ospRisk >= bottomMediumReduced) {
                return 'D'
            }
            if (ospRisk >= topMediumStd) {
                return 'C'
            }
            return 'D'
        case 'L':
            return 'E'
    }
    return null
}

function calculateRoshMappa(rosh: string, mappa: string): Tier {

    if (mappa == 'Y') {
        return rosh == 'V' ? 'A' : rosh == 'H' ? 'C' : rosh == 'M' ? 'D' : rosh == 'L' ? 'E' : null
    } else {
        return rosh == 'V' ? 'C' : rosh == 'H' ? 'D' : null
    }
}

function calculateLifer(tieringCase: TieringCase): Tier {

    if (tieringCase.lifer != 'Y' || tieringCase.custodyInd == 'Y' || tieringCase.communityDate == null || tieringCase.dateCompleted == null) {
        return null
    }

    if (oasysDateTime.dateDiffString(tieringCase.dateCompleted, tieringCase.communityDate, 'day') > 0) {        // Community date is in the future
        return null
    }

    const diffYears = oasysDateTime.dateDiffString(tieringCase.communityDate, tieringCase.dateCompleted, 'year') // Assessment date minus community date
    return diffYears == 0 ? 'B' : diffYears < 5 ? 'D' : 'E'
}

function calculateDaStalkingCp(tieringCase: TieringCase): Tier {

    if (tieringCase.daStalking.da == 'Y' || tieringCase.daStalking.daHistory == 'Y') {
        return 'E'
    }
    if (tieringCase.daStalking.stalking == 'Y' || tieringCase.cp.childProtection == 'Y') {
        return 'F'
    }
    return null
}

function calculatePCoSos(tieringCase: TieringCase): Tier {

    return tieringCase.o1_30 == 'Y' ? 'E' : null
}

function getHigherTier(t1: Tier, t2: Tier): Tier {
    if (t1 == null && t2 == null) {
        return null
    }
    if (t1 == null) {
        return t2
    }
    if (t2 == null) {
        return t1
    }
    return t1 < t2 ? t1 : t2  // reverse alphabetic order
}
