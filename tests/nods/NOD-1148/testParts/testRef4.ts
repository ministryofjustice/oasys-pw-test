import { test } from 'fixtures'


/**
 * Existing MALE PROBATION offender - previous assessment completed RoSHA - non-sexual offence
 * Create a Layer 1 V1
 * Check the 'Predictor Questions' screen layout
 * Check cloning through from the RoSHA
 * Check calculation of new algorithms and so on
 * Check the full analysis - screen layout as per revised layout
 */

export function testRef4(offender1: OffenderDef, pks: { [key: number]: number }) {

    test('OGRS regression test ref 4', async ({ oasys, user, offender, assessment, sections, risk, sentencePlan, sns, signing, ogrs }) => {

        log(`Log in as as Probation Assessor used in Test Ref 3		
            Open up the Offender from Test Ref 3 that has the completed RoSHA assessment		
            Check that there is NO 'Summary Sheet' tab showing for the offender - just seven tabs with no break between them		
            Create a Layer 1 Version 1 assessment (not impact cohort assessment)		
            Check the OASYS_SET record has the SIX new '…ALGO_VERSION' fields all set to 1 apart from the OSP one which is set to 6		
            Check that OASYS_SET.RSR_ALGORITHM_VERSION has been set to 6`, 'Test step')

        await user.prob.probHeadPdu.login()
        await oasys.history(offender1)
        await offender.offenderDetails.summarySheetTab.checkStatus('notVisible')

        pks[2] = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pks[2]}`, {
            RSR_ALGORITHM_VERSION: '6',
            'OGRS4G_ALGO_VERSION': '1',
            'OGRS4V_ALGO_VERSION': '1',
            'OGP2_ALGO_VERSION': '1',
            'OVP2_ALGO_VERSION': '1',
            'OSP_ALGO_VERSION': '6',
            'SNSV_ALGO_VERSION': '1',
        })

        log(`Without moving away from the Case ID screen check the database 		
            Ensure that the new L1 V1 assessment has ALL the questions cloned through from the RoSHA, including the new ones added in this release; 6.8, 7.2, 8.1, drugs table and 8.8		
            Ensure that the navigation menu includes a full analysis in the assessment for Section 8		
            Ensure that the navigation menu now shows a screen called 'Predictor Questions' and not 'RSR Questions'`, 'Test step')

        await assessment.queries.checkCloning(pks[2], pks[1], ['1', '2', '3', '4', '6', '7', '8', '9', '11', '12'])

        log(`Navigate to Section 1 'Predictors' screen - scroll down and ensure that the 'Predictors' section at the end is showing the same results as the previously completed RoSHA		
            Navigate to the 'Predictor Questions' screen and ensure that the new questions 6.8, 7.2, 8.1, drugs table and 8.8 are included on the screen.  
                All the dynamic questions have cloned through correctly from the RoSHA 		
            Ensure the heading at the top of the screen above 3.4 is 'Predictor Questions'`, 'Test step')

        let ogrsResult = await ogrs.checkOgrsInOasysSet(pks[1])
        await ogrs.checkResultsOnPredictorsScreen(ogrsResult)

        await sections.predictorQuestions.goto()
        await sections.predictorQuestions.o6_8.checkStatus('enabled')
        await sections.predictorQuestions.o7_2.checkStatus('enabled')
        await sections.predictorQuestions.o8_1.checkStatus('enabled')
        await sections.predictorQuestions.aCurrent.checkStatus('enabled')
        await sections.predictorQuestions.o8_8.checkStatus('enabled')
        await sections.predictorQuestions.o3_4.checkValue('1-Some problems')
        await sections.predictorQuestions.o4_2.checkValue('0-Not available for work')
        await sections.predictorQuestions.o6_4.checkValue('2-Significant problems')
        await sections.predictorQuestions.o6_7.checkValue('No')
        await sections.predictorQuestions.o6_8.checkValue('In a relationship, living together')
        await sections.predictorQuestions.o7_2.checkValue('1-Some problems')
        await sections.predictorQuestions.o8_1.checkValue('Yes')
        await sections.predictorQuestions.dCurrent.checkValue('Daily')
        await sections.predictorQuestions.dCurrentlyInjected.checkValue(true)
        await sections.predictorQuestions.dPrevious.checkValue(true)
        await sections.predictorQuestions.dPreviouslyInjected.checkValue(true)
        await sections.predictorQuestions.jCurrent.checkValue('Occasional')
        await sections.predictorQuestions.jPrevious.checkValue(true)
        await sections.predictorQuestions.jPrevious.checkValue(true)
        await sections.predictorQuestions.pCurrent.checkValue('Monthly')
        await sections.predictorQuestions.o8_8.checkValue('1-Some problems')
        await sections.predictorQuestions.o9_1.checkValue('1-Some problems')
        await sections.predictorQuestions.o9_2.checkValue('1-Some problems')
        await sections.predictorQuestions.o11_2.checkValue('1-Some problems')
        await sections.predictorQuestions.o11_4.checkValue('1-Some problems')
        await sections.predictorQuestions.o12_1.checkValue('1-Some problems')
        await sections.predictorQuestions.pageHeader.checkValue('Predictor Questions')

        log(`Change some of the dynamic question answers so that it impacts on the predictor algorithms:		
                    Set 1.32 = 6, 1.40 = 3	
                    2.2 weapon = Yes and input 'Knife' for weapon text, 4.2 = 2 - Yes	
                    Drugs table:  add 'Ketamine' with 'Daily' current usage and tick just the currently injected checkbox	
                    8.8 = 2-significant problems, 11.4 AND 12.1 set both to '2-significant problems'	
                Click on <Save>, screen refreshes.  Go back to Section 1 Predictor screen which now shows revised calculations`, 'Test step')

        await sections.predictorQuestions.o4_2.setValue('2-Yes')
        await sections.predictorQuestions.qCurrent.setValue('Daily')
        await sections.predictorQuestions.qCurrentlyInjected.setValue(true)
        await sections.predictorQuestions.o8_8.setValue('2-Significant problems')
        await sections.predictorQuestions.o11_4.setValue('2-Significant problems')
        await sections.predictorQuestions.o12_1.setValue('2-Significant problems')
        await sections.layer1Section2.goto()
        await sections.layer1Section2.o2_2Weapon.setValue('Yes')
        await sections.layer1Section2.o2_2SpecifyWeapon.setValue('Knife')
        await sections.predictors.goto()
        await sections.predictors.o1_32.setValue(6)
        await sections.predictors.o1_40.setValue(3)
        await sections.predictors.save.click()
        ogrsResult = await ogrs.checkOgrsInOasysSet(pks[2])
        await ogrs.checkResultsOnPredictorsScreen(ogrsResult)

        log(`Leave the full analysis sections as they are		
            Complete all other mandatory questions for the L1 V1		
            Sign and lock the assessment`, 'Test step')

        await sections.offendingInformation.goto()
        await sections.offendingInformation.count.setValue(1)
        await sections.layer1Section2.goto()
        await sections.layer1Section2.o2_2Violence.setValue('No')
        await sections.layer1Section2.o2_2ExcessiveViolence.setValue('No')
        await sections.layer1Section2.o2_2Arson.setValue('No')
        await sections.layer1Section2.impactRecognised.setValue('Yes')
        await sections.selfAssessmentForm.populateMinimal()
        await risk.rmp.populateMinimalWithTextFields()
        await sentencePlan.populateMinimal()

        await risk.screeningSection2to4.goto()
        await risk.screeningSection2to4.r2_3.setValue('No')
        await risk.screeningSection2to4.rationale.setValue('Rationale')

        await signing.signAndLock({ page: 'spService' })

        log(`Check that SNS messages are created for the L1 V1:		
                OGRS msg - ensure the MESSAGE_DATA field is now including the new fields as per the specification	
                RSR msg - ensure the MESSAGE_DATA field is not including the new fields as per the specification	
                AssSumm msg - MESSAGE_DATA field remains as is providing the 'detailUrl'`, 'Test step')

        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

        log(`Check that there is a record in the new table 'PREDICTOR_FEATURE_LINES' for this OASYS_SET_PK and it has stored ALL the fields coming back from the new
                Predictor calculator as at the last time it run		
            Check the OASYS_SET record has the OGRS 3 yr 1 and yr 2 fields set and the existing OSP-DC, OSP-IIC, RSR and new predictor fields set correctly		
            Open up the L1 V1 assessment  - opens in READ ONLY mode throughout, not able to change anything`, 'Test step')

        await ogrs.checkFeatureLines(ogrsResult, pks[2])
        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pks[2]}`, { ogrs3_1year: '46', ogrs3_2year: '63' })
        await oasys.history(offender1, 'Start of Community Order')
        await sections.predictorQuestions.goto()
        await sections.predictorQuestions.o3_4.checkStatus('readonly')

        await user.logout()
    })

}