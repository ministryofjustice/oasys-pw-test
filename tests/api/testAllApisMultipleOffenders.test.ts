import { test, Api } from 'fixtures'


// Number of offenders for each date range
const offenderCountEarly = 25     // Used for pre-2023
const offenderCount = 100         // 2023 and later

// Response time thresholds
const slow = 100
const verySlow = 500
const failure = 1000

// Define date parameters for sets of offender data
const dateConditions = [
    { date: `2020-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
    { date: `2021-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
    { date: `2022-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
    { date: `2023-${randomMonth()}-${randomDay()}`, count: offenderCount },
    { date: `2024-${randomMonth()}-${randomDay()}`, count: offenderCount },
    { date: `2025-${randomMonth()}-${randomDay()}`, count: offenderCount },
    { date: 'today', count: offenderCount },
]

const limitEndpoints: Endpoint[] = []
// const limitEndpoints: Endpoint[] = ['crimNeeds']

const excludeEndpoints: Endpoint[] = []
// const excludeEndpoints: Endpoint[] = ['pni']

// Hide details from the report for passes
const reportPasses = false

// Skip some dodgy data if it gets selected
const testDataIssues = [
    `'D011517'`,  // duplicate oasys_set created in 2012
    `'X334486'`,  // 888 offence code issue
]

const stats: EndpointStat[] = []
let offendersTested = 0
let totalApiCount = 0
let totalApiTimeMs = 0
let totalDbTimeMs = 0

test('RestAPI regression tests', async ({ oasysDb, api }) => {

    test.setTimeout(0)
    oasysDateTime.startTimer('apiTest')
    let failed = false

    for (let i = 0; i < dateConditions.length; i++) {

        log('', `\nAll endpoint regression tests - part ${i + 1}: ${dateConditions[i].count} offenders created before ${dateConditions[i].date}\n`)
        console.log(`\nAll endpoint regression tests - part ${i + 1}: ${dateConditions[i].count} offenders created before ${dateConditions[i].date}\n`)

        // Get a list of offenders based on the date specified, then call the API test for each in turn.

        const dateFilter = dateConditions[i].date == 'today' ? 'sysdate' : `to_date('${dateConditions[i].date}','YYYY-MM-DD')`
        const offendersToSkip = `(${testDataIssues.join()})`

        const offenderQuery = `select * from 
                                    (select cms_prob_number, cms_pris_number from eor.offender 
                                        where cms_prob_number is not null
                                        and deleted_date is null
                                        and create_date <= ${dateFilter} 
                                        and cms_prob_number not in ${offendersToSkip}
                                        order by create_date desc)
                                        where rownum <= ${dateConditions[i].count}`

        const offenders = await oasysDb.getData(offenderQuery)
        const setFailed = await runTest(offenders, api)
        if (setFailed) {
            failed = true
        }
    }

    log('', '\n\nTiming stats')

    const tooSlow = reportStats()

    let elapsedTimeS = Math.round(oasysDateTime.elapsedTime('apiTest') / 1000)
    log('', 'Totals')
    log(`Offenders: ${offendersTested}`)
    log(`API calls: ${totalApiCount}`)
    log(`Database query time: ${Math.round(totalDbTimeMs / 1000)}s`)
    log(`API response time: ${Math.round(totalApiTimeMs / 1000)}s`)
    log(`Total elapsed time: ${elapsedTimeS}s`)
    log(`Average call rate: ${Math.round(totalApiCount / elapsedTimeS)} calls per second`)
    log(`Average response time: ${Math.round(totalApiTimeMs / totalApiCount)}ms`)

    if (tooSlow) {
        log('\n*** Failed - too slow ***')
        failed = false
    }

    expect(failed).toBeFalsy()
})

async function runTest(offenders: string[][], api: Api): Promise<boolean> {

    let failed = false
    let count = 1

    for (let offender of offenders) {

        console.log(`Offender ${count++}: ${offender[0]} / ${offender[1]}`)
        offendersTested++

        if (offender[0] != null) {  // call with probation CRN
            const offenderFailed = await api.testOneOffender(offender[0], 'prob', false, reportPasses, stats, limitEndpoints, excludeEndpoints)
            if (offenderFailed) {
                console.log('Failed')
                failed = true
            }
        }
        if (offender[1] != null) {  // call with NomisId
            const offenderFailed = await api.testOneOffender(offender[1], 'pris', offender[0] != null, reportPasses, stats, limitEndpoints, excludeEndpoints)  // skipPrisSubsequents if already done for prob crn
            if (offenderFailed) {
                console.log('Failed')
                failed = true
            }
        }
    }

    return failed
}

function randomMonth(): string {
    return Math.ceil(Math.random() * (12)).toString().padStart(2, '0')
}

function randomDay(): string {
    return Math.ceil(Math.random() * (28)).toString().padStart(2, '0')
}


function reportStats(): boolean {

    let failed = false
    const endpoints = stats.map((stat) => stat.endpoint).filter(utils.onlyUnique)
    endpoints.forEach((endpoint) => {
        const responseTimes = stats.filter((stat) => stat.endpoint == endpoint).map((stat) => stat.responseTime)
        const result = reportStat(endpoint, responseTimes)

        if (endpoint == 'database') {
            totalDbTimeMs += result.totalTime
        } else {
            totalApiCount += result.count
            totalApiTimeMs += result.totalTime
            failed ||= result.failed
        }
    })
    return failed
}

function reportStat(endpoint: string, responseTimes: number[]): { count: number, totalTime: number, failed: boolean } {

    let count = responseTimes.length
    let total = 0
    let failed = false

    let reportString = `${endpoint}: count ${count}`
    if (count > 0) {
        total = responseTimes.reduce((a, b) => a + b, 0)
        let max = Math.max(...responseTimes)
        let maxHighlight = getHighlightText(endpoint, max)
        let average = Math.round(total / count)
        let averageHighlight = getHighlightText(endpoint, average)
        failed = average >= failure
        reportString = `${reportString}, min ${Math.min(...responseTimes)}ms, ${maxHighlight}max ${max}ms${maxHighlight}, ${averageHighlight}average ${average}ms${averageHighlight}`
        log(reportString)
    }

    return { count: count, totalTime: total, failed: failed }
}

function getHighlightText(endpoint: string, time: number): string {

    if (endpoint == 'database') {
        return ''
    }
    return time > failure ? ' ***** ' : time > verySlow ? ' *** ' : time > slow ? ' * ' : ''
}

