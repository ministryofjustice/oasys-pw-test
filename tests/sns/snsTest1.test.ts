import { test } from 'fixtures'


test.describe('Create assessments and check SNS messages - layer 3', () => {

    test('No countersigning required', async ({ oasys, user, offender, assessment, sns, signing, sections }) => {

        // Create an offender with minimally complete layer 3
        await user.prob.probHeadPdu.login()

        const offender1 = await offender.createProbFromStandardOffender()

        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
        await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No', probationCrn: offender1.probationCrn })

        // Sign assessment, then check SNS messages
        await signing.signAndLock()
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR', 'TierRiskFlag'])

        // Create another assessment (cloning from the one above), this one with OPD override and RSR
        await oasys.history(offender1)
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        await sections.predictors.goto()
        await sections.predictors.o1_30.setValue('No')
        await sections.predictors.o1_29.setValue({ months: -1 })
        await sections.predictors.o1_38.setValue({ days: -10 })
        await assessment.summarySheet.goto()
        await assessment.summarySheet.opdOverride.setValue('Yes')
        await assessment.summarySheet.opdOverrideReason.setValue('Testing')

        // Sign assessment, then check SNS messages again
        await signing.signAndLock({ page: 'spService' })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR', 'OPD'])
        await user.logout()

    })

    test('Countersigning required', async ({ oasys, user, offender, assessment, sns, signing, risk, sentencePlan, sections }) => {

        // Create an offender with minimally complete layer 3 to get OGRS and RSR
        await user.prob.probPso.login()
        const offender1 = await offender.createProbFromStandardOffender()

        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
        await sections.offendingInformation.populateMinimal()
        await sections.predictors.populateMinimal()
        await sections.saveAndCheckSns(offender1.probationCrn, false, true)
        await sections.sections2To13NoIssues({ populate6_11: 'No', probationCrn: offender1.probationCrn })
        await sections.selfAssessmentForm.populateMinimal()

        // Set to High risk to get countersigner
        await risk.populateWithSpecificRiskLevel('High', offender1.probationCrn)
        await sentencePlan.populateMinimal()

        // Sign assessment and send for countersigning, then check SNS messages
        await signing.signAndLock({ expectCountersigner: true, countersigner: user.prob.probHeadPdu })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
        await user.logout()

        // Countersign assessment then check SNS messages again
        await user.prob.probHeadPdu.login()
        await signing.countersign({ offender: offender1, comment: 'Test comment' })

        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])
        await user.logout()

        // Create another assessment, this one with OPD override and RSR
        await user.prob.probPso.login()
        await oasys.history(offender1)

        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

        await sections.predictors.goto()
        await sections.predictors.o1_30.setValue('No')
        await sections.predictors.o1_29.setValue({ months: -1 })
        await sections.predictors.o1_38.setValue({ days: -5 })
        await sections.saveAndCheckSns(offender1.probationCrn, false, true)
        await assessment.summarySheet.goto()
        await assessment.summarySheet.opdOverride.setValue('Yes')
        await assessment.summarySheet.opdOverrideReason.setValue('Testing')

        // Sign assessment and check SNS messages
        await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersigner: user.prob.probHeadPdu })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
        await user.logout()

        // Countersign assessment then check SNS messages again
        await user.prob.probHeadPdu.login()
        await signing.countersign({ offender: offender1, comment: 'Test comment' })

        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OPD'])
        await user.logout()

    })
})