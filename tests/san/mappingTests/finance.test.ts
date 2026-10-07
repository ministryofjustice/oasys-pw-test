import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = { ref: number, incomeSource: IncomeSource[], overReliant: SanYesNoUnknown, howGoodManaging: HowGoodManaging }

test.describe.configure({ retries: 1 })
test('Mapping test V1: finance', async ({ oasys, user, offender, assessment, san }) => {

    const mappingTestOffender = await getMappingTestOffender('finance')

    // Open the latest assessment, should be WIP
    await user.prob.probSanUnappr.login()
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.openLatest()
    const assessmentPk = await assessment.queries.getLatestSetPk(mappingTestOffender.probationCrn)

    let failed = 0

    const testCases: TestCase[] = [
        { ref: 1, incomeSource: ['offending'], overReliant: null, howGoodManaging: 'ableStrength' },
        { ref: 2, incomeSource: ['carersAllowance', 'offending'], overReliant: null, howGoodManaging: 'able' },
        { ref: 3, incomeSource: ['disabilityBenefits', 'offending'], overReliant: null, howGoodManaging: 'unable' },
        { ref: 4, incomeSource: ['employment', 'offending'], overReliant: null, howGoodManaging: 'unableProblems' },
        { ref: 5, incomeSource: ['family', 'offending'], overReliant: 'yes', howGoodManaging: 'ableStrength' },
        { ref: 6, incomeSource: ['pension', 'offending'], overReliant: null, howGoodManaging: 'unable' },
        { ref: 7, incomeSource: ['studentLoan', 'offending'], overReliant: null, howGoodManaging: 'able' },
        { ref: 8, incomeSource: ['undeclared', 'offending'], overReliant: null, howGoodManaging: 'unable' },
        { ref: 9, incomeSource: ['workBenefits', 'offending'], overReliant: null, howGoodManaging: 'unableProblems' },
        { ref: 10, incomeSource: ['other', 'offending'], overReliant: null, howGoodManaging: 'ableStrength' },
        { ref: 11, incomeSource: ['pension'], overReliant: null, howGoodManaging: 'unable' },
        { ref: 12, incomeSource: ['noMoney'], overReliant: null, howGoodManaging: 'able' },
        { ref: 13, incomeSource: ['family', 'offending'], overReliant: 'no', howGoodManaging: 'ableStrength' },
        { ref: 14, incomeSource: ['unknown'], overReliant: null, howGoodManaging: 'unable' },
        { ref: 15, incomeSource: ['family', 'offending'], overReliant: 'unknown', howGoodManaging: 'unableProblems' },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Finances', true)
        await san.finance.backToStart()
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
    await san.gotoSan('Finances', true)
    await san.finance.page1.incomeSource.setValue(['carersAllowance'])
    await san.finance.page1.ownAccount.setValue('unknown')
    await san.finance.page1.howGoodManaging.setValue('able')
    await san.finance.page1.gambling.setValue(['no'])
    await san.finance.page1.debt.setValue(['no'])
    await san.finance.page1.wantChanges.setValue('madeChanges')
    await san.finance.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, san.finance, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.finance.page1.incomeSource.setValue(test.incomeSource)
    if (test.incomeSource?.includes('family')) {
        await san.finance.page1.overReliant.setValue(test.overReliant)
    }
    await san.finance.page1.howGoodManaging.setValue(test.howGoodManaging)
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section5Answers: OasysAnswer[] = [
        { q: '5.2', a: null },
        { q: '5.3', a: mapping5_3(test) },
        { q: '5.4', a: mapping5_4(test) },
        { q: '5.5', a: mapping5_5(test) },
        { q: '5.6', a: mapping5_6(test) },
    ]
    const scAnswers: OasysAnswer[] = [
        { q: 'SC8', a: mappingSc8(test) },
    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'FI_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section5Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '5', section5Answers, true)
    const scFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SKILLSCHECKER', scAnswers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section5Failed || scFailed || sanSectionFailed
}

function mapping5_3(test: TestCase): string {

    switch (test.howGoodManaging) {
        case 'ableStrength':
        case 'able':
            return '0'
        case 'unable':
            return '1'
        case 'unableProblems':
            return '2'
        default:
            return null
    }
}

function mapping5_4(test: TestCase): string {

    if (test.incomeSource == null) {
        return null
    }
    if (test.incomeSource.includes('offending')) {
        return test.incomeSource.length == 1 ? '2' : '1'
    }
    if (test.incomeSource.includes('unknown')) {
        return 'M'
    }
    return '0'
}

function mapping5_5(test: TestCase): string {

    if (test.incomeSource == null) {
        return null
    }
    if (test.incomeSource.includes('family')) {
        switch (test.overReliant) {
            case 'yes':
                return '2'
            case 'no':
                return '0'
            case 'unknown':
                return 'M'
        }
    }
    return '0'
}

function mapping5_6(test: TestCase): string {

    if (test.howGoodManaging == 'able' || test.howGoodManaging == 'ableStrength') {
        return '0'
    }
    return null
}

function mappingSc8(test: TestCase): string {

    switch (test.howGoodManaging) {
        case 'ableStrength':
            return 'YES'
        case 'able':
            return 'SOMETIMES'
        case 'unable':
        case 'unableProblems':
            return 'NOTCONFIDENT'
        default:
            return null
    }
}