import { test } from 'fixtures'
import { MergeTestData } from '../testRef39.40.test'

export function mergeAndCreateAssessment(mergeTestData: MergeTestData) {

    test('Merge tests part 3 - merge offenders', async ({ page, oasys, user, offender, assessment, tasks, san, sns }) => {

        await user.prob.probSanHeadPdu.login()
        await offender.searchAndSelect(mergeTestData.offender1)

        // Set the PNC to trigger a merge

        await offender.offenderDetails.pnc.setValue(mergeTestData.offender2.pnc)
        page.once('dialog', async (dialog) => {
            await dialog.accept()
        })
        await offender.offenderDetails.save.click()

        await oasys.clickButton('Close')
        await tasks.taskManager.goto()
        await tasks.grantMerge(mergeTestData.offender2.surname)
        // Winner already had the latest assessment, so no new SNS messages
        await sns.checkNoMessagesForAssessment(mergeTestData.offender1Pks[0])
        await sns.checkNoMessagesForAssessment(mergeTestData.offender2Pks[0])

        // Get new assessment PKs
        mergeTestData.crn1AfterMergePks = await assessment.queries.getAllSetPksByProbationCrn(mergeTestData.offender1.probationCrn)
        mergeTestData.crn2AfterMergePks = await assessment.queries.getAllSetPksByProbationCrn(mergeTestData.offender2.probationCrn)
        await san.queries.checkSanMergeCall(user.prob.probSanHeadPdu, 3)  // TODO fix this
        await user.logout()
    })


    test('Merge tests part 4 - create and complete another 3.2 assessment on the merged offender', async ({ oasys, user, offender, assessment, signing, san }) => {

        await user.prob.probSanHeadPdu.login()
        await offender.searchAndSelectByPnc(mergeTestData.offender2.pnc)

        // Create assessment
        const pk1 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        mergeTestData.crn2AfterMergePks.push(pk1)

        await san.gotoSan()
        await san.offenceAnalysis.goto()
        await san.offenceAnalysis.change()
        await san.offenceAnalysis.page1.offenceDescription.setValue('Offence description modified for 3rd assessment on merged offender')
        await san.offenceAnalysis.page1.motivations.setValue(['financial'])
        await san.offenceAnalysis.saveAndContinue()
        await san.offenceAnalysis.saveAndContinue()
        await san.offenceAnalysis.markAsComplete()
        await san.returnToOASys()

        // Sign and lock
        await signing.signAndLock({ page: 'spService' })
        await user.logout()
    })
}