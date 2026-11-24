import { test } from 'fixtures'


test('Create probation offenders with deleted WIP SAN assessment', async ({ oasys, user, offender, assessment, signing }) => {

    for (let i = 1; i <= 5; i++) {

        await user.prob.probSanHeadPdu.login()
        const offender1 = await offender.createProbFromStandardOffender({ forename1: `DeletedWipForRollback${i}` })
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        await assessment.populateMinimal({ layer: 'Layer 3V2' })

        await user.logout()
        await user.admin.login(providers.prob.san)
        await offender.searchAndSelectByCrn(offender1.probationCrn)
        await assessment.deleteLatest()
        await user.logout()

    }
})
