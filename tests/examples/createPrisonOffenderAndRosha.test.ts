
import { test } from 'fixtures'


test('Example test - create a prison offender and RoSHA assessment', async ({ oasys, offender, assessment, signing }) => {

    await oasys.login(oasys.users.prisHomds)

    await offender.createPrisFromStandardOffender()
    await assessment.createPris({ purposeOfAssessment: 'Risk of Harm Assessment' })

    // Use one of the following two lines to populate the assessment.  maxStrings paramater can be set to populate text fields to maximum length
    // await assessment.populateMinimal({ layer: 'Layer 1V2', provider: 'pris' })
    await assessment.populateFull({ layer: 'Layer 1V2', provider: 'pris', maxStrings: false })

    await signing.signAndLock({ expectCsrpScore: true })

    await oasys.logout()

})