import { Page } from '@playwright/test'

import { test, Oasys, User, Offender, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './xMappingTest'

type TestCase = { ref: number, lastSix: boolean, frequency: DrugsFrequency, injectedLastSix: boolean, injectedMoreThanSix: boolean }


// Template response data for these tests
const expectedAnswersTemplate: OasysAnswer[] = [
    { section: '8', q: '8.1', a: 'YES' },
    { section: '8', q: '8.2.8.1', a: null },
    { section: '8', q: '8.2.8.2', a: null },
    { section: '8', q: '8.2.8.3', a: null },
    { section: '8', q: '8.2.8.4', a: null },
    { section: '8', q: '8.2.7.1', a: null },
    { section: '8', q: '8.2.7.2', a: null },
    { section: '8', q: '8.2.7.3', a: null },
    { section: '8', q: '8.2.7.4', a: null },
    { section: '8', q: '8.2.11.1', a: null },
    { section: '8', q: '8.2.11.3', a: null },
    { section: '8', q: '8.2.5.1', a: null },
    { section: '8', q: '8.2.5.2', a: null },
    { section: '8', q: '8.2.5.3', a: null },
    { section: '8', q: '8.2.5.4', a: null },
    { section: '8', q: '8.2.4.1', a: null },
    { section: '8', q: '8.2.4.2', a: null },
    { section: '8', q: '8.2.4.3', a: null },
    { section: '8', q: '8.2.4.4', a: null },
    { section: '8', q: '8.2.10.1', a: null },
    { section: '8', q: '8.2.10.3', a: null },
    { section: '8', q: '8.2.9.1', a: null },
    { section: '8', q: '8.2.9.3', a: null },
    { section: '8', q: '8.2.1.1', a: null },
    { section: '8', q: '8.2.1.2', a: null },
    { section: '8', q: '8.2.1.3', a: null },
    { section: '8', q: '8.2.1.4', a: null },
    { section: '8', q: '8.2.2.1', a: null },
    { section: '8', q: '8.2.2.2', a: null },
    { section: '8', q: '8.2.2.3', a: null },
    { section: '8', q: '8.2.2.4', a: null },
    { section: '8', q: '8.2.6.1', a: null },
    { section: '8', q: '8.2.6.2', a: null },
    { section: '8', q: '8.2.6.3', a: null },
    { section: '8', q: '8.2.6.4', a: null },
    { section: '8', q: '8.2.3.1', a: null },
    { section: '8', q: '8.2.3.2', a: null },
    { section: '8', q: '8.2.3.3', a: null },
    { section: '8', q: '8.2.3.4', a: null },
    { section: '8', q: '8.2.12.1', a: null },
    { section: '8', q: '8.2.12.3', a: null },
    { section: '8', q: '8.2.13.1', a: null },
    { section: '8', q: '8.2.13.2', a: null },
    { section: '8', q: '8.2.13.3', a: null },
    { section: '8', q: '8.2.13.4', a: null },
    { section: '8', q: '8.2.15.1', a: null },
    { section: '8', q: '8.2.15.3', a: null },
    { section: '8', q: '8.2.14.1', a: null },
    { section: '8', q: '8.2.14.2', a: null },
    { section: '8', q: '8.2.14.3', a: null },
    { section: '8', q: '8.2.14.4', a: null },
    { section: '8', q: '8.2.14.t', a: null },
    { section: '8', q: '8.4', a: '0' },
    { section: '8', q: '8.5', a: '0' },
    { section: '8', q: '8.6', a: '0' },
]
let expectedAnswers: OasysAnswer[]  // variable to hold a new copy of the template for each iteration of the test with the different drug types
const otherDrugName = 'Other drug name'

test.describe.configure({ retries: 1 })
test.describe('Mapping test for drugs - individual drugs details', () => {

    test('amphetamines', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('amphetamines', page, oasys, user, offender, assessment, san) })
    test('benzodiazepines', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('benzodiazepines', page, oasys, user, offender, assessment, san) })
    test('cannabis', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('cannabis', page, oasys, user, offender, assessment, san) })
    test('cocaine', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('cocaine', page, oasys, user, offender, assessment, san) })
    test('crack', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('crack', page, oasys, user, offender, assessment, san) })
    test('ecstasy', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('ecstasy', page, oasys, user, offender, assessment, san) })
    test('hallucinogenics', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('hallucinogenics', page, oasys, user, offender, assessment, san) })
    test('heroin', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('heroin', page, oasys, user, offender, assessment, san) })
    test('methadone', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('methadone', page, oasys, user, offender, assessment, san) })
    test('prescribed', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('prescribed', page, oasys, user, offender, assessment, san) })
    test('opiates', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('opiates', page, oasys, user, offender, assessment, san) })
    test('solvents', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('solvents', page, oasys, user, offender, assessment, san) })
    test('spice', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('spice', page, oasys, user, offender, assessment, san) })
    test('steroids', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('steroids', page, oasys, user, offender, assessment, san) })
    test('other', async ({ page, oasys, user, offender, assessment, san }) => { await drugTest('other', page, oasys, user, offender, assessment, san) })
    // TODO add ketamine (16)
})

async function drugTest(drugType: DrugType, page: Page, oasys: Oasys, user: User, offender: Offender, assessment: Assessment, san: San) {

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

    // Run all the scenarios for a single drug
    let failed = false

    const testCases: TestCase[] =
        [
            { ref: 1, lastSix: false, frequency: null, injectedLastSix: null, injectedMoreThanSix: null },
            { ref: 2, lastSix: true, frequency: null, injectedLastSix: null, injectedMoreThanSix: null },
            { ref: 3, lastSix: true, frequency: 'daily', injectedLastSix: null, injectedMoreThanSix: null },
            { ref: 4, lastSix: true, frequency: 'weekly', injectedLastSix: null, injectedMoreThanSix: null },
            { ref: 5, lastSix: true, frequency: 'monthly', injectedLastSix: null, injectedMoreThanSix: null },
            { ref: 6, lastSix: true, frequency: 'occasionally', injectedLastSix: null, injectedMoreThanSix: null },
            // { ref: 7, lastSix: false, frequency: null, injectedLastSix: null, injectedMoreThanSix: true },  // TODO reinstate this when mapping bug fixed (ARN-3045)
            { ref: 8, lastSix: true, frequency: 'daily', injectedLastSix: true, injectedMoreThanSix: null },
            { ref: 9, lastSix: true, frequency: 'weekly', injectedLastSix: true, injectedMoreThanSix: null },
            { ref: 10, lastSix: true, frequency: 'monthly', injectedLastSix: true, injectedMoreThanSix: null },
            { ref: 11, lastSix: true, frequency: 'occasionally', injectedLastSix: true, injectedMoreThanSix: null },
            { ref: 12, lastSix: true, frequency: 'daily', injectedLastSix: false, injectedMoreThanSix: true },
            { ref: 13, lastSix: true, frequency: 'weekly', injectedLastSix: false, injectedMoreThanSix: true },
            { ref: 14, lastSix: true, frequency: 'monthly', injectedLastSix: false, injectedMoreThanSix: true },
            { ref: 15, lastSix: true, frequency: 'occasionally', injectedLastSix: false, injectedMoreThanSix: true },
            { ref: 16, lastSix: true, frequency: 'daily', injectedLastSix: true, injectedMoreThanSix: true },
            { ref: 17, lastSix: true, frequency: 'weekly', injectedLastSix: true, injectedMoreThanSix: true },
            { ref: 18, lastSix: true, frequency: 'monthly', injectedLastSix: true, injectedMoreThanSix: true },
            { ref: 19, lastSix: true, frequency: 'occasionally', injectedLastSix: true, injectedMoreThanSix: true },
        ]

    let firstRun = true
    console.log(`Testing ${drugType}`)

    expectedAnswers = JSON.parse(JSON.stringify(expectedAnswersTemplate)) as OasysAnswer[]  // take a copy to modify for this drug

    for (const test of testCases) {
        if (injectableDrug(drugType) || (test.injectedLastSix == null && test.injectedMoreThanSix == null)) {  // skip injection tests for non-injectable drugs
            // Get to the right starting screen
            await page.waitForTimeout(5000)  // TODO see if this makes any difference to SAN reliability
            await san.gotoSan('Drug use', true)
            if (firstRun) {
                await san.drugs1.everUsed.setValue('yes')
                await san.drugs1.saveAndContinue.click()
            } else {
                await san.drugs3.previous.click()
            }
            // Set values on SAN, return to OASys and check the results
            await scenario(drugType, test, san)
            await san.returnToOASys()
            await oasys.clickButton('Previous', true)
            await oasys.clickButton('Next', true)

            log('', JSON.stringify(test))
            const scenarioFailed = await checkAnswers(assessmentPk, drugType, test, assessment)
            if (scenarioFailed) {
                failed = true
            }
            console.log(`Ref ${test.ref} ${scenarioFailed ? 'FAILED' : 'Passed'}`)

            firstRun = false
        }
    }

    expect(failed).toBeFalsy()
}

async function scenario(drugType: DrugType, test: TestCase, san: San) {

    await san.drugs2.drugType.setValue([drugType])
    if (drugType == 'other') {
        await san.drugs2.drugTypeOther.setValue(otherDrugName)
    }
    await san.drugs2[`${drugType}LastSixMonths`].setValue(test.lastSix ? 'yes' : 'no')
    await san.drugs2.saveAndContinue.click()
    if (test.lastSix && test.frequency != null) {
        await san.drugs3[`${drugType}Frequency`].setValue(test.frequency)
    }
    if (injectableDrug(drugType)) {
        if (test.injectedLastSix == null && test.injectedMoreThanSix == null) {
            await san.drugs3.injected.setValue(['none'])
        } else {
            await san.drugs3.injected.setValue([drugType as InjectableDrugType])
            if (test.lastSix) {
                const injectedValues: ('lastSix' | 'moreThanSix')[] = []
                if (test.injectedLastSix) injectedValues.push('lastSix')
                if (test.injectedMoreThanSix) injectedValues.push('moreThanSix')
                // @ts-expect-error // hide type error for non-injectable drugs
                await san.drugs3[`${drugType}InjectedLastSixMonths`].setValue(injectedValues)
            }
        }
    }
}

async function checkAnswers(assessmentPk: number, drugType: DrugType, test: TestCase, assessment: Assessment): Promise<boolean> {

    /*
        8.2.x.1 = current frequency - 100/110/120/130
        8.2.x.2 = currently injected - YES or null
        8.2.x.3 = previous usage - YES or null
        8.2.x.4 = previously injected - YES or null

        8.4 = current class A usage (heroin, methadone, opiates, crack, cocaine, prescribed) - 2 or 0
        8.5 = main drug level of use - 2 (daily, weekly), 0 (monthly, occasionally, or not used in last 6 months), M (last six but no frequency)
        8.6 = ever injected - 2 (injected last 6 months), 1 (injected previously), 0
    */

    const drugNumber = drugNumbers[drugType]  // OASys database reference number 8.2.x.
    const dailyOrWeekly = ['daily', 'weekly'].includes(test.frequency)
    const monthlyOrOccasionally = ['monthly', 'occasionally'].includes(test.frequency)

    expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.1`)[0].a = test.frequency == null ? null : frequencyScore[test.frequency]
    expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.3`)[0].a = test.lastSix ? null : 'YES'
    if (injectableDrug(drugType)) {
        expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.2`)[0].a = test.injectedLastSix ? 'YES' : null
        expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.4`)[0].a = test.injectedMoreThanSix ? 'YES' : null
    }
    if (drugType == 'other') {
        expectedAnswers.filter((a) => a.q == '8.2.14.t')[0].a = otherDrugName
    }
    expectedAnswers.filter((a) => a.q == '8.4')[0].a = drugNumber <= 6 && (dailyOrWeekly || monthlyOrOccasionally) ? '2' : '0'  // drugNumbers 1 to 6 are class A
    expectedAnswers.filter((a) => a.q == '8.5')[0].a = dailyOrWeekly ? '2' : monthlyOrOccasionally ? '0' : !test.lastSix ? '0' : 'M'
    expectedAnswers.filter((a) => a.q == '8.6')[0].a = test.injectedLastSix ? '2' : test.injectedMoreThanSix ? '1' : '0'

    const result = await assessment.queries.checkSectionAnswers(assessmentPk, '8', expectedAnswers, true)

    return result
}

function injectableDrug(drugType: DrugType): boolean {

    return ['amphetamines', 'benzodiazepines', 'cocaine', 'crack', 'heroin', 'methadone', 'prescribed', 'opiates', 'steroids', 'other'].includes(drugType)
}

const frequencyScore = {
    daily: '100',
    weekly: '110',
    monthly: '120',
    occasionally: '130',
}

const drugNumbers = {
    amphetamines: 8,
    benzodiazepines: 7,
    cannabis: 11,
    cocaine: 5,
    crack: 4,
    ecstasy: 10,
    hallucinogenics: 9,
    heroin: 1,
    methadone: 2,
    prescribed: 6,
    opiates: 3,
    solvents: 12,
    spice: 15,
    steroids: 13,
    other: 14,
}
