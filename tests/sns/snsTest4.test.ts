import { test } from 'fixtures'


test('Create assessments and check SNS messages - SAN assessment, no countersigning required', async ({ oasys, user, offender, assessment, sns, signing, sections, sentencePlan, san, risk }) => {

    // Create an offender with minimally complete layer 3.2
    await user.prob.probSanHeadPdu.login()
    const offender1 = await offender.createProbFromStandardOffender()

    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await sections.offendingInformation.goto()
    await sections.offendingInformation.count.setValue(1)
    await sections.offendingInformation.offenceDate.setValue({ months: -6 })

    await sections.predictors.goto(true)
    await sections.predictors.dateFirstSanction.setValue({ years: -2 })
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({})

    await san.populateMinimal()
    await risk.screeningNoRisks()

    // Complete SP
    await sentencePlan.populateMinimal()

    // Sign assessment, then check SNS messages
    await signing.signAndLock({ page: 'spService' })
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

    // Create another assessment (cloning from the one above), this one with OPD override
    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    await assessment.summarySheet.goto()
    await assessment.summarySheet.opdOverride.setValue('Yes')
    await assessment.summarySheet.opdOverrideReason.setValue('Testing')

    // Sign assessment, then check SNS messages again
    await signing.signAndLock({ page: 'spService' })
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR', 'OPD'])

    await user.logout()
})
