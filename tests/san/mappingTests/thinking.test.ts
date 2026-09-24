import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page1: {
        awareConsequences: SanYesSometimesNo,
        stableBehaviour: SanYesSometimesNo,
        activitiesLinkedOffending: SanYesSometimesNo,
        resilient: SanYesHasBeenNo,
        ableSolveProblems: SanYesLimitedNo,
        understandOthers: SanYesNoSome,
        manipulativeBehaviour: SanYesNoSome,
        manageTemper: SanYesSometimesNo,
        violence: SanYesSometimesNo,
        impulse: SanYesSometimesNo,
        positiveAttitude: SanYesPartlyNo,
        hostileOrientation: SanYesSometimesNo,
        acceptSupervision: SanYesUnsureNo,
        supportCriminalBehaviour: SanYesSometimesNo,
    },
    page2: {
        riskOfSexualHarm: SanYesNo,
    },
    page3: {
        sexualPreoccupation: SanYesSometimesNoUnknown,
        sexualInterests: SanYesSometimesNoUnknown,
        emotionalIntimacy: SanYesSometimesNoUnknown,
    }
}

let startPage = 1 // Page that SAN will go back into when opening the section, depends on last page reached in previous scenario

// test.describe.configure({ retries: 1 })
test('Mapping test V2: thinking', async ({ page, oasys, user, offender, assessment, san }) => {

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
        { ref: 1, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: null, page3: null },
        { ref: 2, page1: { awareConsequences: 'sometimes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'sometimes', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: null, page3: null },
        { ref: 3, page1: { awareConsequences: 'no', stableBehaviour: 'sometimes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'yes', violence: 'sometimes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: null, page3: null },
        { ref: 4, page1: { awareConsequences: 'yes', stableBehaviour: 'no', activitiesLinkedOffending: 'sometimes', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'no', violence: 'no', impulse: 'sometimes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: null, page3: null },
        { ref: 5, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'yes', resilient: 'hasBeen', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'no', violence: 'yes', impulse: 'no', positiveAttitude: 'partly', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: null, page3: null },
        { ref: 6, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'no', ableSolveProblems: 'limited', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'yes', hostileOrientation: 'sometimes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: null, page3: null },
        { ref: 7, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'no', understandOthers: 'some', manipulativeBehaviour: 'no', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'no', acceptSupervision: 'unsure', supportCriminalBehaviour: 'yes' }, page2: null, page3: null },
        { ref: 8, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'no', manipulativeBehaviour: 'some', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'yes', supportCriminalBehaviour: 'sometimes' }, page2: null, page3: null },
        { ref: 9, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'yes', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'no' }, page2: null, page3: null },
        { ref: 10, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'no', manipulativeBehaviour: 'some', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'no' }, page3: null },
        { ref: 11, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'no', manipulativeBehaviour: 'some', manageTemper: 'sometimes', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'no' }, page3: null },
        { ref: 12, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'no', manipulativeBehaviour: 'some', manageTemper: 'yes', violence: 'sometimes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'no' }, page3: null },
        { ref: 13, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'no', manipulativeBehaviour: 'some', manageTemper: 'no', violence: 'no', impulse: 'sometimes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'no' }, page3: null },
        { ref: 14, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'no', manipulativeBehaviour: 'some', manageTemper: 'no', violence: 'yes', impulse: 'no', positiveAttitude: 'partly', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'no' }, page3: null },
        { ref: 15, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'no', manipulativeBehaviour: 'some', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'yes', hostileOrientation: 'sometimes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'no' }, page3: null },
        { ref: 16, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'no', manipulativeBehaviour: 'some', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'no', acceptSupervision: 'unsure', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'no' }, page3: null },
        { ref: 17, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'no', manipulativeBehaviour: 'some', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'yes', supportCriminalBehaviour: 'sometimes' }, page2: { riskOfSexualHarm: 'no' }, page3: null },
        { ref: 18, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'no', manipulativeBehaviour: 'some', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'no' }, page2: { riskOfSexualHarm: 'no' }, page3: null },
        { ref: 19, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'yes' }, page3: { sexualPreoccupation: 'yes', sexualInterests: 'yes', emotionalIntimacy: 'yes' } },
        { ref: 20, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'sometimes', violence: 'yes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'yes' }, page3: { sexualPreoccupation: 'sometimes', sexualInterests: 'yes', emotionalIntimacy: 'yes' } },
        { ref: 21, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'yes', violence: 'sometimes', impulse: 'yes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'yes' }, page3: { sexualPreoccupation: 'no', sexualInterests: 'sometimes', emotionalIntimacy: 'yes' } },
        { ref: 22, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'no', violence: 'no', impulse: 'sometimes', positiveAttitude: 'no', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'yes' }, page3: { sexualPreoccupation: 'unknown', sexualInterests: 'no', emotionalIntimacy: 'sometimes' } },
        { ref: 23, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'no', violence: 'yes', impulse: 'no', positiveAttitude: 'partly', hostileOrientation: 'yes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'yes' }, page3: { sexualPreoccupation: 'yes', sexualInterests: 'unknown', emotionalIntimacy: 'no' } },
        { ref: 24, page1: { awareConsequences: 'yes', stableBehaviour: 'yes', activitiesLinkedOffending: 'no', resilient: 'yes', ableSolveProblems: 'yes', understandOthers: 'yes', manipulativeBehaviour: 'no', manageTemper: 'no', violence: 'yes', impulse: 'yes', positiveAttitude: 'yes', hostileOrientation: 'sometimes', acceptSupervision: 'no', supportCriminalBehaviour: 'yes' }, page2: { riskOfSexualHarm: 'yes' }, page3: { sexualPreoccupation: 'yes', sexualInterests: 'yes', emotionalIntimacy: 'unknown' } },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Thinking, behaviours and attitudes', true)
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
    await san.gotoSan('Thinking, behaviours and attitudes', true)
    await san.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, 'Thinking, behaviours and attitudes', page, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.thinking.page1.awareConsequences.setValue(test.page1.awareConsequences)
    await san.thinking.page1.stableBehaviour.setValue(test.page1.stableBehaviour)
    await san.thinking.page1.activitiesLinkedOffending.setValue(test.page1.activitiesLinkedOffending)
    await san.thinking.page1.resilient.setValue(test.page1.resilient)
    await san.thinking.page1.ableSolveProblems.setValue(test.page1.ableSolveProblems)
    await san.thinking.page1.understandOthers.setValue(test.page1.understandOthers)
    await san.thinking.page1.manipulativeBehaviour.setValue(test.page1.manipulativeBehaviour)
    await san.thinking.page1.manageTemper.setValue(test.page1.manageTemper)
    await san.thinking.page1.violence.setValue(test.page1.violence)
    await san.thinking.page1.impulse.setValue(test.page1.impulse)
    await san.thinking.page1.positiveAttitude.setValue(test.page1.positiveAttitude)
    await san.thinking.page1.hostileOrientation.setValue(test.page1.hostileOrientation)
    await san.thinking.page1.acceptSupervision.setValue(test.page1.acceptSupervision)
    await san.thinking.page1.supportCriminalBehaviour.setValue(test.page1.supportCriminalBehaviour)
    if (test.page2) {
        await san.thinking.page1.wantChangesThinking.setValue('madeChanges')
        await san.saveAndContinue()
        await san.thinking.page2.riskOfSexualHarm.setValue(test.page2.riskOfSexualHarm)
        if (test.page3) {
            await san.saveAndContinue()
            await san.thinking.page3.sexualPreoccupation.setValue(test.page3.sexualPreoccupation)
            await san.thinking.page3.sexualInterests.setValue(test.page3.sexualInterests)
            await san.thinking.page3.emotionalIntimacy.setValue(test.page3.emotionalIntimacy)
            startPage = 3
        } else {
            startPage = 2
        }
    } else {
        startPage = 1
    }
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section6Answers: OasysAnswer[] = [
        { q: '6.11', a: mapping6_11(test) },
        { q: '6.12', a: mapping6_12(test) },
    ]
    const section7Answers: OasysAnswer[] = [
        { q: '7.1', a: null },
        { q: '7.2', a: mapping7_2(test) },
        { q: '7.3', a: mapping7_3(test) },
        { q: '7.4', a: mapping7_4(test) },
        { q: '7.5', a: mapping7_5(test) },
    ]
    const section11Answers: OasysAnswer[] = [
        { q: '11.1', a: null },
        { q: '11.2', a: mapping11_2(test) },
        { q: '11.3', a: mapping11_3(test) },
        { q: '11.4', a: mapping11_4(test) },
        { q: '11.5', a: null },
        { q: '11.6', a: mapping11_6(test) },
        { q: '11.7', a: mapping11_7(test) },
        { q: '11.8', a: null },
        { q: '11.9', a: mapping11_9(test) },
        { q: '11.10', a: null },
        { q: '11.11', a: mapping11_11(test) },
        { q: '11.12', a: mapping11_12(test) },
    ]
    const section12Answers: OasysAnswer[] = [
        { q: '12.1', a: mapping12_1(test) },
        { q: '12.3', a: mapping12_3(test) },
        { q: '12.4', a: mapping12_4(test) },
        { q: '12.5', a: null },
        { q: '12.6', a: null },
        { q: '12.8', a: null },
        { q: '12.9', a: mapping12_9(test) },
    ]

    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'TBA_SAN_STRENGTH', a: null },
        { q: 'TBA_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section6Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '6', section6Answers, true)
    const section7Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '7', section7Answers, true)
    const section11Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '11', section11Answers, true)
    const section12Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '12', section12Answers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section6Failed || section7Failed || section11Failed || section12Failed || sanSectionFailed
}


function mapping6_11(test: TestCase): string {

    return test.page2?.riskOfSexualHarm?.toUpperCase()
}

function mapping6_12(test: TestCase): string {

    switch (test.page3?.emotionalIntimacy) {
        case 'yes':
            return '2'
        case 'sometimes':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}

function mapping7_2(test: TestCase): string {

    switch (test.page1.activitiesLinkedOffending) {
        case 'yes':
            return '2'
        case 'sometimes':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}

function mapping7_3(test: TestCase): string {

    switch (test.page1.resilient) {
        case 'yes':
            return '0'
        case 'hasBeen':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping7_4(test: TestCase): string {

    switch (test.page1.manipulativeBehaviour) {
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

function mapping7_5(test: TestCase): string {

    switch (test.page1.stableBehaviour) {
        case 'yes':
            return '0'
        case 'sometimes':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }

}

function mapping11_2(test: TestCase): string {

    switch (test.page1.impulse) {
        case 'yes':
            return '2'
        case 'sometimes':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}

function mapping11_3(test: TestCase): string {

    switch (test.page1.violence) {
        case 'yes':
            return '2'
        case 'sometimes':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}

function mapping11_4(test: TestCase): string {

    switch (test.page1.manageTemper) {
        case 'yes':
            return '0'
        case 'sometimes':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping11_6(test: TestCase): string {

    switch (test.page1.ableSolveProblems) {
        case 'yes':
            return '0'
        case 'limited':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping11_7(test: TestCase): string {

    switch (test.page1.awareConsequences) {
        case 'yes':
            return '0'
        case 'sometimes':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping11_9(test: TestCase): string {

    switch (test.page1.understandOthers) {
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

function mapping11_11(test: TestCase): string {

    switch (test.page3?.sexualPreoccupation) {
        case 'yes':
            return '2'
        case 'sometimes':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}

function mapping11_12(test: TestCase): string {

    switch (test.page3?.sexualInterests) {
        case 'yes':
            return '2'
        case 'sometimes':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}

function mapping12_1(test: TestCase): string {

    switch (test.page1.supportCriminalBehaviour) {
        case 'yes':
            return '2'
        case 'sometimes':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}

function mapping12_3(test: TestCase): string {

    switch (test.page1.positiveAttitude) {
        case 'yes':
            return '0'
        case 'partly':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping12_4(test: TestCase): string {

    switch (test.page1.acceptSupervision) {
        case 'yes':
            return '0'
        case 'unsure':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping12_9(test: TestCase): string {

    switch (test.page1.hostileOrientation) {
        case 'yes':
            return '2'
        case 'sometimes':
            return '1'
        case 'no':
            return '0'
        default:
            return null
    }
}
