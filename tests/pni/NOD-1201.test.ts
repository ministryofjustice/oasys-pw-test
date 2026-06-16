import { test } from 'fixtures'


// Offender has a completed assessment with 2.3 Physical Violence and not 6.7DA, complete SARA with high/medium
// Second assessment with SARA rejected

test('NOD-1201', async ({ oasys, user, offender, assessment, sections, risk, sara, sentencePlan, signing, api, pni }) => {

    await user.prob.probSpHeadPdu.login()

    // Offender 1
    const offender1 = await offender.createProbFromStandardOffender()

    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await assessment.populateMinimal({ populate6_11: 'No', layer: 'Layer 3' })

    // Set 2.3 to trigger the SARA
    await sections.section2.goto()
    await sections.section2.o2_3PhysicalViolence.setValue(true)
    // 6.7 is set to yes, so have to answer the supplementary questions
    await sections.section6.goto()
    await sections.section6.o6_7PerpetratorFamily.setValue('No')
    await sections.section6.o6_7PerpetratorPartner.setValue('No')
    await sections.section6.o6_7VictimFamily.setValue('Yes')
    await sections.section6.o6_7VictimPartner.setValue('No')
    await risk.screeningSection2to4.goto()

    // Create the SARA fully populate with high/medium risk flags
    await oasys.clickButton('Next')
    await oasys.clickButton('Create')
    await sara.populate('High', 'Medium')
    await oasys.clickButton('Save')
    await oasys.clickButton('Sign & lock')
    await oasys.clickButton('Confirm Sign & Lock')

    // Complete the assessment
    await oasys.history(offender1, 'Start of Community Order')
    await signing.signAndLock({ page: 'spService', expectRsrWarning: true })

    await pni.checkAssessmentCalc(offender1.probationCrn, pk1)

    let failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, true, null, ['pni'])
    expect(failed).toBeFalsy()

    // Create assessment 2
    await oasys.history(offender1)
    const pk2 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })

    // Reject the SARA
    await risk.screeningSection2to4.goto()
    await oasys.clickButton('Next')
    await sara.createSara.cancel.click()
    await sara.reasonNoSara.reason.setValue('There was no suitably trained assessor available')
    await sara.reasonNoSara.ok.click()

    await signing.signAndLock({ page: 'spService', expectRsrWarning: true })
    await pni.checkAssessmentCalc(offender1.probationCrn, pk2)

    failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, true, null, ['pni'])
    expect(failed).toBeFalsy()

    // Create assessment 3
    await oasys.history(offender1)
    const pk3 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })

    // Create the SARA, but clear the risk flags
    await risk.screeningSection2to4.goto()
    await oasys.clickButton('Next')
    await sara.createSara.create.click()
    await sara.sara.goto()
    await sara.sara.riskOfViolencePartner.setValue('')
    await sara.sara.riskOfViolenceOthers.setValue('')
    await sara.sara.save.click()
    await sara.sara.close.click()

    // Complete the assessment, but reject the SARA
    await sentencePlan.sentencePlanService.goto()
    await oasys.clickButton('Sign & Lock')
    await oasys.clickButton('Continue with Signing')
    await signing.signingStatus.noSaraReason.setValue('There was no suitably trained assessor available')
    await oasys.clickButton('Continue with Signing')
    await oasys.clickButton('Confirm Sign & Lock')

    await pni.checkAssessmentCalc(offender1.probationCrn, pk3)
    failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, true)
    expect(failed).toBeFalsy()
    await user.logout()
})