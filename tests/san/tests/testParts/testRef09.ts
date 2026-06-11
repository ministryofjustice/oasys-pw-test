import { test } from 'fixtures'
import * as testData from '../../data/testRef9'


export function testRef9(offender1: OffenderDef, pks: number[]) {

    test('SAN integration - test ref 9', async ({ page, oasys, user, assessment, san }) => {

        log(`Log in as the same assessor as that in Test Ref 8
                Open up the offender record from Test Ref 8
                Ensure there is a button showing called <Open Strengths and Needs> - should be visible as the user can view the assessments and there is a non-deleted OASys-SAN assessment. 
                Click on that button - OASys disappears and SAN Assessment appears (check OTL parameters, accessMode should be 'EDIT')
                SAN Assessment is in EDIT MODE - change some of the OASys mapping data in several sections of the SAN Assessment and <Save> it so that it validates in SAN.
                DO NOT answer 'Yes' to any of the sections 'linked to risk' questions.  Ensure all sections are marked as complete.
                Return back to OASys.`, 'Test step')

        await user.prob.probSanUnappr.login()
        await oasys.history(offender1)

        await san.gotoSanFromOffender()
        await san.queries.checkSanOtlCall(pks[1], {
            'crn': offender1.probationCrn,
            'pnc': offender1.pnc,
            'nomisId': null,
            'givenName': offender1.forename1,
            'familyName': offender1.surname,
            'dateOfBirth': offender1.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': 'YES',
        }, {
            'displayName': user.prob.probSanUnappr.forenameSurname,
            'accessMode': 'READ_WRITE',
        }, 'san', 'offender'
        )
        await san.populateSanSections('TestRef9 modify SAN', testData.modifySan, true)
        await san.checkSanSectionsCompletionStatus(9)
        await san.returnToOASys()

        log(`Open up the latest fully completed OASys-SAN assessment - navigate to the 'Open Strengths and Needs'  section and link out to the SAN Service
            Ensure the SAN Assessment opens up in READ ONLY MODE (can we check the OTL API to ensure correct parameters passed across)
            and the data mappings that were changed above ARE NOT showing in the SAN Assessment as that should ONLY be showing the SAN Assessment version that was saved at the time of S&L.
            Return back to OASys.
            Log out.`, 'Test step')

        await assessment.openLatest()
        await san.gotoSanReadOnly()
        await san.checkSanEditMode(false)
        const c1 = await page.locator('#main-content').locator('.summary__answer:has-text("Settled"):visible').count()
        const c2 = await page.locator('#main-content').locator('.summary__answer--secondary:has-text("Living with friends or family"):visible').count()
        expect(c1).toBe(1)
        expect(c2).toBe(1)
        await san.returnToOASys()
        await oasys.clickButton('Next')
        await assessment.queries.checkSingleAnswer(pks[1], '5', '5.4', 'refAnswer', '2')  // Should be 2 in the assessment (source of income = offending only).  Change in offender record would return 1 if it impacted the assessment.
        await user.logout()

    })
}