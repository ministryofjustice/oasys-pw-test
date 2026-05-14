import { test } from 'fixtures'

/**
 * New Prison Offender with a Gender of 'Not Specified'
 * Create new RoSHA assessment
 * Complete the RoSHA
 * Check Predictors do not calculate as offender NOT Male or Female
 * S&L assessment
 * 
 * Use same offender to then create a L1 V1 assessment and then a L3 V1 assessment.  In both cases ensure screens show and report correctly that predictors cannot score.  
 */

test('OGRS regression test ref 9', async ({ oasys, offender, assessment, sections, signing, sns, sentencePlan, ogrs }) => {

    log(`Log in as as Prison Assessor to a NON-resettlement prison 								
        Create a reception event with sentence details for a new offender > 18 yrs of age with a GENDER of 'Not Specified'
            - after the offender is created you may need to add the gender from the offender record								
        Create a ROSHA assessment (L1 V2)
        Check the OASYS_SET record has the SIX new '…ALGO_VERSION' fields all set to 1 apart from the OSP one which is set to 6								
        Check that OASYS_SET.RSR_ALGORITHM_VERSION has been set to 6`, 'Test step')

    await oasys.login(oasys.users.prisSpHomds)
    const offender1 = await offender.createPrisFromStandardOffender({ gender: 'Not specified' })
    const pk1 = await assessment.createPris({ purposeOfAssessment: 'Risk of Harm Assessment' })
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        RSR_ALGORITHM_VERSION: '6',
        'OGRS4G_ALGO_VERSION': '1',
        'OGRS4V_ALGO_VERSION': '1',
        'OGP2_ALGO_VERSION': '1',
        'OVP2_ALGO_VERSION': '1',
        'OSP_ALGO_VERSION': '6',
        'SNSV_ALGO_VERSION': '1',
    })

    log(`Navigate to the Predictors screen,	do not enter any data								
        After the Predictors heading
            SHOWS	The All Reoffending Predictor and the Violent Reoffending Predictor scores cannot be calculated when the Gender selected for the offender is not 'Male' or 'Female'.
        The field: All Reoffending Predictor over the next two years					DOES NOT SHOW	
        The field: Violent Reoffending Predictor over the next two years				DOES NOT SHOW	
        Serious Violent Reoffending Predictor over the next two years
            SHOWS	Unable to calculate due to: with the contents of SNSV_MISSING_QUESTIONS_STATIC appended WHICH is 
                        'Serious Violent Reoffending Predictor - Static can't be calculated on gender other than Male and Female'
        Direct Contact - Sexual Reoffending Predictor				SHOWS	Not Applicable
        Images and Indirect Contact - Sexual Reoffending Predictor	SHOWS	Not Applicable
        Combined Serious Reoffending Predictor						
            SHOWS	Unable to calculate due to: with the contents of RSR_EXCEPTION_ERROR appended 
                        which will be 'Combined Serious Reoffending Predictor can't be calculated on gender other than Male and Female.'`, 'Test step')

    await ogrs.checkNonMFResultOnRoshaPredictorsPage()

    log(`Complete data entry of the RoSHA without invoking a full analysis								
        Sign & Lock the RoSHA - no errors occur, ensure you don't get a warning for The OGRS score cannot be calculated when the Gender selected for the offender is not 'Male' or 'Female'.`, 'Test step')

    await assessment.populateMinimal({ layer: 'Layer 1V2' })
    await signing.signAndLock({ page: 'riskScreening' })

    log(`Check that no SNS messages have been sent.
        Check that there is a record in the new table 'PREDICTOR_FEATURE_LINES' for this OASYS_SET_PK and it has stored ALL the fields coming back from the new Predictor calculator as at the last time it run								
        Check the Predictor fields on the OASYS_SET record and that they are set as expected above - note: OGRS3 fields will not be populated`, 'Test step')

    await sns.checkNoMessagesForAssessment(pk1)
    let ogrsResult = await ogrs.checkOgrsInOasysSet(pk1)
    await ogrs.checkFeatureLines(ogrsResult, pk1)
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, { ogrs3_1year: null, ogrs3_2year: null })

    log(`Using the same offender now create a Layer 1 Version 1 Start community Order								
        Data will have cloned through from the previous RoSHA								
        Navigate to the Predictors screen
        Ensure the Predictors shown at the end of the screen all report the same as in the previous RoSHA`, 'Test step')

    await oasys.history(offender1)
    const pk2 = await assessment.createPris({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
    await ogrs.checkNonMFResultOnPredictorsPage()

    log(`Complete entry of any unpopulated questions but do not invoke a full analysis								
        Sign & Lock the L1 V1 assessment - no errors occur, ensure you don't get a warning for
        'The OGRS score cannot be calculated when the Gender selected for the offender is not 'Male' or 'Female'.'`, 'Test step')

    await sections.offendingInformation.goto()
    await sections.offendingInformation.count.setValue(1)
    await sections.layer1Section2.goto()
    await sections.layer1Section2.o2_2Weapon.setValue('No')
    await sections.layer1Section2.o2_2Violence.setValue('No')
    await sections.layer1Section2.o2_2ExcessiveViolence.setValue('No')
    await sections.layer1Section2.o2_2Arson.setValue('No')
    await sections.layer1Section2.impactRecognised.setValue('Yes')
    await sections.selfAssessmentForm.populateMinimal()
    await sentencePlan.populateMinimal()

    await signing.signAndLock()

    log(`Check that there is a record in the new table 'PREDICTOR_FEATURE_LINES' for this OASYS_SET_PK and it has stored ALL the fields coming back from the new Predictor calculator as at the last time it run								
        Check the Predictor fields on the OASYS_SET record and that they are set as expected above - note: OGRS3 fields will not be populated								
        Check that NO SNS messages have been created because the offender does NOT have a CRN.`, 'Test step')

    await sns.checkNoMessagesForAssessment(pk2)
    ogrsResult = await ogrs.checkOgrsInOasysSet(pk2)
    await ogrs.checkFeatureLines(ogrsResult, pk2)
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk2}`, { ogrs3_1year: null, ogrs3_2year: null })

    log(`Using the same offender now create a Layer 3 Version 1 Review								
        Data will have cloned through from the previous Layer 1 Version 1 assessment								
        Navigate to the Predictors screen								
        Ensure the Predictors shown at the end of the screen all report the same as in the previous L1 V1`, 'Test step')

    await oasys.history(offender1)
    const pk3 = await assessment.createPris({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
    await sections.predictors.goto()
    await ogrs.checkNonMFResultOnPredictorsPage()

    log(`Go to the sentence plan screen and click on S&L button - there will be errors reported but ensure the below are NOT included:								
        Warning - calculating OGRS.  The OGRS score cannot be calculated when the Gender selected for the offender is not 'Male' or 'Female'.							
        Warning - The OVP scores could not be calculated as the following fields have not been completed.`, 'Test step')

    await sentencePlan.spService.sentencePlanService.goto()
    await sentencePlan.spService.sentencePlanService.signAndLock.click()
    await signing.checkSingleSignAndLockError('OGRS', false)
    await signing.checkSingleSignAndLockError('OVP', false)
    await signing.signingStatus.returnToAssessment.click()

    log(`Complete entry of any unpopulated questions but do not invoke a full analysis`, 'Test step')

    await sections.sections2To13NoIssues({ populate6_11: 'No' })

    log(`Navigate to the Summary Sheet screen.  Scroll down to the new Predictors table and ensure it shows the following:								
                                                                                2 Year %	Category
            All Reoffending Predictor                                           -           -
            Violent Reoffending Predictor                                       -           -
            Serious Violent Reoffending Predictor                               -           -
            Images and Indirect Contact - Sexual Reoffending Predictor			0.00	    Not applicable
            Direct Contact - Sexual Reoffending Predictor						0.00	    Not applicable
            Combined Serious Reoffending Predictor                              -           -
        `, 'Test step')

    await sections.summarySheet.goto()
    const expectedPredictorsValues: ColumnValues[] = [
        {
            name: 'scoreDescription',
            values: ['All Reoffending Predictor', 'Violent Reoffending Predictor', 'Serious Violent Reoffending Predictor', 'Direct Contact - Sexual Reoffending Predictor', 'Images and Indirect Contact - Sexual Reoffending Predictor', 'Combined Serious Reoffending Predictor']
        },
        {
            name: 'twoYear',
            values: ['-', '-', '-', '  0.00', '  0.00', '-']
        },
        {
            name: 'category',
            values: ['-', '-', '-', 'Not Applicable', 'Not Applicable', '-']
        },
    ]
    await assessment.summarySheet.predictorsTable.checkData(expectedPredictorsValues)

    log(`Sign & Lock the L1 V1 assessment - no errors occur, ensure you don't get a warning for 'The OGRS score cannot be calculated when the Gender selected for the offender is not 'Male' or 'Female'.'								
        Check that there is a record in the new table 'PREDICTOR_FEATURE_LINES' for this OASYS_SET_PK and it has stored ALL the fields coming back from the new Predictor calculator as at the last time it run								
        Check the Predictor fields on the OASYS_SET record and that they are set as expected above - note: OGRS 3, OGP and OVP cannot calculate due to gender type								
        Check that NO SNS messages have been created because the offender does NOT have a CRN.`, 'Test step')

    await signing.signAndLock({ page: 'spService' })
    await sns.checkNoMessagesForAssessment(pk3)
    ogrsResult = await ogrs.checkOgrsInOasysSet(pk3)
    await ogrs.checkFeatureLines(ogrsResult, pk3)
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk3}`, { ogrs3_1year: null, ogrs3_2year: null })

})