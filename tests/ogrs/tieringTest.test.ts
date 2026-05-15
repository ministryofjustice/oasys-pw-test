import { test } from 'fixtures'

const count = 500//260000
const whereClause: string = null
// const whereClause = `cms_prob_number = 'V017263'`
const includeStatic = true
const reportAll = false


test('Tier calculations test', async ({ ogrs }) => {

    let failed = 0
    let passed = 0

    const tieringData = await ogrs.tiering.getTieringTestData(count, whereClause)

    for (const tieringCase of tieringData) {
        const logText: string[] = []

        const caseResult = ogrs.tiering.calculate(tieringCase, includeStatic, logText)
        const caseFailed = caseResult != tieringCase.oracleResults.finalTier

        if (caseFailed || reportAll) {
            log(`     ${JSON.stringify(tieringCase)}`, `CRN: ${tieringCase.probationCrn} / ${tieringCase.prisonCrn} ${caseFailed ? 'FAILED' : ''}`)
            log(`     Oracle: ${tieringCase.oracleResults.finalTier}, Test result: ${caseResult}`)
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
