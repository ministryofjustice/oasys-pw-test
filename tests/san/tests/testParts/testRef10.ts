import { test } from 'fixtures'
import * as testData from '../../data/testRef10'


export function testRef10(offender1: OffenderDef, pks: number[]) {

    test('SAN integration - test ref 10 - second SAN assessment', async ({ oasysDb, oasys, user, assessment, sections, san, risk, sentencePlan, signing }) => {

        log(`Log in as the same assessor as that in Test Ref 9
            Open up the offender record from Test Ref 9
            As a SAN User, Create a new 3.2 'review' assessment with RSP, electing to use the SAN which has defaulted to 'Yes'.
            Check that a CreateAssessment API post was sent off with the correct details in it (has the OASYS_SET_PK of the newly created record, the parameter for previous PK
            is set to the previous OASys-SAN assessment that we have cloned from).
            Check the cloning from 3.2 to 3.2 assessment.  Case ID, Section 1 (sexual offence), RoSH Screening cloned through.
            Sections 2 to 13 and SAN exist in the background and have been updated with the data from the Updated SAN Assessment carried out in Test Ref 9.`, 'Test step')

        await user.prob.probSanUnappr.login()
        await oasys.history(offender1)
        const pk = await assessment.createProb({ purposeOfAssessment: 'Review' })  // Assume SAN defaults to 'Yes'
        pks.push(pk)
        const prevPk = pks[1]
        await san.queries.checkSanCreateAssessmentCall(pk, prevPk, prevPk, user.prob.probSanUnappr, providers.prob.sanCode, 'REVIEW')

        await assessment.queries.checkCloning(pk, prevPk, [
            '2', '7', '8', '9', '10', '11', '12', '13',
            'SAQ', 'ROSH', 'ROSHFULL', 'RMP', 'SAN',
        ])

        await assessment.queries.checkCloningExpectMismatch(pk, prevPk, [
            '1', '3', '4', '5', '6', 'SKILLSCHECKER'     // These sections were modified in the offender record prior to creating this assessment, so will not match the previous one 
        ])

        log(`Check the OASYS_SET record.  The SAN_ASSESSMENT_LINKED_IND field is set to 'Y'. 
            The CLONED_FROM_PREV_OASYS_SAN_PK field is set to the previous OASys-SAN assessment.The SAN_ASSESSMENT_VERSION_NO field is blank.
            The LASTUPD_FROM_SAN is set from the getAssessment API that has been called directly after creating this new 'Review' assessment.
            There is NO full analysis showing.
            RSR and OSP-IIC and OSP-DC are all calculated.
            The SAN 'Strengths and Needs Sections' menu option has a green tick against it for the data being complete.`, 'Test step')

        await san.queries.getSanApiTimeAndCheckDbValues(pk, 'Y', prevPk)
        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
            RSR_PERCENTAGE_SCORE: '9.96',
            RSR_STATIC_OR_DYNAMIC: 'DYNAMIC',
            RSR_ERROR_COUNT: '0',
            OSP_IIC_PERCENTAGE_SCORE: '3.33',
            OSP_DC_PERCENTAGE_SCORE: '6.18',
        })

        await risk.fullAnalysisSection62.checkMenuVisibility(false)
        await risk.rmp.checkMenuVisibility(false)
        await san.sanSections.checkCompletionStatus(true)

        log(`Go to the SAN assessment, change data in the ''accommodation' and 'thinking, behaviours and attitudes' sections to state 
            they are linked to risk of serious harm (ensure the data is validated).
            Return to OASys, a Full analysis is now showing with sections 6.1 and 6.2 in it.  
            The 'Strengths and Needs Sections' menu option remains showing with a green tick`, 'Test step')

        await san.gotoSan()
        await san.populateSanSections('TestRef10 modify SAN', testData.modifySan, true)
        await san.returnToOASys()
        await oasys.clickButton('Next')
        await risk.fullAnalysisSection62.checkMenuVisibility(true)
        await san.sanSections.checkCompletionStatus(true)

        log(`Go to the first screen of the Risk of Serious Harm Screening and ensure it shows the TWO ARNS sections at R1.1
            Complete the full analysis flagging the offender as 'Medium' risk
            Check the Risk Management Plan screen - ensure the checklist shows 'Accommodation' and 'Thinking, behaviours and attitudes' 
            The Key Information field contains the sentence 'They have accommodation and Thinking, behaviours and attitudes linked to risk.' 
            Also check the 'motivation' sentence is correct to what has been selected.
            Complete entry of the Risk Management Plan screen.`, 'Test step')

        await risk.screeningSection1.goto()
        const areas = await risk.screeningSection1.areasOfConcern.getValues()
        expect(areas).toContain('Accommodation')
        expect(areas).toContain('Thinking, behaviours and attitudes')

        await risk.populateWithSpecificRiskLevel('Medium')
        await risk.rmp.goto()
        await risk.rmp.accommodation.checkStatus('enabled')
        await risk.rmp.thinking.checkStatus('notVisible')
        await risk.rmp.sanThinking.checkStatus('enabled')
        const keyInformation = await risk.rmp.keyInformation.getValue()
        expect(keyInformation).toContain('They have accommodation and thinking, behaviours and attitudes linked to risk.')
        expect(keyInformation).not.toContain('otiv')  // Shouldn't contain Motivation or motivation
        await risk.rmp.populateMinimalWithTextFields()

        log(`Complete the review sentence plan
            Mark as Complete all sections of the Review assessment (not applicable for Case ID and SAN menu option already ticked)
            Sign and Lock the assessment (if it requires a countersigner that countersign it)
            Check the database has the correct section data in it.  Then log out.`, 'Test step')

        await sections.offendingInformation.markCompleteAndCheck()
        await risk.screeningSection2to4.goto()
        await risk.screeningSection2to4.rationale.setValue('Rationale')
        await risk.screeningSection1.markCompleteAndCheck()
        await risk.fullAnalysisSection62.markCompleteAndCheck()
        await risk.summary.markCompleteAndCheck()
        await risk.rmp.markCompleteAndCheck()

        await sentencePlan.sentencePlanService.checkCompletionStatus(true)
        await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersigner: user.prob.probSanHeadPdu })

        await user.logout()

        await user.prob.probSanHeadPdu.login()
        await signing.countersign({ offender: offender1 })
        await user.logout()

        // Check that the correct number of sections have been completed
        const sectionQuery = `select count(*) from eor.oasys_section 
                                    where oasys_set_pk = ${pk} and section_status_elm = 'COMPLETE_LOCKED'`
        const sectionCount = await oasysDb.selectCount(sectionQuery)
        expect(sectionCount).toBe(22)
    })

}