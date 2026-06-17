import { test } from 'fixtures'

test('Cloning test - current period of supervision', async ({ oasys, user, offender, assessment, sections, signing }) => {

    await user.prob.probHeadPdu.login()

    const offender1 = await offender.createProbFromStandardOffender()
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No' })
    await signing.signAndLock({ expectRsrWarning: true })

    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
    await sections.section3.goto()
    await sections.section3.identifyIssues.setValue('Second assessment section 3 issues')
    await signing.signAndLock({ page: 'spService', expectRsrWarning: true })

    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
    await sections.section4.goto()
    await sections.section4.identifyIssues.setValue('Third assessment section 4 issues')
    await signing.signAndLock({ page: 'spService', expectRsrWarning: true })

    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
    await signing.signAndLock({ page: 'spService' })

    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
    await signing.signAndLock({ page: 'spService' })

    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Basic (Layer 1)' })
    await signing.signAndLock({ page: 'spService' })

    await oasys.history(offender1)
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await sections.section3.goto()
    await sections.section3.identifyIssues.checkValue('Second assessment section 3 issues')
    await sections.section4.goto()
    await sections.section4.identifyIssues.checkValue('Third assessment section 4 issues')

    await user.logout()
})