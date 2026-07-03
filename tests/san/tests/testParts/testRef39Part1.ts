import { test } from 'fixtures'
import { MergeTestData } from '../testRef39.40.test'
import * as testData from '../../data/mergeTest'

export function createOffendersAndAssessments(mergeTestData: MergeTestData) {

    test('Merge tests part 1 - create and complete 3.2 assessment on offender 1', async ({ oasys, user, offender, assessment, signing, sections, san, risk, sentencePlan, sns }) => {

        log('Merge tests part 1 - create and complete 3.2 assessment on offender 1', 'Test step')

        await user.prob.probSanHeadPdu.login()
        await offender.createProb(mergeTestData.offender1)

        // Create assessment
        const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        mergeTestData.offender1Pks.push(pk1)

        // Complete section 1
        await sections.offendingInformation.goto()
        await sections.offendingInformation.offence.setValue('030')
        await sections.offendingInformation.subcode.setValue('01')
        await sections.offendingInformation.count.setValue(1)
        await sections.offendingInformation.offenceDate.setValue({ months: -6 })
        await sections.offendingInformation.sentence.setValue('Fine')
        await sections.offendingInformation.sentenceDate.setValue({ months: -1 })

        await sections.predictors.goto(true)
        await sections.predictors.dateFirstSanction.setValue({ years: -2 })
        await sections.predictors.o1_32.setValue(2)
        await sections.predictors.o1_40.setValue(0)
        await sections.predictors.o1_29.setValue({ months: -1 })
        await sections.predictors.o1_30.setValue('No')
        await sections.predictors.o1_38.setValue({})

        await san.gotoSan()
        await san.populateSanSections('Merge test', testData.sanPopulation, true)
        await san.returnToOASys()

        await risk.screeningNoRisks(true)

        // Complete SP, then sign and lock
        await sentencePlan.populateMinimal()
        await signing.signAndLock({ page: 'spService' })
        await sns.testSnsMessageData(mergeTestData.offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

        log('Merge tests part 2 - create and complete two 3.2 assessments on offender 2, delete the second', 'Test step')
        await offender.createProb(mergeTestData.offender2)

        // Create assessment
        const pk2 = await assessment.createProb({ purposeOfAssessment: 'Start of Suspended Sentence Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        mergeTestData.offender2Pks.push(pk2)

        // Complete section 1
        await sections.offendingInformation.goto()
        await sections.offendingInformation.offence.setValue('030')
        await sections.offendingInformation.subcode.setValue('01')
        await sections.offendingInformation.count.setValue(1)
        await sections.offendingInformation.offenceDate.setValue({ months: -6 })
        await sections.offendingInformation.sentence.setValue('Fine')
        await sections.offendingInformation.sentenceDate.setValue({ months: -1 })

        await sections.predictors.goto(true)
        await sections.predictors.dateFirstSanction.setValue({ years: -2 })
        await sections.predictors.o1_32.setValue(2)
        await sections.predictors.o1_40.setValue(0)
        await sections.predictors.o1_29.setValue({ months: -1 })
        await sections.predictors.o1_30.setValue('No')
        await sections.predictors.o1_38.setValue({})

        await san.gotoSan()
        await san.populateSanSections('Merge test', testData.sanPopulation, true)
        await san.populateSanSections('Merge test', testData.modifySanForAssessment2, true)
        await san.returnToOASys()

        await risk.screeningNoRisks(true)

        // Complete SP, then sign and lock
        await sentencePlan.populateMinimal()

        await signing.signAndLock({ page: 'spService' })
        await sns.testSnsMessageData(mergeTestData.offender2.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

        // Deleted assessment added for testing of SAN defect ARN-2427
        await oasys.history(mergeTestData.offender2)
        const pk3 = await assessment.createProb({ purposeOfAssessment: 'Review' })
        mergeTestData.offender2Pks.push(pk3)
        await user.logout()

        await user.admin.login(providers.prob.san)
        await offender.searchAndSelectByPnc(mergeTestData.offender2.pnc)
        await assessment.deleteLatest()

        await user.logout()
    })
}