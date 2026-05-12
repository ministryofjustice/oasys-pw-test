import { test } from 'fixtures'


test('Example test - create a probation offender and a layer 3 assessment plus SARA', async ({ oasys, offender, assessment, sections, sara, risk, sentencePlan, signing }) => {

    await oasys.login(oasys.users.probSpHeadPdu)

    const offender1 = await offender.createProbFromStandardOffender()
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    await sections.offendingInformation.populateMinimal()
    await sections.predictors.populateMinimal()
    await sections.sections2To13NoIssues({ populate6_11: 'No' })
    await sections.selfAssessmentForm.populateMinimal()
    await risk.screeningNoRisks()
    await sections.section2.goto()
    await sections.section2.o2_3PhysicalViolence.setValue(true)
    await sections.section2.save.click()

    await risk.screeningSection5.goto()
    await oasys.clickButton('Next')
    await oasys.clickButton('Create')

    await sara.populate('Low', 'Low')
    await sara.signAndLock()

    await oasys.history(offender1.surname, offender1.forename1, 'Start of Community Order')
    await sentencePlan.populateMinimal()
    await signing.signAndLock({ expectRsrWarning: true })

    await oasys.logout()
})
