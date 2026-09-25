import { test } from 'fixtures'


test('Example test - create a probation offender and a layer 1 assessment - minimally populated', async ({ user, offender, assessment, signing, api, sns, ogrs, sections }) => {

    await user.prob.probHeadPdu.login()

    const offender1 = await offender.createProbFromStandardOffender()
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })

    await assessment.populateMinimal({ layer: 'Layer 1', probationCrn: offender1.probationCrn })

    const failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, true)
    expect(failed).toBeFalsy()
    await ogrs.checkOgrsInOasysSet(pk1)

    await user.logout()

})

test('Example test - create a probation offender and a layer 1 assessment - fully populated', async ({ user, offender, assessment, signing, api, sns, ogrs }) => {

    await user.prob.probHeadPdu.login()

    const offender1 = await offender.createProbFromStandardOffender()
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })

    await assessment.populateFull({ layer: 'Layer 1', probationCrn: offender1.probationCrn })
    await signing.signAndLock()

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])
    const failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, false)
    expect(failed).toBeFalsy()
    await ogrs.checkOgrsInOasysSet(pk1)

    await user.logout()

})