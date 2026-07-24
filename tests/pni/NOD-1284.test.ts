import { chromium, firefox } from '@playwright/test'

import { test } from 'fixtures'
import { AssessmentsTab, OffenderSearch } from 'fixtures/offender/pages'
import { Sara } from 'fixtures/sara/pages'
import { Login } from 'fixtures/user/pages'
import { testEnvironment } from 'localSettings'


test('NOD-1284', async ({ oasys, user, offender, assessment, sections, risk, sara, sentencePlan, signing, api, pni }) => {

    await user.prob.probPso.login()

    const offender1 = await offender.createProbFromStandardOffender()
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await assessment.populateMinimal({ populate6_11: 'No', layer: 'Layer 3' })

    // Set 2.3 to trigger the SARA
    await sections.section2.goto()
    await sections.section2.o2_3PhysicalViolence.setValue(true)
    // 6.7 is set to yes, so have to answer the supplementary questions
    await sections.section6.goto()
    await sections.section6.o6_7PerpetratorFamily.setValue('No')
    await sections.section6.o6_7PerpetratorPartner.setValue('No')
    await sections.section6.o6_7VictimFamily.setValue('Yes')
    await sections.section6.o6_7VictimPartner.setValue('No')
    await risk.screeningSection2to4.goto()

    // Create the SARA and assign to probHeadPdu
    await oasys.clickButton('Next')
    await oasys.clickButton('Create')
    await sara.createAndAssign('BED Default LDU', 'Default Team', user.prob.probHeadPdu)

    // Open the SARA as other user
    const saraBrowser = await chromium.launch()
    const saraContext = await saraBrowser.newContext()
    const saraPage = await saraContext.newPage()
    await saraPage.goto(testEnvironment.url)
    const loginPage = new Login(saraPage)
    await loginPage.username.setValue(user.prob.probHeadPdu.username)
    await loginPage.password.setValue(testEnvironment.standardUserPassword)
    await loginPage.login.click()

    const searchPage = new OffenderSearch(saraPage)
    await searchPage.goto()
    await searchPage.probationCrn.setValue(offender1.probationCrn)
    await searchPage.search.click()
    await searchPage.surnameColumn.clickFirstRow()
    const assessmentsTab = new AssessmentsTab(saraPage)
    await assessmentsTab.assessments.clickNthRow(2)

    const saraAssessment = new Sara(saraPage)
    await saraAssessment.populate('High', 'Medium', true)
    await saraAssessment.save.click()

    // Complete the assessment, rejecting the SARA as it's not yet signed
    await sentencePlan.sentencePlanService.goto()
    await sentencePlan.sentencePlanService.signAndLock.click()
    await oasys.clickButton('Continue with Signing')
    await signing.signingStatus.noSaraReason.setValue('There was no suitably trained assessor available')
    await oasys.clickButton('Continue with Signing')
    await oasys.clickButton('Confirm Sign & Lock')
    await user.logout()

    // Sign the SARA
    await saraAssessment.signAndLock.click()
    await saraAssessment.confirmSignAndLock.click()

    let failed = await api.testOneOffender(offender1.probationCrn, 'prob', false, true, ['pni'])
    expect(failed).toBeFalsy()

})