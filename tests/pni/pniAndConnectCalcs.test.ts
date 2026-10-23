import { test, Pni } from 'fixtures'


// Number of offenders for each date range
const offenderCountEarly = 100     // Used for pre-2023
const offenderCount = 1000         // 2025 and later


// Define date parameters for sets of offender data
const dateConditions = [
    { date: `2020-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
    { date: `2021-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
    { date: `2022-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
    { date: `2023-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
    { date: `2024-${randomMonth()}-${randomDay()}`, count: offenderCountEarly },
    { date: `2025-${randomMonth()}-${randomDay()}`, count: offenderCount },
    { date: 'today', count: offenderCount },
]

// Hide details from the report for passes
const reportPasses = false

for (let i = 0; i < dateConditions.length; i++) {

    test(`PNI and Connect calculator tests - ${i}`, async ({ oasysDb, pni }) => {

        test.setTimeout(0)

        log('', `\nPNI and Connect calculator tests - part ${i + 1}: ${dateConditions[i].count} offenders created before ${dateConditions[i].date}\n`)
        console.log(`\nPNI and Connect calculator tests - part ${i + 1}: ${dateConditions[i].count} offenders created before ${dateConditions[i].date}\n`)

        // Get a list of offenders based on the date specified, then call the Connect test for each in turn.

        const dateFilter = dateConditions[i].date == 'today' ? 'sysdate' : `to_date('${dateConditions[i].date}','YYYY-MM-DD')`

        const offenderQuery = `select * from 
                (select cms_prob_number, offender_pk from eor.offender 
                where cms_prob_number is not null
                and deleted_date is null
                and create_date <= ${dateFilter} 
                order by create_date desc)
                where rownum <= ${dateConditions[i].count}`

        const offenders = await oasysDb.getData(offenderQuery)
        const failed = await runTest(offenders, pni, reportPasses)
        expect(failed).toBe(0)
    })
}

test(`PNI and Connect calculator tests - specific offender`, async ({ pni }) => {

    const failed = await runTest([['N628778', '1387261912']], pni, true)
    expect(failed).toBe(0)
})


async function runTest(offenders: string[][], pni: Pni, reportPasses: boolean): Promise<number> {

    let failed = 0
    let assessmentCount = 0
    let offenderCount = 1

    for (let offender of offenders) {

        console.log(`Offender ${offenderCount++}: ${offender[0]}`)

        const results = await pni.testCalculators(offender[0], Number.parseInt(offender[1]), reportPasses)
        assessmentCount += results.count
        if (results.failed > 0) {
            console.log('Failed')
            failed += results.failed
        }
    }

    log(`Offenders: ${offenderCount - 1}, layer 3 assessments: ${assessmentCount}, failed: ${failed}`, 'Summary')

    return failed
}

function randomMonth(): string {
    return Math.ceil(Math.random() * (12)).toString().padStart(2, '0')
}

function randomDay(): string {
    return Math.ceil(Math.random() * (28)).toString().padStart(2, '0')
}

