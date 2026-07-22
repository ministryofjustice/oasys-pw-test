import { test } from 'fixtures'


test('Create assessments and check SNS messages - SAN assessment, countersigning required', async ({ oasys, user, offender, assessment, sns, signing, sections, risk, san, sentencePlan }) => {

    // Create an offender with minimally complete layer 3.2
    await user.prob.probSanUnappr.login()
    const offender1 = await offender.createProbFromStandardOffender()

    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await sections.offendingInformation.populateMinimal()
    await sections.predictors.populateMinimal()
    await san.populateMinimal()

    // Set to high risk to get countersigner
    await risk.populateWithSpecificRiskLevel('High')

    // Complete SP
    await sentencePlan.populateMinimal()

    // Sign assessment and send for countersigning, then check SNS messages
    await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersigner: user.prob.probSanHeadPdu })
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
    await user.logout()

    // Countersign assessment then check SNS messages again
    await user.prob.probSanHeadPdu.login()

    await offender.searchAndSelect(offender1)
    await assessment.openLatest()
    await signing.countersign({ page: 'spService', comment: 'Test comment' })

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])
    await user.logout()

    // Create another assessment, this one with OPD override and RSR
    await user.prob.probSanUnappr.login()
    await oasys.history(offender1)

    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    await sections.predictors.goto()
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({ days: -10 })
    await assessment.summarySheet.goto()
    await assessment.summarySheet.opdOverride.setValue('Yes')
    await assessment.summarySheet.opdOverrideReason.setValue('Testing')

    // Sign assessment and check SNS messages
    await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersigner: user.prob.probSanHeadPdu })
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
    await user.logout()

    // Countersign assessment then check SNS messages again
    await user.prob.probSanHeadPdu.login()
    await signing.countersign({ offender: offender1, comment: 'Test comment' })

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OPD'])
    await user.logout()

})
