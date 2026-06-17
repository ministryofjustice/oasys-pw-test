import { test } from 'fixtures'
import { testRef3 } from './testParts/testRef3'
import { testRef4 } from './testParts/testRef4'

const offender1: OffenderDef = {
    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -25 },

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

const pks: { [key: number]: number } = {}

test.describe.serial('OGRS regression test refs 3 and 4', async () => {

    test('Create offender', async ({ oasys, user, offender }) => {

        await user.prob.probHeadPdu.login()
        await offender.createProb(offender1)
        await user.logout()
    })

    testRef3(offender1, pks)
    testRef4(offender1, pks)
})