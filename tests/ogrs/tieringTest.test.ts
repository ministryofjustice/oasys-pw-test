import { test } from 'fixtures'

const count = 260000
const whereClause: string = null
// const whereClause = `cms_prob_number = 'V017263'`
const reportAll = false


test('Tier calculations test', async ({ ogrs }) => {

    let failed = 0
    let passed = 0
    let communityDateIssue = 0

    const tieringData = await ogrs.tiering.getTieringTestData(count, whereClause)

    for (const testCase of tieringData) {
        const logText: string[] = []

        const caseResult = ogrs.tiering.calculate(testCase, logText)
        const caseFailed = caseResult.tier != testCase.csvOrOracleResults.finalTier || caseResult.provisional != testCase.csvOrOracleResults.provisional
        const caseCommunityDateIssue = testCase.lifer && !testCase.inCustody && testCase.communityDateFuture

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
            if (caseCommunityDateIssue) {
                communityDateIssue++
            }
        }
        if (!caseFailed) {
            passed++
        }

    }

    log(`Passed: ${passed}, failed: ${failed}, community date issue: ${communityDateIssue}`, 'Summary')
    console.log(`Passed: ${passed}, failed: ${failed}, community date issue: ${communityDateIssue}`)

    expect(failed).toBe(0)

})
