import { test } from 'fixtures'
import * as testData from '../data/testRef35'

/**
    Check the cloning of a standalone RSR into an OASys-SAN 3.2 assessment
    Includes Maturity Screening score
 */

test.describe.configure({ retries: 1 })
test('SAN integration - test refs 35 and 45', async ({ oasys, user, offender, assessment, sections, signing, san, risk, sentencePlan }) => {

    await user.prob.probSanHeadPdu.login()  // No countersigning for this test
    const offender1 = await offender.createProbFromStandardOffender({ forename1: 'TestRefThirtyFive' })

    log(`Carry out a 3.2 assessment ensuring questions are set in SAN to produce a low maturity outcome`, 'Test step')

    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await san.gotoSan()
    await san.populateSanSections('Test ref 35', testData.sanPopulation1, true)
    await san.returnToOASys()

    await sentencePlan.populateMinimal()

    await assessment.summarySheet.goto()
    await assessment.summarySheet.maturityScreening.checkValue('This individual is likely to need support or services aimed at promoting maturation.', true)

    await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk1}`, {
        SAN_ASSESSMENT_LINKED_IND: 'Y',
        MATURITY_SCORE: '14',
        MATURITY_FLAG: '1',
    })

    // Complete section 1
    await sections.offendingInformation.populateMinimal()

    await sections.predictors.goto(true)
    await sections.predictors.dateFirstSanction.setValue({ years: -2 })
    await sections.predictors.o1_32.setValue(2)
    await sections.predictors.o1_40.setValue(0)
    await sections.predictors.o1_29.setValue({ months: -1 })
    await sections.predictors.o1_30.setValue('No')
    await sections.predictors.o1_38.setValue({})

    await risk.screeningNoRisks(true)
    await signing.signAndLock({ page: 'spService' })

    let failed = await assessment.queries.checkAnswers(pk1, testData.preRsrDataCheck, true)
    expect(failed).toBeFalsy()

    log(`Then create a standalone RSR changing some data for the section 1 parameters and R1.2 fields.  
        Say Yes to Interview and answer the dynamic questions differently`, 'Test step')

    await oasys.history(offender1)
    await offender.standaloneCsrp.goto()

    // Check cloning from the assessment
    await offender.standaloneCsrp.o1_8Age.checkValue('23')
    await offender.standaloneCsrp.o1_32.checkValue(2)
    await offender.standaloneCsrp.o1_40.checkValue(0)
    await offender.standaloneCsrp.o1_29.checkValue({ months: -1 })
    await offender.standaloneCsrp.o1_30.checkValue('No')
    await offender.standaloneCsrp.o1_38.checkValue({})
    await offender.standaloneCsrp.o1_39.setValue('Yes') // Offender interview
    await offender.standaloneCsrp.o2_2.setValue('Yes')
    await offender.standaloneCsrp.o3_4.checkValue('0-No problems')
    await offender.standaloneCsrp.o4_2.checkValue('0-No')
    await offender.standaloneCsrp.o6_4.checkValue('2-Significant problems')
    await offender.standaloneCsrp.o9_1.checkValue('0-No problems')
    await offender.standaloneCsrp.o11_2.checkValue('2-Significant problems')
    await offender.standaloneCsrp.o11_4.checkValue('1-Some problems')
    await offender.standaloneCsrp.o12_1.checkValue('2-Significant problems')

    await offender.standaloneCsrp.o1_32.setValue(4)
    await offender.standaloneCsrp.o1_40.setValue(1)
    await offender.standaloneCsrp.o1_29.setValue({})
    await offender.standaloneCsrp.o1_38.setValue({ days: -10 })
    await offender.standaloneCsrp.o3_4.setValue('1-Some problems')
    await offender.standaloneCsrp.o4_2.setValue('2-Yes')
    await offender.standaloneCsrp.o6_4.setValue('0-No problems')
    await offender.standaloneCsrp.o9_1.setValue('1-Some problems')
    await offender.standaloneCsrp.o11_2.setValue('2-Significant problems')
    await offender.standaloneCsrp.o11_4.setValue('2-Significant problems')
    await offender.standaloneCsrp.o12_1.setValue('1-Some problems')

    await offender.standaloneCsrp.weaponPrevious.setValue('Yes')
    await offender.standaloneCsrp.burglaryPrevious.setValue('Yes')

    await offender.standaloneCsrp.calculateScores.click()

    log(`Now create a new 3.2 assessment, will overclone with the standalone RSR
                    However, it will then get the data from the SAN assessment
                    Check in the database that the dynamic questions are now showing as from SAN
                    However, the Section 1 questions and the R1.2 fields are showing as cloned from the standalone RSR (this proves that cloning from the standalone RSR still works)`, 'Test step')

    await offender.standaloneCsrp.close.click()

    const pk2 = await assessment.createProb({ purposeOfAssessment: 'Review', includeSanSections: 'Yes' })
    failed = await assessment.queries.checkAnswers(pk2, testData.postRsrDataCheck, true)
    expect(failed).toBeFalsy()
    await oasys.clickButton('Close')

    /*
    Check the functionality when navigating to SAN via the new buttons on the offender record and the offender's latest assessment is a WIP classic 3.1
    */

    log(`Find an offender whose latest assessment is a fully completed 3.2`)

    // Complete the WIP 3.2 from test 35
    await assessment.openLatest()
    await risk.populateWithSpecificRiskLevel('Low')
    await signing.signAndLock({ page: 'spService' })

    log(`As the assessor create a new assessment BUT make it a classic 3.1 assessment, say 'No' to the SAN question
        Close the WIP 3.1`, 'Test step')

    await oasys.history(offender1)
    const pk3 = await assessment.createProb({ purposeOfAssessment: 'Review', includeSanSections: 'No' })
    await oasys.clickButton('Close')

    log(`From the offender record click on the <Open S&N> button
                    Navigates out to the SAN Assessment which should be shown in READ ONLY mode - check the OTL access mode parameter for SAN
                    Return back to OASys`, 'Test step')

    await san.gotoSanFromOffender(true)
    await san.checkSanEditMode(false)

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
        'displayName': user.prob.probSanHeadPdu.forenameSurname,
        'accessMode': 'READ_ONLY',
    },
        'san', 'offender'
    )

    await san.returnToOASys()

    log(`From the offender record click on the <Open SP> button
                    Navigates out to the Sentence Plan which should be shown in READ WRITE mode - check the OTL access mode parameter for SP
                    Return back to OASys`, 'Test step')

    await sentencePlan.openAndReturn('offender')

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
        'planAccessMode': 'READ_WRITE',
    },
        'sp', 'offender'
    )

    await user.logout()
})
