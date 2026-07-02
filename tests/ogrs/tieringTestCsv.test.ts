import * as fs from 'fs-extra'

import { test } from 'fixtures'
import { TieringCase } from 'fixtures/ogrs/tiering/dbClasses'
import { getPiCaseFromCsv } from 'fixtures/ogrs/tiering/csv'

const csvCount: number = 300000
const oracleCount = 300000
const oracleCsvExport: string = 'tests/ogrs/data/local/Step12Extract_300626.csv'

const whereClause: string = `os.snsv_algo_version is null`
// SNSV_ALGO_VERSION - ignore cases where this has been set in OASYS_SET, as Delius will not use the rescore values for these


const reportAll = false
const testFile = 'tests/ogrs/data/local/tiers-prod-2026-07-01.csv'

test('Tier calculations test - CSV', async ({ ogrs }) => {

    let failed = 0
    let passed = 0
    let skipped = 0

    // CSV data (with PI results)
    const testData = await fs.readFile(testFile, 'utf8')
    const testCases = testData.split('\n')
    const numCases = testCases.length
    const rows = csvCount == 0 || numCases < csvCount ? numCases - 1 : csvCount  // First row is header

    // Oracle data (with Oracle results)
    const oracleTieringData = await ogrs.tiering.getTieringTestData(oracleCount, whereClause, oracleCsvExport)
    const oracleTestCases: { [key: string]: TieringCase } = {}
    for (let i = 0; i < oracleTieringData.length; i++) {
        oracleTestCases[oracleTieringData[i].probationCrn] = oracleTieringData[i]
    }


    for (let i = 1; i <= rows; i++) {

        const logText: string[] = []

        const csvTestCase = getPiCaseFromCsv(testCases[i])
        if (csvTestCase) {

            const oracleTestCase = oracleTestCases[csvTestCase.probationCrn]

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

                    const logDetails: string[] = []
                    logDetails.push(csvTestCase.probationCrn)
                    logDetails.push(oracleTestCase?.assessmentPk)
                    logDetails.push(oracleTestCase?.offenderPk)
                    logDetails.push(csvTestCase.csvOrOracleResults.finalTier)
                    logDetails.push(csvTestCase.csvOrOracleResults.provisional)
                    logDetails.push(csvTestCase.rosh)
                    logDetails.push(csvTestCase.arp?.toString())
                    logDetails.push(csvTestCase.csrp?.toString())
                    logDetails.push(csvTestCase.o1_30?.toString())
                    logDetails.push(csvTestCase.releaseDate?.toString())
                    logDetails.push(oracleTestCase?.csvOrOracleResults.finalTier)
                    logDetails.push(oracleTestCase?.csvOrOracleResults.provisional)
                    logDetails.push(oracleTestCase?.rosh)
                    logDetails.push(oracleTestCase?.arp?.toString())
                    logDetails.push(oracleTestCase?.csrp?.toString())
                    logDetails.push(oracleTestCase?.o1_30?.toString())
                    logDetails.push(oracleTestCase?.inCustody?.toString())
                    fileLog(logDetails.join('\t'))
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
    console.log(`Passed: ${passed}, failed: ${failed}, skipped: ${skipped}`, 'Summary')
    expect(failed).toBe(0)

})
