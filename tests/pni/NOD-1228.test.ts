import { test } from 'fixtures'

// Test for incorrect missing questions result in PNI endpoint

test('NOD-1228', async ({ oasys, user, offender, assessment, sections, signing, api, pni }) => {

    await user.prob.probHeadPdu.login()

    // Offender 1
    const offender1 = await offender.createProbFromStandardOffender()

    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No' })

    await sections.section6.goto()
    await sections.section6.o6_1.setValue('Missing')

    await signing.signAndLock({ page: 'spService' })

    await pni.checkAssessmentCalc(offender1.probationCrn, pk1)
    const failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, true)
    expect(failed).toBeFalsy()

    await user.logout()
})
