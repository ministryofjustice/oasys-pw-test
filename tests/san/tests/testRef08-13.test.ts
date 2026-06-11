import { test } from 'fixtures'
import { testRef8 } from './testParts/testRef08'
import { testRef9 } from './testParts/testRef09'
import { testRef10 } from './testParts/testRef10'
import { testRef11 } from './testParts/testRef11'
import { testRef12 } from './testParts/testRef12'
import { testRef13 } from './testParts/testRef13'

const offender1: OffenderDef = {

    forename1: 'TestRefEight',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}
const pks: number[] = []

test.describe.serial('Test refs 8 to 13', async () => {

    test('Create offender', async ({ oasys, user, cms, offender }) => {

        await user.prob.probSanUnappr.login()
        await offender.createProb(offender1)
        await user.logout()

        await user.prob.probHeadPdu.login()
        await cms.addProbationOffenderToStub(offender1)
        await user.logout()
    })

    testRef8(offender1, pks)
    testRef9(offender1, pks)
    testRef10(offender1, pks)
    testRef11(offender1, pks)
    testRef12(offender1, pks)
    testRef13(offender1, pks)
})