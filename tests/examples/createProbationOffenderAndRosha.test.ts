import { test } from 'fixtures'


test('Example test - create a probation offender and RoSHA assessment', async ({ oasys, offender, assessment, signing }) => {

    await oasys.login(oasys.users.probHeadPdu)

    const offender1 = await offender.createProbFromStandardOffender()
    await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

    // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
    await assessment.populateMinimal({ layer: 'Layer 1V2' })
    // await assessment.populateFull({ layer: 'Layer 1V2', maxStrings: false })

    await signing.signAndLock({ expectCsrpScore: true })

    await oasys.logout()

})
