import { test } from 'fixtures'

test('Create probation offender and CSRP', async ({ api, user, offender, ogrs }) => {

    await user.prob.probHeadPdu.login()

    const offender1 = await offender.createProbFromStandardOffender()
    await offender.standaloneCsrp.populateMinimal()
    await offender.standaloneCsrp.populateMinimalDynamic()
    await offender.standaloneCsrp.o8_1.setValue('Yes')
    await offender.standaloneCsrp.kCurrent.setValue('Occasional')
    await offender.standaloneCsrp.o8_1.setValue('No')
    await offender.standaloneCsrp.calculateScores.click()
    await offender.standaloneCsrp.close.click()

    await ogrs.checkOgrsInStandaloneCsrp(offender1.probationCrn)
    const failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, false)
    expect(failed).toBeFalsy()

    await user.logout()
})