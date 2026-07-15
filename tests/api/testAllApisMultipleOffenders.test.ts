import { test, Api } from 'fixtures'


// Number of offenders for each date range
const offenderCountEarly = 25     // Used for pre-2023
const offenderCount = 100         // 2023 and later


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
//const limitEndpoints: Endpoint[] = ['pni']

const excludeEndpoints: Endpoint[] = []
// const excludeEndpoints: Endpoint[] = ['pni']

// Hide details from the report for passes
const reportPasses = false

// Skip some dodgy data if it gets selected
const testDataIssues = [
    `'D011517'`,  // duplicate oasys_set created in 2012
    `'X334486'`,  // 888 offence code issue
    `'ZLSNJNH'`,  // SAN issue
    `'ZLHTSIW'`,  // SAN issue
    `'ZNBWPWW'`,  // SAN issue
    `'ZUFYJQT'`,  // SAN issue
    `'X778253'`,  // SAN issue
]

for (let i = 0; i < dateConditions.length; i++) {

    test(`RestAPI regression tests - ${i}`, async ({ oasysDb, api }) => {

        test.setTimeout(0)

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
        const failed = await runTest(offenders, api)
        expect(failed).toBeFalsy()
    })
}

async function runTest(offenders: string[][], api: Api): Promise<boolean> {

    let failed = false
    let count = 1

    for (let offender of offenders) {

        console.log(`Offender ${count++}: ${offender[0]} / ${offender[1]}`)

        if (offender[0] != null) {  // call with probation CRN
            const offenderFailed = await api.testOneOffender(offender[0], 'prob', false, reportPasses, limitEndpoints, excludeEndpoints)
            if (offenderFailed) {
                console.log('Failed')
                failed = true
            }
        }
        if (offender[1] != null) {  // call with NomisId
            const offenderFailed = await api.testOneOffender(offender[1], 'pris', offender[0] != null, reportPasses, limitEndpoints, excludeEndpoints)  // skipPrisSubsequents if already done for prob crn
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

