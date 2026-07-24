import { test } from 'fixtures'

/**
 * Tests all endpoints against one or more specific oasys.Offender.
 */

const testCases = [
    // ['ZABUOBO', null],    // fully populated L3/L1v2/L1v1
    // ['H923484', null],    // SARA
    // ['X450397', null],    // SUM
    // ['ZLHECUL', null],       // OASys-SP layer 1
    // ['ZUHJFAA', null],      // SAN assessments
    // ['X743137', null],
    ['ZWMCLZB', null],      // Obscure PNI defect (NOD-1284)

    // Pre-prod cases for PNI
    // ['V217229', null],
    // ['E445066', null],
    // ['E475550', null],
    // ['T027274', null],
    // ['E496953', null],
    // ['E050428', null],
    // ['E506857', null],
    // ['E599091', null],
    // ['E716844', null],
    // ['E679100', null],          // NOD-1284
    // [null, 'A9029EY'],          //  (case raised by John for NOD-1196)
    // ['E591983', null],          //  - 1.30 not reported missing
    // ['S016052', null],          //  - 1.30 not reported missing
    // [null, 'A2144FH'],          //  - 1.30 not reported missing
    // ['E776521', null],          //  OGP2 status defect NOD-1313
    // ['R414385', null],
]

// const limitEndpoints: Endpoint[] = []
const limitEndpoints: Endpoint[] = ['pni']

const excludeEndpoints: Endpoint[] = []
// const excludeEndpoints: Endpoint[] = ['pni']

test('All endpoint regression tests - extra test for specific cases', async ({ api }) => {

    let failed = 0
    let count = 1

    for (const offender of testCases) {
        console.log(`Offender ${count++}: ${offender[0]} / ${offender[1]}`)

        if (offender[0] != null) {  // call with probation CRN
            const offenderFailed = await api.testOneOffender(offender[0], 'prob', false, true, limitEndpoints, excludeEndpoints)
            if (offenderFailed) {
                console.log('Failed')
                failed++
            }
        }
        if (offender[1] != null) {  // call with NomisId
            const offenderFailed = await api.testOneOffender(offender[1], 'pris', offender[0] != null, true, limitEndpoints, excludeEndpoints)  // skipPrisSubsequents if already done for prob crn
            if (offenderFailed) {
                console.log('Failed')
                failed++
            }
        }
    }

    expect(failed).toBe(0)
})
