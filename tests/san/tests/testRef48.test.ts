import { test } from 'fixtures'

/**
    Offender has a previous historic period of supervision where latest assessment is a 3.1 classic OASys
    Has a current period of supervision where the only assessment is a Layer 1 V1
    Assessor creates a 3.2 assessment - does NOT get asked whether they wish to clone section 3 to 13 and sentence plan question (improved cloning)
 */

test.describe.configure({ retries: 1 })
test('SAN integration - test ref 48', async ({ oasys, user, offender, assessment, sections, signing }) => {

    await user.prob.probSanHeadPdu.login()
    const offender1 = await offender.createProbFromStandardOffender({ forename1: 'TestRefFortyEight' })

    log(`Offender has a previous historic period of supervision where latest assessment is a 3.1 classic OASys`, 'Test step')

    // Create and complete layer 3
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' })
    await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No' })
    await signing.signAndLock()

    // Make historic
    await oasys.history()
    await assessment.markHistoric()

    // Create and complete layer 1
    log(`Has a current period of supervision where the only assessment is a Layer 1 V1`, 'Test step')

    await oasys.clickButton('Close')
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' }, 'No')
    await assessment.populateMinimal({ layer: 'Layer 1' })
    await signing.signAndLock()

    log(`Assessor creates a 3.2 assessment - does NOT get asked whether they wish to clone section 3 to 13 and sentence plan question (improved cloning)`, 'Test step')

    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    // Check that the assessment has created without an additional prompt
    await sections.offenderInformation.checkCurrent()

    await user.logout()
})
