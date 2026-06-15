import { Page } from '@playwright/test'
import { San, SentencePlan, test } from 'fixtures'


export function testRef22(offender1: OffenderDef, offender2: OffenderDef, offender2Pks: number[]) {

    test('SAN integration - test ref 22', async ({ page, oasys, user, sections, offender, assessment, san, sentencePlan }) => {

        log(`Open up the 'winning' Offender record from Test Ref 21
            Click on 'Demerge'
            The demerge screen shows ONE 3.2 assessment within the 'Manage Assessments - Merged Offender assessments available for reassignment' section  -
                DO NOT CHANGE THIS, this is the 3.2 assessment that was created POST merge
            Click on the >Confirm Demerge> button - screen changed to 'Demerge' screen showing Offender (offender 2 winner) on the lhs with the ONE 3.2
                assessment created post merge and Deleted Offender (0ffender 1)
            Click on the <Demerge> button.
            Offenders have now been demerged.
            Check the OFFENDER_LINK record has the 'REVERSED_IND' field set to 'Y' and the 'LINK_TYPE_ELM' field set to 'DE_MERGE'
            Check that a MERGE API has gone off to the SAN Service with the correct parameters as detailed in the above table and in the Interfaces specification`, 'Test step')

        await user.admin.login(providers.prob.san)
        await offender.searchAndSelect(offender2)

        // Demerge
        await offender.demerge(oasys)
        await user.logout()

        await san.queries.checkSanMergeCall(user.admin, 5)

        log('Check offender 1', 'Test step')
        await user.prob.probHeadPdu.login()
        await offender.searchAndSelectByCrn(offender1.probationCrn)
        await assessment.assessmentsTab.assessments.checkRowCount(1)
        await assessment.openLatest()
        await sections.offenderInformation.religion.checkStatus('readonly')
        await user.logout()

        log('Check offender 2', 'Test step')
        await user.prob.probSanHeadPdu.login()
        await offender.searchAndSelectByPnc(offender2.pnc)

        await assessment.assessmentsTab.assessments.checkRowCount(7)

        // 3rd assessment
        await assessment.assessmentsTab.assessments.clickNthRow(5)
        await checkAssessment(user.prob.probSanHeadPdu.forenameSurname, offender2, offender2Pks[2], 'Homeowner', page, san, sentencePlan)
        await oasys.clickButton('Close')

        // 4th assessment
        await assessment.assessmentsTab.assessments.clickNthRow(3)
        await checkAssessment(user.prob.probSanHeadPdu.forenameSurname, offender2, offender2Pks[4], 'Living with friends or family', page, san, sentencePlan)
        await oasys.clickButton('Close')

        // 6th assessment
        await assessment.assessmentsTab.assessments.clickNthRow(2)
        await checkAssessment(user.prob.probSanHeadPdu.forenameSurname, offender2, offender2Pks[5], 'Renting privately', page, san, sentencePlan)
        await oasys.clickButton('Close')

        // 7th assessment
        await assessment.assessmentsTab.assessments.clickNthRow(1)
        await checkAssessment(user.prob.probSanHeadPdu.forenameSurname, offender2, offender2Pks[6], 'Renting from social, local authority or other', page, san, sentencePlan)
        await oasys.clickButton('Close')

        await user.logout()
    })
}

async function checkAssessment(user: string, offender: OffenderDef, pk: number, accommodation: string, page: Page, san: San, sentencePlan: SentencePlan) {

    log(`Checking assessment pk ${pk}`)
    await san.gotoSanReadOnly()
    await san.queries.checkSanOtlCall(pk,
        {
            'crn': offender.probationCrn,
            'pnc': offender.pnc,
            'nomisId': null,
            'givenName': offender.forename1,
            'familyName': offender.surname,
            'dateOfBirth': offender.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        { 'displayName': user, 'accessMode': 'READ_ONLY', },
        'san', 'assessment'
    )
    await san.checkSanEditMode(false)

    const a1 = await page.locator('#main-content').locator('.summary__answer:has-text("Settled"):visible').count()
    const a2 = await page.locator('#main-content').locator(`.summary__answer--secondary:has-text("${accommodation}"):visible`).count()
    expect(a1).toBe(1)
    expect(a2).toBe(1)

    await san.returnToOASys()
    // Pass user details as they get lost in the cy.get.then structure
    await sentencePlan.spService.checkReadOnly()
    await san.queries.checkSanOtlCall(pk,
        {
            'crn': offender.probationCrn,
            'pnc': offender.pnc,
            'nomisId': null,
            'givenName': offender.forename1,
            'familyName': offender.surname,
            'dateOfBirth': offender.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        { 'displayName': user, 'planAccessMode': 'READ_ONLY', },
        'sp', 'assessment'
    )

}