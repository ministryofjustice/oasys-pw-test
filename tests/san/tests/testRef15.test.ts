import { test } from 'fixtures'
import * as testData from '../data/testRef15'


test('SAN integration - test ref 15', async ({ oasys, user, offender, assessment, sections, sentencePlan, san, risk, signing }) => {

    await user.pris.prisSanCAdm.login()
    const offender1 = await offender.createPrisFromStandardOffender({ forename1: 'TestRefFifteen' })

    log(`Log in as a prison user who has the Case Admin role but DOES NOT have the SAN function.
        Open up the offender record.
        Create a Start Custody, layer 3, initial sentence plan.  At select Assessor select an Assessor who does have the SAN function and has the framework role 
        'Unpproved' with a default csigner who has the 'Approved Prison POM….' role.
        Now the new SAN question appears asking if they want to 'Include strengths and needs sections' which has defaulted to 'Yes' 
        Create the assessment - navigation menu does not show section 2 to 13 or the SAQ.  There is a menu option for 'Strengths and Needs'
        There is  menu option for 'Sentence Plan Service' and the 'Initial Sentence Plan' menu has ONE option below it for 'Section 5.2 to 8'
        Check the database - ensure the OASYS_SET.SAN_ASSESSMENT_LINKED_IND = 'Y'
        Check that a CreateAssessment API post was sent off with the correct details in it (the OASYS_SET_PK of the newly created record, the parameter for
                previous PK is null, and the user ID and name are correct and the planType is INITIAL)
        With the introduction of the sentence plan service ensure that the CREATE API also now includes a parameter of 'planType' that is set to 'INITIAL'
        Check that we get a '200' response back from the API - the response contains parameters back and now includes sentence plan data
        Ensure that we have NOT stored down any SAN version number OR Sentence Plan version number on the OASYS_SET record`, 'Test step')

    const pk1 = await assessment.createPris({ purposeOfAssessment: 'Start custody', selectAssessor: user.pris.prisSanUnappr.lovLookup })

    await san.checkLayer3Menu(true, sections)

    await san.queries.checkSanCreateAssessmentCall(pk1, null, null, user.pris.prisSanCAdm, providers.pris.sanCode, 'INITIAL')
    await san.queries.checkSanGetAssessmentCall(pk1, 0)

    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        CLONED_FROM_PREV_OASYS_SAN_PK: null,
        SAN_ASSESSMENT_VERSION_NO: null,
        SSP_PLAN_VERSION_NO: null,
    })

    log(`Complete sections Case ID and Section 1 with a non-sexual offence`)

    await sections.offendingInformation.populateMinimal()
    await sections.predictors.goto()
    await sections.predictors.dateFirstSanction.setValue({ years: -3 })
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -6 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({ months: -1 })
    await sections.predictors.markCompleteAndCheck()

    log(`Navigate out to S&N section - check the OTL parameters (should go across as READ ONLY).  Check you cannot edit anything in the SAN Assessment
                    Return back to the OASys assessment.
                    Navigate out to Sentence Plan section - check the OTL parameters (should go across as READ ONLY).  Check you cannot edit anything in the Sentence Plan
                    Return back to the OASys assessment.`, 'Test step')

    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.returnToOASys()
    await san.queries.checkSanOtlCall(pk1, {
        'crn': null,
        'pnc': offender1.pnc,
        'nomisId': offender1.nomisId,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'PRISON',
        'sexuallyMotivatedOffenceHistory': 'NO',
    }, {
        'displayName': user.pris.prisSanCAdm.forenameSurname,
        'accessMode': 'READ_ONLY',
    },
        'san', 'assessment'
    )

    await sentencePlan.checkReadOnly()

    await san.queries.checkSanOtlCall(pk1, {
        'crn': null,
        'pnc': offender1.pnc,
        'nomisId': offender1.nomisId,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'PRISON',
        'sexuallyMotivatedOffenceHistory': 'NO',
    }, {
        'displayName': user.pris.prisSanCAdm.forenameSurname,
        'planAccessMode': 'READ_ONLY',
    },
        'sp', 'assessment'
    )

    log(`Log out and log back in again as the actual Assessor of the OASys-SAN assessment.  This assessor needs to have a framework role of 
            'Unapproved' with a default countersigner that has 'Approved Prison POM, approved PQiP, NQO or unapproved Probation POM' 
            (can sign up to Medium risk with exceptions).
        Navigate out to the 'Strengths and Needs Sections' - complete ALL of the SAN assessment with anything you like but say Yes to Drugs
            and make sure you select some drugs and include Other and then enter in exactly 400 characters for the text to go with other drugs.
        Return back to the OASys assessment.  Have to navigate to a new screen - This will activate a pull of the SAN data.
        Check that the database now has data in sections 2 to 12, definitely check that Section 8 contains data for the drugs entered in the SAN Assessment and that the Other Drug text field has all 400 characters in it.
        The 'Strengths and Needs Sections' menu item has a green tick against it`, 'Test step')

    await user.logout()
    await user.pris.prisSanUnappr.login()
    await offender.searchAndSelect(offender1)
    await assessment.openLatest()


    await san.gotoSan()
    await san.populateSanSections('Test ref 15', testData.sanPopulation, true)
    await san.returnToOASys()
    await oasys.clickButton('Next')

    const failed = await assessment.queries.checkAnswers(pk1, testData.dataFromSan, true)
    expect(failed).toBeFalsy()
    await san.sanSections.checkCompletionStatus(true)

    log(`Complete the remaining sections in the OASys assessment and invoke a full analysis.  Complete the full analysis and set the offender as 'HIGH' risk.`, 'Test step')

    await risk.screeningSection1.goto()
    await risk.screeningSection1.mark1_2AsNo.click()
    await risk.screeningSection1.mark1_3AsNo.click()
    await risk.screeningSection1.r1_4.setValue('No')

    await risk.screeningSection2to4.goto()
    await risk.screeningSection2to4.r2_3.setValue('No')
    await risk.screeningSection2to4.rationale.setValue('Because')
    await risk.screeningSection2to4.r3_1.setValue('No')
    await risk.screeningSection2to4.r3_2.setValue('No')
    await risk.screeningSection2to4.r3_3.setValue('No')
    await risk.screeningSection2to4.r3_4.setValue('No')
    await risk.screeningSection2to4.r4_1.setValue('No')
    await risk.screeningSection2to4.r4_6.setValue('No')
    await risk.screeningSection2to4.r4_4.setValue('No')

    await risk.populateWithSpecificRiskLevel('High', false, 'pris')

    log(`Navigate out to the 'Sentence Plan Service' 
        Ensure that the OTL sends the correct data for the new 'criminogenicNeedsData' parameter (check to the Summary Sheet in OASys)
        Complete the sentence plan with at least one goal/steps and ensure you 'agree the plan' which will give a 'COMPLETE' status back.  
            Do not change the sentence plan type.
        Return back to the OASys assessment.`, 'Test step')

    await sentencePlan.populateMinimal()

    await san.queries.checkSanOtlCall(pk1, {
        'crn': null,
        'pnc': offender1.pnc,
        'nomisId': offender1.nomisId,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'PRISON',
        'sexuallyMotivatedOffenceHistory': 'NO',
    }, {
        'displayName': user.pris.prisSanUnappr.forenameSurname,
        'planAccessMode': 'READ_WRITE',
    },
        'sp', 'assessment', testData.otlCrimNeeds
    )

    log(`For each of the OASys assessment sections, apart from Case ID and Summary Sheet, click on the 'Mark as Complete' flag.
        Sign and lock the assessment`, 'Test step')

    await risk.screeningSection1.markCompleteAndCheck()
    await risk.summary.markCompleteAndCheck()
    await risk.rmp.markCompleteAndCheck()

    await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersignComment: 'Signing test 15' })

    await user.logout()


    await user.pris.prisSanPom.login()
    await offender.searchAndSelect(offender1)
    await assessment.openLatest()

    log(`Countersign the assessment - Check that the countersigning option NO LONGER include 'Send for sentence board comments' 
        Continue to countersign - asks for a second countersign - accept default and continue to countersign - check that the COUNTERSIGN API has been posted 
            with contents correct (outcome = 'AWAITING_DOUBLE_COUNTERSIGN' along with first countersigners ID and name)`, 'Test step')

    await signing.countersign({ page: 'spService', comment: 'Countersigning test ref 15', expectSecondCountersigner: true })

    await san.queries.checkSanCountersigningCall(pk1, user.pris.prisSanPom, 'AWAITING_DOUBLE_COUNTERSIGN')

    await user.logout()

    log(`Log in as the second countersigner - countersign the assessment, is now fully completed - check the COUNTERSIGN API has been posted with 
        contents correct (outcome = 'DOUBLE_COUNTERSIGNED' along with second countersigners ID and name)
        OASys-SAN assessment now in read only mode - Print the whole of the assessment.  Ensure the printout is correct to the screens.`, 'Test step')

    await user.pris.prisSanHomds.login()
    await offender.searchAndSelect(offender1)
    await assessment.openLatest()
    await signing.countersign({ page: 'spService', comment: 'Countersigning test ref 15 second time' })

    await san.queries.checkSanCountersigningCall(pk1, user.pris.prisSanHomds, 'DOUBLE_COUNTERSIGNED')

    await oasys.history()
    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    await sentencePlan.checkReadOnly()

    await user.logout()
})
