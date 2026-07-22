import { test } from 'fixtures'
import * as testData from '../data/testRef36'
import * as testData38 from '../data/testRef38'

const offender1: OffenderDef = {

    forename1: 'TestRefThirtySeven',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}

/**
 * Carry out a test for rolling back a countersigned assessment to ensure the san service process the request
 * 
 * Have a completed 3.2 assessment that has been countersigned.
 * Create a new 3.2 assessment and enter some data including SAN data.
 * Delete that second 3.2 assessment. 
 * Roll back the first 3.2 assessment and carry on with that does it work with SAN statuses?
 */

test.describe.configure({ retries: 1 })
test('SAN integration - test ref 37/38', async ({ oasys, user, offender, assessment, signing, sections, san, risk, sentencePlan, sns }) => {

    await user.prob.probSanUnappr.login()
    await offender.createProb(offender1)

    // Create first assessment
    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
    // Check values in OASYS_SET
    await san.queries.getSanApiTimeAndCheckDbValues(pk1, 'Y', null)

    // Check Create call
    await san.queries.checkSanCreateAssessmentCall(pk1, null, null, user.prob.probSanUnappr, providers.prob.sanCode, 'INITIAL')
    await san.queries.checkSanGetAssessmentCall(pk1, 0)

    // Complete section 1
    await sections.offendingInformation.goto()
    await sections.offendingInformation.offence.setValue('030')
    await sections.offendingInformation.subcode.setValue('01')
    await sections.offendingInformation.count.setValue(1)
    await sections.offendingInformation.offenceDate.setValue({ months: -6 })
    await sections.offendingInformation.sentence.setValue('Fine')
    await sections.offendingInformation.sentenceDate.setValue({ months: -1 })

    await sections.predictors.goto(true)
    await sections.predictors.dateFirstSanction.setValue({ years: -2 })
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({})

    // Populate SAN sections, check API calls
    await san.gotoSan()
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
        'displayName': user.prob.probSanUnappr.forenameSurname,
        'accessMode': 'READ_WRITE',
    },
        'san', null
    )

    await san.populateSanSections('TestRef37 complete SAN', testData.sanPopulation, true)
    await san.returnToOASys()
    await oasys.clickButton('Next')
    await san.queries.checkSanGetAssessmentCall(pk1, 0)

    await risk.screeningNoRisks(true)

    // Complete SP
    await sentencePlan.populateMinimal()

    // Sign and lock, check API calls and OASYS_SET
    await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersigner: user.prob.probSanHeadPdu, countersignComment: 'Test 37 part 1 signing' })
    await san.queries.checkSanSigningCall(pk1, user.prob.probSanUnappr, 'COUNTERSIGN')
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        CLONED_FROM_PREV_OASYS_SAN_PK: null,
        SAN_ASSESSMENT_VERSION_NO: '0'
    })
    await user.logout()

    await user.prob.probSanHeadPdu.login()
    await offender.searchAndSelect(offender1)
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
    }, {
        'displayName': user.prob.probSanHeadPdu.forenameSurname,
        'accessMode': 'READ_ONLY',
    },
        'san', 'assessment'
    )
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    // Countersign the assessment
    await san.queries.checkSanGetAssessmentCall(pk1, 0)
    await signing.countersign({ page: 'spService', comment: 'Test 37 part 2 countersigning' })
    await san.queries.checkSanCountersigningCall(pk1, user.prob.probSanHeadPdu, 'COUNTERSIGNED')
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])
    await user.logout()

    log('Roll back the assessment and check API calls and assessment status, then sign again', 'Test step')

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelect(offender1)

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
    }, {
        'displayName': user.admin.forenameSurname,
        'accessMode': 'READ_ONLY',
    },
        'san', 'assessment'
    )
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    // Roll back the assessment
    await assessment.rollBack('Test 37 part 3 rollback')

    // Check OASYS_SET and API calls
    await san.queries.checkSanRollbackCall(pk1, user.admin)
    await user.logout()

    // Sign and lock again, check API calls and OASYS_SET
    await user.prob.probSanUnappr.login()
    await oasys.history()

    // Check it's now read-write
    await san.gotoSan()
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
        'displayName': user.prob.probSanUnappr.forenameSurname,
        'accessMode': 'READ_WRITE',
    },
        'san', 'assessment'
    )
    await san.checkSanEditMode(true)
    await san.returnToOASys()
    await oasys.clickButton('Next')
    await san.queries.checkSanGetAssessmentCall(pk1, 0)

    await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersigner: user.prob.probSanHeadPdu, countersignComment: 'Test 37 part 3 signing again' })
    await san.queries.checkSanSigningCall(pk1, user.prob.probSanUnappr, 'COUNTERSIGN')
    await san.queries.checkSanGetAssessmentCall(pk1, 0)
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        CLONED_FROM_PREV_OASYS_SAN_PK: null,
        SAN_ASSESSMENT_VERSION_NO: '0'
    })
    await user.logout()

    log('Countersign again', 'Test step')

    await user.prob.probSanHeadPdu.login()
    await offender.searchAndSelect(offender1)
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
    }, {
        'displayName': user.prob.probSanHeadPdu.forenameSurname,
        'accessMode': 'READ_ONLY',
    },
        'san', 'assessment'
    )
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    // Countersign the assessment
    await san.queries.checkSanGetAssessmentCall(pk1, 0)
    await signing.countersign({ page: 'spService', comment: 'Test 37 part 4 countersign again' })

    await san.queries.checkSanCountersigningCall(pk1, user.prob.probSanHeadPdu, 'COUNTERSIGNED')
    await san.queries.checkSanGetAssessmentCall(pk1, 0)
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])
    await user.logout()

    log('Create 3.2 assessment and change some data, then delete it', 'Test step')

    await user.prob.probSanUnappr.login()
    await offender.searchAndSelect(offender1)

    // Create new assessment
    const pk2 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
    // Check values in OASYS_SET
    await san.queries.getSanApiTimeAndCheckDbValues(pk2, 'Y', pk1)

    // Check Create call
    await san.queries.checkSanCreateAssessmentCall(pk2, pk1, pk1, user.prob.probSanUnappr, providers.prob.sanCode, 'REVIEW')
    await san.queries.checkSanGetAssessmentCall(pk2, 1)

    // Tweak section 1
    await sections.offendingInformation.goto()
    await sections.offendingInformation.offence.setValue('030')
    await sections.offendingInformation.subcode.setValue('01')
    await sections.offendingInformation.count.setValue(3)
    await sections.offendingInformation.offenceDate.setValue({ months: -2 })
    await sections.offendingInformation.sentence.setValue('Fine')
    await sections.offendingInformation.sentenceDate.setValue({ months: -1 })

    await sections.predictors.goto(true)
    await sections.predictors.o1_32.setValue(4)
    await sections.predictors.o1_40.setValue(1)
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({})
    await oasys.clickButton('Save')
    await risk.rmp.checkMenuVisibility(false)

    // Populate SAN sections, check API calls
    await san.gotoSan()
    await san.queries.checkSanOtlCall(pk2, {
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
        'displayName': user.prob.probSanUnappr.forenameSurname,
        'accessMode': 'READ_WRITE',
    },
        'san', null
    )

    // Modify SAN, these changes will trigger FA in this assessment
    await san.populateSanSections('TestRef38 modify SAN', testData38.modifySan, true)
    await san.returnToOASys()
    await oasys.clickButton('Next')
    await risk.rmp.checkMenuVisibility(true)
    await san.queries.checkSanGetAssessmentCall(pk2, 1)

    await user.logout()
    // Delete the WIP assessment
    await user.admin.login(providers.prob.san)
    await offender.searchAndSelect(offender1)
    await assessment.deleteLatest()
    await san.queries.checkSanDeleteCall(pk2, user.admin)

    log('Roll back the first assessment and check API calls and assessment status', 'Test step')
    await oasys.history(offender1)
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
    }, {
        'displayName': user.admin.forenameSurname,
        'accessMode': 'READ_ONLY',
    },
        'san', 'assessment'
    )
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    // Roll back the assessment
    await assessment.rollBack('Test 38 part 2 rolling back again, after deleting the second assessment')

    // Check OASYS_SET and API calls
    await san.queries.checkSanRollbackCall(pk1, user.admin)
    await user.logout()

    log('Modify and sign again', 'Test step')

    // Open the assessment and check status
    await user.prob.probSanUnappr.login()
    await offender.searchAndSelect(offender1)
    await assessment.openLatest()

    await risk.rmp.checkMenuVisibility(false)  // Shouldn't be there

    // Check it's now read-write
    await san.gotoSan()
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
        'displayName': user.prob.probSanUnappr.forenameSurname,
        'accessMode': 'READ_WRITE',
    },
        'san', null
    )
    await san.checkSanEditMode(true)
    await san.populateSanSections('Test ref 38 part 2', testData38.modifySan2, true)
    await san.returnToOASys()
    await oasys.clickButton('Next')
    await san.queries.checkSanGetAssessmentCall(pk1, 2)

    await risk.rmp.checkMenuVisibility(false)  // Shouldn't be there

    // Sign and lock again, check API calls and OASYS_SET

    await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersigner: user.prob.probSanHeadPdu, countersignComment: 'Signing for the third time' })
    await san.queries.checkSanSigningCall(pk1, user.prob.probSanUnappr, 'COUNTERSIGN')
    await san.queries.checkSanGetAssessmentCall(pk1, 2)
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['OGRS', 'RSR'])
    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        CLONED_FROM_PREV_OASYS_SAN_PK: null,
        SAN_ASSESSMENT_VERSION_NO: '2'
    })

    await user.logout()

    log('Countersign again', 'Test step')

    await user.prob.probSanHeadPdu.login()
    await offender.searchAndSelect(offender1)
    await assessment.openLatest()

    // Open as countsigner
    await user.logout()
    await user.prob.probSanHeadPdu.login()
    await oasys.history()
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
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    // Countersign the assessment
    await san.queries.checkSanGetAssessmentCall(pk1, 2)
    await signing.countersign({ page: 'spService', comment: 'Countersigning for the third time' })

    await san.queries.checkSanCountersigningCall(pk1, user.prob.probSanHeadPdu, 'COUNTERSIGNED')
    await san.queries.checkSanGetAssessmentCall(pk1, 2)
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])

    // Check the signing history
    await oasys.history()
    const expectedValues: ColumnValues[] = [
        {
            name: 'action',
            values: ['Countersigning', 'Signing', 'Rollback', 'Countersigning', 'Signing', 'Rollback', 'Countersigning', 'Signing']
        },
        {
            name: 'who',
            values: [
                user.prob.probSanHeadPdu.forenameSurname, user.prob.probSanUnappr.forenameSurname, user.admin.forenameSurname, user.prob.probSanHeadPdu.forenameSurname,
                user.prob.probSanUnappr.forenameSurname, user.admin.forenameSurname, user.prob.probSanHeadPdu.forenameSurname, user.prob.probSanUnappr.forenameSurname
            ]
        },
        {
            name: 'date',
            values: [oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString(), oasysDateTime.oasysDateAsString()]
        },
        {
            name: 'comment',
            values: [
                'Countersigning for the third time', 'Signing for the third time', 'Test 38 part 2 rolling back again, after deleting the second assessment',
                'Test 37 part 4 countersign again', 'Test 37 part 3 signing again', 'Test 37 part 3 rollback', 'Test 37 part 2 countersigning', 'Test 37 part 1 signing'
            ]
        },
    ]
    await sections.offenderInformation.signingHistory.checkData(expectedValues)

    await user.logout()
})