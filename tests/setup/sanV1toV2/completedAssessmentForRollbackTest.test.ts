import { test } from 'fixtures'


test('Create probation offenders with completed SAN assessment', async ({ oasys, user, offender, assessment, signing }) => {

    await user.prob.probSanHeadPdu.login()

    for (let i = 1; i <= 5; i++) {

        await offender.createProbFromStandardOffender({ forename1: `CompletedSanForRollback${i}` })
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        await assessment.populateMinimal({ layer: 'Layer 3V2' })

        await signing.signAndLock()
    }

    await user.logout()

})
