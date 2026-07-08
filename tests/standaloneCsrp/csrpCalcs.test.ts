import { test } from 'fixtures'

test('CSRP calcs', async ({ oasys, user, offender, ogrs }) => {

    await user.prob.probHeadPdu.login()

    log('', 'First CSRP - static only')
    const offender1 = await offender.createProbFromStandardOffender()
    await offender.standaloneCsrp.populateMinimal()
    await offender.standaloneCsrp.calculateScores.click()
    await offender.standaloneCsrp.close.click()

    let ogrsResult = await ogrs.checkOgrsInStandaloneCsrp(offender1.probationCrn)
    expect(ogrsResult.outputParams.OGP2_CALCULATED).toBe('N')

    log('', 'Second CSRP - dynamic (minimal)')
    await offender.standaloneCsrp.goto()
    await offender.standaloneCsrp.populateMinimalDynamic()
    await offender.standaloneCsrp.calculateScores.click()
    await offender.standaloneCsrp.close.click()

    ogrsResult = await ogrs.checkOgrsInStandaloneCsrp(offender1.probationCrn)
    expect(ogrsResult.outputParams.OGP2_CALCULATED).toBe('Y')

    log('', 'Third CSRP - back to static')
    await offender.standaloneCsrp.goto()
    await offender.standaloneCsrp.o1_39.setValue('No')
    await offender.standaloneCsrp.calculateScores.click()
    await offender.standaloneCsrp.close.click()

    ogrsResult = await ogrs.checkOgrsInStandaloneCsrp(offender1.probationCrn)
    expect(ogrsResult.outputParams.OGP2_CALCULATED).toBe('N')

    log('', 'Fourth CSRP - dynamic, no changes')
    await offender.standaloneCsrp.goto()
    await offender.standaloneCsrp.o1_39.setValue('Yes')
    await offender.standaloneCsrp.calculateScores.click()
    await offender.standaloneCsrp.close.click()
    
    ogrsResult = await ogrs.checkOgrsInStandaloneCsrp(offender1.probationCrn)
    expect(ogrsResult.outputParams.OGP2_CALCULATED).toBe('Y')
    
    log('', 'Fifth CSRP - static, 6.7 validation')
    await offender.standaloneCsrp.goto()
    await offender.standaloneCsrp.o1_39.setValue('Yes')
    await offender.standaloneCsrp.o6_7.setValue('Yes')
    await offender.standaloneCsrp.calculateScores.click()
    await oasys.checkErrorMessage('6.7 At least one Victim or Perpetrator question must be answered as Yes')
    await offender.standaloneCsrp.o1_39.setValue('No')
    await offender.standaloneCsrp.calculateScores.click()
    await oasys.checkNoErrorMessage()
    await offender.standaloneCsrp.close.click()

    ogrsResult = await ogrs.checkOgrsInStandaloneCsrp(offender1.probationCrn)
    expect(ogrsResult.outputParams.OGP2_CALCULATED).toBe('N')

    await user.logout()
})