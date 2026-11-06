import { test, Oasys, User, Offender, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'

type TestCase = { ref: number, whenUsed: DrugsWhenUsed, frequency: DrugsFrequency, whenInjected: DrugsWhenUsed[] }


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
    { section: '8', q: '8.2.16.1', a: null },
    { section: '8', q: '8.2.16.2', a: null },
    { section: '8', q: '8.2.16.3', a: null },
    { section: '8', q: '8.2.16.4', a: null },
    { section: '8', q: '8.2.14.1', a: null },
    { section: '8', q: '8.2.14.2', a: null },
    { section: '8', q: '8.2.14.3', a: null },
    { section: '8', q: '8.2.14.4', a: null },
    { section: '8', q: '8.2.14.t', a: null },
    { section: '8', q: '8.4', a: null },
    { section: '8', q: '8.5', a: null },
    { section: '8', q: '8.6', a: null },
    { section: '8', q: '8.97', a: null },
    { section: '8', q: '8.98', a: null },
    { section: '8', q: '8.99', a: null },
]
let expectedAnswers: OasysAnswer[]  // variable to hold a new copy of the template for each iteration of the test with the different drug types
const otherDrugName = 'Other drug name'

test.describe.configure({ retries: 1 })

for (const mode of ['community', 'custody']) {
    test.describe(`Mapping test V2 ${mode}: drugs - individual drugs details`, () => {

        test('amphetamines', async ({ oasys, user, offender, assessment, san }) => { await drugTest('amphetamines', oasys, user, offender, assessment, san) })
        test('benzodiazepines', async ({ oasys, user, offender, assessment, san }) => { await drugTest('benzodiazepines', oasys, user, offender, assessment, san) })
        test('cannabis', async ({ oasys, user, offender, assessment, san }) => { await drugTest('cannabis', oasys, user, offender, assessment, san) })
        test('cocaine', async ({ oasys, user, offender, assessment, san }) => { await drugTest('cocaine', oasys, user, offender, assessment, san) })
        test('crack', async ({ oasys, user, offender, assessment, san }) => { await drugTest('crack', oasys, user, offender, assessment, san) })
        test('ecstasy', async ({ oasys, user, offender, assessment, san }) => { await drugTest('ecstasy', oasys, user, offender, assessment, san) })
        test('hallucinogenics', async ({ oasys, user, offender, assessment, san }) => { await drugTest('hallucinogenics', oasys, user, offender, assessment, san) })
        test('heroin', async ({ oasys, user, offender, assessment, san }) => { await drugTest('heroin', oasys, user, offender, assessment, san) })
        test('ketamine', async ({ oasys, user, offender, assessment, san }) => { await drugTest('ketamine', oasys, user, offender, assessment, san) })
        test('mephedrone', async ({ oasys, user, offender, assessment, san }) => { await drugTest('mephedrone', oasys, user, offender, assessment, san) })
        test('methadone', async ({ oasys, user, offender, assessment, san }) => { await drugTest('methadone', oasys, user, offender, assessment, san) })
        test('prescribed', async ({ oasys, user, offender, assessment, san }) => { await drugTest('prescribed', oasys, user, offender, assessment, san) })
        test('opiates', async ({ oasys, user, offender, assessment, san }) => { await drugTest('opiates', oasys, user, offender, assessment, san) })
        test('solvents', async ({ oasys, user, offender, assessment, san }) => { await drugTest('solvents', oasys, user, offender, assessment, san) })
        test('spice', async ({ oasys, user, offender, assessment, san }) => { await drugTest('spice', oasys, user, offender, assessment, san) })
        test('steroids', async ({ oasys, user, offender, assessment, san }) => { await drugTest('steroids', oasys, user, offender, assessment, san) })
        test('other', async ({ oasys, user, offender, assessment, san }) => { await drugTest('other', oasys, user, offender, assessment, san) })
    })

    async function drugTest(drugType: DrugType, oasys: Oasys, user: User, offender: Offender, assessment: Assessment, san: San) {

        sanMode = mode as SanMode
        const mappingTestOffender = await getMappingTestOffender()

        // Create a new SAN assessment if there isn't one already
        if (sanMode == 'community') {
            await user.prob.probSanUnappr.login()
        } else {
            await user.pris.prisSanPom.login()
        }
        await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
        const assessments = await assessment.assessmentsTab.assessments.getRowCount()
        let assessmentPk: number
        if (assessments == 0) {
            if (sanMode == 'community') {
                assessmentPk = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
            } else {
                assessmentPk = await assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)' })
            }
        } else {
            assessmentPk = await assessment.getLatestSetPkByPnc(mappingTestOffender.pnc)
            log(`PK: ${assessmentPk}`)
            await assessment.openLatest()
        }

        // Run all the scenarios for a single drug
        let failed = false

        const testCases: TestCase[] =
            [
                { ref: 1, whenUsed: 'lastSix', frequency: 'daily', whenInjected: null },
                { ref: 2, whenUsed: 'lastSix', frequency: 'weekly', whenInjected: null },
                { ref: 3, whenUsed: 'lastSix', frequency: 'monthly', whenInjected: null },
                { ref: 4, whenUsed: 'lastSix', frequency: 'occasionally', whenInjected: null },
                { ref: 5, whenUsed: 'lastSix', frequency: 'daily', whenInjected: ['lastSix'] },
                { ref: 6, whenUsed: 'lastSix', frequency: 'weekly', whenInjected: ['lastSix'] },
                { ref: 7, whenUsed: 'lastSix', frequency: 'monthly', whenInjected: ['lastSix'] },
                { ref: 8, whenUsed: 'lastSix', frequency: 'occasionally', whenInjected: ['lastSix'] },
                { ref: 9, whenUsed: 'lastSix', frequency: 'daily', whenInjected: ['moreThanSix'] },
                { ref: 10, whenUsed: 'lastSix', frequency: 'weekly', whenInjected: ['moreThanSix'] },
                { ref: 11, whenUsed: 'lastSix', frequency: 'monthly', whenInjected: ['moreThanSix'] },
                { ref: 12, whenUsed: 'lastSix', frequency: 'occasionally', whenInjected: ['moreThanSix'] },
                { ref: 13, whenUsed: 'lastSix', frequency: 'daily', whenInjected: ['lastSix', 'moreThanSix'] },
                { ref: 14, whenUsed: 'lastSix', frequency: 'weekly', whenInjected: ['lastSix', 'moreThanSix'] },
                { ref: 15, whenUsed: 'lastSix', frequency: 'monthly', whenInjected: ['lastSix', 'moreThanSix'] },
                { ref: 16, whenUsed: 'lastSix', frequency: 'occasionally', whenInjected: ['lastSix', 'moreThanSix'] },
                { ref: 17, whenUsed: 'moreThanSix', frequency: 'daily', whenInjected: null },
                { ref: 18, whenUsed: 'moreThanSix', frequency: 'weekly', whenInjected: null },
                { ref: 19, whenUsed: 'moreThanSix', frequency: 'monthly', whenInjected: null },
                { ref: 20, whenUsed: 'moreThanSix', frequency: 'occasionally', whenInjected: null },
                { ref: 21, whenUsed: 'moreThanSix', frequency: 'daily', whenInjected: ['lastSix'] },
                { ref: 22, whenUsed: 'moreThanSix', frequency: 'weekly', whenInjected: ['lastSix'] },
                { ref: 23, whenUsed: 'moreThanSix', frequency: 'monthly', whenInjected: ['lastSix'] },
                { ref: 24, whenUsed: 'moreThanSix', frequency: 'occasionally', whenInjected: ['lastSix'] },
                { ref: 25, whenUsed: 'moreThanSix', frequency: 'daily', whenInjected: ['moreThanSix'] },
                { ref: 26, whenUsed: 'moreThanSix', frequency: 'weekly', whenInjected: ['moreThanSix'] },
                { ref: 27, whenUsed: 'moreThanSix', frequency: 'monthly', whenInjected: ['moreThanSix'] },
                { ref: 28, whenUsed: 'moreThanSix', frequency: 'occasionally', whenInjected: ['moreThanSix'] },
                { ref: 29, whenUsed: 'moreThanSix', frequency: 'daily', whenInjected: ['lastSix', 'moreThanSix'] },
                { ref: 30, whenUsed: 'moreThanSix', frequency: 'weekly', whenInjected: ['lastSix', 'moreThanSix'] },
                { ref: 31, whenUsed: 'moreThanSix', frequency: 'monthly', whenInjected: ['lastSix', 'moreThanSix'] },
                { ref: 32, whenUsed: 'moreThanSix', frequency: 'occasionally', whenInjected: ['lastSix', 'moreThanSix'] },
            ]

        console.log(`Testing ${drugType}`)

        expectedAnswers = JSON.parse(JSON.stringify(expectedAnswersTemplate)) as OasysAnswer[]  // take a copy to modify for this drug

        for (const test of testCases) {

            if (injectableDrug(drugType) || test.whenInjected == null) {  // skip injection tests for non-injectable drugs
                // Get to the right starting screen
                await san.gotoSan('drugs', true)
                await san.drugs.backToStart()
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
            }
        }

        expect(failed).toBeFalsy()
    }
}

async function scenario(drugType: DrugType, test: TestCase, san: San) {

    await san.drugs.page1.everUsed.setValue('yes')
    await san.drugs.saveAndContinue()
    await san.drugs.page2.drugType.setValue([drugType])
    if (drugType == 'other') {
        await san.drugs.page3.otherDrugName.setValue(otherDrugName)
    }
    await san.drugs.page3[`${drugType}WhenUsed`].setValue(test.whenUsed)
    await san.drugs.saveAndContinue()
    if (test.whenUsed == 'lastSix' && test.frequency != null) {
        await san.drugs.page4[`${drugType}Frequency`].setValue(test.frequency)
        await san.drugs.saveAndContinue()
    } else if (test.whenUsed == 'moreThanSix' && test.frequency != null) {
        await san.drugs.page4[`${drugType}FrequencyPast`].setValue(test.frequency)
        await san.drugs.saveAndContinue()
    }
    if (injectableDrug(drugType)) {
        if (test.whenInjected == null) {
            await san.drugs.page5.injected.setValue(['none'])
        } else {
            await san.drugs.page5.injected.setValue([drugType as InjectableDrugType])
            await san.drugs.page5[`${drugType as InjectableDrugType}WhenInjected`].setValue(test.whenInjected)
        }
        await san.drugs.saveAndContinue()
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

    expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.1`)[0].a = (test.whenUsed != 'lastSix' || test.frequency == null) ? null : frequencyScore[test.frequency]
    expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.3`)[0].a = test.whenUsed == 'moreThanSix' ? 'YES' : null

    if (injectableDrug(drugType)) {
        expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.2`)[0].a = test.whenInjected.includes('lastSix') ? 'YES' : null
        expectedAnswers.filter((a) => a.q == `8.2.${drugNumber}.4`)[0].a = test.whenInjected.includes('moreThanSix') ? 'YES' : null
    }
    if (drugType == 'other') {
        expectedAnswers.filter((a) => a.q == '8.2.14.t')[0].a = otherDrugName
    }

    expectedAnswers.filter((a) => a.q == '8.4')[0].a = drugNumber <= 6 && (dailyOrWeekly || monthlyOrOccasionally) ? '2' : '0'  // drugNumbers 1 to 6 are class A
    expectedAnswers.filter((a) => a.q == '8.5')[0].a = dailyOrWeekly ? '2' : monthlyOrOccasionally ? '0' : 'M'
    expectedAnswers.filter((a) => a.q == '8.6')[0].a = test.whenInjected.includes('lastSix') ? '2' : test.whenInjected.includes('moreThanSix') ? '1' : '0'

    const result = await assessment.queries.checkSectionAnswers(assessmentPk, '8', expectedAnswers, true)

    return result
}

function injectableDrug(drugType: DrugType): boolean {

    const injectableDrugs: DrugType[] = ['amphetamines', 'benzodiazepines', 'cocaine', 'crack', 'heroin', 'ketamine', 'mephedrone', 'methadone', 'prescribed', 'opiates', 'steroids', 'other']
    return injectableDrugs.includes(drugType)
}

const frequencyScore = {
    daily: '100',
    weekly: '110',
    monthly: '120',
    occasionally: '130',
}

const drugNumbers: { [key in DrugType]: number } = {
    amphetamines: 8,
    benzodiazepines: 7,
    cannabis: 11,
    cocaine: 5,
    crack: 4,
    ecstasy: 10,
    hallucinogenics: 9,
    heroin: 1,
    ketamine: 16,
    mephedrone: null,   // Not in OASys
    methadone: 2,
    prescribed: 6,
    opiates: 3,
    solvents: 12,
    spice: 15,
    steroids: 13,
    other: 14,
}
