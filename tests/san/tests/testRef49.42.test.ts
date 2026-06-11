import { test } from 'fixtures'

/**
    New FEMALE Probation Offender in SAN Area - check functionality when say 'No' to cloning from an Historic OASys-SAN assessment.
 */

test('SAN integration - test refs 49 and 42', async ({ oasys, user, offender, assessment, sections, san, risk, sentencePlan, signing }) => {

    await user.prob.probSanHeadPdu.login()
    const offender1 = await offender.createProbFromStandardOffender({ forename1: 'TestRefFortyNine' })
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await san.populateMinimal()
    await sentencePlan.populateMinimal()

    // Complete section 1
    await sections.offendingInformation.populateMinimal()

    await sections.predictors.goto()
    await sections.predictors.dateFirstSanction.setValue({ years: -2 })
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({})

    // Complete risk, sign and lock
    await risk.screeningNoRisks()
    await oasys.clickButton('Save')
    await signing.signAndLock({ page: 'spService' })

    // Mark all assessments as historic

    await oasys.history()
    await assessment.markHistoric()

    log(`Open up the offender record
        Click on the <Open S&N> button - SAN opens in READ ONLY mode
        Ensure the OTL passes across READ_ONLY for the accessMode and the assessment version number is NULL
        Return to OASys`, 'Test step')

    await oasys.history(offender1)
    await san.gotoSanFromOffender(true)
    await san.queries.checkSanOtlCall(pk1, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': 'NO',
    },
        { 'displayName': user.prob.probSanHeadPdu.forenameSurname, 'accessMode': 'READ_ONLY', },
        'san', 'offender'
    )
    await san.returnToOASys()

    log(`Open the historic 3.2 assessment
        Navigate out to the SAN Service via the screen - SAN opens in READ ONLY mode
        Ensure the OTL passes across READ_ONLY for the accessMode and the assessment version number is 0 (or whatever number is held on the OASYS_SET record)
        Return to OASys
        Navigate out to the Sentence Plan Service via the screen - Sentence Plan opens in READ ONLY mode
        Ensure the OTL passes across READ_ONLY for the accessMode and the sentence plan version number is 0 (or whatever number is held on the OASYS_SET record)
        Return to OASys`, 'Test step')

    await assessment.openLatest()

    await san.gotoSanReadOnly()
    await san.queries.checkSanOtlCall(pk1, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': 'NO',
    },
        { 'displayName': user.prob.probSanHeadPdu.forenameSurname, 'accessMode': 'READ_ONLY', },
        'san', 'assessment'
    )

    await san.returnToOASys()
    await sentencePlan.spService.checkReadOnly()

    await san.queries.checkSanOtlCall(pk1, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': 'NO',
    },
        { 'displayName': user.prob.probSanHeadPdu.forenameSurname, 'planAccessMode': 'READ_ONLY', },
        'sp', 'assessment'
    )

    await oasys.clickButton('Close')


    log(`For the assessment in a new period of supervision create a classic 3.1 OASys assessment
        During the create process say 'Yes' to cloning from the historic 3.2 assessment`, 'Test step')

    const pk2 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' }, 'Yes')

    log(`Check the OASYS_SET record - field CLONED_FROM_PREV_OASYS_SAN_PK is set to the PK of the historic 3.2 assessment
        Check other OASYS_SET record fields; SAN_ASSESSMENT_LINKED_IND is N, LASTUPD_FROM_SAN is populated,  retrieved the data but SAN_ASSESSMENT_VERSION_NO
            AND SSP_PLAN_VERSION_NO are NULL.`, 'Test step')

    await san.queries.getSanApiTimeAndCheckDbValues(pk2, 'N', pk1)

    log(`Check that there are NO OASYS_SECTION records for 'SAN'
        Check that on any cloned through OASYS_SECTION records the fields 'SAN_CRIM_NEED_SCORE' have been nulled out
        Check that the OASys sections has data cloned from the historic 3.2 assessment (confirmed by GetAssessment call and completion of some mandatory questions)`)

    await san.queries.checkNoSanSections(pk2)
    await san.queries.checkNoSanSectionScores(pk2)
    await san.queries.checkSanGetAssessmentCall(pk1, 0)

    log(`Complete the 3.1 assessment and then fully sign and lock and countersign (if applicable) the 3.1 assessment.`)

    await sections.offendingInformation.goto()
    await sections.offendingInformation.count.setValue(1)
    await sections.predictors.goto()
    await sections.predictors.o1_32.setValue(3)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ days: -10 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({ months: 6 })

    await sections.section2.goto()
    await sections.section2.briefOffenceDetails.checkValue('Offence description') // Confirms cloning from historic SAN
    await sections.section2.o2_14.setValue('No')
    await sections.sections2To13NoIssues()

    await sections.selfAssessmentForm.populateMinimal()
    await sentencePlan.populateMinimal()
    await signing.signAndLock()

    log(`Now check the access to the SAN and Sentence Plan service again, now that we have a 3.1 assessment
        Open up the offender record
        Click on the <Open S&N> button - SAN opens in READ ONLY mode
        Ensure the OTL passes across READ_ONLY for the accessMode and the assessment version number is NULL
        Return to OASys`, 'Test step')

    await oasys.history(offender1)
    await san.gotoSanFromOffender(true)
    await san.checkSanEditMode(false)

    await san.queries.checkSanOtlCall(pk1, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': 'NO',
    },
        { 'displayName': user.prob.probSanHeadPdu.forenameSurname, 'accessMode': 'READ_ONLY', },
        'san', 'offender'
    )

    await san.returnToOASys()

    log(`Click on the <Open SP> button - Sentence Plan opens in READ/WRITE mode
        Ensure the OTL passes across READ_WRITE for the accessMode and the sentence plan version number is NULL
        Return to OASys`, 'Test step')

    await sentencePlan.spService.openAndReturn('offender')

    await san.queries.checkSanOtlCall(pk2, {
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
        { 'displayName': user.prob.probSanHeadPdu.forenameSurname, 'planAccessMode': 'READ_WRITE', },
        'san', 'offender'
    )

    log(`Open the historic 3.2 assessment
        Navigate out to the SAN Service via the screen - SAN opens in READ ONLY mode
        Ensure the OTL passes across READ_ONLY for the accessMode and the assessment version number is 0 (or whatever number is held on the OASYS_SET record)
        Return to OASys
        Navigate out to the Sentence Plan Service via the screen - Sentence Plan opens in READ ONLY mode
        Ensure the OTL passes across READ_ONLY for the accessMode and the sentence plan version number is 0 (or whatever number is held on the OASYS_SET record)
        Return to OASys`, 'Test step')

    await assessment.open(2)  // Row 1 is the 3.1 assessment, row 2 is historic 3.2

    await san.gotoSanReadOnly()
    await san.queries.checkSanOtlCall(pk1, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': 'NO',
    }, {
        'displayName': user.prob.probSanHeadPdu.forenameSurname,
        'accessMode': 'READ_ONLY',
    },
        'san', 'assessment'
    )

    await san.returnToOASys()
    await sentencePlan.spService.openAndReturn('assessment', true)

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
            'sexuallyMotivatedOffenceHistory': 'NO',
        },
        {
            'displayName': user.prob.probSanHeadPdu.forenameSurname,
            'planAccessMode': 'READ_ONLY',
        },

        'sp', 'assessment'
    )
    await oasys.clickButton('Close')

    /*
        Check functionality for the Fast Review POA 
    */

    log(`Find a probation offender in the SAN PILOT AREA whose latest assessment is a Layer 3 Version 1
        Click on the <Create Assessment> button and go through the processing to land on the Create Assessment page
        Change the POA and select Fast Review`, 'Test step')

    await assessment.getToCreateAssessmentPage()
    await assessment.createAssessmentPage.purposeOfAssessment.setValue('Fast Review')

    log(`Select 'No' at Include strengths and needs sections? - Fast Review remains
        Change 'No' to 'Yes' screen refreshes and 'Fast Review' automatically changes to 'Review' - because you cannot action a FAST REVIEW for an OASys-SAN assessment`, 'Test step')

    await assessment.createAssessmentPage.includeSanSections.setValue('No')
    await assessment.createAssessmentPage.purposeOfAssessment.checkValue('Fast Review')
    await assessment.createAssessmentPage.includeSanSections.setValue('Yes')
    await assessment.createAssessmentPage.purposeOfAssessment.checkValue('Review')

    log(`Now change the POA to Fast Review - the question is nulled out
        Try clicking on <Create> - get error msg`, 'Test step')

    await assessment.createAssessmentPage.purposeOfAssessment.setValue('Fast Review')
    await assessment.createAssessmentPage.includeSanSections.checkValue('')
    await assessment.createAssessmentPage.create.click()
    await oasys.checkErrorMessage('You must decide if you want to include strengths and needs before being able to create the assessment.')

    log(`Say No to the question. Click on <Create>`)

    await assessment.createAssessmentPage.includeSanSections.setValue('No')
    await assessment.createAssessmentPage.create.click()

    log(`Complete the Fast Review assessment`, 'Test step')

    await sections.fastReview.populateNoChanges()
    await signing.signAndLock({ page: 'spService' })

    log(`Click on the <Create Assessment> button and go through the processing to land on the Create Assessment page - defaults POA to Fast Review
        Answer 'Yes' to the question - screen refreshes and changes 'Fast Review' to 'Review' and blanks out the question
        Answer Yes to the question
        Click on <Create> - now have an OASys-SAN assessment (3.2)`, 'Test step')

    await oasys.history(offender1)
    await assessment.getToCreateAssessmentPage()
    await assessment.createAssessmentPage.purposeOfAssessment.checkValue('Fast Review')
    await assessment.createAssessmentPage.includeSanSections.setValue('Yes')
    await assessment.createAssessmentPage.purposeOfAssessment.checkValue('Review')
    await assessment.createAssessmentPage.includeSanSections.checkValue('')
    await assessment.createAssessmentPage.includeSanSections.setValue('Yes')
    await assessment.createAssessmentPage.create.click()

    log(`Complete the 3.2 assessment including sentence plan with whatever you like
        Click on the <Create Assessment> button and go through the processing to land on the Create Assessment page
        Ensure that the POA drop down list does NOT contain FAST REVIEW`, 'Test step')

    await signing.signAndLock({ page: 'spService' })

    await oasys.history(offender1)
    await assessment.getToCreateAssessmentPage()
    await assessment.createAssessmentPage.purposeOfAssessment.checkOptionNotAvailable('Fast Review')

    await user.logout()

})
