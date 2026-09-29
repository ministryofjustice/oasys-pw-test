import { test } from 'fixtures'

test.describe.configure({ retries: 1 })
test('SAN integration - test ref 29/30', async ({ oasys, user, signing, offender, assessment, san, sections, sara, risk, sentencePlan }) => {

    /**
        Check 'Soft Deleting' OASys-SAN assessments in various states sends a notification to the SAN Service
     */

    await user.prob.probSanHeadPdu.login()  // No countersigning for this test

    const offender1 = await offender.createProbFromStandardOffender({ forename1: 'TestRefTwenty-One' })
    const offender2 = await offender.createProbFromStandardOffender({ forename1: 'TestRefTwenty-Two' })

    // Part 1
    log(`Create an offender whose latest assessment is a fully completed OASYS-SAN`, 'Test step')

    await offender.searchAndSelect(offender1)

    const o1pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await assessment.populateMinimal({ layer: 'Layer 3V2' })
    await signing.signAndLock()

    await user.logout()

    log(`Log into the SAN Pilot area as an Administrator
        Search for the offender and open up the readonly OASys-SAN assessment
        From the Admin menu select 'Delete assessment' - enter in a reason for the deletion and then click on OK
        The OASYS_SET record for the OASys-SAN assessment has the field DELETED_DATE set to system date and time the deletion took place
        An OASYS_SIGNING record has been created for the deletion 'ASSMT_DEL_SIGNING'
        A Delete API has been sent to the SAN Service - check the parameters are the OASYS_SET_PK, Admins User ID and Name - a 200 response has been received back`, 'Test step')

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelect(offender1)
    await assessment.deleteLatest()
    await assessment.queries.checkDeleted(o1pk1)
    await assessment.queries.checkSigningRecord(o1pk1, ['ASSMT_DEL_SIGNING', 'SIGNING'])
    await san.queries.checkSanDeleteCall(o1pk1, user.admin)

    log(`Test ref 30 - reverse deletion test`, 'Test step')
    await assessment.reverseDeletion(offender1, 'Assessment', 'Start of Community Order', 'Test ref 30 part 1 deletion reversal')

    await assessment.queries.checkNotDeleted(o1pk1)
    await assessment.queries.checkSigningRecord(o1pk1, ['ASS_DEL_RESTORE', 'ASSMT_DEL_SIGNING', 'SIGNING'])
    await san.queries.checkSanUndeleteCall(o1pk1, user.admin)

    await user.logout()

    // Part 2
    await user.prob.probSanHeadPdu.login()

    log(`Create an offender whose latest assessment is a WIP OASYS-SAN`, 'Test step')

    await offender.searchAndSelect(offender1)

    const o1pk2 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await user.logout()

    log(`Log into the SAN Pilot area as an Administrator
        Search for the offender and open up the readonly OASys-SAN assessment
        From the Admin menu select 'Delete assessment' - enter in a reason for the deletion and then click on OK
        The OASYS_SET record for the OASys-SAN assessment has the field DELETED_DATE set to system date and time the deletion took place
        An OASYS_SIGNING record has been created for the deletion 'ASSMT_DEL_SIGNING'
        A Delete API has been sent to the SAN Service - check the parameters are the OASYS_SET_PK, Admins User ID and Name - a 200 response has been received back`, 'Test step')

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelect(offender1)
    await assessment.deleteLatest()
    await assessment.queries.checkDeleted(o1pk2)
    await assessment.queries.checkSigningRecord(o1pk2, ['ASSMT_DEL_SIGNING'])
    await san.queries.checkSanDeleteCall(o1pk2, user.admin)


    log(`Test ref 30 - reverse deletion test`)
    await assessment.reverseDeletion(offender1, 'Assessment', 'Review', 'Test ref 30 part 2 deletion reversal')

    await assessment.queries.checkNotDeleted(o1pk2)
    await assessment.queries.checkSigningRecord(o1pk2, ['ASS_DEL_RESTORE', 'ASSMT_DEL_SIGNING'])
    await san.queries.checkSanUndeleteCall(o1pk2, user.admin)

    // Leave the offender ready for part 4
    await oasys.history(offender1)
    await assessment.lockIncomplete()

    await user.logout()

    // Part 3
    await user.prob.probSanPo.login()
    await offender.searchAndSelectByPnc(offender2.pnc)

    // Create and complete assessment and SARA
    const o2pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    // Complete section 1
    await sections.offendingInformation.populateMinimal()

    await sections.predictors.goto(true)
    await sections.predictors.dateFirstSanction.setValue({ years: -2 })
    await sections.predictors.o1_30.setValue('Yes')
    await sections.predictors.o1_41.setValue('No')
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_33.setValue({ months: -6 })
    await sections.predictors.o1_34.setValue(1)
    await sections.predictors.o1_45.setValue(1)
    await sections.predictors.o1_46.setValue(1)
    await sections.predictors.o1_38.setValue({ months: -1 })
    await sections.predictors.o1_37.setValue(1)

    // Minimal population plus SARA trigger
    await san.gotoSan()
    await san.accommodation.populateMinimal()
    await san.employment.populateMinimal()
    await san.finance.populateMinimal()
    await san.drugs.populateMinimal()
    await san.alcohol.populateMinimal()
    await san.health.populateMinimal()
    await san.relationships.populateMinimal()
    await san.thinking.goto()
    await san.thinking.page1.awareConsequences.setValue('yes')
    await san.thinking.page1.stableBehaviour.setValue('yes')
    await san.thinking.page1.activitiesLinkedOffending.setValue('no')
    await san.thinking.page1.resilient.setValue('yes')
    await san.thinking.page1.ableSolveProblems.setValue('yes')
    await san.thinking.page1.understandOthers.setValue('no')
    await san.thinking.page1.manipulativeBehaviour.setValue('some')
    await san.thinking.page1.manageTemper.setValue('no')
    await san.thinking.page1.violence.setValue('yes')
    await san.thinking.page1.impulse.setValue('sometimes')
    await san.thinking.page1.positiveAttitude.setValue('no')
    await san.thinking.page1.hostileOrientation.setValue('yes')
    await san.thinking.page1.acceptSupervision.setValue('no')
    await san.thinking.page1.supportCriminalBehaviour.setValue('yes')
    await san.thinking.page1.wantChanges.setValue('madeChanges')
    await san.thinking.saveAndContinue()
    await san.thinking.saveAndContinue()
    await san.thinking.page3.emotionalIntimacy.setValue('yes')
    await san.thinking.page3.sexualPreoccupation.setValue('yes')
    await san.thinking.page3.sexualInterests.setValue('yes')
    await san.thinking.saveAndContinue()
    await san.thinking.openPractitionerAnalysis()
    await san.thinking.practitionerAnalysis.populateMinimal()
    await san.thinking.markAsComplete()
    await san.offenceAnalysis.goto()
    await san.offenceAnalysis.page1.offenceDescription.setValue('Offence description')
    await san.offenceAnalysis.page1.offenceElements.setValue(['weapon'])
    await san.offenceAnalysis.page1.reason.setValue('Why it happened')
    await san.offenceAnalysis.page1.motivations.setValue(['other'])
    await san.offenceAnalysis.page1.motivationOther.setValue('Some reason')
    await san.offenceAnalysis.page1.victimType.setValue(['other'])
    await san.offenceAnalysis.page1.victimTypeDetails.setValue('Victim details')
    await san.offenceAnalysis.saveAndContinue()
    await san.offenceAnalysis.page2.howManyOthers.setValue('0')
    await san.offenceAnalysis.saveAndContinue()
    await san.offenceAnalysis.page3.impact.setValue('yes')
    await san.offenceAnalysis.page3.responsibility.setValue('yes')
    await san.offenceAnalysis.page3.patterns.setValue('Patterns')
    await san.offenceAnalysis.page3.escalation.setValue('no')
    await san.offenceAnalysis.page3.riskSeriousHarm.setValue('yes')
    await san.offenceAnalysis.page3.riskSeriousHarmYesDetails.setValue('No risk')
    await san.offenceAnalysis.page3.domesticAbusePerpetrator.setValue('yes')
    await san.offenceAnalysis.page3.domesticAbusePerpetratorType.setValue('partner')
    await san.offenceAnalysis.page3.partnerPerpetratorDetails.setValue('Some details about domestic abuse')
    await san.offenceAnalysis.page3.domesticAbuseVictim.setValue('no')
    await san.offenceAnalysis.markAsComplete()
    await san.returnToOASys()

    await oasys.clickButton('Next')
    await oasys.clickButton('Next')
    await oasys.clickButton('Create')

    await sara.populate('Low', 'Low')
    await sara.signAndLock()

    await oasys.history(offender2, 'Start of Community Order')
    await risk.screeningSection1.populateMinimal()
    await risk.screeningSection2to4.populateMinimal(true)

    await risk.summary.populateWithSpecificRiskLevel('High')
    await risk.rmp.populateMinimalWithTextFields()

    await sentencePlan.populateTwoGoals()

    await signing.signAndLock({ expectCountersigner: true, countersigner: user.prob.probSanHeadPdu, countersignComment: 'Sending test ref 20 for countersigning' })

    // Countersign
    await user.logout()
    await user.prob.probSanHeadPdu.login()
    await signing.countersign({ offender: offender2 })
    await user.logout()

    log(`Log into the SAN Pilot area as an Administrator
        Search for the offender and open up the SARA
        From the Admin menu select 'Delete SARA - enter in a reason for the deletion and then click on OK
        Check that a Delete API has NOT been sent to the SAN Service`, 'Test step')

    const saraPk = await sara.queries.getSaraPk(o2pk1)

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelectByPnc(offender2.pnc)
    await assessment.open(2)  // SARA is second on the list
    await sara.deleteSara()

    await assessment.queries.checkDeleted(saraPk)
    await assessment.queries.checkSigningRecord(saraPk, ['SARA_DEL_SIGNING', 'SARA_SIGNING'])
    await san.queries.checkNoSanCall(saraPk)

    log(`Now open up the OASys-SAN assessment
        From the Admin menu select 'Delete assessment' - enter in a reason for the deletion and then click on OK
            The OASYS_SET record for the OASys-SAN assessment has the field DELETED_DATE set to system date and time the deletion took place
            An OASYS_SIGNING record has been created for the deletion 'ASSMT_DEL_SIGNING'
            A Delete API has been sent to the SAN Service - check the parameters are the OASYS_SET_PK, Admins User ID and Name - a 200 response has been received back`, 'Test step')

    await oasys.history(offender2)
    await assessment.deleteLatest()
    await san.queries.checkSanDeleteCall(o2pk1, user.admin)
    await assessment.queries.checkDeleted(o2pk1)
    await assessment.queries.checkSigningRecord(o2pk1, ['ASSMT_DEL_SIGNING', 'COUNTERSIGNING', 'SIGNING'])

    log(`Test ref 30 - reverse deletion test`)
    await assessment.reverseDeletion(offender2, 'Assessment', 'Start', 'Test ref 30 part 3 deletion reversal')

    await assessment.queries.checkNotDeleted(o2pk1)
    await assessment.queries.checkSigningRecord(o2pk1, ['ASS_DEL_RESTORE', 'ASSMT_DEL_SIGNING', 'COUNTERSIGNING', 'SIGNING'])
    await san.queries.checkSanUndeleteCall(o2pk1, user.admin)
    await assessment.queries.checkNotDeleted(saraPk)
    await assessment.queries.checkSigningRecord(saraPk, ['SARA_DEL_RESTORE', 'SARA_DEL_SIGNING', 'SARA_SIGNING'])
    await san.queries.checkNoSanCall(saraPk)

    await user.logout()

    // Part 4

    await user.prob.probSanUnappr.login()

    log(`Create an offender whose latest assessment is signed and locked but awaiting countersignature`, 'Test step')

    await offender.searchAndSelect(offender1)
    const o1pk3 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
    await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersigner: user.prob.probSanHeadPdu })
    await user.logout()

    log(`Log into the SAN Pilot area as an Administrator
        Search for the offender and open up the readonly OASys-SAN assessment
        From the Admin menu select 'Delete assessment' - enter in a reason for the deletion and then click on OK
        The OASYS_SET record for the OASys-SAN assessment has the field DELETED_DATE set to system date and time the deletion took place
        An OASYS_SIGNING record has been created for the deletion 'ASSMT_DEL_SIGNING'
        A Delete API has been sent to the SAN Service - check the parameters are the OASYS_SET_PK, Admins User ID and Name - a 200 response has been received back`, 'Test step')

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelect(offender1)
    await assessment.deleteLatest()
    await assessment.queries.checkDeleted(o1pk3)
    await assessment.queries.checkSigningRecord(o1pk3, ['ASSMT_DEL_SIGNING', 'SIGNING'])
    await san.queries.checkSanDeleteCall(o1pk3, user.admin)

    log(`Test ref 30 - reverse deletion test`)
    await assessment.reverseDeletion(offender1, 'Assessment', 'Start', 'Test ref 30 part 4 deletion reversal')

    await assessment.queries.checkNotDeleted(o1pk3)
    await assessment.queries.checkSigningRecord(o1pk3, ['ASS_DEL_RESTORE', 'ASSMT_DEL_SIGNING', 'SIGNING'])
    await san.queries.checkSanUndeleteCall(o1pk3, user.admin)

    // Leave the offender ready for part 5
    await oasys.history(offender1)
    await assessment.lockIncomplete('Do you wish to lock the assessment as incomplete? This assessment is currently awaiting countersignature')

    await user.logout()

    // Part 5
    await user.prob.probSanHeadPdu.login()

    log(`Create an offender whose latest assessment is a locked incomplete OASYS-SAN`, 'Test step')

    await offender.searchAndSelectByPnc(offender1.pnc)

    const o1pk4 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await oasys.clickButton('Close')
    await assessment.lockIncomplete()

    await user.logout()

    log(`Log into the SAN Pilot area as an Administrator
        Search for the offender and open up the readonly OASys-SAN assessment
        From the Admin menu select 'Delete assessment' - enter in a reason for the deletion and then click on OK
        The OASYS_SET record for the OASys-SAN assessment has the field DELETED_DATE set to system date and time the deletion took place
        An OASYS_SIGNING record has been created for the deletion 'ASSMT_DEL_SIGNING'
        A Delete API has been sent to the SAN Service - check the parameters are the OASYS_SET_PK, Admins User ID and Name - a 200 response has been received back`, 'Test step')

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelectByPnc(offender1.pnc)
    await assessment.deleteLatest()
    await assessment.queries.checkDeleted(o1pk4)
    await assessment.queries.checkSigningRecord(o1pk4, ['ASSMT_DEL_SIGNING', 'LOCKED_INCOMPLETE'])
    await san.queries.checkSanDeleteCall(o1pk4, user.admin)


    log(`Test ref 30 - reverse deletion test`)
    await assessment.reverseDeletion(offender1, 'Assessment', 'Start', 'Test ref 30 part 5 deletion reversal')

    await assessment.queries.checkNotDeleted(o1pk4)
    await assessment.queries.checkSigningRecord(o1pk4, ['ASS_DEL_RESTORE', 'ASSMT_DEL_SIGNING', 'LOCKED_INCOMPLETE'])
    await san.queries.checkSanUndeleteCall(o1pk4, user.admin)

    await user.logout()
})