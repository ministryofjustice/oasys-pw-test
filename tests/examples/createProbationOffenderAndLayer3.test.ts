import { test } from 'fixtures'


test('Example test - create a probation offender and a layer 3 assessment using new SP service', async ({ oasys, offender, assessment, signing }) => {

    await oasys.login(oasys.users.probSpHeadPdu)

    const offender1 = await offender.createProbFromStandardOffender()
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
    await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No', sentencePlan: 'spService' })
    // await oasys.Populate.fullyPopulated({layer: 'Layer 1', maxStrings: false })

    await signing.signAndLock({ expectRsrWarning: true })

    await oasys.logout()

})