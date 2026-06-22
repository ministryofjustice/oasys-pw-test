import { test } from 'fixtures'

/**
 * Tests all endpoints against one or more specific oasys.Offender.
 */

const testCases = [
    ['ZABUOBO', null],    // fully populated L3/L1v2/L1v1
    ['H923484', null],    // SARA
    ['X450397', null],    // SUM
    ['ZLHECUL', null],       // OASys-SP layer 1
    ['ZUHJFAA', null],      // SAN assessments
    ['X743137', null],
    ['ZWMCLZB', null],      // Obscure PNI defect (NOD-1284)

    // Pre-prod cases for PNI
    // ['V217229', ''],
    // ['A9029EY', ''],
    // ['E591983', ''],
    // ['E445066', ''],
    // ['E475550', ''],
    // ['T027274', ''],
    // ['E496953', ''],
    // ['E050428', ''],
    // ['E506857', ''],
    // ['E599091', ''],
    // ['E716844', ''],
    // ['E679100', ''],  // This one is still an issue in release 7.9
    // ['S016052', ''],
    // ['A2144FH', ''],
]

const limitEndpoints: Endpoint[] = []
// const limitEndpoints: Endpoint[] = ['pni']

const excludeEndpoints: Endpoint[] = []
// const excludeEndpoints: Endpoint[] = ['pni']

test('All endpoint regression tests - extra test for specific cases', async ({ api }) => {

    let failed = false
    let count = 1

    for (const offender of testCases) {
        console.log(`Offender ${count++}: ${offender[0]} / ${offender[1]}`)

        if (offender[0] != null) {  // call with probation CRN
            const offenderFailed = await api.testOneOffender(offender[0], 'prob', false, true, limitEndpoints, excludeEndpoints)
            if (offenderFailed) {
                console.log('Failed')
                failed = true
            }
        }
        if (offender[1] != null) {  // call with NomisId
            const offenderFailed = await api.testOneOffender(offender[1], 'pris', offender[0] != null, true, limitEndpoints, excludeEndpoints)  // skipPrisSubsequents if already done for prob crn
            if (offenderFailed) {
                console.log('Failed')
                failed = true
            }
        }
    }

    expect(failed).toBeFalsy()
})
