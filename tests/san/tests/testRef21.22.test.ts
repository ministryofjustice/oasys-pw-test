import { test } from 'fixtures'
import { testRef21CreateAssessments } from './testParts/testRef21CreateAssessments'
import { testRef21Merge } from './testParts/testRef21Merge'
import { testRef22 } from './testParts/testRef22'

const offender1: OffenderDef = {

    forename1: 'TestTwentyOneOffenderOne',
    gender: 'Male',
    dateOfBirth: { years: -20 },
    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -6 },
        },
        offences:
        {
            offence: '028',
            subcode: '01',
        },
    },
}

const offender2: OffenderDef = {

    forename1: 'TestTwentyOneOffenderTwo',
    gender: 'Male',
    dateOfBirth: { years: -20 },
    event: {
        eventDetails: {
            sentenceType: 'Fine',
            sentenceDate: { months: -1 },
        },
        offences:
        {
            offence: '030',
            subcode: '01',
        },
    },
}
const offender1Pks: number[] = []
const offender2Pks: number[] = []

/**
    MERGE -1st offender just has ONE 3.1 assessment (created before the 2nd offender's assessments).  
    2nd offender has combination of assessments (L1, 3.1 and 3.2).  
    They merge - check the merge API sends the parameters correctly.  
    Check the NEW OASYS_SET records have the 'clone from' field updated to the newly created OASYS_SET records.
 */
test.describe.serial('Test refs 21 and 22', async () => {

    test('Create offenders', async ({ oasys, user, cms, offender }) => {

        await user.prob.probHeadPdu.login()
        await offender.createProb(offender1)
        await user.logout()

        await user.prob.probSanHeadPdu.login()
        await offender.createProb(offender2)
        await user.logout()

        await user.prob.probHeadPdu.login()
        await cms.addProbationOffenderToStub(offender2)
        await user.logout()

    })

    testRef21CreateAssessments(offender1, offender2, offender1Pks, offender2Pks)
    testRef21Merge(offender1, offender2, offender2Pks)
    testRef22(offender1, offender2, offender2Pks)
})