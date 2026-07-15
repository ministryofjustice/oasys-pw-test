import { test } from 'fixtures'


test('Example test - create a prison offender and a SAN 3.2 assessment', async ({ oasys, user, offender, assessment, signing }) => {

    await user.prob.probSanHeadPdu.login()

    const offender1 = await offender.createProbFromStandardOffender({type: 'sexual'})
    // await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    // // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
    // await assessment.populateMinimal({ layer: 'Layer 3V2' })
    // // await oasys.Populate.fullyPopulated({layer: 'Layer 1',provider: 'pris',  sentencePlan: 'SpService' , maxStrings: false })

    // await signing.signAndLock()

    await user.logout()

})
