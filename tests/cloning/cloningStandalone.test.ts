import { test } from 'fixtures'

test('Cloning test - standalone CSRP', async ({ oasys, user, offender, assessment, sections, risk, signing }) => {

    await user.prob.probHeadPdu.login()

    const offender1 = await offender.createProbFromStandardOffender()

    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No' })

    await sections.section2.goto()
    await sections.section2.o2_2Weapon.setValue('Yes')
    await sections.section2.o2_2SpecifyWeapon.setValue('L3 weapon')

    await sections.section3.goto()
    await sections.section3.o3_4.setValue('1-Some problems')

    await risk.screeningSection2to4.goto()
    await risk.screeningSection2to4.r2_3.setValue('No')
    await risk.screeningSection2to4.rationale.setValue('Rationale')

    await signing.signAndLock({ page: 'spService' })

    await oasys.history(offender1)
    await offender.standaloneCsrp.goto()
    await offender.standaloneCsrp.o1_8Age.checkValue('23')
    await offender.standaloneCsrp.o1_32.checkValue(2)
    await offender.standaloneCsrp.o1_40.checkValue(0)

    await offender.standaloneCsrp.o1_32.setValue(5)
    await offender.standaloneCsrp.o1_40.setValue(4)
    await offender.standaloneCsrp.o1_29.setValue({ months: -1 })
    await offender.standaloneCsrp.o1_38.setValue({ days: -7 })
    await offender.standaloneCsrp.o1_30.setValue('No')
    await offender.standaloneCsrp.o1_39.setValue('No') // Offender interview

    await offender.standaloneCsrp.calculateScores.click()
    await offender.standaloneCsrp.close.click()

    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await sections.predictors.goto()
    await sections.predictors.o1_32.checkValue(5)
    await sections.predictors.o1_40.checkValue(4)

    await sections.section2.goto()
    await sections.section2.o2_2Weapon.checkValue('Yes')
    await sections.section2.o2_2SpecifyWeapon.checkValue('L3 weapon')

    await sections.section3.goto()
    await sections.section3.o3_4.checkValue('1-Some problems')

    await user.logout()
})