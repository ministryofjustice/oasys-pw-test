import { test } from 'fixtures'

/**
 * New probation MALE offender - NO assessment - Create a Standalone RSR and then clone to a new OASys assessment
 */
test('OGRS regression test ref 12', async ({ oasys, user, offender, assessment, sections, ogrs, sns }) => {

    log(`Log in as as Probation Assessor - create a new MALE probation offender > 18 yrs of age - ensure the CMS stub has just ONE event for it
    In the CMS stub for this offender set the offence code to be 028 01
    From the offender record click on the <CSRP> button
    Existing standalone RSR screen appears, all questions blank apart from the offence has populated with 028 03 and 1.39 which has defaulted to 'No'
    Check that the heading states 'PLEASE COMPLETE ALL QUESTIONS TO PRODUCE ACTUARIAL PREDICTIONS'
    Check the OFFENDER_RSR_SCORES record has the SIX new '…ALGO_VERSION' fields all set to 1 apart from the OSP one which is set to 6
    Check that OFFENDER_RSR_SCORES.RSR_ALGORITHM_VERSION has been set to 6`, 'Test step')

    await user.prob.probHeadPdu.login()
    const offender1 = await offender.createProbFromStandardOffender()
    // const offender1: OffenderDef = {
    //     forename1: 'Autotest',
    //     surname: 'Auto-MH FKJZZ',
    //     pnc: '56/5511522L',
    //     probationCrn: 'ZLZZZTG',
    //     gender: 'Male',
    //     dateOfBirth: { years: -25 },

    //     event: {
    //         eventDetails: {
    //             sentenceType: 'Fine',
    //             sentenceDate: { months: -6 },
    //         },
    //         offences:
    //         {
    //             offence: '028',
    //             subcode: '01',
    //         },
    //     },
    // }
    // await oasys.history(offender1)

    await offender.standaloneCsrp.goto()
    await offender.standaloneCsrp.heading.checkValue('PLEASE COMPLETE ALL QUESTIONS TO PRODUCE ACTUARIAL PREDICTIONS')
    const pk1 = await offender.queries.getLatestStandaloneCsrpPk(offender1.probationCrn)
    await offender.queries.checkStandaloneCsrpDbValues(pk1, {
        RSR_ALGORITHM_VERSION: '6',
        'OGRS4G_ALGO_VERSION': '1',
        'OGRS4V_ALGO_VERSION': '1',
        'OGP2_ALGO_VERSION': '1',
        'OVP2_ALGO_VERSION': '1',
        'OSP_ALGO_VERSION': '6',
        'SNSV_ALGO_VERSION': '1',
    })

    log(`Change 1.39 to 'Yes' and ensure the new fields 6.8 'Current Relationship Status', 7.2 'Regular activities encourage offending' and 8.1 'Drugs ever misused (in custody and community)' appear within the list of dynamic questions
        Answer 'Yes' to 8.1 and the whole of the drugs table appears (including text field for other drug) AND question 8.8 'Motivation to tackle drug misuse' appears
        Click on  <Calculate Predictor Scores>
        A popout message is given that states 'Please complete all questions and click Calculate Predictor Scores' - click on <OK>`, 'Test step')

    await offender.standaloneCsrp.o1_39.setValue('Yes')
    await offender.standaloneCsrp.o6_8.checkStatus('enabled')
    await offender.standaloneCsrp.o7_2.checkStatus('enabled')
    await offender.standaloneCsrp.o8_1.setValue('Yes')
    await offender.standaloneCsrp.aCurrent.checkStatus('enabled')
    await offender.standaloneCsrp.o8_8.checkStatus('enabled')
    await oasys.handleAlert('Calculate Predictor Scores', 'Please complete all questions and click Calculate Predictor Scores')

    log(`Ensure the Predictor section shows the below as with 1.39 set to 'Yes' we are expecting DYNAMIC scores:
        The 'All Reoffending Predictor over the next two years' section states 'Unable to calculate due to :' with the contents of OGRS4G_MISSING_QUESTIONS appended to it	
        The 'Violent Reoffending Predictor over the next two years' section states 'Unable to calculate due to: ' with the contents of OGRS4V_MISSING_QUESTIONS appended to it	
        The 'Serious Violent Reoffending Predictor over the next two years' section states 'Unable to calculate due to:' with the contents of SNSV_MISSING_QUESTIONS_STATIC appended to it	
        The 'Images and Indirect Contact - Sexual Reoffending Predictor' section displays nothing	
        The 'Direct Contact - Sexual Reoffending Predictor' section displays nothing	
        The 'Combined Serious Reoffending Predictor' section displays nothing`, 'Test step')

    await offender.standaloneCsrp.arpText.checkValue('Unable to calculate due to:', true)
    await offender.standaloneCsrp.arpText.checkValue('Missing 1.29 Date of current conviction', true)
    await offender.standaloneCsrp.vrpText.checkValue('Unable to calculate due to:', true)
    await offender.standaloneCsrp.vrpText.checkValue('Missing 1.29 Date of current conviction', true)
    await offender.standaloneCsrp.svrpText.checkValue('Unable to calculate due to:', true)
    await offender.standaloneCsrp.svrpText.checkValue('Missing 1.29 Date of current conviction', true)
    await offender.standaloneCsrp.dcSrpText.checkValue('')
    await offender.standaloneCsrp.iicSrpText.checkValue('')
    await offender.standaloneCsrp.csrpText.checkValue('')

    log(`Complete the section 1 questions ONLY with whatever you like but set 1.30 = 'No' 
        Do not answer anymore of the dynamic questions - only 8.1 remains set to 'Yes'
        Click on  <Calculate Predictor Scores>
        A popout message is given that states 'Please complete all questions and click Calculate Predictor Score' - click on <OK>
        Check the predictor values shown on screen`, 'Test step')

    await offender.standaloneCsrp.o1_8.setValue({ months: -5 })
    await offender.standaloneCsrp.o1_32.setValue(2)
    await offender.standaloneCsrp.o1_40.setValue(1)
    await offender.standaloneCsrp.o1_29.setValue({ months: -3 })
    await offender.standaloneCsrp.o1_30.setValue('No')
    await offender.standaloneCsrp.o1_38.setValue({ months: -1 })
    await oasys.handleAlert('Calculate Predictor Scores', 'Please complete all questions and click Calculate Predictor Scores')
    let ogrsResult = await ogrs.checkOgrsInStandaloneCsrp(pk1)
    await ogrs.checkResultsOnStandaloneCsrpScreen(ogrsResult)


    log(`Now complete ALL of the remaining DYNAMIC questions including selecting and populating ALL of the DRUG table and checkboxes and entering in text for other drug (this is for cloning purposes later on)
        Click on <Calculate Predictor Scores> - scores have been calculated and the screen has turned READ ONLY`, 'Test step')

    await offender.standaloneCsrp.populateAllDynamic()
    await offender.standaloneCsrp.calculateScores.click()
    ogrsResult = await ogrs.checkOgrsInStandaloneCsrp(pk1)
    await ogrs.checkResultsOnStandaloneCsrpScreen(ogrsResult)
    await offender.standaloneCsrp.o1_39.checkStatus('readonly')

    log(`Close out of the standalone RSR - back to the Offender record
        Check that SNS messages are created for the Standalone RSR:
            OGRS msg - ensure the MESSAGE_DATA field is now including the new fields as per the specification	
            RSR msg - ensure the MESSAGE_DATA field is not including the new fields as per the specification	
        Check that there is a record in the new table 'PREDICTOR_FEATURE_LINES' for this OFFENDER_RSR_SCORES_PK and it has stored ALL the fields coming back from the new Predictor calculator as at the last time it run
        Check the OFFENDER_RSR_SCORES record has the existing OGRS 3 fields populated and the new predictor fields populated correctly including original OSP-DC, OSP-IIC and RSR fields`, 'Test step')

    await offender.standaloneCsrp.close.click()
    await sns.testSnsMessageData(offender1.probationCrn, 'csrp', ['OGRS', 'RSR'])
    await ogrs.checkFeatureLines(ogrsResult, pk1, 'csrp')

    log(`NOW TO CHECK CLONING OF STANDALONE RSR DATA TO AN OASYS ASSESSMENT
        Create an OASys assessment for this offender - Layer 3 Version 1 Start of Community Order with ISP
        The data should clone through to this L3 V1 assessment
        Navigate to Section 6 and ensure 6.8 has been set as per the standalone RSR screenshot
        Navigate to Section 7 and ensure 7.2 has been set as per the standalone RSR screenshot
        Navigate to Section 8 and ensure fields and the drug table have been set as per the standalone RSR screenshot NOTE: 8.4, 8.5 and 8.6 will automatically pre-populate and be read only`, 'Test step')

    await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    await sections.section6.goto()
    await sections.section6.o6_8.checkValue('In a relationship living together')
    await oasys.clickButton('Next')
    await sections.section7.o7_2.checkValue('2-Significant problems')
    await oasys.clickButton('Next')
    await sections.section8.aCurrent.checkValue('Monthly')
    await sections.section8.dCurrentlyInjected.checkValue(true)

    log(`Navigate to the Predictors screen
        Ensure that the Predictors section is showing the same DYNAMIC scores as calculated by the standalone RSR`, 'Test step')

    // Remove extra spaces that are shown on CSRP screen but not on Predictors screen

    ogrsResult.arpText = ogrsResult.arpText.replace('DYNAMIC ', 'DYNAMIC')
    ogrsResult.vrpText = ogrsResult.vrpText.replace('DYNAMIC ', 'DYNAMIC')
    ogrsResult.svrpText = ogrsResult.svrpText.replace('DYNAMIC ', 'DYNAMIC')
    await ogrs.checkResultsOnPredictorsScreen(ogrsResult)
})

