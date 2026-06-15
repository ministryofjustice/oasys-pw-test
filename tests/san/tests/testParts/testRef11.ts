import { test } from 'fixtures'
import * as testData from '../../data/testRef11'

export function testRef11(offender1: OffenderDef, pks: number[]) {

    test('SAN integration - test ref 11 - Transfer to non-pilot area and complete 3.1 assessment', async ({ offender, tasks, oasys, user, assessment, sections, san, risk, sentencePlan, signing }) => {

        log(`Log in as an Assessor from a Non-Pilot probation area
            Find the offender used in Test Ref 10
            Carry out a 'transfer' so that the probation owner and controlling owner transfers to the non-pilot area.`, 'Test step')

        await user.prob.probHeadPdu.login()
        await offender.searchAndSelectByPnc(offender1.pnc, providers.prob.san)
        await offender.requestTransfer()
        await user.logout()

        await user.prob.probSanUnappr.login()
        await tasks.grantTransfer(offender1.surname)
        await user.logout()

        log(`Create a new 'Review' Layer 3 version 1 assessment - opens at the Case ID screen.  3.1 assessment includes a full analysis with sections 6.1 and 6.2.  
            Sections 2 to 13 and the SAQ are showing in the navigation menu.  'Open Strengths and Needs' is NOT shown in the navigation menu.
            Part of create will go and retrieve the latest validated set of SAN data.
            Check the OASYS_SET record; field CLONED_FROM_PREV_OASYS_SAN_PK has been set to the PK of of the last OASys-SAN assessment, 
            fields SAN_ASSESSMENT_LINKED_IND, LASTUPD_FROM_SAN and SAN_ASSESSMENT_VERSION_NO are all NULL.
            Check that the 'NON OASYS' fields as listed in the analysis document have been deleted from the database.
            Check that the LAST THREE questions in Sections 7, 11 and 12 have ALL been set by the SAN data and are the same;  'identify' text box, 'linked to risk of serious harm...' 
            and 'linked to reoffending...'  (note: this is coming from the TBA section in the SAN Assessment and, rightly or wrongly, Cindy wanted it mapped to ALL 3 sections in OASys).`, 'Test step')

        await user.prob.probHeadPdu.login()
        await oasys.history(offender1)
        const pk = await assessment.createProb({ purposeOfAssessment: 'Review' })
        pks.push(pk)
        const prevPk = pks[2]

        await san.checkLayer3Menu(false, sections)
        await risk.fullAnalysisSection62.checkMenuVisibility(true)

        await san.queries.getSanApiTimeAndCheckDbValues(pk, null, prevPk)

        const failed = await assessment.queries.checkAnswers(pk, testData.nonOASysQuestions, true)
        expect(failed).toBeFalsy()

        log(`Go to the RoSH Screening Section 1 and check that at R1.1 it has area of concern set to '3 - Accommodation', 
                '7 - Lifestyle and Associates', '11 - Thinking and Behaviour', '12 - Attitudes'
            Carry on to fully complete the 3.1 assessment in OASys ensuring at S&L the Assessor DOES NOT receive any errors relating to the SAN service.`, 'Test step')

        await risk.screeningSection1.goto()
        const areas = await risk.screeningSection1.areasOfConcern.getValues()
        expect(areas).toContain('7 - Lifestyle and Associates')
        expect(areas).toContain('11 - Thinking and Behaviour')
        expect(areas).toContain('12 - Attitudes')

        // Complete remaining mandatory fields that didn't get cloned from the previous assessment
        await sections.section2.goto()
        await sections.section2.o2_2Weapon.setValue('No')
        await sections.section2.o2_2Arson.setValue('No')
        await sections.section2.o2_9Emotional.setValue('No')
        await sections.section2.o2_14.setValue('No')
        await sections.section2.identifyIssues.setValue('Section 2 issues')
        await sections.victim.goto()
        await sections.victim.relationship.setValue('Spouse/Partner - live in')
        await sections.victim.save.click()
        await sections.victim.close.click()

        await sections.section3.goto()
        await sections.section3.o3_5.setValue('0-No problems')
        await sections.section4.goto()
        await sections.section4.o4_5.setValue('0-No problems')
        await sections.section4.o4_5.setValue('0-No problems')
        await sections.section4.identifyIssues.setValue('No issues')
        await sections.section5.goto()
        await sections.section5.identifyIssues.setValue('No issues')
        await sections.section6.goto()
        await sections.section6.identifyIssues.setValue('No issues')
        await sections.section9.goto()
        await sections.section9.o9_3.setValue('0-No problems')
        await sections.section9.identifyIssues.setValue('No issues')
        await sections.section10.goto()
        await sections.section10.o10_3.setValue('0-No problems')
        await sections.section10.o10_7Medication.setValue('No')
        await sections.section10.o10_7Patient.setValue('No')
        await sections.section10.identifyIssues.setValue('No issues')
        await sections.section11.goto()
        await sections.section11.o11_1.setValue('0-No problems')
        await sections.section11.o11_5.setValue('0-No problems')
        await sections.section12.goto()
        await sections.section12.o12_5.setValue('0-No problems')
        await sections.section12.o12_8.setValue('1-Quite motivated')
        await sections.selfAssessmentForm.populateMinimal()

        await sentencePlan.rspSection72to10.goto()
        await sentencePlan.rspSection72to10.agreeWithPlan.setValue('Yes')
        await signing.signAndLock()
        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
            SAN_ASSESSMENT_LINKED_IND: null,
            CLONED_FROM_PREV_OASYS_SAN_PK: prevPk.toString(),
            SAN_ASSESSMENT_VERSION_NO: null,
        })
        await user.logout()
    })

}