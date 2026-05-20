import { test } from 'fixtures'


test('Delete an assessment and check the sentence plan', async ({ oasys, offender, assessment, signing, sentencePlan }) => {

    await oasys.login(oasys.users.probSpHeadPdu)

    // Create and complete an assessment with one goal in the sentence plan
    const offender1 = await offender.createProbFromStandardOffender()
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
    await assessment.populateMinimal({ layer: 'Layer 1', sentencePlan: 'spService' })
    await sentencePlan.spService.checkGoalCount(1, 0, 0)
    await signing.signAndLock()

    // Create a second assessment; add a goal
    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
    await sentencePlan.spService.addGoal()
    await sentencePlan.spService.checkGoalCount(2, 0, 0)
    await oasys.logout()

    // Delete the second assessment
    await oasys.login(oasys.users.admin, oasys.users.probationNonSan)
    await offender.searchAndSelect(offender1)
    await assessment.deleteLatest()
    await oasys.logout()

    // Create a third assessment, check the number of goals
    await oasys.login(oasys.users.probSpHeadPdu)
    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
    await sentencePlan.spService.checkGoalCount(1, 0, 0)

    await oasys.logout()

})