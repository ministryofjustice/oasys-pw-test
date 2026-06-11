import { test } from 'fixtures'

const offender1: OffenderDef = {
    forename1: 'Autotest',
    gender: 'Male',
    dateOfBirth: { years: -35 }

}

test('Create assessments and check SNS messages - RoSHA plus layer 1', async ({ oasys, user, offender, assessment, sns, signing, sections, risk }) => {

    await user.prob.probHeadPdu.login()
    await offender.createProb(offender1)


    // First RoSHA
    await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
    await sections.roshaPredictors.goto()
    await sections.roshaPredictors.offence.setValue('807')
    await sections.roshaPredictors.subcode.setValue('01')
    await sections.roshaPredictors.dateFirstSanction.setValue({ months: -9 })
    await sections.roshaPredictors.o1_32.setValue('3')
    await sections.roshaPredictors.o1_40.setValue(0)
    await sections.roshaPredictors.o1_30.setValue('No')
    await sections.roshaPredictors.o1_29.setValue({ days: -1 })
    await sections.roshaPredictors.o1_38.setValue({ days: -1 })
    await sections.roshaPredictors.save.click()

    await risk.screeningSection1.populateMinimal()
    await oasys.clickButton('Next')
    await risk.screeningSection2to4.r2_3.setValue(`No`)
    await risk.screeningSection2to4.r3_1.setValue(`Don't Know`)
    await risk.screeningSection2to4.r3_2.setValue(`Don't Know`)
    await risk.screeningSection2to4.r3_3.setValue(`Don't Know`)
    await risk.screeningSection2to4.r3_4.setValue(`Don't know`)
    await risk.screeningSection2to4.r4_1.setValue(`Don't Know`)
    await risk.screeningSection2to4.r4_6.setValue(`Don't Know`)
    await risk.screeningSection2to4.r4_4.setValue(`Don't know`)
    await risk.screeningSection2to4.next.click()

    await signing.signAndLock({ expectCsrpScore: true })
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

    // First L1
    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
    await sections.offendingInformation.goto()
    await sections.offendingInformation.count.setValue(1)
    await sections.offendingInformation.offenceDate.setValue({ months: -9 })
    await sections.additionalOffences.goto()
    await sections.additionalOffences.offence.setValue('809')
    await sections.additionalOffences.subcode.setValue('01')
    await sections.additionalOffences.count.setValue(1)
    await sections.additionalOffences.save.click()
    await sections.additionalOffences.close.click()
    await sections.offendingInformation.sentence.setValue('CJA2003 - Community Order')
    await sections.offendingInformation.sentenceDate.setValue({})
    await sections.offendingInformation.courtProximity.setValue('Local Court')
    await sections.offendingInformation.courtName.setValue('Bedford MC')
    await sections.offendingInformation.orderLengthMonths.setValue('12')

    await sections.layer1Section2.populateMinimal()
    await sections.selfAssessmentForm.populateMinimal()

    await signing.signAndLock({ page: 'basic' })
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

})
