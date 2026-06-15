import { test } from 'fixtures'

/**
 * New Probation FEMALE offender aged > 18
 * Create a L3 V1 assessment.   Select a non-sexual offence but set 2.9 Sexual Motivation to Yes
 * Check that OSP is not shown on screen but set to NA in the database
 */

test('NOD 1148 OGRS regression - test ref 17', async ({ oasys, user, offender, assessment, sections, risk, ogrs, sentencePlan, signing, sns }) => {

    log(`Log in as as Probation Assessor - create a new FEMALE probation offender aged > 18								
        Create a Layer 3 Version 1 Start Community Order with an ISP`, 'Test step')

    await user.prob.probSpHeadPdu.login()
    const offender1 = await offender.createProbFromStandardOffender({ gender: 'Female', type: 'noEvent', age: 35 })
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    log(`Navigate to Section 1 Offending - input offence code as 045 10, offence count = 1 and offence date = 10/05/2025, select sentence type as SA2020 Community Order with Sentence Date = 10/06/2025								
        Navigate to Section 1 Predictors and set the following fields as below: 								
            Make the offenders age at first sanction 30						
            1.32 = 7, 1.40 = 4, 1.29 = 10/06/2025							
            Leave 1.30 BLANK							
            1.38 = '12/12/2019', 1.43 LEAVE BLANK IF SHOWN`, 'Test step')

    await sections.offendingInformation.goto()
    await sections.offendingInformation.offence.setValue('045')
    await sections.offendingInformation.subcode.setValue('10')
    await sections.offendingInformation.count.setValue(1)
    await sections.offendingInformation.offenceDate.setValue({ months: -6 })
    await sections.offendingInformation.sentence.setValue('SA2020 Community Order')
    await sections.offendingInformation.sentenceDate.setValue({ months: -5 })

    await sections.predictors.goto()
    await sections.predictors.dateFirstSanction.setValue({ years: -5 })
    await sections.predictors.o1_32.setValue(7)
    await sections.predictors.o1_40.setValue(4)
    await sections.predictors.o1_29.setValue({ months: -5 })
    await sections.predictors.o1_38.setValue({ years: -6 })

    log(`Navigate to Section 2 - answer all questions with whatever you like but set 2.9 Sexual Motivation to 'Yes'								
        Navigate back to the Predictors screen:								
        1.30 is now set to 'Yes' and read only 							
        this will make 1.41 appear - set it to 'Yes' and this will make 1.44 appear - set it to 'No'. 							
        1.33 = '10/04/2019', 1.34 = 4, 1.45 = 2, 1.46 = 2, 1.37 = 1`, 'Test step')

    await sections.sections2To13NoIssues()
    await sections.section2.goto()
    await sections.section2.o2_9Sexual.setValue('Yes')
    await sections.predictors.goto()
    await sections.predictors.o1_30RO.checkValue('Yes')

    await sections.predictors.o1_41.setValue('Yes')
    await sections.predictors.o1_44.setValue('No')
    await sections.predictors.o1_33.setValue({ years: -6, months: -8 })
    await sections.predictors.o1_34.setValue(4)
    await sections.predictors.o1_45.setValue(2)
    await sections.predictors.o1_46.setValue(2)
    await sections.predictors.o1_37.setValue(1)

    log(`Complete sections 2 to 13, Self Assessment Form with whatever you like BUT in Section 8 do say 'Yes' at 8.1 and select some drugs								
        Complete the screening, all with 'No' so don't invoke a full analysis`, 'Test step')

    await sections.selfAssessmentForm.populateMinimal()
    await sections.section8.goto()
    await sections.section8.o8_1.setValue('Yes')
    await sections.section8.aCurrent.setValue('Daily')
    await sections.section8.jCurrent.setValue('Weekly')
    await sections.section8.jPrevious.setValue(true)
    await sections.section8.o8_8.setValue('1-Some problems')
    await sections.section8.o8_9.setValue('0-No problems')
    await sections.section8.linkedToBehaviour.setValue('No')
    await sections.section8.identifyIssues.setValue('No issues')
    await risk.screeningNoRisks(true)

    log(`Go back to Predictors screen and check the Predictors section at the end
        Navigate to the Summary Sheet and ensure the new Predictors table shows the correct data`, 'Test step')

    let ogrsResult = await ogrs.checkOgrsInOasysSet(pk1)
    await ogrs.checkResultsOnPredictorsScreen(ogrsResult)
    await sections.summarySheet.goto()
    const expectedPredictorsValues: ColumnValues[] = [
        {
            name: 'scoreDescription',
            values: ['All Reoffending Predictor', 'Violent Reoffending Predictor', 'Serious Violent Reoffending Predictor', 'Combined Serious Reoffending Predictor']
        },
        {
            name: 'twoYear',
            values: [ogrsResult.outputParams.OGP2_PERCENTAGE.toFixed(2).padStart(6), ogrsResult.outputParams.OVP2_PERCENTAGE.toFixed(2).padStart(6), ogrsResult.outputParams.SNSV_PERCENTAGE_DYNAMIC.toFixed(2).padStart(6), ogrsResult.outputParams.RSR_PERCENTAGE.toFixed(2).padStart(6)]
        },
        {
            name: 'category',
            values: [`${ogrsResult.outputParams.OGP2_BAND}  (DYNAMIC)`, `${ogrsResult.outputParams.OVP2_BAND}  (DYNAMIC)`, `${ogrsResult.outputParams.SNSV_BAND_DYNAMIC}  (DYNAMIC)`, `${ogrsResult.outputParams.RSR_BAND}  (DYNAMIC)`]
        },
    ]
    await assessment.summarySheet.predictorsTable.checkData(expectedPredictorsValues)

    log(`Agree the Sentence Plan								
        Sign & Lock the L3 V1 assessment - no errors occur`, 'Test step')

    await sentencePlan.populateMinimal()
    await signing.signAndLock()

    log(`Check that SNS messages are created for the L1 V1:								
        OGRS msg - ensure the MESSAGE_DATA field is now including the new fields as per the specification							
        RSR msg - ensure the MESSAGE_DATA field is not including the new fields as per the specification							
        AssSumm msg - MESSAGE_DATA field remains as is providing the 'detailUrl'`, 'Test step')
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

    log(`Check that there is a record in the new table 'PREDICTOR_FEATURE_LINES' for this OASYS_SET_PK and it has stored ALL the fields coming back from the new Predictor calculator as at the last time it run								
            Check the OASYS_SET record has the existing OGRS 3, OGP and OVP fields populated and the new predictor fields populated correctly including original OSP-DC, OSP-IIC and RSR fields								
            The OSP fields will be set as follows since the gender of the offender is female:								
            OSP_IIC_RISK_RECON_ELM = 'NA'							
            OSP_IIC_RISK_RECON_CAT = 'RISK_FLAG'							
            OSP_IIC_PERCENTAGE_SCORE = 0							
            OSP_DC_RISK_RECON_ELM = 'NA'							
            OSP_DC_RISK_RECON_CAT = 'RISK_FLAG'							
            OSP_DC_PERCENTAGE_SCORE = 0	`, 'Test step')

    await ogrs.checkFeatureLines(ogrsResult, pk1)

    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        ogrs3_1year: '57',
        ogrs3_2year: '73',
        ogp_1year: '38',
        ogp_2year: '53',
        ovp_1year: '7',
        ovp_2year: '12',
        osp_iic_risk_recon_elm: 'NA',
        osp_iic_risk_recon_cat: 'RISK_FLAG',
        osp_iic_percentage_score: '0',
        osp_dc_risk_recon_elm: 'NA',
        osp_dc_risk_recon_cat: 'RISK_FLAG',
        osp_dc_percentage_score: '0',
    })

    await user.logout()
})
