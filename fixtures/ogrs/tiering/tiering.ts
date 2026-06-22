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

    calculate(testCase: TieringCase, logText: string[]): { tier: Tier, provisional: string } {

        // Initial tier calculation - ARP/CSRP
        const arpCsrp = calculateArpCsrp(testCase.arp, testCase.csrp)

        // Moderator calculations
        const dc = calculateDc(testCase.ospDcScore, testCase.oscDcBand)
        const roshMappa = calculateRoshMappa(testCase.rosh, testCase.mappa)
        const lifer = calculateLifer(testCase)
        const otherModerators = calculateOtherModerators(testCase)

        // Find the highest moderator
        let maxModerator = getHigherTier(dc, roshMappa)
        maxModerator = getHigherTier(maxModerator, lifer)
        maxModerator = getHigherTier(maxModerator, otherModerators)

        // Determine the final result - null if no ARP/CSRP
        let finalResult = arpCsrp == null ? null : getHigherTier(arpCsrp, maxModerator)

        // Provisional flag for static ARP and CSRP
        let provisionalFlag: 'Y' | 'N' = 'N'
        let maxArpCsrpTier: Tier

        if (finalResult && (testCase.arpStatic || testCase.csrpStatic)) {

            // If both static, result is always provisional unless moderators make it A
            if (testCase.arpStatic && testCase.csrpStatic) {
                if (maxModerator != 'A') {
                    provisionalFlag = 'Y'
                }
            } else {
                // Otherwise, depends on the possible maximum if one predictor went from static to dynamic
                if (testCase.arpStatic) {
                    maxArpCsrpTier = calculateArpCsrp(100, testCase.csrp)
                } else {
                    maxArpCsrpTier = calculateArpCsrp(testCase.arp, 100)
                }

                // Provisional unless a moderator has taken it to the maximum available or higher
                if (finalResult > maxArpCsrpTier || finalResult != maxModerator) { // Reverse alphabetical, final result is less than max possible
                    provisionalFlag = 'Y'
                }
            }
        }

        if (finalResult && !testCase.rosh && provisionalFlag == 'N') {

            // Missing ROSH, result is provisional unless a non-provisional result above is at least as high as the highest possible ROSH result

            const highestRosh = calculateRoshMappa('V', testCase.mappa)
            if (finalResult > highestRosh) {
                provisionalFlag = 'Y'
            }
        }

        logText.push(`        ARP/CSRP         - ${arpCsrp}`)
        logText.push(`        DC-SRP           - ${dc}`)
        logText.push(`        RoSH/MAPPA       - ${roshMappa}`)
        logText.push(`        Lifer            - ${lifer}`)
        logText.push(`        Other moderators - ${otherModerators}`)
        logText.push(`        [Max ARP/CSRP    - ${maxArpCsrpTier}]`)
        logText.push(`        [Max moderator   - ${maxModerator}]`)

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

function calculateRoshMappa(rosh: string, mappa: boolean): Tier {

    if (mappa) {
        return rosh == 'V' ? 'A' : rosh == 'H' ? 'C' : rosh == 'M' ? 'D' : 'E'
    } else {
        return rosh == 'V' ? 'C' : rosh == 'H' ? 'D' : null
    }
}

function calculateLifer(tieringCase: TieringCase): Tier {

    if (!tieringCase.lifer || tieringCase.inCustody || tieringCase.communityDate == null || tieringCase.communityDateFuture) {
        return null
    }

    const diffYears = oasysDateTime.dateDiff(tieringCase.communityDate, oasysDateTime.testStartDate, 'year') // Today minus community date
    return diffYears == 0 ? 'B' : diffYears < 5 ? 'D' : 'E'
}

function calculateOtherModerators(tieringCase: TieringCase): Tier {

    if (tieringCase.da || tieringCase.o1_30) {
        return 'E'
    }
    if (tieringCase.stalking || tieringCase.cp) {
        return 'F'
    }
    return null
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
