import { test } from 'fixtures'

test('Example test - create a prison offender and a layer 1 assessment', async ({ oasys, offender, assessment, signing, cms }) => {

    await oasys.login(oasys.users.prisSpHomds)

    const offender1 = await offender.createPrisFromStandardOffender()
    await assessment.createPris({ purposeOfAssessment: 'Transfer in from non England / Wales Court', assessmentLayer: 'Basic (Layer 1)' })

    // Use one of the following two lines to populate the assessment.  maxStrings parameter can be set to populate text fields to maximum length
    await assessment.populateMinimal({ layer: 'Layer 1', provider: 'pris' })
    // await oasys.Populate.fullyPopulated({ layer: 'Layer 1', provider: 'pris', maxStrings: true })

    await signing.signAndLock()

    await cms.createDischargeEvent(offender1)
    await oasys.logout()

})
