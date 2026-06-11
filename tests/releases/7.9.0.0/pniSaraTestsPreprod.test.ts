import { test } from 'fixtures'

test('Pre-prod tests for PNI SARA parameters', async ({ api }) => {

    const testCases = [
        // First set return incorrect values for SARA parameters
        ['V217229', null],
        ['E445066', null],
        ['E475550', null],
        ['T027274', null],
        ['E496953', null],
        ['E050428', null],
        ['E506857', null],
        ['E599091', null],
        ['E716844', null],
        ['E679100', null],
        [null, 'A9029EY'],          //  (case raised by John for NOD-1196)
        ['E591983', null],          //  - 1.30 not reported missing
        ['S016052', null],          //  - 1.30 not reported missing
        [null, 'A2144FH'],          //  - 1.30 not reported missing
    ]

    let failed = false
    let count = 1

    for (const offender of testCases) {
        console.log(`Offender ${count++}: ${offender[0]} / ${offender[1]}`)

        if (offender[0] != null) {  // call with probation CRN
            const offenderFailed = await api.testOneOffender(offender[0], 'prob', false, true)
            if (offenderFailed) {
                console.log('Failed')
                failed = true
            }
        }
        if (offender[1] != null) {  // call with NomisId
            const offenderFailed = await api.testOneOffender(offender[1], 'pris', offender[0] != null, true)  // skipPrisSubsequents if already done for prob crn
            if (offenderFailed) {
                console.log('Failed')
                failed = true
            }
        }
    }
    expect(failed).toBeFalsy()
})

