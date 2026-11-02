import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page1: {
        mentalHealthProblems: SanYesNoUnknown,
    },
    page2: {
        describeMentalHealthCondition: MentalHealthCondition,
        psychTreatment: SanYesNoUnknown,
        learningDifficulties: SanSignificantSomeNoUnknown,
        coping: SanYesSomeNo,
        attitude: SanPositiveMixedNegative,
        selfHarmed: SanYesNo,
        suicide: SanYesNo,
    }
}

test.describe.configure({ retries: 1 })

for (const mode of ['community', 'custody']) {
    test(`Mapping test V2 ${mode}: health and wellbeing`, async ({ oasys, user, offender, assessment, san }) => {

        sanMode = mode as SanMode
        const mappingTestOffender = await getMappingTestOffender()

        // Delete previous assessments so no data gets cloned
        await user.admin.login(sanMode == 'community' ? providers.prob.san : providers.pris.san)
        await offender.searchAndSelectByPnc(mappingTestOffender.pnc)
        await assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
        await user.logout()

        // Create a new SAN assessment
        if (sanMode == 'community') {
            await user.prob.probSanUnappr.login()
        } else {
            await user.pris.prisSanPom.login()
        }
        await offender.searchAndSelectByPnc(mappingTestOffender.pnc)
        let assessmentPk: number
        if (sanMode == 'community') {
            assessmentPk = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
        } else {
            assessmentPk = await assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)' })
        }

        let failed = 0

        const testCases: TestCase[] = [
            { ref: 1, page1: { mentalHealthProblems: 'yes' }, page2: null },
            { ref: 2, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedEvidenceOfImpact', psychTreatment: 'yes', learningDifficulties: 'significant', coping: 'yes', attitude: 'positive', selfHarmed: 'yes', suicide: 'yes' } },
            { ref: 3, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedEvidenceOfImpact', psychTreatment: 'no', learningDifficulties: 'some', coping: 'yes', attitude: 'positive', selfHarmed: 'yes', suicide: 'no' } },
            { ref: 4, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedEvidenceOfImpact', psychTreatment: 'unknown', learningDifficulties: 'no', coping: 'yes', attitude: 'positive', selfHarmed: 'no', suicide: 'yes' } },
            { ref: 5, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedNoEvidence', psychTreatment: 'yes', learningDifficulties: 'unknown', coping: 'yes', attitude: 'positive', selfHarmed: 'no', suicide: 'no' } },
            { ref: 6, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedNoEvidence', psychTreatment: 'no', learningDifficulties: 'significant', coping: 'yes', attitude: 'positive', selfHarmed: 'yes', suicide: 'yes' } },
            { ref: 7, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedNoEvidence', psychTreatment: 'unknown', learningDifficulties: 'some', coping: 'some', attitude: 'positive', selfHarmed: 'yes', suicide: 'no' } },
            { ref: 8, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'past', psychTreatment: 'yes', learningDifficulties: 'no', coping: 'some', attitude: 'positive', selfHarmed: 'no', suicide: 'yes' } },
            { ref: 9, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'past', psychTreatment: 'no', learningDifficulties: 'unknown', coping: 'some', attitude: 'positive', selfHarmed: 'no', suicide: 'no' } },
            { ref: 10, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'past', psychTreatment: 'unknown', learningDifficulties: 'significant', coping: 'some', attitude: 'negative', selfHarmed: 'yes', suicide: 'no' } },
            { ref: 11, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'undiagnosed', psychTreatment: 'yes', learningDifficulties: 'some', coping: 'some', attitude: 'negative', selfHarmed: 'no', suicide: 'yes' } },
            { ref: 12, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'undiagnosed', psychTreatment: 'no', learningDifficulties: 'no', coping: 'no', attitude: 'negative', selfHarmed: 'no', suicide: 'no' } },
            { ref: 13, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'undiagnosed', psychTreatment: 'unknown', learningDifficulties: 'unknown', coping: 'no', attitude: 'negative', selfHarmed: 'yes', suicide: 'yes' } },
            { ref: 14, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedEvidenceOfImpact', psychTreatment: 'yes', learningDifficulties: 'significant', coping: 'no', attitude: 'negative', selfHarmed: 'yes', suicide: 'no' } },
            { ref: 15, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedEvidenceOfImpact', psychTreatment: 'no', learningDifficulties: 'some', coping: 'no', attitude: 'negative', selfHarmed: 'no', suicide: 'yes' } },
            { ref: 16, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedEvidenceOfImpact', psychTreatment: 'unknown', learningDifficulties: 'no', coping: 'no', attitude: 'negative', selfHarmed: 'no', suicide: 'no' } },
            { ref: 17, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedNoEvidence', psychTreatment: 'yes', learningDifficulties: 'unknown', coping: 'yes', attitude: 'negative', selfHarmed: 'no', suicide: 'yes' } },
            { ref: 18, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedNoEvidence', psychTreatment: 'no', learningDifficulties: 'significant', coping: 'yes', attitude: 'negative', selfHarmed: 'no', suicide: 'no' } },
            { ref: 19, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'diagnosedNoEvidence', psychTreatment: 'unknown', learningDifficulties: 'some', coping: 'some', attitude: 'mixed', selfHarmed: 'yes', suicide: 'yes' } },
            { ref: 20, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'past', psychTreatment: 'yes', learningDifficulties: 'no', coping: 'some', attitude: 'mixed', selfHarmed: 'yes', suicide: 'no' } },
            { ref: 21, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'past', psychTreatment: 'no', learningDifficulties: 'unknown', coping: 'some', attitude: 'mixed', selfHarmed: 'no', suicide: 'yes' } },
            { ref: 22, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'past', psychTreatment: 'unknown', learningDifficulties: 'significant', coping: 'no', attitude: 'mixed', selfHarmed: 'no', suicide: 'no' } },
            { ref: 23, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'undiagnosed', psychTreatment: 'yes', learningDifficulties: 'some', coping: 'no', attitude: 'mixed', selfHarmed: 'yes', suicide: 'yes' } },
            { ref: 24, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'undiagnosed', psychTreatment: 'no', learningDifficulties: 'no', coping: 'yes', attitude: 'mixed', selfHarmed: 'no', suicide: 'yes' } },
            { ref: 25, page1: { mentalHealthProblems: 'yes' }, page2: { describeMentalHealthCondition: 'undiagnosed', psychTreatment: 'unknown', learningDifficulties: 'unknown', coping: 'some', attitude: 'mixed', selfHarmed: 'no', suicide: 'no' } },
        ]


        for (const test of testCases) {
            // Get to the right starting screen
            await san.gotoSan('health', true)
            // Back to the start, depending where the previous scenario ended
            await san.health.backToStart()
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
        await san.gotoSan('health', true)
        await san.health.saveAndContinue()
        await san.health.saveAndContinue()
        await san.health.wantChanges.setValue('madeChanges')
        await san.health.saveAndContinue()
        await san.returnToOASys()

        await paTest(assessmentPk, san.health, oasys, assessment, san)
        await user.logout()
    })
}


async function scenario(test: TestCase, san: San) {

    await san.health.page1.physicalHealthConditions.setValue('yes')
    await san.health.page1.mentalHealthProblems.setValue(test.page1.mentalHealthProblems)
    await san.health.saveAndContinue()

    if (test.page2) {
        await san.health.page2.describeMentalHealthCondition.setValue(test.page2.describeMentalHealthCondition)
        await san.health.page2.psychTreatment.setValue(test.page2.psychTreatment)
        await san.health.page2.learningDifficulties.setValue(test.page2.learningDifficulties)
        await san.health.page2.coping.setValue(test.page2.coping)
        await san.health.page2.attitude.setValue(test.page2.attitude)
        await san.health.page2.selfHarmed.setValue(test.page2.selfHarmed)
        if (test.page2.selfHarmed == 'yes') {
            await san.health.page2.selfHarmedDetails.setValue('some text')
        }
        await san.health.page2.suicide.setValue(test.page2.suicide)
        if (test.page2.suicide == 'yes') {
            await san.health.page2.suicideDetails.setValue('some text')
        }

        await san.health.saveAndContinue()
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
        { q: '10.7_V2_HISTHEADINJ', a: null },
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
        case 'significant':
            return '2'
        case 'some':
            return '1'
        case 'no':
            return '0'
        case 'unknown':
            return 'M'
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

    if (test.page1.mentalHealthProblems == 'no') {
        return '0'
    }
    if (test.page1.mentalHealthProblems == 'yes') {


        switch (test.page2.describeMentalHealthCondition) {
            case 'diagnosedEvidenceOfImpact':
                return '2'
            case 'diagnosedNoEvidence':
            case 'past':
                return '1'
            case 'undiagnosed':
                return '0'
        }
    }

    return null
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

    if (test.page1.mentalHealthProblems == 'no') {
        return '0'
    }
    if (test.page1.mentalHealthProblems == 'yes') {

        switch (test.page2.describeMentalHealthCondition) {
            case 'diagnosedEvidenceOfImpact':
                return '2'
            case 'diagnosedNoEvidence':
            case 'past':
                return '1'
            case 'undiagnosed':
                return '0'
        }
    }

    return null
}

function mapping10_7HistPsych(test: TestCase): string {

    if (test.page1.mentalHealthProblems == 'no') {
        return 'NO'
    }
    if (test.page1.mentalHealthProblems == 'yes') {

        switch (test.page2.describeMentalHealthCondition) {
            case 'diagnosedEvidenceOfImpact':
            case 'diagnosedNoEvidence':
            case 'past':
                return 'YES'
            case 'undiagnosed':
                return 'NO'
        }
    }

    return null
}

function mapping10_7Psych(test: TestCase): string {

    if (test.page1.mentalHealthProblems == 'no') {
        return 'NO'
    }
    if (test.page1.mentalHealthProblems == 'yes') {
        switch (test.page2?.psychTreatment) {
            case 'yes':
                return 'YES'
            case 'no':
            case 'unknown':
                return 'NO'
            default:
                return null
        }
    }

    return null
} 
