import * as fs from 'fs-extra'

import { test } from 'fixtures'

const count = 50000

test('OGRS rescoring (LIC) datafix test', async ({ ogrs, oasysDb }) => {
    
    test.setTimeout(0)

    const inputTableQuery = `select cms_prob_number, oasys_set_pk from eor.df453_input_predictors_lic 
                                        where oasys_set_pk is null
                                        order by df453_input_predictors_pk desc
                                        fetch first ${count} rows only`

    const inputs = await oasysDb.getData(inputTableQuery)

    let failed = 0

    for (let i = 0; i <= inputs.length - 1; i++) {

        if (i%1000 == 0) {
            console.log(i)
        }
        const probationCrn = inputs[i][0]
        const assessmentPk = utils.stringToInt(inputs[i][1])

        const offenderQuery = `select offender_pk from eor.offender where cms_prob_number = '${probationCrn}'`
        const offenderPk = await oasysDb.getSingleNumericValue(offenderQuery)
        const testCase = await ogrs.rescoringLic.getRescoreOffender(offenderPk, probationCrn)

        if (
            (testCase.assessments.length > 0 && !assessmentPk)
            || (assessmentPk && testCase.assessments.length == 0)
            || assessmentPk != testCase.assessments[0]?.assessmentPk
        ) {
            log(`offender ${i}: pk: ${offenderPk}, crn: ${probationCrn}, assessment: ${assessmentPk}`)
            log(JSON.stringify(testCase))
            failed++
            console.log(`offender ${i} failed: pk: ${offenderPk}, crn: ${probationCrn}, assessment: ${assessmentPk}`)
        } else {
            // log(`offender ${i}: matched`)
        }
    }

    expect(failed).toBe(0)
})

