import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page1: {
        everDrank: EverDrank,
    },
    page2: {
        howOftenLast3: HowOftenLast3,
        typicalUnits: TypicalUnits,
        bingeDrinking: BingeDrinking,
    }
}

let startPage = 1 // Page that SAN will go back into when opening the section, depends on last page reached in previous scenario

test.describe.configure({ retries: 1 })
test('Mapping test V2: alcohol', async ({ page, oasys, user, offender, assessment, san }) => {

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
        { ref: 0, page1: { everDrank: null }, page2: null },
        { ref: 1, page1: { everDrank: 'no' }, page2: null },
        { ref: 2, page1: { everDrank: 'yesNotLast3' }, page2: { howOftenLast3: null, typicalUnits: null, bingeDrinking: 'noEvidence' } },
        { ref: 3, page1: { everDrank: 'yesNotLast3' }, page2: { howOftenLast3: null, typicalUnits: null, bingeDrinking: 'someEvidence' } },
        { ref: 4, page1: { everDrank: 'yesNotLast3' }, page2: { howOftenLast3: null, typicalUnits: null, bingeDrinking: 'evidence' } },
        { ref: 5, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '1PerMonth', typicalUnits: '1To2', bingeDrinking: 'noEvidence' } },
        { ref: 6, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '1PerMonth', typicalUnits: '3To4', bingeDrinking: 'someEvidence' } },
        { ref: 7, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '1PerMonth', typicalUnits: '5To6', bingeDrinking: 'evidence' } },
        { ref: 8, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '1PerMonth', typicalUnits: '7To9', bingeDrinking: 'noEvidence' } },
        { ref: 9, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '1PerMonth', typicalUnits: '10orMore', bingeDrinking: 'someEvidence' } },
        { ref: 10, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '2-4PerMonth', typicalUnits: '1To2', bingeDrinking: 'evidence' } },
        { ref: 11, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '2-4PerMonth', typicalUnits: '3To4', bingeDrinking: 'noEvidence' } },
        { ref: 12, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '2-4PerMonth', typicalUnits: '5To6', bingeDrinking: 'someEvidence' } },
        { ref: 13, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '2-4PerMonth', typicalUnits: '7To9', bingeDrinking: 'evidence' } },
        { ref: 14, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '2-4PerMonth', typicalUnits: '10orMore', bingeDrinking: 'noEvidence' } },
        { ref: 15, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '2-3PerWeek', typicalUnits: '1To2', bingeDrinking: 'someEvidence' } },
        { ref: 16, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '2-3PerWeek', typicalUnits: '3To4', bingeDrinking: 'evidence' } },
        { ref: 17, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '2-3PerWeek', typicalUnits: '5To6', bingeDrinking: 'noEvidence' } },
        { ref: 18, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '2-3PerWeek', typicalUnits: '7To9', bingeDrinking: 'someEvidence' } },
        { ref: 19, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: '2-3PerWeek', typicalUnits: '10orMore', bingeDrinking: 'evidence' } },
        { ref: 20, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: 'more', typicalUnits: '1To2', bingeDrinking: 'noEvidence' } },
        { ref: 21, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: 'more', typicalUnits: '3To4', bingeDrinking: 'someEvidence' } },
        { ref: 22, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: 'more', typicalUnits: '5To6', bingeDrinking: 'evidence' } },
        { ref: 23, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: 'more', typicalUnits: '7To9', bingeDrinking: 'noEvidence' } },
        { ref: 24, page1: { everDrank: 'yesIncLast3' }, page2: { howOftenLast3: 'more', typicalUnits: '10orMore', bingeDrinking: 'someEvidence' } },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Alcohol use', true)
        // Back to the start, depending where the previous scenario ended
        // if (test.ref > 1) {
        //     await san.change()
        // }
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
    await san.gotoSan('Alcohol use', true)
    await san.alcohol.page2.howOftenLast3.setValue('1PerMonth')
    await san.alcohol.page2.typicalUnits.setValue('10orMore')
    await san.alcohol.page2.had8OrMore.setValue('no')
    await san.alcohol.page2.bingeDrinking.setValue('noEvidence')
    await san.alcohol.page2.pastIssues.setValue('no')
    await san.alcohol.page2.whyDrink.setValue(['cultural'])
    await san.alcohol.page2.impactAlcohol.setValue(['behavioural'])
    await san.alcohol.page2.anythingHelpedAlcohol.setValue('no')
    await san.alcohol.page2.wantChanges.setValue('madeChanges')
    await san.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, 'Alcohol use', page, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.alcohol.page1.everDrank.setValue(test.page1.everDrank)
    if (test.page2) {
        await san.saveAndContinue()
        if (test.page1.everDrank == 'yesIncLast3') {
            await san.alcohol.page2.howOftenLast3.setValue(test.page2.howOftenLast3)
            await san.alcohol.page2.typicalUnits.setValue(test.page2.typicalUnits)
        }
        await san.alcohol.page2.bingeDrinking.setValue(test.page2.bingeDrinking)
        startPage = 2
    } else {
        startPage = 1
    }
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section9Answers: OasysAnswer[] = [
        { q: '9.1', a: mapping9_1(test) },
        { q: '9.1.t', a: mapping9_1_t(test) },
        { q: '9.2', a: mapping9_2(test) },
        { q: '9.3', a: null },
        { q: '9.4', a: null },
        { q: '9.5', a: null },
        { q: '9.97', a: null },
        { q: '9.98', a: null },
        { q: '9.99', a: null },
        { q: '9_SAN_STRENGTH', a: null },
    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'AC_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section9Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '9', section9Answers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section9Failed || sanSectionFailed
}


function mapping9_1(test: TestCase): string {

    if (test.page1.everDrank == null) {
        return null
    }
    if (test.page1.everDrank == 'no') {
        return '0'
    }

    let score = 0

    switch (test.page2?.howOftenLast3) {
        case '1PerMonth':
            score = 0
            break
        case '2-4PerMonth':
            score = 1
            break
        case '2-3PerWeek':
            score = 3
            break
        case 'more':
            score = 4
            break
    }

    switch (test.page2?.typicalUnits) {
        case '3To4':
            score += 1
            break
        case '5To6':
            score += 2
            break
        case '7To9':
            score += 3
            break
        case '10orMore':
            score += 4
            break
    }

    if (score <= 4) {
        return '0'
    } else if (score <= 7) {
        return '1'
    } else if (score = 8) {
        return '2'
    }

}

function mapping9_1_t(test: TestCase): string {

    if (test.page2?.howOftenLast3 == '1PerMonth') {
        switch (test.page2?.typicalUnits) {
            case '1To2':
                return 'Only drinks once a month or less and consumes 1 to 2 units a day, when they drink.'
            case '3To4':
                return 'Only drinks once a month or less and consumes 3 to 4 units a day, when they drink.'
            case '5To6':
                return 'Only drinks once a month or less and consumes 5 to 6 units a day, when they drink.'
            case '7To9':
                return 'Only drinks once a month or less and consumes 7 to 9 units a day, when they drink.'
            case '10orMore':
                return 'Only drinks once a month or less and consumes 10 or more units a day, when they drink.'
        }
    } else if (test.page2?.howOftenLast3 == '2-4PerMonth') {
        switch (test.page2?.typicalUnits) {
            case '1To2':
                return 'Drinks multiple times a month and consumes 1 to 2 units a day, when they drink.'
            case '3To4':
                return 'Drinks multiple times a month and consumes 3 to 4 units a day, when they drink.'
            case '5To6':
                return 'Drinks multiple times a month and consumes 5 to 6 units a day, when they drink.'
            case '7To9':
                return 'Drinks multiple times a month and consumes 7 to 9 units a day, when they drink.'
            case '10orMore':
                return 'Drinks multiple times a month and consumes 10 or more units a day, when they drink.'
        }
    } else if (test.page2?.howOftenLast3 == '2-3PerWeek') {
        switch (test.page2?.typicalUnits) {
            case '1To2':
                return 'Drinks less than four times a week and consumes 1 to 2 units a day, when they drink.'
            case '3To4':
                return 'Drinks less than four times a week and consumes 3 to 4 units a day, when they drink.'
            case '5To6':
                return 'Drinks less than four times a week and consumes 5 to 6 units a day, when they drink.'
            case '7To9':
                return 'Drinks less than four times a week and consumes 7 to 9 units a day, when they drink.'
            case '10orMore':
                return 'Drinks less than four times a week and consumes 10 or more units a day, when they drink.'
        }
    } else if (test.page2?.howOftenLast3 == 'more') {
        switch (test.page2?.typicalUnits) {
            case '1To2':
                return 'Drinks more than four times a week and consumes 1 to 2 units a day, when they drink.'
            case '3To4':
                return 'Drinks more than four times a week and consumes 3 to 4 units a day, when they drink.'
            case '5To6':
                return 'Drinks more than four times a week and consumes 5 to 6 units a day, when they drink.'
            case '7To9':
                return 'Drinks more than four times a week and consumes 7 to 9 units a day, when they drink.'
            case '10orMore':
                return 'Drinks more than four times a week and consumes 10 or more units a day, when they drink.'
        }
    }

    return null

}

function mapping9_2(test: TestCase): string {

    if (test.page1.everDrank == 'no') {
        return '0'
    }
    switch (test.page2?.bingeDrinking) {
        case 'noEvidence':
            return '0'
        case 'someEvidence':
            return '1'
        case 'evidence':
            return '2'
        default:
            return null
    }

}
