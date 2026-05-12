import { test } from 'fixtures'


test('Example test - create a probation offender and a layer 1 assessment using new SP service', async ({ oasys, offender, assessment, signing, api, sns, ogrs }) => {

    await oasys.login(oasys.users.probSpHeadPdu)

    const offender1 = await offender.createProbFromStandardOffender()
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })

    // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
    await assessment.populateMinimal({ layer: 'Layer 1', sentencePlan: 'spService' })
    // await oasys.Populate.fullyPopulated({layer: 'Layer 1', maxStrings: false })

    await signing.signAndLock()

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment')
    await api.testOneOffender(offender1.probationCrn, 'prob', false, false)
    await ogrs.checkOgrsInOasysSet(pk1)

    await oasys.logout()

})