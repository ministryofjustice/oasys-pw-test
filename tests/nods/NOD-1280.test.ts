import { test } from 'fixtures'


test('NOD-1280: Final Third Suspension', async ({ oasys, sections, user, offender, assessment, risk, signing, sentencePlan }) => {

    await user.prob.probHeadPdu.login()
    const offender1 = await offender.createProbFromStandardOffender()

    // Standalone unpaid work - no SP required
    await assessment.createProb({ purposeOfAssessment: 'Standalone Unpaid Work', assessmentLayer: 'Basic (Layer 1)' })
    await sections.populateMinimal({ layer: 'Layer 1' })
    await risk.screeningNoRisks()
    await signing.signAndLock({ page: 'spService' })
    
    // Final third suspension - no SP required
    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Final Third Suspension', assessmentLayer: 'Basic (Layer 1)' })
    await signing.signAndLock({ page: 'spService' })
    
    // Other assessment - error at sign and lock
    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
    await sentencePlan.sentencePlanService.goto()
    await sentencePlan.sentencePlanService.signAndLock.click()
    await signing.checkSingleSignAndLockError(`The Sentence Plan has NOT been agreed. Please press 'Return to Assessment' and navigate back to the 'Sentence Plan Service' to complete and agree the plan.`, true)
})

