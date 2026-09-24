import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page2: {
        importantPeople: ImportantPeople[],
    },
    page3: {
        happyWithStatus: HappyWithStatus,
        history: RelationshipHistory,
        manageParenting: SanYesSometimesNoUnknown,
        currentFamilyRelationship: CurrentFamilyRelationship,
        childhoodExperience: SanPositiveMixedNegative,
        behaviouralProblems: SanYesNo,
    }
}

let startPage = 1 // Page that SAN will go back into when opening the section, depends on last page reached in previous scenario

test.describe.configure({ retries: 1 })
test('Mapping test V2: relationships', async ({ page, oasys, user, offender, assessment, san }) => {

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
        { ref: 1, page2: { importantPeople: ['partner'] }, page3: null },
        { ref: 2, page2: { importantPeople: ['ownChildren'] }, page3: null },
        { ref: 3, page2: { importantPeople: ['otherChildren'] }, page3: null },
        { ref: 4, page2: { importantPeople: ['family'] }, page3: null },
        { ref: 5, page2: { importantPeople: ['friends'] }, page3: null },
        { ref: 6, page2: { importantPeople: ['other'] }, page3: null },
        { ref: 7, page2: { importantPeople: ['partner', 'ownChildren', 'otherChildren', 'family', 'friends', 'other'] }, page3: { happyWithStatus: 'happy', history: 'unstable', manageParenting: 'yes', currentFamilyRelationship: 'unstable', childhoodExperience: 'positive', behaviouralProblems: 'yes' } },
        { ref: 8, page2: { importantPeople: ['ownChildren', 'otherChildren', 'family', 'friends', 'other'] }, page3: { happyWithStatus: 'someConcerns', history: 'stable', manageParenting: 'sometimes', currentFamilyRelationship: 'stable', childhoodExperience: 'mixed', behaviouralProblems: 'no' } },
        { ref: 9, page2: { importantPeople: ['partner', 'otherChildren', 'family', 'friends', 'other'] }, page3: { happyWithStatus: 'unhappy', history: 'mixed', manageParenting: null, currentFamilyRelationship: 'mixed', childhoodExperience: 'negative', behaviouralProblems: 'yes' } },
        { ref: 10, page2: { importantPeople: ['partner', 'ownChildren', 'family', 'friends', 'other'] }, page3: { happyWithStatus: 'happy', history: 'unstable', manageParenting: 'unknown', currentFamilyRelationship: 'unstable', childhoodExperience: 'negative', behaviouralProblems: 'no' } },
        { ref: 11, page2: { importantPeople: ['partner', 'ownChildren', 'otherChildren', 'friends', 'other'] }, page3: { happyWithStatus: 'someConcerns', history: 'stable', manageParenting: 'yes', currentFamilyRelationship: 'unknown', childhoodExperience: 'positive', behaviouralProblems: 'yes' } },
        { ref: 12, page2: { importantPeople: ['partner', 'ownChildren', 'otherChildren', 'family', 'other'] }, page3: { happyWithStatus: 'unhappy', history: 'mixed', manageParenting: 'sometimes', currentFamilyRelationship: 'stable', childhoodExperience: 'mixed', behaviouralProblems: 'no' } },
        { ref: 13, page2: { importantPeople: ['partner', 'ownChildren', 'otherChildren', 'family', 'friends'] }, page3: { happyWithStatus: 'someConcerns', history: 'unstable', manageParenting: 'no', currentFamilyRelationship: 'mixed', childhoodExperience: 'positive', behaviouralProblems: 'yes' } },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Personal relationships and community', true)
        // Back to the start (page 2), depending where the previous scenario ended
        if (startPage == 1) {
            await san.relationships.page1.anyChildren.setValue(['no'])
            await san.saveAndContinue()
        } else {
            for (let i = 2; i < startPage; i++) {
                await san.previous()
            }
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
    await san.gotoSan('Personal relationships and community', true)
    await san.relationships.page3.resolveChallenges.setValue('Testing')
    await san.relationships.page3.wantChangesRelationships.setValue('madeChanges')
    await san.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, 'Personal relationships and community', page, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.relationships.page2.importantPeople.setValue(test.page2.importantPeople)
    if (test.page2.importantPeople.includes('other')) {
        await san.relationships.page2.importantOtherDetails.setValue('Other people details')
    }

    if (test.page3) {
        await san.saveAndContinue()
        await san.relationships.page3.happyWithStatus.setValue(test.page3.happyWithStatus)
        await san.relationships.page3.history.setValue(test.page3.history)
        await san.relationships.page3.manageParenting.setValue(test.page3.manageParenting)
        await san.relationships.page3.currentFamilyRelationship.setValue(test.page3.currentFamilyRelationship)
        await san.relationships.page3.childhoodExperience.setValue(test.page3.childhoodExperience)
        await san.relationships.page3.behaviouralProblems.setValue(test.page3.behaviouralProblems)
        startPage = 3
    } else {
        startPage = 2
    }
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section6Answers: OasysAnswer[] = [
        { q: '6.1', a: mapping6_1(test) },
        { q: '6.3', a: mapping6_3(test) },
        { q: '6.8', a: mapping6_8(test) },
        { q: '6.4', a: mapping6_4(test) },
        { q: '6.6', a: mapping6_6(test) },
        { q: '6.7da', a: null },
        { q: '6.7.1.1da', a: null },
        { q: '6.7.1.2da', a: null },
        { q: '6.7.2.1da', a: null },
        { q: '6.7.2.2da', a: null },
        { q: '6.9', a: mapping6_9(test) },
        { q: '6.10', a: mapping6_10(test) },
        { q: '6_SAN_STRENGTH', a: null },
    ]
    const section10Answers: OasysAnswer[] = [
        { q: '10.7_V2_CHILDHOOD', a: mapping10_7_V2_CHILDHOOD(test) },
    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'PRC_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section6Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '6', section6Answers, true)
    const section10Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '10', section10Answers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section6Failed || section10Failed || sanSectionFailed
}

function mapping6_1(test: TestCase): string {

    switch (test.page3?.currentFamilyRelationship) {
        case 'stable':
            return '0'
        case 'mixed':
            return '1'
        case 'unstable':
            return '2'
        case 'unknown':
            return 'M'
        default:
            return null
    }
}

function mapping6_3(test: TestCase): string {

    switch (test.page3?.childhoodExperience) {
        case 'positive':
            return '0'
        case 'mixed':
            return '1'
        case 'negative':
            return '2'
        default:
            return null
    }
}

function mapping6_8(test: TestCase): string {

    return test.page2.importantPeople.includes('partner') ? '2' : '3'
}


function mapping6_4(test: TestCase): string {

    switch (test.page3?.happyWithStatus) {
        case 'happy':
            return '0'
        case 'someConcerns':
            return '1'
        case 'unhappy':
            return '2'
        default:
            return null
    }
}

function mapping6_6(test: TestCase): string {

    switch (test.page3?.history) {
        case 'stable':
            return '0'
        case 'mixed':
            return '1'
        case 'unstable':
            return '2'
        default:
            return null
    }
}

function mapping6_9(test: TestCase): string {

    return test.page2.importantPeople.includes('ownChildren') ? 'YES' : 'NO'
}

function mapping6_10(test: TestCase): string {

    switch (test.page3?.manageParenting) {
        case 'yes':
            return 'Noproblems'
        case 'sometimes':
            return 'Someproblems'
        case 'no':
            return 'Significantproblems'
        default:
            return null
    }
}

function mapping10_7_V2_CHILDHOOD(test: TestCase): string {

    return test.page3?.behaviouralProblems?.toUpperCase()
}
