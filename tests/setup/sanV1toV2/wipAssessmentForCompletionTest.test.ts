import { test } from 'fixtures'


test('Create probation offenders with WIP SAN assessment', async ({ oasys, user, offender, assessment, san }) => {

    test.setTimeout(0)
    await user.prob.probSanHeadPdu.login()

    for (let i = 1; i <= 20; i++) {

        const offender1 = await offender.createProbFromStandardOffender({ forename1: `WipSanForCompletion${i}` })
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        await assessment.populateMinimal({ layer: 'Layer 3V2' })

        await san.gotoSan('Offence analysis')
        await san.offenceAnalysis.backToStart()
        await san.offenceAnalysis.page1.offenceDescription.setValue(`V1 to V2 WIP assessment for offender ${offender1.probationCrn}`)
        await san.offenceAnalysis.saveAndContinue()
        await san.returnToOASys()
        await oasys.clickButton('Close')
    }

    await user.logout()

})
