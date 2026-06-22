import * as fs from 'fs-extra'

import { test } from 'fixtures'
import { TieringCase } from 'fixtures/ogrs/tiering/dbClasses'
import { getCaseFromCsv } from 'fixtures/ogrs/tiering/csv'

const csvCount: number = 300000
const oracleCount = 300000
const whereClause: string = null
// const whereClause = `cms_prob_number = 'V017263'`
const reportAll = false
const testFile = 'tests/ogrs/data/local/tiers-preprod-2026-06-19.csv'

test('Tier calculations test - CSV', async ({ ogrs }) => {

    let failed = 0
    let passed = 0
    let skipped = 0
    let arpMismatch = 0
    let csrpMismatch = 0
    let releaseDate = 0
    let scoreOverlap = 0
    let releaseDateScoreOverlap = 0
    let anyMismatch = 0

    // CSV data (with PI results)
    const testData = await fs.readFile(testFile, 'utf8')
    const testCases = testData.split('\r\n')
    const numCases = testCases.length
    const rows = csvCount == 0 || numCases < csvCount ? numCases - 1 : csvCount  // First row is header

    // Oracle data (with Oracle results)
    const oracleTieringData = await ogrs.tiering.getTieringTestData(oracleCount, whereClause)
    const oracleTestCases: { [key: string]: TieringCase } = {}
    for (let i = 0; i < oracleTieringData.length; i++) {
        oracleTestCases[oracleTieringData[i].probationCrn] = oracleTieringData[i]
    }


    for (let i = 1; i <= rows; i++) {

        const logText: string[] = []

        const csvTestCase = getCaseFromCsv(testCases[i])
        if (csvTestCase) {

            const oracleTestCase = oracleTestCases[csvTestCase.probationCrn] // oracleTieringData.find((c) => c.probationCrn == csvTestCase.probationCrn)

            const calculatedResult = ogrs.tiering.calculate(csvTestCase, logText)
            const caseFailed =
                calculatedResult.tier != csvTestCase.csvOrOracleResults.finalTier
                || calculatedResult.provisional != csvTestCase.csvOrOracleResults.provisional
                || (oracleTestCase && (calculatedResult.tier != oracleTestCase?.csvOrOracleResults.finalTier
                    || calculatedResult.provisional != oracleTestCase?.csvOrOracleResults.provisional))

            if (caseFailed || reportAll) {
                log(` CSV: ${JSON.stringify(csvTestCase)}\n Oracle: ${JSON.stringify(oracleTestCase)}`,
                    `CRN: ${csvTestCase.probationCrn} ${caseFailed ? 'FAILED' : ''}`)
                log(`     Tier - CSV: ${csvTestCase.csvOrOracleResults.finalTier}, Oracle: ${oracleTestCase?.csvOrOracleResults.finalTier}, Calculated: ${calculatedResult.tier}`)
                log(`     Provisional - CSV: ${csvTestCase.csvOrOracleResults.provisional}, Oracle: ${oracleTestCase?.csvOrOracleResults.provisional}, Calculated:  ${calculatedResult.provisional}`)
                logText.forEach((logLine) => {
                    log(logLine)
                })
                log(' ')
                if (caseFailed) {
                    failed++

                    if (csvTestCase.arp != oracleTestCase.arp) {
                        arpMismatch++
                    }
                    if (csvTestCase.csrp != oracleTestCase.csrp) {
                        csrpMismatch++
                    }
                    if (csvTestCase.arp != oracleTestCase.arp && csvTestCase.csrp != oracleTestCase.csrp) {
                        scoreOverlap++
                    }
                    if (csvTestCase.communityDate != oracleTestCase.communityDate) {
                        releaseDate++
                    }
                    if (csvTestCase.communityDate != oracleTestCase.communityDate && (csvTestCase.arp != oracleTestCase.arp || csvTestCase.csrp != oracleTestCase.csrp)) {
                        releaseDateScoreOverlap++
                    }
                    if (csvTestCase.arp != oracleTestCase.arp || csvTestCase.csrp != oracleTestCase.csrp || csvTestCase.communityDate != oracleTestCase.communityDate) {
                        anyMismatch++
                    }
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
    log(`ARP mismatch: ${arpMismatch}, CSRP mismatch: ${csrpMismatch}, score overlap: ${scoreOverlap}`)
    log(`Releast date mismatch: ${releaseDate}, overlap: ${releaseDateScoreOverlap}`)
    log(`Any mismatch: ${anyMismatch}`)
    console.log(`Passed: ${passed}, failed: ${failed}, skipped: ${skipped}`)
    console.log(`ARP mismatch: ${arpMismatch}, CSRP mismatch: ${csrpMismatch}, score overlap: ${scoreOverlap}`)
    console.log(`Release date mismatch: ${releaseDate}, overlap: ${releaseDateScoreOverlap}`)
    console.log(`Any mismatch: ${anyMismatch}`)

    expect(failed).toBe(0)

})
