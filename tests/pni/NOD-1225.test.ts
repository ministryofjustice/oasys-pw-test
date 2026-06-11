import { test } from 'fixtures'


// Offender has a completed assessment and incomplete SARA (rejected at S/L) with high/medium

test('NOD-1225', async ({ oasys, user, offender, assessment, sections, risk, sara, sentencePlan, signing, api, pni }) => {

    await user.prob.probHeadPdu.login()

    // Offender 1
    const offender1 = await offender.createProbFromStandardOffender()

    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await assessment.populateMinimal({ populate6_11: 'No', layer: 'Layer 3', sentencePlan: 'isp' })

    // Set 6.7 to trigger the SARA
    await sections.section6.goto()
    await sections.section6.o6_7.setValue('Yes')
    await sections.section6.o6_7PerpetratorFamily.setValue('No')
    await sections.section6.o6_7PerpetratorPartner.setValue('Yes')
    await sections.section6.o6_7VictimFamily.setValue('No')
    await sections.section6.o6_7VictimPartner.setValue('No')

    await risk.screeningSection2to4.goto()
    await risk.screeningSection2to4.r2_3.setValue('No')
    await risk.screeningSection2to4.rationale.setValue('because')

    await oasys.clickButton('Next')
    await oasys.clickButton('Create')

    // Create the SARA and populate the risk flags
    await sara.sara.goto()
    await sara.sara.riskOfViolencePartner.setValue('High')
    await sara.sara.riskOfViolenceOthers.setValue('Medium')
    await oasys.clickButton('Save')

    await oasys.clickButton('Close')

    // Complete the assessment and reject the SARA
    await sentencePlan.ispSection52to8.populateMinimal()
    await oasys.clickButton('Sign & Lock')
    await oasys.clickButton('Continue with Signing')
    await signing.signingStatus.noSaraReason.setValue('There was no suitably trained assessor available')
    await oasys.clickButton('Continue with Signing')
    await oasys.clickButton('Confirm Sign & Lock')

    await pni.checkAssessmentCalc(offender1.probationCrn, pk1)
    const failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, true)
    expect(failed).toBeFalsy()

    await user.logout()
})