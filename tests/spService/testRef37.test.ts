import { test } from 'fixtures'


test('NOD-1156 regression test ref 37', async ({ oasysDb, oasys, user, offender, assessment, sections, signing, sentencePlan, san }) => {

    /*
        New Probation Offender 
        1st assessment - L3 V2 SAN
        2nd assessment - L3 V1 SP
        3rd assessment - L3 V2 SAN
        4th assessment - L3 V2 SAN
    */


    log(`Create a new Probation offender
        1st assessent - Create a L3 V2 SAN assessment. Fully complete it, add one goal and step and agree plan. Check version numbers`, 'Test step')

    await user.prob.probSanHeadPdu.login()
    const offender1 = await offender.createProbFromStandardOffender()
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
    await assessment.populateMinimal({ layer: 'Layer 3V2' })
    await signing.signAndLock({ expectRsrWarning: true })
    const spVersion1 = await oasysDb.getSingleNumericValue(`select SSP_PLAN_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk1}`)

    log(`2nd assessment - Now create a L3 V1 SP assessment. Should have the field 'CLONED_FROM_PREV_OASYS_SAN_PK' set to the PK of the previous L3 V2 assessment
        Update the sentence plan by adding a second goal and step, sign and lock. Check version numbers`, 'Test step')

    await oasys.history(offender1)
    const pk2 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' })
    await san.queries.checkSanCreateAssessmentCall(pk2, null, pk1, user.prob.probSanHeadPdu, providers.prob.sanCode, 'REVIEW', true, 'N')
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk2}`, {
        SSP_TYPE_ELM: 'REVIEW',
        ARNS_SP_ONLY_LINKED_IND: 'Y',
        SAN_ASSESSMENT_LINKED_IND: 'N',
        CLONED_FROM_PREV_OASYS_SAN_PK: pk1.toString(),
    })
    await sentencePlan.addGoal()
    await sections.sections2To13NoIssues({ populate6_11: 'No', })
    await sections.selfAssessmentForm.populateMinimal()
    await signing.signAndLock({ page: 'spService', expectRsrWarning: true })
    const spVersion2 = await oasysDb.getSingleNumericValue(`select SSP_PLAN_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk2}`)
    expect(spVersion2).not.toBe(spVersion1)

    log(`3rd assessment - Now create a new L3 V2 SAN assessment. SAN section is already complete.  SP remains agreed.
        Navigate out to the sentence plan - check OTL is correct
        Change the sentence plan - complete one of the goals and steps.
        Sign and lock. Check version numbers`, 'Test step')

    await oasys.history(offender1)
    const pk3 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
    await san.queries.checkSanCreateAssessmentCall(pk3, pk1, pk2, user.prob.probSanHeadPdu, providers.prob.sanCode, 'REVIEW', false, 'N')
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk3}`, {
        SSP_TYPE_ELM: 'REVIEW',
        ARNS_SP_ONLY_LINKED_IND: 'N',
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        CLONED_FROM_PREV_OASYS_SAN_PK: pk1.toString(),
    })
    await sentencePlan.completeFirstGoal()
    await signing.signAndLock({ expectRsrWarning: true })
    const spVersion3 = await oasysDb.getSingleNumericValue(`select SSP_PLAN_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk3}`)
    expect(spVersion3).not.toBe(spVersion2)

    log(`4th assessment - Now create a new L3 V2 SAN assessment. SAN section is already complete. SP remain agreed.
        Check the OASYS_SET  'version number' fields after create
        Navigate out to the SAN assessment - check the OTL parameters. Change something and return back
        Navigate out to the Sentence plan - check OTL parameters. Complete the second goal and step.  No active goals left
        Sign and lock.  Check version numbers`, 'Test step')

    await oasys.history(offender1)
    const pk4 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
    await san.queries.checkSanCreateAssessmentCall(pk4, pk3, pk3, user.prob.probSanHeadPdu, providers.prob.sanCode, 'REVIEW', false, 'N')
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk4}`, {
        SSP_TYPE_ELM: 'REVIEW',
        ARNS_SP_ONLY_LINKED_IND: 'N',
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        CLONED_FROM_PREV_OASYS_SAN_PK: pk3.toString(),
    })

    await san.gotoSan()
    await san.informationSummary.change.click()
    await san.accommodation1.settledAccommodationType.setValue('socialRent')
    await san.accommodation1.saveAndContinue.click()
    await san.accommodation2.saveAndContinue.click()
    await san.action('practitionerAnalysis')
    await san.accommodationPractitionerAnalysis.markAsComplete.click()
    await san.returnToOASys()
    await sentencePlan.completeSecondGoal()
    await signing.signAndLock({ expectRsrWarning: true })
    const spVersion4 = await oasysDb.getSingleNumericValue(`select SSP_PLAN_VERSION_NO from eor.oasys_set where oasys_set_pk = ${pk4}`)
    expect(spVersion4).not.toBe(spVersion3)

    log(`As the Assessor - click on the <Open S&N> button from the offender record - should have READ_WRITE access, check the OTL parameters
        As the Assessor - click on the <Open SP> button from the offender record - should have READ_WRITE access, check the OTL parameters`, 'Test step')

    await oasys.history(offender1)
    await san.gotoSanFromOffender()
    await san.checkSanEditMode(true)

    await san.queries.checkSanOtlCall(pk4, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': null,
    }, {
        'displayName': user.prob.probSanHeadPdu.forenameSurname,
        'accessMode': 'READ_WRITE',
    },
        'san', 'offender'
    )
    await san.returnToOASys()

    await sentencePlan.checkGoalCount(0, 0, 2, 'offender', false)

    await san.queries.checkSanOtlCall(pk4, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': null,
    }, {
        'displayName': user.prob.probSanHeadPdu.forenameSurname,
        'planAccessMode': 'READ_WRITE',
    },
        'sp', 'offender'
    )

    log(`Go through each completed assessment
        Navigate to the SAN assessment (if appropriate) and check the OTL parameters - will be READ_ONLY
        Navigate to the Sentence Plan and check the OTL parameters - will be READ_ONLY`, 'Test step')

    await assessment.open(4)
    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.returnToOASys()
    await sentencePlan.checkGoalCount(1, 0, 0, 'assessment', true)
    await san.queries.checkSanOtlCall(pk1, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': null,
    }, {
        'displayName': user.prob.probSanHeadPdu.forenameSurname,
        'planAccessMode': 'READ_ONLY',
    },
        'sp', 'assessment'
    )
    await oasys.clickButton('Close')

    await assessment.open(3)
    await sentencePlan.checkGoalCount(2, 0, 0, 'assessment', true)
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
    }, {
        'displayName': user.prob.probSanHeadPdu.forenameSurname,
        'planAccessMode': 'READ_ONLY',
    },
        'sp', 'assessment'
    )
    await oasys.clickButton('Close')

    await assessment.open(2)
    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.returnToOASys()
    await sentencePlan.checkGoalCount(1, 0, 1, 'assessment', true)
    await san.queries.checkSanOtlCall(pk3, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': null,
    }, {
        'displayName': user.prob.probSanHeadPdu.forenameSurname,
        'planAccessMode': 'READ_ONLY',
    },
        'sp', 'assessment'
    )
    await oasys.clickButton('Close')

    await assessment.open(1)
    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.returnToOASys()
    await sentencePlan.checkGoalCount(0, 0, 2, 'assessment', true)

    await san.queries.checkSanOtlCall(pk4, {
        'crn': offender1.probationCrn,
        'pnc': offender1.pnc,
        'nomisId': null,
        'givenName': offender1.forename1,
        'familyName': offender1.surname,
        'dateOfBirth': offender1.dateOfBirth,
        'gender': '1',
        'location': 'COMMUNITY',
        'sexuallyMotivatedOffenceHistory': null,
    }, {
        'displayName': user.prob.probSanHeadPdu.forenameSurname,
        'planAccessMode': 'READ_ONLY',
    },
        'sp', 'assessment'
    )
    await oasys.clickButton('Close')

    await user.logout()
})
