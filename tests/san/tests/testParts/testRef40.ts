import { test } from 'fixtures'
import { MergeTestData } from '../testRef39.40.test'

export function demergeAndCheckOffenders(mergeTestData: MergeTestData) {

    test('Merge tests part 5 - demerge offenders', async ({ oasys, user, offender, san, sns }) => {

        await user.admin.login(providers.prob.san)
        await offender.searchAndSelectByPnc(mergeTestData.offender2.pnc)

        await offender.demerge(oasys)
        await sns.testSnsMessageData(mergeTestData.offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])
        await sns.testSnsMessageData(mergeTestData.offender2.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])
        await oasys.clickButton('Close')
        await user.logout()

        await san.queries.checkSanMergeCall(user.admin, 3)  // TODO fix this
    })

    test('Merge tests part 6 - check assessment on offender 1, and create a new one', async ({ oasys, user, offender, assessment, san }) => {

        await user.prob.probSanHeadPdu.login()

        await offender.searchAndSelectByCrn(mergeTestData.offender1.probationCrn)
        await assessment.assessmentsTab.assessments.checkData([{ name: 'purposeOfAssessment', values: ['Start of Community Order (Full) '] }])

        await assessment.openLatest()
        await san.gotoSanReadOnly('Offence analysis')
        await san.checkReadonlyText('Enter a brief description of the current index offence(s)', 'Offence description for assessment 1')
        await san.returnToOASys()
        await oasys.clickButton('Close')

        // Create a new one, check cloning
        if (!appConfig.probForceCrn) {
            // Need to set PNC to avoid error creating assessment
            await offender.offenderDetails.pnc.setValue(mergeTestData.offender1.pnc)
        }
        await assessment.createProb({ purposeOfAssessment: 'Review' })
        await san.gotoSan('Offence analysis')
        await san.checkReadonlyText('Enter a brief description of the current index offence(s)', 'Offence description for assessment 1')
        await san.returnToOASys()
        await user.logout()
    })

    test('Merge tests part 7 - check assessments on offender 2, and create a new one', async ({ oasys, user, offender, assessment, san }) => {

        await user.prob.probSanHeadPdu.login()
        await offender.searchAndSelectByCrn(mergeTestData.offender2.probationCrn)
        await assessment.assessmentsTab.assessments.checkData([{ name: 'purposeOfAssessment', values: ['Review (Full) ', 'Start of Suspended Sentence Order (Full) '] }])

        // Check first assessment
        await assessment.assessmentsTab.assessments.purposeOfAssessment.clickRowContaining('Start of Suspended Sentence Order (Full) ')
        await san.gotoSanReadOnly('Offence analysis')
        await san.checkReadonlyText('Enter a brief description of the current index offence(s)', 'Offence description modified for offender 2')
        await san.returnToOASys()
        await oasys.clickButton('Close')

        // Check second assessment
        await assessment.openLatest()
        await san.gotoSanReadOnly('Offence analysis')
        await san.checkReadonlyText('Enter a brief description of the current index offence(s)', 'Offence description modified for 3rd assessment on merged offender')
        await san.returnToOASys()
        await oasys.clickButton('Close')

        await assessment.createProb({ purposeOfAssessment: 'Review' })
        await san.gotoSan('Offence analysis')
        await san.checkReadonlyText('Enter a brief description of the current index offence(s)', 'Offence description modified for 3rd assessment on merged offender')
        await san.returnToOASys()
        await user.logout()
    })
}