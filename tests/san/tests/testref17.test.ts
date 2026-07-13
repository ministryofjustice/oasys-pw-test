import { test } from 'fixtures'
import * as testData from '../data/testRef17'

test('SAN integration - test ref 17', async ({ page, oasys, user, offender, assessment, sections, san, signing, sentencePlan, risk, sns, tasks, oasysDb }) => {

    await user.prob.probSanPso.login()
    const offender1 = await offender.createProbFromStandardOffender({ forename1: 'TestRefSeventeen', gender: 'Female' })

    // TODO implement IOM stub and remove elog workaround
    // oasys.Offender.createIomStub(offender1.probationCrn, 'Y', 1, 'OK', 'Y')

    log(`Create a Start of Community Order, layer 3, initial sentence plan.  
        The SAN question appears asking if they want to 'Include strengths and needs sections' which has defaulted to 'Yes' 
        Create the assessment - navigation menu does not show section 2 to 13 or the SAQ.  There is a menu option for 'Strengths and Needs Sections'
        Check the database - ensure the OASYS_SET.SAN_ASSESSMENT_LINKED_IND = 'Y'
        Check that a CreateAssessment API post was sent off with the correct details in it (the OASYS_SET_PK of the newly created record, the parameter 
        for previous PK is null, and the User ID and name are correct, and now the sentence plan type)
        Check that we get a '200' response back from the API - the contains parameters back, now includes data for the sentence plan
        Ensure that we have NOT stored down any SAN version number OR Sentence Plan version number on the OASYS_SET record
        Complete Section 1 with a non-sexual offence and complete the predictors screen - RSR dynamic score can't be scored yet.`, 'TestStep')

    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order' })
    await san.checkLayer3Menu(true, sections)

    await san.queries.checkSanCreateAssessmentCall(pk1, null, null, user.prob.probSanPso, providers.prob.sanCode, 'INITIAL')
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        CLONED_FROM_PREV_OASYS_SAN_PK: null,
        SAN_ASSESSMENT_VERSION_NO: null,
        SSP_PLAN_VERSION_NO: null,
    })

    await sections.offendingInformation.goto()
    await sections.offendingInformation.setValues({
        offence: '030', subcode: '01', count: '1', offenceDate: oasysDateTime.oasysDateAsString({ months: -4 }),
        sentence: 'Fine', sentenceDate: oasysDateTime.oasysDateAsString({ months: -3 })
    })
    await sections.predictors.goto(true)
    await sections.predictors.dateFirstSanction.setValue({ years: -3 })
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -6 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({ months: -1 })

    log(`Navigate out to the 'Strengths and Needs Sections' - complete the following questions in the SAN assessment that relate to Female OPD scoring.		
        The following set of SAN questions are for the FEMALE OPD score:	
            In Offence Analysis 'Did the offence involve 'Violence or threat of violence / coercion' - select Yes	
            In Offence Analysis 'Did the offence involve 'Excessive violence or sadistic violence' - select Yes	
            In Offence Analysis 'Is there any evidence of domestic abuse?' - select No	
            In Offence Analysis 'Is the offence linked to risk of serious harm, risks to the individual or other risks?' - select Yes	
            In Accommodation 'Is this area linked to risk of serious harm?' - select Yes	
            In Personal relationships…. 'What was [subject]’s experience of their childhood?' - select 'Both positive and negative experience'	
            In Personal relationships…. 'Is this area linked to risk of serious harm?' - select Yes	
            In Health and wellbeing 'Is ? able to cope with day-to-day life?' - select 'Not able to cope'	
            In Health and wellbeing 'Does ? have any diagnosed or documented mental health problems?' - select 'Yes, ongoing - severe and documented over a prolonged period of time.'	
            In Health and wellbeing 'Has ? ever self-harmed?' - select Yes	
            In Health and wellbeing 'Is this area linked to risk of serious harm?' - select Yes	
            In Thinking, behaviour… 'Is this area linked to risk of serious harm?' - select Yes	
        Answer ALL other SAN Assessment questions as 'No' or select the 'negative' response		
        Ensure the SAN Assessment is completed and validated. The 'Strengths and Needs Sections' menu item has a green tick against it
        A full analysis has been invoked - giving sections 6.1, 6.2, RoSH Summary and Risk Management Plan`, 'TestStep')

    await san.gotoSan()
    await san.populateSanSections('Test ref 17', testData.sanPopulation, true)
    await san.returnToOASys()
    await oasys.clickButton('Next')
    await san.sanSections.checkCompletionStatus(true)
    await risk.fullAnalysisSection62.checkMenuVisibility(true)
    await risk.summary.checkMenuVisibility(true)
    await risk.rmp.checkMenuVisibility(true)

    log(`Navigate to the RoSH Screening Section 1 - at R1.2 Arson - select 'Yes' in the Current column, at R1.2 Any offence involving possession and / or 
            use of weapons - select 'Yes' in the current column
        Ensure ALL other question on this screen are answered as 'No'
        Click on <Next> to go to Section 2 to 4 of the RoSH Screening -  ensure the 'Factors to consider for Child Wellbeing' include 'violent behaviours' 
            and 'Self-harm issues' 
        At R2.3 select 'Yes', at R2.7 for Identifiable Children select 'Yes' and for Children in general select 'No'
        At R3.1, R3.2, R3.3, R3.4, R4.1, R4.2, R4.3 and R4.4 select 'No'
        Do not enter in any child details here - click on <Save> - the full analysis now have section 7 added to it
        Click on <Next> to go to Section 5 of the RoSH Screening - R5.1 is NOT shown, R5.2 has defaulted to 'No' and is read only
        Complete the full analysis, adding a couple of child details and set the offender to have 'MEDIUM' risk for CHILDREN IN COMMUNITY,
            set all other risks to 'LOW'`, 'TestStep')

    await risk.screeningSection1.goto()
    await risk.screeningSection1.mark1_2AsNo.click()
    await risk.screeningSection1.r1_2_7P.setValue('Yes')
    await risk.screeningSection1.r1_2_13P.setValue('Yes')
    await risk.screeningSection1.mark1_3AsNo.click()
    await risk.screeningSection1.r1_4.setValue('No')

    await risk.screeningSection2to4.goto()
    await risk.screeningSection2to4.r2_3.setValue('Yes')
    await risk.screeningSection2to4.r2_4_1.setValue('Yes')
    await risk.screeningSection2to4.r2_4_2.setValue('No')
    await risk.screeningSection2to4.r3_1.setValue('No')
    await risk.screeningSection2to4.r3_2.setValue('No')
    await risk.screeningSection2to4.r3_3.setValue('No')
    await risk.screeningSection2to4.r3_4.setValue('No')
    await risk.screeningSection2to4.r4_1.setValue('No')
    await risk.screeningSection2to4.r4_6.setValue('No')
    await risk.screeningSection2to4.r4_4.setValue('No')

    await risk.screeningSection5.goto()
    await risk.screeningSection5.r5_1.checkStatus('notVisible')
    await risk.screeningSection5.r5_2.checkStatusAndValue('readonly', 'No')

    await risk.fullAnalysisSection7.goto()
    await risk.childAtRisk.populateFullChild1()
    await risk.childAtRisk.populateFullChild2()

    await risk.summary.goto()
    await risk.summary.populateWithSpecificRiskLevel('Low')
    await risk.summary.r10_6ChildrenCommunity.setValue('Medium')

    log(`Navigate to the Risk Management screen - ensure the checklist of items are 'Use of weapons', 'Arson', 'Accommodation', 
                'Personal relationships and commnity', 'Health and wellbeing', 'Thinking, behaviours and attitudes', 'Risk to Children, 
            Note: there maybe others depending on what has been answered in the SAN assessment
        Ensure the Key Information about Current Situation field is correct and specifically includes the following:
            A sentence for 'They have offence analysis,accommodation, personal relationships and community, health and wellbeing and thinking,
                    behaviours and attitudes linked to risk.'
            A sentence for '? Has been assessed as medium risk to children.'
        Complete the Risk Management screen`, 'TestStep')

    await risk.rmp.populateMinimalWithTextFields()
    await risk.rmp.weapons.checkStatus('enabled')
    await risk.rmp.arson.checkStatus('enabled')
    await risk.rmp.accommodation.checkStatus('enabled')
    await risk.rmp.sanRelationships.checkStatus('enabled')
    await risk.rmp.sanHealth.checkStatus('enabled')
    await risk.rmp.sanThinking.checkStatus('enabled')
    await risk.rmp.riskToChildren.checkStatus('enabled')

    await risk.rmp.keyInformation.checkValue('They have offence analysis, accommodation, personal relationships and community, health and wellbeing and thinking, behaviours and attitudes linked to risk.', true)
    await risk.rmp.keyInformation.checkValue(`${offender1.forename1} ${offender1.surname} has been assessed as medium risk to children.`, true)

    log(`Navigate to the Summary Sheet screen: in particular check that the 'Offender Personality Disorder' section states 
            'This individual meets the criteria for the OPD Pathway'.
        Check the database and the OASYS_SET record - ensure field OPD_SCORE = 14 and OPD_RESULT = 'SCREEN_IN'`, 'TestStep')

    await assessment.summarySheet.goto()

    // TODO restore OPD check
    // await assessment.summarySheet.opd.checkValue('This individual meets the criteria for the OPD pathway.')
    // await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
    //     OPD_SCORE: '11',
    //     OPD_RESULT: 'SCREEN IN',
    // })

    log(`Navigate out to the 'Sentence Plan Service'
        Check the OTL is sending the correct criminogenic needs data according to the Summary Screen
        Complete entry of the sentence plan with 2 goals/steps and ensure you 'Agree the Plan'
        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen`, 'TestStep')

    await sentencePlan.populateTwoGoals()
    await san.queries.checkSanOtlCall(pk1, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '2',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': 'NO',
    }, {
        'displayName': user.prob.probSanPso.forenameSurname,
        'planAccessMode': 'READ_WRITE',
    }, 'sp', 'assessment',
        {
            'accommodation': {
                'accLinkedToHarm': 'YES',
                'accLinkedToReoffending': 'NO',
                'accStrengths': 'NO',
                'accOtherWeightedScore': '0',
                'accThreshold': 'NO'
            },
            'educationTrainingEmployability': {
                'eteLinkedToHarm': 'NO',
                'eteLinkedToReoffending': 'NO',
                'eteStrengths': 'NO',
                'eteOtherWeightedScore': '0',
                'eteThreshold': 'NO'
            },
            'finance': {
                'financeLinkedToHarm': 'NO',
                'financeLinkedToReoffending': 'NO',
                'financeStrengths': 'NO',
                'financeOtherWeightedScore': 'N/A',
                'financeThreshold': 'N/A'
            },
            'drugMisuse': {
                'drugLinkedToHarm': 'NO',
                'drugLinkedToReoffending': 'NO',
                'drugStrengths': 'NO',
                'drugOtherWeightedScore': '0',
                'drugThreshold': 'NO'
            },
            'alcoholMisuse': {
                'alcoholLinkedToHarm': 'NO',
                'alcoholLinkedToReoffending': 'NO',
                'alcoholStrengths': 'NO',
                'alcoholOtherWeightedScore': '0',
                'alcoholThreshold': 'NO'
            },
            'healthAndWellbeing': {
                'emoLinkedToHarm': 'YES',
                'emoLinkedToReoffending': 'NO',
                'emoStrengths': 'NO',
                'emoOtherWeightedScore': 'N/A',
                'emoThreshold': 'N/A'
            },
            'personalRelationshipsAndCommunity': {
                'relLinkedToHarm': 'YES',
                'relLinkedToReoffending': 'NO',
                'relStrengths': 'NO',
                'relOtherWeightedScore': '3',
                'relThreshold': 'YES'
            },
            'thinkingBehaviourAndAttitudes': {
                'thinkLinkedToHarm': 'YES',
                'thinkLinkedToReoffending': 'NO',
                'thinkStrengths': 'NO',
                'thinkOtherWeightedScore': '4',
                'thinkThreshold': 'YES'
            },
            'lifestyleAndAssociates': {
                'lifestyleLinkedToHarm': 'N/A',
                'lifestyleLinkedToReoffending': 'N/A',
                'lifestyleStrengths': 'N/A',
                'lifestyleOtherWeightedScore': '0',
                'lifestyleThreshold': 'NO'
            }

        })

    log(`Navigate to Section 5.2 to 8 - green tick on the Sentence Plan Service menu option. Complete entry of the three fields on the screen for
            Public Protection conference
        Click on <Sign and Lock> -  get incomplete sections alert.
        Continue to sign and lock, asks for a countersigner, leave default countersigner, add a comment
        Check that a 'Sign API' has been posted to the SAN Service and the contents are correct (signType passed is 'COUNTERSIGN' along
            with the User ID and name)`, 'TestStep')

    await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersignComment: 'Signing test 17' })

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
    await san.queries.checkSanSigningCall(pk1, user.prob.probSanPso, 'COUNTERSIGN')


    log(`Log out and log back in as the countersigner to the probation area	
        Take a note of what is in the OASYS_SET record for fields 'LASTUPD_FROM_SAN', 'SAN_ASSESSMENT_VERSION_NO' and
            'SSP_PLAN_VERSION_NO' (should have been set from the response to the SIGN API)	
        Open up the countersigning task and then open up the assessment	
        Countersigner shown the correct 'Countersigning Overview' screen:	
            Assessor's Comment: {text from the CSIGN task}
            This is the first assessment in the Offender's period of supervision.
            The following factors determine why the assessment has been presented for countersignature:
            • Offender has been assessed as Medium risk
            • Risks to identifiable children (R7)
            • Integrated Offender Management (IOM)
        Return back to the assessment - now on the last screen for the Initial Sentence Plan`, 'Test step')

    await user.logout()
    await user.prob.probSanPo.login()
    await tasks.openAssessmentFromCountersigningTaskByName(offender1.surname)

    await signing.countersigningOverview.details.checkValue('Signing test 17', true)
    await signing.countersigningOverview.details.checkValue('Offender has been assessed as Medium risk', true)
    await signing.countersigningOverview.details.checkValue('Risks to identifiable children (R7)', true)

    // TODO restore IOM
    // countersigningOverview.details.checkValue('Integrated Offender Management (IOM)', true)

    await signing.countersigningOverview.returnToAssessment.click()
    await sentencePlan.sentencePlanService.checkCurrent()

    // Get oasys_set details to compare later
    const sanColumnsQuery = `select lastupd_from_san, san_assessment_version_no, ssp_plan_version_no from eor.oasys_set where cms_prob_number = '${offender1.probationCrn}'`
    const sanColumns1 = await oasysDb.getData(sanColumnsQuery)

    log(`Navigate to the 'Strengths and Needs Sections' screen - 
        Click on the button <Open Strengths and Needs> - launches into the SAN Assessment.  Ensure you can navigate through the SAN Assessment and it is ALL read only.
        Return back to the assessment via the button/link - SAN assessment disappears and returned to the 'Strengths and Needs Sections' screen in the same browser tab`, 'Test step')

    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    log(`Navigate to the only screen of the Initial Sentence Plan - Countersign button is available
        Continue to countersign the assessment - check that a 'Countersign API' has been posted to the SAN Service and the contents are correct, including the
            'outcome' being 'COUNTERSIGNED' along with the countersigners ID and name
        Check that on the SNS_MESSAGE table there are records for OGRS, RSR, OPD and AssSumm (with URL asssummsan)`, 'Test step')

    await signing.countersign({ page: 'spService', comment: 'Countersigning test ref 17' })
    // TODO restore OPD check (needs IOM stub) 
    // await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OPD'])    // Others checked at signing
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])

    await san.queries.checkSanCountersigningCall(pk1, user.prob.probSanPo, 'COUNTERSIGNED')

    log(`Open up the Offender record
        Ensure the latest completed assessment shows an 'S&N/SSP' icon next to it
        Ensure the Offender record shows the new buttons called <Open S&N'> and <Open SPP> next to the <RSR> button`, 'Test step')

    await offender.searchAndSelect(offender1)
    await assessment.assessmentsTab.assessments.checkData([{ name: 'san', values: ['Includes Strengths and Needs / Sentence Plan Service'] }])
    await offender.offenderDetails.openSan.checkStatus('enabled')
    await offender.offenderDetails.openSp.checkStatus('enabled')

    log(`Check the OASYS_SET record.  Ensure the fields 'LASTUPD_FROM_SAN', 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' remain the same as noted above
        Ensure the OASys database for this assessment has questions in Sections 2 to 12 from the SAN Assessment
        Ensure that the new SAN section has questions in it from the SAN assessment`, 'Test step')

    const sanColumns2 = await oasysDb.getData(sanColumnsQuery)
    expect(JSON.stringify(sanColumns1)).toBe(JSON.stringify(sanColumns2))

    const failed = await assessment.queries.checkAnswers(pk1, testData.dataFromSan, true)
    expect(failed).toBeFalsy()

    log(`Click on the <Print> button - check that the initial print screen does NOT show options for sections 2 to 13, SAQ and Skills Checker`, 'Test step')

    await assessment.openLatest()
    await assessment.printAssessment.goto()
    await assessment.printAssessment.section2.checkStatus('notVisible')
    await assessment.printAssessment.section3.checkStatus('notVisible')
    await assessment.printAssessment.section4.checkStatus('notVisible')
    await assessment.printAssessment.section5.checkStatus('notVisible')
    await assessment.printAssessment.section6.checkStatus('notVisible')
    await assessment.printAssessment.section7.checkStatus('notVisible')
    await assessment.printAssessment.section8.checkStatus('notVisible')
    await assessment.printAssessment.section9.checkStatus('notVisible')
    await assessment.printAssessment.section10.checkStatus('notVisible')
    await assessment.printAssessment.section11.checkStatus('notVisible')
    await assessment.printAssessment.section12.checkStatus('notVisible')
    await assessment.printAssessment.section13.checkStatus('notVisible')
    await assessment.printAssessment.selfAssessmentForm.checkStatus('notVisible')
    await assessment.printAssessment.allSections.setValue(true)

    await user.logout()
})