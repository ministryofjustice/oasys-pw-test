import { test } from 'fixtures'


test('NOD-1156 regression test ref 2, 3, 4', async ({ oasysDb, oasys, user, offender, assessment, sections, risk, signing, sentencePlan, san, sns }) => {

    /*
        TEST REF 2
        New Probation Offender - assessor has new SP function in their role(s)
        Create a PSR type assessment with Court Report
        Check SP Linked Ind on OASYS_SET = 'Y'
        Complete the PSR and court report including adding ONE goal and step to the ARNS Sentence Plan
        Check S&L for not agreeing the plan.  Then agree the plan.
        After S&L check the SIGN API.
        Check the Sentence Plan version number has been written to the OASYS_SET record.
        Check the correct SNS Messages have been created.
     */

    log(`Log in as a User who has the new SP function in their role(s) to a Probation Area that is not set-up for SAN
        Create a new Male Probation offender
        Create a L3 V1 PSR assessment with SDR court report
        Check the CREATE API clog and make sure the parameters have been set correctly:
            the planType will be 'PSR_OUTLINE', the assessmentType will be 'SP', newPeriodOfSupervision will be 'Y', the 'Previous….' tags will both be null`, 'Test step')

    await user.prob.probSpHeadPdu.login()
    const offender1 = await offender.createProbFromStandardOffender()
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'PSR - SDR', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'PSR Outline', includeCourtReportTemplate: 'SDR' })
    await san.queries.checkSanCreateAssessmentCall(pk1, null, null, user.prob.probSpHeadPdu, providers.prob.nonSanCode, 'PSR_OUTLINE', true, 'Y')

    log(`Check that OASYS_SET_SSP_TYPE_ELM = 'PSR_OUTLINE', OASYS_SET.ARNS_SP_ONLY_LINKED_IND = 'Y' and OASYS_SET.SAN_ASSESSMENT_LINKED_IND is NULL 
        Complete the OASys part of the assessment with whatever data you want but do NOT invoke a full analysis`, 'Test step')

    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        SSP_TYPE_ELM: 'PSR_OUTLINE',
        ARNS_SP_ONLY_LINKED_IND: 'Y',
        SAN_ASSESSMENT_LINKED_IND: null,
        CLONED_FROM_PREV_OASYS_SAN_PK: null,
    })

    await sections.offenderInformation.dateAssessmentReportRequested.setValue({})
    await sections.populateMinimal({ layer: 'Layer 3', populate6_11: 'No' })
    await risk.screeningNoRisks()

    log(`Navigate to the Sentence Plan Service screen and click on <Sign & Lock> - ensure there is an error:
        'The Sentence Plan has NOT been agreed. Please press 'Return to Assessment' and navigate back to the 'Sentence Plan Service' to complete and agree the plan.'`, 'Test step')

    await sentencePlan.spService.sentencePlanService.goto()
    await sentencePlan.spService.sentencePlanService.signAndLock.click()
    await signing.checkSingleSignAndLockError(`The Sentence Plan has NOT been agreed. Please press 'Return to Assessment' and navigate back to the 'Sentence Plan Service' to complete and agree the plan.`, true)
    await signing.signingStatus.returnToAssessment.click()

    log(`Go into the Sentence Plan, enter in ONE goal and step and agree the plan. Return back to OASys
        `, 'Test step')

    await sentencePlan.populateMinimal()

    log(`Create and complete the SDR Court Report - S&L it
        Go back into the PSR assessment
        The Sentence Plan Service screen should be showing as a green tick in the navigation menu`, 'Test step')

    await oasys.clickButton('Next')
    await sentencePlan.spService.sentencePlanService.checkCompletionStatus(true)
    await sentencePlan.psr.createPsr.authorsTeam.setValue('BED Default LDU/Default Team')
    await sentencePlan.psr.createPsr.author.setValue(user.prob.probSpHeadPdu.lovLookup)
    await sentencePlan.psr.createPsr.create.click()
    await oasys.clickButton('Sign & Lock')
    await oasys.clickButton('Sign')
    const spVersion1 = await oasysDb.getSingleNumericValue(`select SSP_PLAN_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk1}`)


    log(`Go into the sentence plan service screen
        - S&L the assessment, the 'incomplete' screen should NOT show the PSR Outline or Sentence Plan Service screens in the list and the assessment should not require countersigning
        Check the SIGN API clog for the correct parameters`, 'Test step')

    await oasys.history()
    await signing.signAndLock({ page: 'spService', expectRsrWarning: true })
    await san.queries.checkSanSigningCall(pk1, user.prob.probSpHeadPdu, 'SELF')

    log(`Check the correct SNS messages have been created, OGRS3, RSR and an ASSSUMMSAN (maybe OPD, depends on the data entered)
        Check the assessments tab for the offender - this latest completed PSR assessment shows an icon of SP against it (meaning it includes an ARNS sentence plan)`, 'Test step')

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS'])
    await oasys.history(offender1)
    const sanIcons = await assessment.assessmentsTab.assessments.san.getValues()
    expect(sanIcons[0]).toBe('Includes Sentence Plan Service')

    /*
        TEST REF 3
        Create a new Start Community assessment with an Initial plan - check the CREATE API CLOGs
        Check SP Linked Ind on OASYS_SET = 'Y'
        Check Admin user cannot change the sentence plan type
        Check navigation etc.
        Invoke a full analysis, set the overall risk of the offender to HIGH and complete entry of all questions.
        Navigate out to the Sentence Plan - ensure the ONE goal and step from the PSR assessment is shown. Add another goal and step.  Plan has already been agreed
        S&L the assessment - check the SIGN API
        Check a new Sentence Plan version number has been written to the OASYS_SET record.
        Check the correct SNS Messages have been created.
        Open up the offender's previous PSR assessment - navigate out to the sentence plan - check the OTL tags.  Sentence plan should show in READ ONLY mode and show the ONE goal and step added in Test Ref 2.
        Check the assessor cannot add any signing of the sentence plan.
    */

    log(`Create a L3 V1 Start of Community assessment with INITIAL sentence plan in the default  (not SAN)
        Check the CREATE API clog and make sure the parameters have been set correctly:
            the planType will be 'INITIAL', the assessmentType will be 'SP', newPeriodOfSupervision will be 'N', 
            previousOasysSpPk = OASYS_SET_PK of the PSR assessment from Test Ref 2, previousOasysSanPk is null
        Check that OASYS_SET_SSP_TYPE_ELM = 'INITIAL', OASYS_SET.ARNS_SP_ONLY_LINKED_IND = 'Y' and OASYS_SET.SAN_ASSESSMENT_LINKED_IND is 'N'`, 'Test step')

    const pk2 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', sentencePlanType: 'Initial' })
    await san.queries.checkSanCreateAssessmentCall(pk2, null, pk1, user.prob.probSpHeadPdu, providers.prob.nonSanCode, 'INITIAL', true, 'N')

    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk2}`, {
        SSP_TYPE_ELM: 'INITIAL',
        ARNS_SP_ONLY_LINKED_IND: 'Y',
        SAN_ASSESSMENT_LINKED_IND: null,
        CLONED_FROM_PREV_OASYS_SAN_PK: null,
    })

    log(`Log out and log back in as an ADMINISTRATOR
        Search for and open the offender record
        Open the WIP L3 V1 - ensure that from the 'Admin' menu there is NO option for 'Change Sentence Plan Type'`, 'Test step')

    await user.logout()
    await user.admin.login(providers.prob.nonSan)
    await offender.searchAndSelectByCrn(offender1.probationCrn)
    await assessment.openLatest()
    await sentencePlan.changeSentencePlan.checkMenuVisibility(false)

    log(`Log out and log back in as the assessor - open up the WIP assessment
        Check that the navigation menu does NOT have ANY of the 'Initial sentence plan' screens but there is a menu option titled 'Sentence Plan Service' after the Summary Sheet
        The Sentence Plan Service navigation option has a green tick on it because the plan was agreed as part of Test Ref 2 and it remains ongoing`, 'Test step')

    await user.logout()
    await user.prob.probSpHeadPdu.login()
    await oasys.history(offender1, 'Start of Community Order')
    await sentencePlan.spService.sentencePlanService.checkCompletionStatus(true)

    log(`Data will have cloned through from the PSR assessment.  Change some of the data to invoke a full analysis.
        Complete the full analysis screens, setting the overall risk of the offender to HIGH and complete the RMP screen`, 'Test step')

    await risk.screeningSection1.goto()
    await risk.screeningSection1.r1_2_1P.setValue('Yes')
    await oasys.clickButton('Save')
    await risk.summary.populateWithSpecificRiskLevel('High')
    await risk.rmp.populateMinimalWithTextFields()

    log(`Navigate out to the ARNS Sentence Plan - check the OTL clog entry has passed the correct parameters
        Ensure you can see the ONE goal and step from Test Ref 2
        Enter a second goal and step.  Plan remains agreed
        Return back to OASys`, 'Test step')

    await sentencePlan.spService.checkGoalCount(1, 0, 0)
    await san.queries.checkSanOtlCall(pk2,
        {
            'crn': offender1.probationCrn,
            'pnc': offender1.pnc,
            'nomisId': null,
            'givenName': offender1.forename1,
            'familyName': offender1.surname,
            'dateOfBirth': offender1.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        {
            'displayName': user.prob.probSpHeadPdu.forenameSurname,
            'planAccessMode': 'READ_WRITE',
        },
        'sp', 'assessment'
    )
    await sentencePlan.spService.addGoal('assessment')

    log(`S&L the assessment, the 'incomplete' screen should NOT show the Initial Sentence Plan or Sentence Plan Service screens in the list and the assessment should not require countersigning
        Check the SIGN API clog for the correct parameters`, 'Test step')

    await signing.signAndLock({ expectRsrWarning: true })
    await san.queries.checkSanSigningCall(pk2, user.prob.probSpHeadPdu, 'SELF')

    log(`Check that OASYS_SET.SSP_PLAN_VERSION_NO differs from the version number on the previous PSR assessment.
        Check that OASYS_SET.SAN_ASSESSMENT_VERSION_NO remains null
        Check the correct SNS messages have been created, OGRS3, RSR and an ASSSUMMSAN`, 'Test step')

    const spVersion2 = await oasysDb.getSingleNumericValue(`select SSP_PLAN_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk2}`)
    expect(spVersion2).not.toBe(spVersion1)
    const sanVersion1 = await oasysDb.getSingleNumericValue(`select SAN_ASSESSMENT_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk2}`)
    expect(sanVersion1).toBe('')
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS'])

    log(`Open up the START assessment - now all read only
        Check the database and ensure there are NO fields populated for the ISP section questions and answers
        Check the assessments tab for the offender - this latest completed START assessment shows an icon of SP against it (meaning it includes an ARNS sentence plan)`, 'Test step')

    await oasys.history(offender1)
    await assessment.openLatest()
    await sentencePlan.spService.checkGoalCount(2, 0, 0, 'assessment', true)  // checks readonly
    await assessment.queries.checkCountOfQuestionsInSection(pk2, 'ISP', 0)
    await oasys.clickButton('Close')
    const sanIcons2 = await assessment.assessmentsTab.assessments.san.getValues()
    expect(sanIcons2[0]).toBe('Includes Sentence Plan Service')

    log(`Open up the offender's previous PSR assessment - navigate out to the sentence plan - check the OTL tags.
          Sentence plan should show in READ ONLY mode and show the ONE goal and step added in Test Ref 2.`, 'Test step')

    await assessment.open(2)
    await sentencePlan.spService.checkGoalCount(1, 0, 0, 'assessment', true)
    await san.queries.checkSanOtlCall(pk1,
        {
            'crn': offender1.probationCrn,
            'pnc': offender1.pnc,
            'nomisId': null,
            'givenName': offender1.forename1,
            'familyName': offender1.surname,
            'dateOfBirth': offender1.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        {
            'displayName': user.prob.probSpHeadPdu.forenameSurname,
            'planAccessMode': 'READ_ONLY',
        },
        'sp', 'assessment'
    )
    await oasys.clickButton('Close')

    /*
    TEST REF 4
    Create a new Review assessment with a review plan - check the CREATE API CLOGs
    Check SP Linked Ind on OASYS_SET = 'Y'
    Navigate out to the Sentence Plan - ensure there are TWO goals and steps shown from the PSR and INITIAL assessments. Complete one of the goals and steps.  Plan has already been agreed
    S&L the assessment - check the SIGN API
    Check a new Sentence Plan version number has been written to the OASYS_SET record.
    Check the correct SNS Messages have been created.
    Open up the offender's previous INITIAL assessment - navigate out to the sentence plan - check the OTL tags.  Sentence plan should show in READ ONLY mode and show the TWO ACTIVE goals and steps as per Test Ref 3.
    Check the assessor cannot add any signing of the sentence plan.
    */

    log(`Create a L3 V1 REVIEW assessment with REVIEW sentence plan in the default (not SAN)
        Check the CREATE API clog and make sure the parameters have been set correctly:
            the planType will be 'REVIEW', the assessmentType will be 'SP', newPeriodOfSupervision will be 'N',
            previousOasysSpPk = OASYS_SET_PK of the PSR assessment from Test Ref 3, previousOasysSanPk is null
        Check that OASYS_SET_SSP_TYPE_ELM = 'REVIEW', OASYS_SET.ARNS_SP_ONLY_LINKED_IND = 'Y' and OASYS_SET.SAN_ASSESSMENT_LINKED_IND is 'N'`, 'Test step')

    const pk3 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
    await san.queries.checkSanCreateAssessmentCall(pk3, null, pk2, user.prob.probSpHeadPdu, providers.prob.nonSanCode, 'REVIEW', true, 'N')

    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk3}`, {
        SSP_TYPE_ELM: 'REVIEW',
        ARNS_SP_ONLY_LINKED_IND: 'Y',
        SAN_ASSESSMENT_LINKED_IND: null,
        CLONED_FROM_PREV_OASYS_SAN_PK: null,
    })

    log(`Check that the navigation menu does NOT have ANY of the 'Review sentence plan' screens but there is a menu option titled 'Sentence Plan Service' after the Summary Sheet
        The Sentence Plan Service navigation option has a green tick on it because the plan was agreed as part of Test Ref 2 and it remains ongoing 
            and there has been no new supervision period.
        Check the database and ensure there are NO fields populated for the RSP section questions and answers EXCEPT for RP.3 which is set to 'REVIEW' 
            (this has to remain in case we are told to 'TERMINATE' the offender from the ARNS Sentence Plan data response.`, 'Test step')

    await sentencePlan.spService.sentencePlanService.checkCompletionStatus(true)
    await assessment.queries.checkCountOfQuestionsInSection(pk3, 'RSP', 1)
    await assessment.queries.checkSingleAnswer(pk3, 'RSP', 'RP.3', 'refAnswer', 'REVIEW')

    log(`Navigate out to the ARNS Sentence Plan - check the OTL clog entry has passed the correct parameters
        Ensure there are the TWO goals and steps as entered in Test Ref 2 and Test Ref 3
        Complete ONE of the goals and steps, leaves One active.  Plan remains agreed.
        Return back to OASys`, 'Test step')

    await sentencePlan.spService.completeFirstGoal()

    log(`S&L the assessment, the 'incomplete' screen should NOT show the PSR Outline or Sentence Plan Service screens in the list and the assessment should not require countersigning
        Check the SIGN API clog for the correct parameters
        REVIEW assessment is now fully completed
        Check that OASYS_SET.SSP_PLAN_VERSION_NO is set to the number returned from the SIGN API processing and it differs from the version number on the previous START assessment.
        Check that OASYS_SET.SAN_ASSESSMENT_VERSION_NO remains null
        Check the correct SNS messages have been created
        Check the database and ensure there are NO fields populated for the RSP section questions and answers EXCEPT for RP.3 which is set to 'REVIEW' (this has to remain in case we are told to 'TERMINATE' the offender from the ARNS Sentence Plan data response.
        Check the assessments tab for the offender - this latest completed REVIEW assessment shows an icon of SP against it (meaning it includes an ARNS sentence plan)`, 'Test step')

    await signing.signAndLock({ expectRsrWarning: true })
    await san.queries.checkSanSigningCall(pk3, user.prob.probSpHeadPdu, 'SELF')

    const spVersion3 = await oasysDb.getSingleNumericValue(`select SSP_PLAN_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk3}`)
    expect(spVersion3).not.toBe(spVersion2)
    const sanVersion2 = await oasysDb.getSingleNumericValue(`select SAN_ASSESSMENT_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk3}`)
    expect(sanVersion2).toBe('')
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment')
    await assessment.queries.checkCountOfQuestionsInSection(pk3, 'RSP', 1)
    await assessment.queries.checkSingleAnswer(pk3, 'RSP', 'RP.3', 'refAnswer', 'REVIEW')
    await oasys.history(offender1)
    const sanIcons3 = await assessment.assessmentsTab.assessments.san.getValues()
    expect(sanIcons3[0]).toBe('Includes Sentence Plan Service')

    log(`Open up the offender's previous START assessment - navigate out to the sentence plan - check the OTL tags.  
        Sentence plan should show in READ ONLY mode and show the TWO goals and steps as they were in Test Ref 2.`, 'Test step')

    await assessment.open(2)
    await sentencePlan.spService.checkGoalCount(2, 0, 0, 'assessment', true)
    await san.queries.checkSanOtlCall(pk2,
        {
            'crn': offender1.probationCrn,
            'pnc': offender1.pnc,
            'nomisId': null,
            'givenName': offender1.forename1,
            'familyName': offender1.surname,
            'dateOfBirth': offender1.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        {
            'displayName': user.prob.probSpHeadPdu.forenameSurname,
            'planAccessMode': 'READ_ONLY',
        },
        'sp', 'assessment'
    )

    await oasys.clickButton('Close')

    log(`Open up the offender's latest REVIEW assessment - navigate out to the sentence plan - check the OTL tags.  
        Sentence plan should show in READ ONLY mode and the ONE ACTIVE goal and step and ONE COMPLETED goal and step.  The plan remains agreed.`, 'Test step')

    await assessment.openLatest()
    await sentencePlan.spService.checkGoalCount(1, 0, 1, 'assessment', true)
    await san.queries.checkSanOtlCall(pk2,
        {
            'crn': offender1.probationCrn,
            'pnc': offender1.pnc,
            'nomisId': null,
            'givenName': offender1.forename1,
            'familyName': offender1.surname,
            'dateOfBirth': offender1.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        {
            'displayName': user.prob.probSpHeadPdu.forenameSurname,
            'planAccessMode': 'READ_ONLY',
        },
        'sp', 'assessment'
    )

    await user.logout()
})
