import { test } from 'fixtures'

/**
    New Probation Offender - assessor has new SP function in their role(s)
    Create a PSR type assessment with Court Report
    Check SP Linked Ind on OASYS_SET = 'Y'
    Complete the PSR and court report including adding ONE goal and step to the ARNS Sentence Plan
    Check S&L for not agreeing the plan.  Then agree the plan.
    After S&L check the SIGN API.
    Check the Sentence Plan version number has been written to the OASYS_SET record.
    Check the correct SNS Messages have been created.
 */

test('NOD-1156 regression test ref 2', async ({ oasys, offender, assessment, sections, risk, signing, sentencePlan, san, sns }) => {

    log(`Log in as a User who has the new SP function in their role(s) to a Probation Area that is not set-up for SAN
        Create a new Male Probation offender
        Create a L3 V1 PSR assessment with SDR court report
        Check the CREATE API clog and make sure the parameters have been set correctly:
            the planType will be 'PSR_OUTLINE', the assessmentType will be 'SP', newPeriodOfSupervision will be 'Y', the 'Previous….' tags will both be null`, 'Test step')

    await oasys.login(oasys.users.probSpHeadPdu)
    const offender1 = await offender.createProbFromStandardOffender()
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'PSR - SDR', assessmentLayer: 'Full (Layer 3)', sentencePlanType: 'PSR Outline', includeCourtReportTemplate: 'SDR' })
    await san.queries.checkSanCreateAssessmentCall(pk1, null, null, oasys.users.probSpHeadPdu, oasys.users.probationNonSanCode, 'PSR_OUTLINE', true, 'Y')

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
    await sentencePlan.psr.createPsr.author.setValue(oasys.users.probSpHeadPdu.lovLookup)
    await sentencePlan.psr.createPsr.create.click()
    await oasys.clickButton('Sign & Lock')
    await oasys.clickButton('Sign')


    log(`Go into the sentence plan service screen
        - S&L the assessment, the 'incomplete' screen should NOT show the PSR Outline or Sentence Plan Service screens in the list and the assessment should not require countersigning
        Check the SIGN API clog for the correct parameters`, 'Test step')

    await oasys.history()
    await signing.signAndLock({ page: 'spService', expectRsrWarning: true })
    await san.queries.checkSanSigningCall(pk1, oasys.users.probSpHeadPdu, 'SELF')

    log(`Check the correct SNS messages have been created, OGRS3, RSR and an ASSSUMMSAN (maybe OPD, depends on the data entered)
        Check the assessments tab for the offender - this latest completed PSR assessment shows an icon of SP against it (meaning it includes an ARNS sentence plan)`, 'Test step')

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS'])
    await oasys.history(offender1)
    const sanIcons = await assessment.assessmentsTab.assessments.san.getValues()
    expect(sanIcons[0]).toBe('Includes Sentence Plan Service')

    await oasys.logout()

})
