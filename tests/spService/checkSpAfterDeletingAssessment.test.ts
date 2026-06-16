import { test } from 'fixtures'


test('Delete an assessment and check the sentence plan', async ({ oasys, user, offender, assessment, signing, sentencePlan }) => {

    await user.prob.probSpHeadPdu.login()

    // Create and complete an assessment with one goal in the sentence plan
    const offender1 = await offender.createProbFromStandardOffender()
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
    await assessment.populateMinimal({ layer: 'Layer 1', sentencePlan: 'spService' })
    await sentencePlan.checkGoalCount(1, 0, 0)
    await signing.signAndLock()

    // Create a second assessment; add a goal
    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
    await sentencePlan.addGoal()
    await sentencePlan.checkGoalCount(2, 0, 0)
    await user.logout()

    // Delete the second assessment
    await user.admin.login(providers.prob.nonSan)
    await offender.searchAndSelect(offender1)
    await assessment.deleteLatest()
    await user.logout()

    // Create a third assessment, check the number of goals
    await user.prob.probSpHeadPdu.login()
    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
    await sentencePlan.checkGoalCount(1, 0, 0)

    await user.logout()

})