import { test } from 'fixtures'


test('Example test - create a prison offender and a layer 1 assessment using new SP service', async ({ oasys, user, offender, assessment, signing }) => {

    await user.pris.prisSpHomds.login()

    await offender.createPrisFromStandardOffender()
    await assessment.createPris({ purposeOfAssessment: 'Transfer in from non England / Wales Court', assessmentLayer: 'Basic (Layer 1)' })

    // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
    await assessment.populateMinimal({ layer: 'Layer 1', provider: 'pris', sentencePlan: 'spService' })
    // await oasys.Populate.fullyPopulated({layer: 'Layer 1',provider: 'pris',  sentencePlan: 'SpService' , maxStrings: false })

    await signing.signAndLock()

    await user.logout()

})