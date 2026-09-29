import { test } from 'fixtures'


test('NOD-xxx 6.8 null', async ({ user, offender, assessment, sections, api, ogrs }) => {

    await user.prob.probHeadPdu.login()

    const offender1 = await offender.createProbFromStandardOffender()
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })

    await assessment.populateMinimal({ layer: 'Layer 1', probationCrn: offender1.probationCrn })

    await sections.predictorQuestions.goto()
    await sections.predictorQuestions.o6_4.setValue('2-Significant problems')
    await sections.predictorQuestions.o6_8.setValue(null)
    await sections.predictorQuestions.save()
    const failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, false)
    expect(failed).toBeFalsy()
    await ogrs.checkOgrsInOasysSet(pk1)

    await user.logout()

})
