import { test } from 'fixtures'


test('SAN integration - RFI test', async ({ oasys, user, offender, assessment }) => {
    /**
     * RFI - Complete an RFI against an offender who does not have any WIP OASys assessment
     * Then create an OASys-SAN assessment - ensure the RFI has now been associated with the 
     * assessment and is visible and available (read only) from the left hand navigation menu.
     */

    await user.prob.probSanUnappr.login()

    const offender1 = await offender.createProbFromStandardOffender()

    // Create RFI
    await offender.rfi.goto()
    await offender.rfi.typeOfRfi.setValue('Ad Hoc')
    await offender.rfi.internalUser.setValue(user.prob.probSanUnappr.lovLookup)
    await offender.rfi.reasonForRequest.setValue('Review')
    await offender.rfi.complete.click()

    // Create assessment
    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await assessment.rfis.goto()
    await assessment.rfis.rfiTable.checkRowCount(1)
    await assessment.rfis.rfiTable.clickFirstRow()
    await offender.rfi.save.checkStatus('notVisible')
    log('Checked readonly (save button not visible)')
    await oasys.clickButton('Close')
    await oasys.clickButton('Close')

    await user.logout()
})
