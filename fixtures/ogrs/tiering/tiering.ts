import { OasysDb } from 'fixtures'
import { TieringCase } from './dbClasses'

export class Tiering {

    constructor(private readonly oasysDb: OasysDb) { }

    async getTieringTestData(rows: number, whereClause: string): Promise<TieringCase[]> {

        const cases = await this.oasysDb.getData(TieringCase.query(rows, whereClause))

        const result: TieringCase[] = []
        for (let a = 0; a < cases.length; a++) {
            result.push(new TieringCase(cases[a]))
        }

        return result
    }

    calculate(tieringCase: TieringCase, logText: string[]): { tier: Tier, provisional: string } {

        // CSRP score
        const csrpScore = tieringCase.arpCsrp.ncRsrPercentageScore
        const staticCsrp = tieringCase.arpCsrp.rsrStaticOrDynamic != 'DYNAMIC'

        // ARP score
        const arpScore = tieringCase.arpCsrp.ogp2Percentage2yr ?? tieringCase.arpCsrp.ogrs4gPercentage2yr
        const staticArp = tieringCase.arpCsrp.ogp2Percentage2yr == null

        // RoSH flag - use Delius flag if available, otherwise take the one from oasys_set
        const rosh = tieringCase.rosh ?? tieringCase.roshLevelElm

        // Initial tier calculation - ARP/CSRP
        const arpCsrp = calculateArpCsrp(arpScore, csrpScore)

        // Moderator calculations
        const dc = calculateDc(tieringCase.srp.ncOspDcPercentageScore, tieringCase.srp.ncOspDcRiskReconElm)
        const roshMappa = calculateRoshMappa(rosh, tieringCase.mappa)
        const lifer = calculateLifer(tieringCase)
        const daStalkingCp = calculateDaStalkingCp(tieringCase)
        const pCoSos = calculatePCoSos(tieringCase)

        // Find the highest moderator
        let maxModerator = getHigherTier(dc, roshMappa)
        maxModerator = getHigherTier(maxModerator, lifer)
        maxModerator = getHigherTier(maxModerator, daStalkingCp)
        maxModerator = getHigherTier(maxModerator, pCoSos)

        // Determine the final result - null if no ARP/CSRP
        let finalResult = arpCsrp == null ? null : getHigherTier(arpCsrp, maxModerator)

        // Provisional flag for static ARP and CSRP
        let provisionalFlag: 'Y' | 'N' = 'N'
        let maxArpCsrpTier: Tier

        if (finalResult && (staticArp || staticCsrp)) {

            // If both static, result is always provisional unless moderators make it A
            if (staticArp && staticCsrp) {
                if (maxModerator != 'A') {
                    provisionalFlag = 'Y'
                }
            } else {
                // Otherwise, depends on the possible maximum if one predictor went from static to dynamic
                if (staticArp) {
                    maxArpCsrpTier = calculateArpCsrp(100, csrpScore)
                } else {
                    maxArpCsrpTier = calculateArpCsrp(arpScore, 100)
                }

                // Provisional unless a moderator has taken it to the maximum available or higher
                if (finalResult > maxArpCsrpTier || finalResult != maxModerator) { // Reverse alphabetical, final result is less than max possible
                    provisionalFlag = 'Y'
                }
            }
        }

        if (finalResult && !rosh && provisionalFlag == 'N') {

            // Missing ROSH, result is provisional unless a non-provisional result above is at least as high as the highest possible ROSH result

            const highestRosh = calculateRoshMappa('V', tieringCase.mappa)
            if (finalResult > highestRosh) {
                provisionalFlag = 'Y'
            }
        }

        logText.push(`        ARP/CSRP   - ${arpCsrp}`)
        logText.push(`        DC-SRP     - ${dc}`)
        logText.push(`        RoSH/MAPPA - ${roshMappa}`)
        logText.push(`        Lifer      - ${lifer}`)
        logText.push(`        DA, st, CP - ${daStalkingCp}`)
        logText.push(`        PCoSo      - ${pCoSos}`)
        logText.push(`        [Max ARP/CSRP - ${maxArpCsrpTier}]`)
        logText.push(`        [Max moderator - ${maxModerator}]`)

        return { tier: finalResult ?? 'M', provisional: provisionalFlag }
    }
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

function calculateDc(ospRisk: number, ospContactBand: string): Tier {

    if (ospRisk == null || ospContactBand == null) {
        return null
    }

    const topMediumReduced = 3.36
    const bottomMediumReduced = 2.11
    const topMediumStd = 1.12

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
        return rosh == 'V' ? 'A' : rosh == 'H' ? 'C' : rosh == 'M' ? 'D' : 'E' //rosh == 'L' ? 'E' : null
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

    if (tieringCase.daStalkingCp.da == 'Y' || tieringCase.daStalkingCp.daHistory == 'Y') {
        return 'E'
    }
    if (tieringCase.daStalkingCp.stalking == 'Y' || tieringCase.daStalkingCp.childProtection == 'Y') {
        return 'F'
    }
    return null
}

function calculatePCoSos(tieringCase: TieringCase): Tier {

    return tieringCase.o1_30 == 'Y' ? 'E' : null
}

function calculateMinCsrp(tieringCase: TieringCase): number {

    let result = tieringCase.srp.ncOspDcPercentageScore ?? 0
    if (tieringCase.srp.ncOspIicPercentageScore) {
        result += tieringCase.srp.ncOspIicPercentageScore
    }
    return result
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
