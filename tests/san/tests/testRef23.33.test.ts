import { test } from 'fixtures'
import * as testData from '../data/testRef23'

/**
    ROLLBACK - ensure ROLLBACK API is sent with the parameters set correctly
    This test has an offender whose gender is 'Not known' which means OGRS, OGP, OVP and RSR cannot calculate but what do we get back for the
    alcohol sections questions 9.1 and 9.2
 */

test('SAN integration - test refs 23 and 33', async ({ oasys, user, offender, assessment, sections, sentencePlan, san, risk, signing, sns }) => {

    await user.prob.probSanHeadPdu.login()  // No countersigning for this test
    const offender1 = await offender.createProbFromStandardOffender({ forename1: 'TestRefTwentyThree', gender: 'Not known' })

    log(`For the first assessment, create a new OASys-SAN assessment (3.2)	
        Ensure the Create Assessment API is sent to the SAN service and the parameters are correct	
        Complete the SAN Assessment part: 	
            - in the Alcohol section say 'Yes' to question 'Has ? ever drunk alcohol' and then complete any other alcohol questions shown on screen
            - doesn't matter what else you answer in the remaining sections but DO NOT invoke a full analysis, just need to get a completed 3.2
        Return back to the OASys part of the assessment and complete it BUT DO NOT invoke a full analysis`, 'Test step')

    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await san.gotoSan()
    await san.populateSanSections('Test ref 23', testData.sanPopulation1, true)
    await san.returnToOASys()

    await sections.offendingInformation.populateMinimal()

    await sections.predictors.goto()
    await sections.predictors.dateFirstSanction.setValue({ years: -2 })
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({})

    await risk.screeningNoRisks(true)

    log(`Check in the database to see what questions have been set for section 9 - interested to know how SAN have treated an Offender who is NOT male or female
            for the alcohol questions
        Check that OGRS, OGP and OVP have NOT calculated because of the offender's gender
        In the Predictors screen check that for RSR it hasn't calculated due to 'RSR can't be calculated on gender other than Male or Female'`, 'Test step')

    const failed = await assessment.queries.checkAnswers(pk1, [
        { section: '9', q: '9.1', a: '0' },
        { section: '9', q: '9.1.t', a: 'Only drinks once a month or less and consumes 1 to 2 units a day, when they drink.' },
        { section: '9', q: '9.2', a: '0' },
        { section: '9', q: '9.97', a: null },
        { section: '9', q: '9.98', a: 'NO' },
        { section: '9', q: '9.99', a: 'NO' },
        { section: '9', q: '9_SAN_STRENGTH', a: 'NO' },
    ], true)
    expect(failed).toBeFalsy()

    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        CLONED_FROM_PREV_OASYS_SAN_PK: null,
        SAN_ASSESSMENT_VERSION_NO: null,
        SSP_PLAN_VERSION_NO: null,
        OGRS3_1YEAR: null,
        OGRS3_2YEAR: null,
        OGP_1YEAR: null,
        OGP_2YEAR: null,
        OVP_1YEAR: null,
        OVP_2YEAR: null,
    })

    await sections.predictors.goto()
    await sections.predictors.csrpText.checkValue(`Unable to calculate due to: \nCombined Serious Reoffending Predictor can't be calculated on gender other than Male and Female.`, true)

    log(`Check that the Summary screen is showing the correct information for the Criminogenic Needs and threshold section and that in the Predictors Scores % 
        and Risk Category OGRS, OGP and OVP just show dashes, both OSP rows show N/A,  the RSR row shows N/A and then two dashes`, 'Test step')

    await assessment.summarySheet.goto()
    await oasys.clickButton('Save')  // TODO workaround for defect NOD-1165
    const expectedValues: ColumnValues[] = [
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
    await assessment.summarySheet.sanCrimTable.checkData(expectedValues)

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

    log(`Navigate out to the 'Sentence Plan Service' - complete entry with 1 goal/step and ensure you 'Agree the Plan'
        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
        Navigate to Sentence Plan screen - complete entry of the three fields on the screen for Public Protection conference
        Sign and lock the assessment - no countersigner required.
        Ensure the Sign API is sent to the SAN service and the parameters are correct
        Ensure we get back a 200 response from the Sign API and that OASYS_SET.SAN_ASSESSMENT_VERSION_NO and OASYS_SET.SSP_PLAN_VERSION NO have been populated
        Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`, 'Test step')

    await sentencePlan.populateMinimal()

    await signing.signAndLock({ page: 'spService' })
    await san.queries.checkSanSigningCall(pk1, user.prob.probSanHeadPdu, 'SELF')
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])

    log(`Still logged in as the Assessor open up the SAN Assessment from the offender records 'Open S&N' button.
        This should have invoked a new version of the SAN Assessment in their database - Change some of the data and set a couple of the section
            'Linked to risk of serious harm…' questions to 'Yes'
        Save the SAN data ensuring it is fully complete and then return back to the OASys Offender record screen`, 'Test step')

    await oasys.history(offender1)

    await san.gotoSanFromOffender()
    await san.populateSanSections('Test ref 23 modification', testData.modifySan, true)
    await san.returnToOASys()

    log(`Now open up the Sentence Plan from the offender records 'Open SP' button
        This should have invoked a new version of the Sentence Plan in their database - Add another goal/steps to the sentence plan 
        Return back to the OASys Offender record screen`, 'Test step')

    await sentencePlan.spService.addGoal('offender')

    await user.logout()

    log(`Log out and log back in again as an Administrator
        Open up the Offender record and open up the OASys-SAN assessment which is all read only.  No data is updated from SAN.
        From the Admin menu click on 'Rollback assessment' and follow the instructions to roll the assessment back
        Offender's OASys-SAN assessment is now WIP again and editable by the assessor
        Check that an OASYS_SIGNING record has been created for 'ROLLBACK'
        Ensure that the Rollback API is sent to the SAN service detailing the OASYS_SET_PK for parameter 'oasysAssessmentPk', the OASYS_SET.SAN_ASSESSMENT_VERSION_NO 
            for parameter 'sanVersionNumber', the OASYS_SET.SSP_PLAN_VERSION_NO fo parameter 'sentencePlanVersionNumber' along with user ID and name
        After the call has been sent ensure that OASYS_SET.SAN_ASSESSMENT_VERSION_NO and OASYS_SET.SSP_PLAN_VERSION_NO have been nulled out due to becoming editable again
        Check that a new 'Assessment Work in Progress' task has been created`, 'Test step')

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelect(offender1)
    await assessment.openLatest()

    await assessment.rollBack()
    await assessment.queries.checkSigningRecord(pk1, ['ROLLBACK', 'SIGNING'])
    await san.queries.checkSanRollbackCall(pk1, user.admin)

    await user.logout()

    log(`Log out and log back in again as the Assessor
        Assessment opens to the Case ID landing page - ensure that the navigation menu is now showing a full analysis with sections 6.1 and 6.2 in it -
            invoked via the SAN data
        Complete entry of the full analysis etc. in the OASys part of the assessment 
        Sign and lock the assessment - no countersigner required.`, 'Test step')

    await user.prob.probSanHeadPdu.login()
    await oasys.history(offender1)
    await assessment.openLatest()

    await risk.fullAnalysisSection62.checkMenuVisibility(true)
    await risk.populateWithSpecificRiskLevel('Low')
    await risk.rmp.populateMinimal()

    await signing.signAndLock({ page: 'spService' })

    log(`Ensure the Sign API is sent to the SAN service and the parameters are correct
        Ensure we get back a 200 response from the Sign API and that OASYS_SET.SAN_ASSESSMENT_VERSION_NO and OASYS_SET.SPP_PLAN_VERSION_NO have been populated
            and they differ from the version numbers logged at the time of the initial S&L
        Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`, 'Test step')

    await san.queries.checkSanSigningCall(pk1, user.prob.probSanHeadPdu, 'SELF')
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])

    log(`Go to Create a new Assessment
        Check that the 'Purpose of Assessment' field does NOT include 'Fast Review' in the drop downs because the last assessment is SAN`, 'Test step')

    await oasys.history(offender1)
    await assessment.getToCreateAssessmentPage()
    await assessment.createAssessmentPage.purposeOfAssessment.checkOptionNotAvailable('Fast Review')
    await user.logout()

})