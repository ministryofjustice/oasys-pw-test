import { test } from 'fixtures'

const count = 300000
const reportAll = false
const oracleCsvExport: string = 'tests/ogrs/data/local/PP test export unfiltered.csv'

test('Tier calculations test', async ({ ogrs }) => {

    let failed = 0
    let passed = 0

    const tieringData = await ogrs.tiering.getTieringTestData(count, null, oracleCsvExport)

    for (const testCase of tieringData) {
        const logText: string[] = []

        const caseResult = ogrs.tiering.calculate(testCase, logText)
        const caseFailed = caseResult.tier != testCase.csvOrOracleResults.finalTier || caseResult.provisional != testCase.csvOrOracleResults.provisional

        if (caseFailed || reportAll) {
            log(`     ${JSON.stringify(testCase)}`, `CRN: ${testCase.probationCrn} ${caseFailed ? 'FAILED' : ''}`)
            log(`     Oracle tier: ${testCase.csvOrOracleResults.finalTier}, Test result: ${caseResult.tier}`)
            log(`     Oracle provisional: ${testCase.csvOrOracleResults.provisional}, Test result: ${caseResult.provisional}`)
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

    }

    log(`Passed: ${passed}, failed: ${failed}`, 'Summary')
    console.log(`Passed: ${passed}, failed: ${failed}`)
    expect(failed).toBe(0)

})
