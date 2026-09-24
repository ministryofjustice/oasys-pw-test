import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page1: {
        mentalHealthProblems: MentalHealthProblems,
    },
    page2: {
        psychTreatment: PsychTreatment,
        headInjury: SanYesNoUnknown,
        learningDifficulties: SanYesNoSome,
        coping: SanYesNoSome,
        attitude: SanPositiveMixedNegative,
        selfHarmed: SanYesNo,
        suicide: SanYesNo,
    }
}

let startPage = 1 // Page that SAN will go back into when opening the section, depends on last page reached in previous scenario

test.describe.configure({ retries: 1 })
test('Mapping test V2: health and wellbeing', async ({ page, oasys, user, offender, assessment, san }) => {

    const mappingTestOffender = await getMappingTestOffender()

    // Delete previous assessments so no data gets cloned
    await user.admin.login(providers.prob.san)
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
    await user.logout()

    // Create a new SAN assessment
    await user.prob.probSanUnappr.login()
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    const assessmentPk = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    let failed = 0

    const testCases: TestCase[] = [
        { ref: 0, page1: { mentalHealthProblems: null }, page2: null },
        { ref: 1, page1: { mentalHealthProblems: 'yesOngoingSevere' }, page2: null },
        { ref: 2, page1: { mentalHealthProblems: 'yesOngoing' }, page2: null },
        { ref: 3, page1: { mentalHealthProblems: 'yesPast' }, page2: null },
        { ref: 4, page1: { mentalHealthProblems: 'no' }, page2: null },
        { ref: 5, page1: { mentalHealthProblems: 'unknown' }, page2: null },
        { ref: 6, page1: { mentalHealthProblems: 'yesOngoingSevere' }, page2: { psychTreatment: 'yes', headInjury: 'yes', learningDifficulties: 'some', coping: 'no', attitude: 'positive', selfHarmed: 'yes', suicide: 'yes' } },
        { ref: 7, page1: { mentalHealthProblems: 'yesOngoing' }, page2: { psychTreatment: 'pending', headInjury: 'no', learningDifficulties: 'no', coping: 'yes', attitude: 'mixed', selfHarmed: 'yes', suicide: 'no' } },
        { ref: 8, page1: { mentalHealthProblems: 'yesPast' }, page2: { psychTreatment: 'no', headInjury: 'unknown', learningDifficulties: 'yes', coping: 'some', attitude: 'negative', selfHarmed: 'no', suicide: 'yes' } },
        { ref: 9, page1: { mentalHealthProblems: 'yesOngoingSevere' }, page2: { psychTreatment: 'unknown', headInjury: 'yes', learningDifficulties: 'some', coping: 'no', attitude: 'mixed', selfHarmed: 'no', suicide: 'no' } },
        { ref: 10, page1: { mentalHealthProblems: 'yesOngoing' }, page2: { psychTreatment: 'unknown', headInjury: 'no', learningDifficulties: 'no', coping: 'yes', attitude: 'negative', selfHarmed: 'yes', suicide: 'yes' } },
        { ref: 11, page1: { mentalHealthProblems: 'yesPast' }, page2: { psychTreatment: 'no', headInjury: 'unknown', learningDifficulties: 'yes', coping: 'some', attitude: 'positive', selfHarmed: 'yes', suicide: 'no' } },
        { ref: 12, page1: { mentalHealthProblems: 'yesOngoing' }, page2: { psychTreatment: 'pending', headInjury: 'yes', learningDifficulties: 'yes', coping: 'yes', attitude: 'negative', selfHarmed: 'no', suicide: 'yes' } },
        { ref: 13, page1: { mentalHealthProblems: 'yesPast' }, page2: { psychTreatment: 'yes', headInjury: 'no', learningDifficulties: 'some', coping: 'some', attitude: 'positive', selfHarmed: 'no', suicide: 'no' } },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Health and wellbeing', true)
        // Back to the start, depending where the previous scenario ended
        for (let i = 1; i < startPage; i++) {
            await san.previous()
        }
        // Set values on SAN, return to OASys and check the results
        await scenario(test, san)
        await san.returnToOASys()
        await oasys.clickButton('Previous', true)
        await oasys.clickButton('Next', true)

        log(JSON.stringify(test))
        const scenarioFailed = await checkAnswers(assessmentPk, test, assessment)
        if (scenarioFailed) {
            failed++
        }
        console.log(`Ref ${test.ref} ${scenarioFailed ? 'FAILED' : 'Passed'}`)

    }

    expect(failed).toBe(0)

    // Complete everything needed for PA
    await san.gotoSan('Health and wellbeing', true)
    await san.health.page2.psychTreatment.setValue('no')
    await san.health.page2.headInjury.setValue('no')
    await san.health.page2.neurodiverse.setValue('no')
    await san.health.page2.learningDifficulties.setValue('no')
    await san.health.page2.coping.setValue('no')
    await san.health.page2.attitude.setValue('positive')
    await san.health.page2.selfHarmed.setValue('no')
    await san.health.page2.suicide.setValue('no')
    await san.health.page2.optimistic.setValue('optimistic')
    await san.health.page2.wantChangesHealth.setValue('madeChanges')

    await san.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, 'Health and wellbeing', page, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.health.page1.physicalHealthConditions.setValue('yes')
    await san.health.page1.mentalHealthProblems.setValue(test.page1.mentalHealthProblems)
    if (test.page2) {
        await san.saveAndContinue()
        await san.health.page2.psychTreatment.setValue(test.page2.psychTreatment)
        await san.health.page2.headInjury.setValue(test.page2.headInjury)
        await san.health.page2.learningDifficulties.setValue(test.page2.learningDifficulties)
        await san.health.page2.coping.setValue(test.page2.coping)
        await san.health.page2.attitude.setValue(test.page2.attitude)
        await san.health.page2.selfHarmed.setValue(test.page2.selfHarmed)
        await san.health.page2.suicide.setValue(test.page2.suicide)
        startPage = 2
    } else {
        startPage = 1
    }
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section4Answers: OasysAnswer[] = [
        { q: '4.8', a: mapping4_8(test) },
    ]
    const section10Answers: OasysAnswer[] = [
        { q: '10.1', a: mapping10_1(test) },
        { q: '10.2', a: mapping10_2(test) },
        { q: '10.3', a: null },
        { q: '10.4', a: mapping10_4(test) },
        { q: '10.5', a: mapping10_5(test) },
        { q: '10.6', a: mapping10_6(test) },
        { q: '10.7_V2_HISTHEADINJ', a: mapping10_7HistHeadInj(test) },
        { q: '10.7_V2_HISTPSYCH', a: mapping10_7HistPsych(test) },
        { q: '10.7_V2_MEDICATION', a: null },
        { q: '10.7_V2_FAILEDTOCOOP', a: null },
        { q: '10.7_V2_PATIENT', a: null },
        { q: '10.7_V2_PSYCHTREAT', a: mapping10_7Psych(test) },
        { q: '10.8', a: null },
        { q: '10.97', a: null },
        { q: '10.98', a: null },
        { q: '10.99', a: null },
        { q: '10_SAN_STRENGTH', a: null },
    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'HW_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section4Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '4', section4Answers, true)
    const section10Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '10', section10Answers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section4Failed || section10Failed || sanSectionFailed
}

function mapping4_8(test: TestCase) {

    switch (test.page2?.learningDifficulties) {
        case 'yes':
            return '2'
        case 'some':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}

function mapping10_1(test: TestCase): string {

    switch (test.page2?.coping) {
        case 'yes':
            return '0'
        case 'some':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping10_2(test: TestCase): string {

    switch (test.page1.mentalHealthProblems) {
        case 'yesOngoingSevere':
            return '2'
        case 'yesOngoing':
        case 'yesPast':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}

function mapping10_4(test: TestCase): string {

    switch (test.page2?.attitude) {
        case 'negative':
            return '2'
        case 'mixed':
            return '1'
        case 'positive':
            return '0'
        default:
            return null
    }
}

function mapping10_5(test: TestCase): string {

    if (test.page2?.selfHarmed == 'yes' || test.page2?.suicide == 'yes') {
        return 'YES'
    }
    if (test.page2?.selfHarmed == 'no' || test.page2?.suicide == 'no') {
        return 'NO'
    }
    return null
}

function mapping10_6(test: TestCase): string {

    switch (test.page1.mentalHealthProblems) {
        case 'yesOngoingSevere':
            return '2'
        case 'yesOngoing':
        case 'yesPast':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}

function mapping10_7HistHeadInj(test: TestCase): string {

    switch (test.page2?.headInjury) {
        case 'yes':
            return 'YES'
        case 'no':
            return 'NO'
        default: null
    }
}

function mapping10_7HistPsych(test: TestCase): string {

    switch (test.page1.mentalHealthProblems) {
        case 'yesOngoingSevere':
        case 'yesOngoing':
        case 'yesPast':
            return 'YES'
        case 'no':
        case 'unknown':
            return 'NO'
        default:
            return null
    }

}

function mapping10_7Psych(test: TestCase): string {

    if (test.page1.mentalHealthProblems == 'no' || test.page1.mentalHealthProblems == 'unknown') {
        return 'NO'
    }
    switch (test.page2?.psychTreatment) {
        case 'yes':
        case 'pending':
            return 'YES'
        case 'no':
        case 'unknown':
            return 'NO'
        default:
            return null
    }
} 
