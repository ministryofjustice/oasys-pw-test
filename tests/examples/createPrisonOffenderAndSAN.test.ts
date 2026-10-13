import { test } from 'fixtures'


test('Example test - create a prison offender and a SAN 3.2 assessment', async ({ oasys, user, offender, assessment, signing }) => {

    await user.pris.prisSanHomds.login()
    sanMode = 'custody'
    const offender1 = await offender.createPrisFromStandardOffender()
    await assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await assessment.populateMinimal({ layer: 'Layer 3V2' })

    await signing.signAndLock()

    await user.logout()

})
