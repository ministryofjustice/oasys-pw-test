import * as fs from 'fs-extra'

import { test } from 'fixtures'
import { TieringCase } from 'fixtures/ogrs/tiering/dbClasses'

const count: number = 0
const reportAll = false
const testFile = 'tests/ogrs/data/local/tiers-preprod-2026-06-17.csv'

test('Tier calculations test - CSV', async ({ ogrs }) => {

    let failed = 0
    let passed = 0
    let skipped = 0

    const testData = await fs.readFile(testFile, 'utf8')
    const testCases = testData.split('\r\n')
    const numCases = testCases.length

    const rows = count == 0 || numCases < count ? numCases - 1 : count  // First row is header

    for (let i = 1; i <= rows; i++) {

        const logText: string[] = []

        const tieringCase = getCaseFromCsv(testCases[i])
        if (tieringCase) {
            const caseResult = ogrs.tiering.calculate(tieringCase, logText)
            const caseFailed = caseResult.tier != tieringCase.oracleResults.finalTier || caseResult.provisional != tieringCase.oracleResults.provisional

            if (caseFailed || reportAll) {
                log(`     ${JSON.stringify(tieringCase)}`, `CRN: ${tieringCase.probationCrn} / ${tieringCase.prisonCrn} ${caseFailed ? 'FAILED' : ''}`)
                log(`     CSV tier: ${tieringCase.oracleResults.finalTier}, Test result: ${caseResult.tier}`)
                log(`     CSV provisional: ${tieringCase.oracleResults.provisional}, Test result: ${caseResult.provisional}`)
                logText.forEach((logLine) => {
                    log(logLine)
                })
                log(' ')
                if (caseFailed) {
                    failed++
                }
            }
            if (!caseFailed) {
                passed++
            }
        } else {
            skipped++
        }

    }

    log(`Passed: ${passed}, failed: ${failed}, skipped: ${skipped}`, 'Summary')
    console.log(`Passed: ${passed}, failed: ${failed}, skipped: ${skipped}`)

    expect(failed).toBe(0)

})

function getCaseFromCsv(testCaseData: string): TieringCase {

    const data = testCaseData.split(',')
    // 00 crn
    // 01 tier
    // 02 provisional
    // 03 tier_calculation_id
    // 04 tier_calculated_at
    // 05 assessment_completed_at
    // 06 arp_score
    // 07 arp_band
    // 08 arp_static_or_dynamic
    // 09 csrp_score
    // 10 csrp_band
    // 11 csrp_static_or_dynamic
    // 12 dcsrp_score
    // 13 dcsrp_band
    // 14 iicsrp_score
    // 15 iicsrp_band
    // 16 ever_committed_sexual_offence
    // 17 has_active_event
    // 18 rosh
    // 19 mappa_level
    // 20 mappa_category
    // 21 lifer_ipp
    // 22 latest_release_date
    // 23 stalking
    // 24 domestic_abuse
    // 25 child_protection

    if (data[1] == 'NOT_SUPERVISED') {
        return null
    }

    const result: TieringCase = {
        probationCrn: data[0],
        prisonCrn: null,
        assessmentPk: null,
        offenderPk: null,
        dateCompleted: '16/06/2026', // TODO data[5],
        o1_30: trueFalseToYN(data[16]),
        arpCsrp: {
            ncRsrPercentageScore: utils.stringToFloat(data[9]),
            rsrStaticOrDynamic: data[11],
            ogrs4gPercentage2yr: data[8] == 'STATIC' ? utils.stringToFloat(data[6]) : null,
            ogp2Percentage2yr: data[8] == 'DYNAMIC' ? utils.stringToFloat(data[6]) : null,
        },
        srp: {
            ncOspDcRiskReconElm: data[13].charAt(0),
            ncOspDcPercentageScore: utils.stringToFloat(data[12]),
            ncOspIicRiskReconElm: data[15].charAt(0),
            ncOspIicPercentageScore: utils.stringToFloat(data[14]),
            dcSrpRiskReduction: null,
        },
        rosh: data[18].charAt(0),
        roshLevelElm: null,
        mappa: data[20] == '' ? null : 'Y',
        lifer: trueFalseToYN(data[21]),
        custodyInd: null,
        communityDate: data[22] == '' ? null : data[22],
        daStalkingCp: {
            da: trueFalseToYN(data[24]),
            daHistory: null,
            stalking: trueFalseToYN(data[23]),
            childProtection: trueFalseToYN(data[25]),
        },
        oracleResults: {
            finalTier: data[1].charAt(0),
            provisional: trueFalseToYN(data[2]),
        },
    }

    return result
}

function trueFalseToYN(data: string): 'Y' | 'N' {

    return data == 'TRUE' ? 'Y' : 'N'
}
