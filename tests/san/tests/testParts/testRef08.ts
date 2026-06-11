import { test } from 'fixtures'
import * as testData from '../../data/testRef8'


export function testRef8(offender1: OffenderDef, pks: number[]) {

    test('SAN integration - test ref 8', async ({ oasys, user, offender, assessment, signing, sections, san, risk, sentencePlan, sns, tasks, oasysDb }) => {

        log(`Create a new assessment - defaults to PSR-SDR, Layer 3, PSR Outline Plan with SDR court report
            Ensure the new SAN question is not showing on the screen (cannot do SAN with a PSR type assessment)`, 'Test step')

        await user.prob.probSanUnappr.login()
        await offender.searchAndSelect(offender1)

        await assessment.getToCreateAssessmentPage()
        await assessment.createAssessmentPage.purposeOfAssessment.checkValue('PSR - SDR')
        await assessment.createAssessmentPage.assessmentLayer.checkValue('Full (Layer 3)')
        await assessment.createAssessmentPage.includeSanSections.checkStatus('notVisible')

        log(`Change the POA to 'Start of Community Order' with an ISP
            Ensure the new SAN question 'Include strengths and needs sections' is shown with a default setting of 'Yes'
            Drop downs on this new question are null, No and Yes
            Set the anwer to null, and click on the <Create> button
            Error shown at the top of the screen that it is mandatory to complete the question
            Change the answer from null to 'No'
            Click on <Create>`, 'Test step')

        await assessment.createAssessmentPage.purposeOfAssessment.setValue('Start of Community Order')
        await assessment.createAssessmentPage.sentencePlanType.setValue('Initial')

        await assessment.createAssessmentPage.includeSanSections.checkStatusAndValue('enabled', 'Yes')
        await assessment.createAssessmentPage.includeSanSections.checkOptions(['', 'Yes', 'No'])
        await assessment.createAssessmentPage.includeSanSections.setValue('')
        await assessment.createAssessmentPage.create.click()
        await oasys.checkErrorMessage('You must decide if you want to include strengths and needs before being able to create the assessment.')
        await assessment.createAssessmentPage.includeSanSections.setValue('No')

        await assessment.createAssessmentPage.create.click()
        const pk1 = (await assessment.queries.getAllSetPksByProbationCrn(offender1.probationCrn))[0]
        pks.push(pk1)

        log(`A normal Layer 3 Version 1 assessment is created showing the Case ID Offender Information screen 
        Do NOT change any data or navigate anywhere
        Ensure the left hand navigation menu shows +Section 2 to 13 AND Self Assessment Form
        Ensure there is no navigation option for 'Strengths and Needs Sections'
        Check the OASYS_SET record has new field 'SAN_ASSESSMENT_LINKED_IND' SET to 'N'
        Do not enter any data, go to a sentence plan screen and click on 'Sign and Lock' - ensure the errors reported are consistent with a 3.1 assessment type and there is nothing there to do with a SAN assessment`, 'Test step')

        await sections.offenderInformation.checkCurrent()
        await san.checkLayer3Menu(false, sections)
        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, { SAN_ASSESSMENT_LINKED_IND: 'N' })

        await sentencePlan.goto('spService')
        await sentencePlan.spService.sentencePlanService.signAndLock.click()
        await signing.checkSignAndLockErrorsVisible('section2To13Errors')
        await signing.checkSignAndLockErrorsNotVisible('sanSectionsIncomplete')
        await signing.signingStatus.returnToAssessment.click()

        log(`Continue to complete the Layer 3 Version 1, doesn't matter what data you put in BUT make it a SEXUAL offence so that 1.30 = Yes and is read only.  Fully complete it by signing and locking, countersigning if necessary
            Offender now has 1 completed Layer 3 Version 1 assessment
            Check the database, ensure the OASYS_SET record still have the new field 'SAN_ASSESSMENT_LINKED_IND' set to 'N' AND there is NO section associated to it called 'SAN'
            Check that on the SNS_MESSAGE table there are records for OGRS, RSR and AssSumm`, 'Test step')

        await sections.offendingInformation.goto()
        await sections.offendingInformation.setValues({
            offence: '020', subcode: '01', count: '1', offenceDate: oasysDateTime.oasysDateAsString({ months: -4 }), sentence: 'Fine',
            sentenceDate: oasysDateTime.oasysDateAsString({ months: -3 })
        })
        await sections.predictors.populateFull({ r1_30PrePopulated: true, r1_41PrePopulated: true })
        await sections.sections2To13NoIssues()
        await sections.selfAssessmentForm.populateMinimal()
        await risk.screeningNoRisks(true)

        await sentencePlan.populateMinimal()
        await signing.signAndLock({ expectCountersigner: true, countersigner: user.prob.probSanHeadPdu })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])

        await user.logout()
        await user.prob.probSanHeadPdu.login()
        await signing.countersign({ offender: offender1, comment: 'Test comment' })

        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, { SAN_ASSESSMENT_LINKED_IND: 'N' })

        const sectionCount1 = await san.queries.getSanSectionsCount(pk1)
        expect(sectionCount1).toBe(1)   // expect SSP but not SAN
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])
        await user.logout()

        // Test 8 part 2
        await user.prob.probSanUnappr.login()
        await offender.searchAndSelect(offender1)
        log(`Create another assessment - defaults to Review
        The new SAN question is NOT shown on the screen due to the default of PSR with 'PSR Outline' plan
        Change the POA to 'Start of Community Order', Layer 3 with ISP and the new SAN question shows with a NULL default setting 
        Set the SAN question answer to 'Yes'
        Click on <Create>`, 'Test step')

        await assessment.getToCreateAssessmentPage()
        await assessment.createAssessmentPage.purposeOfAssessment.checkValue('Review')
        await assessment.createAssessmentPage.purposeOfAssessment.setValue('Start of Community Order')
        await assessment.createAssessmentPage.assessmentLayer.setValue('Full (Layer 3)')
        await assessment.createAssessmentPage.sentencePlanType.setValue('Initial')
        await assessment.createAssessmentPage.includeSanSections.checkStatusAndValue('enabled', '')
        await assessment.createAssessmentPage.includeSanSections.setValue('Yes')
        await assessment.createAssessmentPage.create.click()
        const pk2 = (await assessment.queries.getAllSetPksByProbationCrn(offender1.probationCrn))[1]
        pks.push(pk2)

        log(`An OASys-SAN assessment (3.2) is created showing the Case ID Offender Information screen
        Do NOT change any data or navigate anywhere
        Ensure the left hand navigation menu DOES NOT show +Section 2 to 13 AND Self Assessment Form
        Ensure THERE IS a navigation option for 'Strengths and Needs Sections' showing between + Section 1 and + RoSH Screening
        Ensure the other navigation menus show correctly for Case ID, Section 1, RoSH Screening and Initial Sentence Plan`, 'Test step')

        await sections.offenderInformation.checkCurrent()
        await san.checkLayer3Menu(true, sections)
        await sections.sourcesOfInformation.checkMenuVisibility(true)
        await sections.offendingInformation.checkMenuVisibility(true)
        await sections.predictors.checkMenuVisibility(true)
        await risk.screeningSection1.checkMenuVisibility(true)
        await risk.screeningSection2to4.checkMenuVisibility(true)
        await risk.screeningSection5.checkMenuVisibility(true)
        await sentencePlan.ispSection52to8.checkMenuVisibility(false)

        log(`Check the OASYS_SET record has new field 'SAN_ASSESSMENT_LINKED_IND' is SET to 'Y' and 'CLONED_FROM_PREV_OASYS_SAN_PK' is NULL
        Check that a CreateAssessment API post was sent off with the correct details in it (the OASYS_SET_PK of the newly created record,
                the parameter for previous PK is null, and the User detail fields are correct i.e User ID and User Name)
        Check that we get a '200' response back from the API - the response may contain parameters back
        Ensure that if the response returned parameters we have NOT stored down any SAN version number on the OASYS_SET record
        Check the OASys database - there are NO questions saved to Sections 2 to 13 and SAQ - this is because we initially clear everything out
        Check the OASys database - there are NO IP.1 and IP.2 questions in the ISP section
        As part of the Create Assessment we would have called the SAN Service to Get data - can we provide evidence of that?
        Check the OASYS_SET record, it is not clear yet but I am assuming that we will get something back from SAN even if the OASys equivalent section is blank - but OASYS_SET.LASTUPD_FROM_SAN should be set to date/timestamp from the API response
        None of the navigation menu options have ticks against them`, 'Test step')

        await san.queries.getSanApiTimeAndCheckDbValues(pk2, 'Y', null)
        await san.queries.checkSanCreateAssessmentCall(pk2, null, pk1, user.prob.probSanUnappr, providers.prob.sanCode, 'INITIAL')

        await san.queries.checkNoQuestionsCreated(pk2)
        await san.queries.checkNoIspQuestions1Or2(pk2)
        await san.checkSanAssessmentCompletionStatus(false, sections, san, risk)

        log(`Click on 'Sign and Lock'
        Ensure the errors reported are consistent with being a 3.2 assessment: 
        There is NO <Mark 1 to 9 as Missing> button showing and there is NO <Continue with Signing> button
        There is a <Return to Assessment> button showing
        There is a warning thatOVP has not been calculated along with 'Please complete the ‘Offence analysis’ section in the Strengths and Needs Sections.’ 
        There are NO errors relating to the 3.1 assessment sections 2 through to 13 or for the SAQ as any questions answered will be stored in the database but NOT visible on screen (but not yet!).
        There are no errors relating to the RoSH Screening or the sentence plan as those questions have cloned from the previous 3.1 assessment
        There is a new error that states 'The following ‘Strengths and Needs Sections’ have not been completed. Please press ‘Return to Assessment’ and navigate back to the ‘Strengths and Needs Sections’ to complete'
        Then a list of the sections follows which are: Accommodation, Employment and education, Finance, Drug use, Alcohol use, Health and wellbeing, Personal relationships and community, Thinking, behaviours and attitudes, Offence analysis
        There is a new error stating 'In OASys the offender has been marked at 1.30 as having behaviours that are sexually motivated.  There are relevant questions within the Strengths and Needs assessment that must be completed.  Please press 'Return to Assessment' and navigate back to the 'Strengths and Needs Sections' to complete.`, 'Test step')

        await sentencePlan.goto('spService')
        await sentencePlan.spService.sentencePlanService.signAndLock.click()
        await signing.checkSignAndLockErrorsNotVisible('section2To13Errors')
        await signing.checkSingleSignAndLockError(`Please provide a clear rationale for not fully completing the Self Assessment Questionnaire`, false)
        await signing.checkSingleSignAndLockError(`The following fields on the RoSH Screening have not been completed, Please press 'Return to Assessment' and navigate back to the RoSH Screening to complete.`, false)
        await signing.checkSingleSignAndLockError('Do you agree with the proposed plan (if no, explain why below)', false)
        await signing.checkSignAndLockErrorsVisible('sanSectionsIncomplete')
        await signing.checkSingleSignAndLockError(`In OASys the offender has been marked at 1.30 as having behaviours that are sexually motivated. There are relevant questions within the Strengths and Needs assessment that must be completed. Please press 'Return to Assessment' and navigate back to the 'Strengths and Needs Sections' to complete.`, true)
        await signing.signingStatus.mark1To9AsMissing.checkStatus('notVisible')
        await signing.signingStatus.continueWithSigning.checkStatus('notVisible')

        log(`Return back to the assessment and change some of the data in the Case ID sections and Section 1 screens but leave as a SEXUAL offence (will have cloned from previous 3.1 assessment)
        Remain on Section 1 Predictors screen after clicking <Save>
        Now click on <Next>, navigates to the new 'Strengths and Needs Sections' screen
        Ensure the buttons <Close>, <Next> and <Previous> are available (no other buttons should be showing)
        There is text above the on-screen button which states 'To exit OASys and launch into the Strengths and Needs Service please click on the button below.'
        The on-screen button is labelled 'Open Strengths and Needs'
        Click on the button <Open Strengths and Needs>`, 'Test step')

        await signing.signingStatus.returnToAssessment.click()
        await sections.offenderInformation.goto()
        await sections.offenderInformation.religion.setValue('Adventist')
        await sections.sourcesOfInformation.goto()
        await sections.sourcesOfInformation.sourcesOther.setValue('Some other sources')
        await sections.offendingInformation.goto()
        await sections.offendingInformation.communityPunishmentHours.setValue('200')
        await sections.offendingInformation.additionalRequirements1.setValue('Citizenship')
        await sections.offendingInformation.sentenceAdditionalLicenceConditions.setValue('Some additional conditions')
        await sections.predictors.goto()
        await sections.predictors.o1_32.setValue(4)
        await sections.predictors.o1_40.setValue(0)
        await sections.predictors.o1_29.setValue({ days: -7 })
        await sections.predictors.save.click()
        await sections.predictors.next.click()

        await san.sanSections.checkCurrent()
        await san.sanSections.close.checkStatus('enabled')
        await san.sanSections.next.checkStatus('enabled')
        await san.sanSections.previous.checkStatus('enabled')
        await san.sanSections.markAsComplete.checkStatus('notVisible')
        await san.sanSections.openSanLabel.checkStatus('visible')
        await san.gotoSan()

        log(`Within the SAME browser tab the OASys screen closes and is replaced by the first screen in the SAN Assessment
            - get evidence here of the One-Time link API so we can check the parameters going out
        Do not enter anything into the SAN Assessment - there should be a visible button/link to return to the OASys assessment
        Click on that button/link - Within the SAME browser tab the SAN Assessment screen closes and is replaced with the OASys 'Strengths and Needs Sections'
        screen for the OASys-SAN assessment that we navigated away from
        The OASys 'Strengths and Needs Sections' screen is the same as before with some text above the launch <button>
        None of the navigation menus have green ticks against them
        Go to the Summary Sheet screen - ensure that the top 'Criminogenic Needs Summary and Section Scores' has a populated 'Criminogenic Need' 
        column which are all set to 'N' apart from 'Finance' and 'Health and wellbeing' which are set to 'N/A'.
        The 'Scores' column are all just greyed out apart from 'Finance' and 'Health and wellbeing' which are set to 'N/A'.`, 'Test step')

        await san.queries.checkSanOtlCall(pk2, {
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
        },
            'san', 'assessment'
        )
        await san.returnToOASys()
        await san.sanSections.checkCurrent()
        await san.checkSanAssessmentCompletionStatus(false, sections, san, risk)
        await assessment.summarySheet.goto()
        const expectedValues1: ColumnValues[] = [
            {
                name: 'oasysSection',
                values: ['Accommodation', 'Employment and education', 'Finance', 'Drug use', 'Alcohol use', 'Health and wellbeing', 'Personal relationships and community', 'Thinking, behaviours and attitudes', 'Lifestyle & Associates']
            },
            {
                name: 'criminogenicNeed',
                values: ['N', 'N', 'N/A', 'N', 'N', 'N/A', 'N', 'N', 'N']
            },
            {
                name: 'scores',
                values: [null, null, 'N/A', null, null, 'N/A', null, null, null]
            }
        ]
        await assessment.summarySheet.save.click()  // Workaround for defect NOD-1165
        await assessment.summarySheet.sanCrimTable.checkData(expectedValues1)

        // Test ref 8 part 3
        log(`Now go back to the 'Strengths and Needs Sections' screen
        Click on the button <Open Strengths and Needs> - launches into the SAN Assessment.  Answer all questions with whatever you like BUT at all the 'Is this area linked to risk of serious harm?' answer 'No'
        As you go through take screenshots of those SAN section screens that show the 'risk', 'reoffending', 'strengths/protective factors' and 'risk not related' questions (for checking against our Summary Screen later on)
        When you have fully completed the SAN Assessment, return back to the OASys part of the assessment via the button/link
        As part of the return back from SAN OASys will automatically retrieve the latest data from SAN (for this we will assume it is correct in the database)
        The navigation menu is now showing a green tick against the 'Strengths and Needs Sections' option
        A full analysis has NOT been invoked`, 'Test step')

        await san.gotoSan()
        await san.populateSanSections('TestRef8 complete SAN', testData.sanPopulation, true)
        await san.returnToOASys()
        await oasys.clickButton('Next')
        await san.sanSections.checkCompletionStatus(true)
        await risk.rmp.checkMenuVisibility(false)

        log(`Go to the Summary Sheet screen
        There is NO <Summary Sheet> button BUT there is a <Print > button.
        There is NO 3.1 'Criminogenic Needs Summary and Section Scores', NO 'Low scoring areas that may need attention in the sentence plan' and NO 'Reasons for Low Scoring Areas 
            needing attention in the sentence plan'
        At the top of the screen is a new section called 'Criminogenic Needs Summary and Scores' and lists each of the strengths and needs sections apart from 'Offence analysis' 
            and includes at the bottom a row for 'Lifestyle & Associates' which is not a specific SAN Section
        Check that this section is showing names of the SAN Assessment sections and that results are correct for the THREE columns according to the screenshots taken earlier on.
            The 'Lifestyle & Associates' row will show 'N/A' for the first THREE columns in this table. 
        Check that the section is showing the threshold scores correctly, including 'Lifestyle & Associates' - will need to check against the NEW 'crim need scores'
            questions stored in the database and prove they are correct from the SAN assessment data
        Check that the next 'Predictors' section is showing scores for OGRS3, OGP, OVP, OSP-IIC, OSP-DC and RSR
        Carry out a manual check to ensure that the OGP and OVP scores are correct to the FAST algorithm calculation - 
        will need to interogate the OASys database and use the 'L3.2 OGP and OVP FAST calculator.xls' spreadsheet to input the values and obtain the scores`, 'Test step')

        await assessment.summarySheet.goto()
        await assessment.summarySheet.summarySheet.checkStatus('notVisible')
        await assessment.summarySheet.print.checkStatus('enabled')

        const expectedValues2: ColumnValues[] = [
            {
                name: 'oasysSection',
                values: ['Accommodation', 'Employment and education', 'Finance', 'Drug use', 'Alcohol use', 'Health and wellbeing', 'Personal relationships and community', 'Thinking, behaviours and attitudes', 'Lifestyle & Associates']
            },
            {
                name: 'criminogenicNeed',
                values: ['N', 'N', 'N/A', 'N', 'N', 'N/A', 'Y', 'Y', 'N']
            },
            {
                name: 'scores',
                values: ['0', '0', 'N/A', '0', '0', 'N/A', '4', '6', '0']
            }
        ]
        await assessment.summarySheet.save.click()  // Workaround for defect NOD-1165
        await assessment.summarySheet.sanCrimTable.checkData(expectedValues2)

        const expectedPredictorsValues: ColumnValues[] = [
            {
                name: 'scoreDescription',
                values: ['All Reoffending Predictor', 'Violent Reoffending Predictor', 'Serious Violent Reoffending Predictor', 'Direct Contact - Sexual Reoffending Predictor', 'Images and Indirect Contact - Sexual Reoffending Predictor', 'Combined Serious Reoffending Predictor']
            },
            {
                name: 'twoYear',
                values: [' 29.05', '  3.71', '  0.43', '  6.18', '  3.33', '  9.94']
            },
            {
                name: 'category',
                values: ['Low  (DYNAMIC)', 'Low  (DYNAMIC)', 'Low  (DYNAMIC)', 'Very High', 'Medium', 'Very High  (DYNAMIC)']
            },
        ]
        await assessment.summarySheet.predictorsTable.checkData(expectedPredictorsValues)

        log(`There is NO 'weighted scores' section
        There is a 'Likelihood of serious harm to others' section - ensure it states that 'There is no risk information to be displayed as the RoSH Screening does not indicate a Risk of Serious Harm, and a Full Analysis has not been undertaken.'
        There is a 'Concerns' section which lists no concerns
        There is a 'Learning Screening Tool' section which will list the outcome.  I cannot predict what it will be but the sentence will start with 'This individual….'.  If it starts with 'Not enough items….' then something is wrong because the entire assessment has been completed so it must be able to work it out.
        There is an 'Offender Personality Disorder' section which will state 'This individual does not meet the criteria for the OPD pathway.'  
        There is a 'Date Assessment Completed:' which does not have a date yet`, 'Test step')

        await assessment.summarySheet.weighedScoresTable.checkVisibility(false)
        await assessment.summarySheet.likelihoodHarmOthersTable.checkRowCount(0)
        await assessment.summarySheet.likelihoodHarmOthersTable.checkText('There is no risk information to be displayed as the RoSH Screening does not indicate a Risk of Serious Harm, and a Full Analysis has not been undertaken.')
        await assessment.summarySheet.concernsTable.checkRowCount(0)
        await assessment.summarySheet.learningScreeningTool.checkValue('This individual may have some learning challenges. Further assessment may be needed to determine the support required.', true)
        await assessment.summarySheet.opdOverrideMessage.checkValue('This individual does not meet the criteria for the OPD pathway.')
        await assessment.summarySheet.dateCompleted.checkValue('\nDate Assessment Completed: \n')

        log(`Click on the <Sign & Lock> button - no outstanding questions/warnings are given
        User is given the 'Incomplete Sections Alert' - it is NOT showing Sections 2 to 13 and the Self Assessment Form.
        It does NOT show the 'Strengths and Needs Sections' as this has a green tick and will always have to have that before it can be signed off.
        Ensure that what is showing is: 1-Predictors, Initial Sentence Plan, Risk of Serious Harm Screening
        Click on <Confirm Sign & Lock> - will ask for a countersigner
        Leave the default countersigner and enter a countersign comment
        Check that a 'Sign API' has been posted to the SAN Service and the contents are correct (status passed is 'SIGNED' along with the User ID and User name)`, 'Test step')

        await signing.signAndLock({
            page: 'spService',
            expectCountersigner: true, countersigner: user.prob.probSanHeadPdu, countersignComment: '3.2 assessment needs countersigning'
        })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk2}`, {
            SAN_ASSESSMENT_LINKED_IND: 'Y',
            CLONED_FROM_PREV_OASYS_SAN_PK: null,
            SAN_ASSESSMENT_VERSION_NO: '0'
        })
        await user.logout()

        // Test ref 8 part 4
        log(`Log out and log back in as the countersigner to the probation area
        Take a note of what is in the OASYS_SET record for fields 'LASTUPD_FROM_SAN' and 'SAN_ASSESSMENT_VERSION_NO' (should have been set from the response to the SIGN API)
        Open up the countersigning task and then open up the assessment
        Countersigner shown the correct 'Countersigning Overview' screen
        Return back to the assessment - now on the first Initial Sentence Plan screen`, 'Test step')

        await user.prob.probSanHeadPdu.login()
        const sanColumnsQuery = `select LASTUPD_FROM_SAN, SAN_ASSESSMENT_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk2}`
        const sanColumnsQuery1 = await oasysDb.getData(sanColumnsQuery)

        await tasks.openAssessmentFromCountersigningTask(offender1)
        await signing.countersigningOverview.header.checkStatus('visible')
        await signing.countersigningOverview.details.checkValue('3.2 assessment needs countersigning', true)
        await signing.countersigningOverview.details.checkValue(`Countersigning required, Assessor's role at time of signing the assessment was 'Unapproved'`, true)
        const today = oasysDateTime.testStartDate.toLocaleString()
        await signing.countersigningOverview.details.checkValue(`The previous assessment was countersigned for the same risk attributes by ${user.prob.probSanHeadPdu.forenameSurname} on the ${today}`, true)

        await signing.countersigningOverview.returnToAssessment.click()
        await sentencePlan.spService.sentencePlanService.checkCurrent()

        // Test ref 8 part 5
        log(`Navigate to the 'Strengths and Needs Sections' screen - 
        Click on the button <Open Strengths and Needs> - launches into the SAN Assessment.  Ensure you can navigate through the SAN Assessment and it is ALL read only.
        Return back to the assessment via the button/link - SAN assessment disappears and returned to the 'Strengths and Needs Sections' screen in the same browser tab
        Navigate to the first screen of the Initial Sentence Plan - Countersign button is available
        Continue to countersign the assessment - check that a 'Countersign API' has been posted to the SAN Service and the contents are correct
            (outcome passed is 'COUNTERSIGNED' along with countersigners ID and name)
        Check that on the SNS_MESSAGE table there are records for OGRS, RSR and AssSumm`, 'Test step')

        await san.gotoSanReadOnly()
        await san.checkSanEditMode(false)
        await san.returnToOASys()
        await signing.countersign({ page: 'spService', comment: 'Test comment' })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])  // Note AssSumm only at this stage, as others were sent on signing
        await tasks.taskManager.checkCurrent()

        await san.queries.checkSanCountersigningCall(pk2, user.prob.probSanHeadPdu, 'COUNTERSIGNED')

        log(`Open up the Offender record
        Ensure the latest completed assessment shows an 'S&N' icon next to it
        Ensure the Offender record shows the new button called <Open S&N'> next to the <RSR> button`, 'Test step')

        await offender.searchAndSelectByCrn(offender1.probationCrn)
        const assessmentTable = await assessment.assessmentsTab.assessments.getData()
        expect(assessmentTable[1].values[0]).toContain('Includes Strengths and Needs')
        await offender.offenderDetails.openSan.checkStatus('enabled')

        log(`Check the OASYS_SET record.  Ensure the fields 'LASTUPD_FROM_SAN' and 'SAN_ASSESSMENT_VERSION_NO' remain the same as noted above
        Ensure the OASys database for this assessment has questions in Sections 2 to 12 from the SAN Assessment
        Ensure there is no Section 13
        Ensure that the new SAN section has questions in it from the SAN assessment`, 'Test step')

        const sanColumnsQuery2 = await oasysDb.getData(sanColumnsQuery)
        expect(JSON.stringify(sanColumnsQuery2)).toBe(JSON.stringify(sanColumnsQuery1))

        await assessment.queries.checkCountOfQuestionsInSection(pk2, '13', 0)
        await assessment.queries.checkCountOfQuestionsInSection(pk2, 'SAN', 12)

        log(`Open up the completed OASys-SAN asessment - now shows all READ ONLY.  
        Click on the <Print> button - check that the initial print screen does NOT show options for sections 2 to 13 and the SAQ`, 'Test step')

        await assessment.openLatest()
        await sections.offenderInformation.religion.checkStatus('readonly')
        await sections.predictors.goto()
        await sections.predictors.o1_32.checkStatus('readonly')
        await sections.predictors.print.click()
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

    return { offender: offender1 }
}