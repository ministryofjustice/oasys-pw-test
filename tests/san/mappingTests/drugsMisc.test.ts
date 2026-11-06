import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = { ref: number, motivatedToStop: DrugsMotivation }

test.describe.configure({ retries: 1 })

for (const mode of ['community', 'custody']) {
    test(`Mapping test V2 ${mode}: drugs (misc questions and PA)`, async ({ oasys, user, offender, assessment, san }) => {

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
            { ref: 1, motivatedToStop: null },
            { ref: 2, motivatedToStop: 'motivated' },
            { ref: 3, motivatedToStop: 'someMotivation' },
            { ref: 4, motivatedToStop: 'noMotivation' },
            { ref: 5, motivatedToStop: 'unknown' },
        ]

        // First check with no drug use (no PA)
        await san.gotoSan('drugs', true)
        await san.drugs.page1.everUsed.setValue('no')
        await san.drugs.saveAndContinue()
        await san.returnToOASys()
        await oasys.clickButton('Previous', true)
        await oasys.clickButton('Next', true)

        const expectedAnswers = [
            { section: '8', q: '8.1', a: 'NO' },
            { section: '8', q: '8.4', a: null },
            { section: '8', q: '8.5', a: null },
            { section: '8', q: '8.6', a: null },
            { section: '8', q: '8.97', a: 'No issues identified' },
            { section: '8', q: '8.98', a: 'NO' },
            { section: '8', q: '8.99', a: 'NO' },
        ]
        const result = await assessment.queries.checkSectionAnswers(assessmentPk, '8', expectedAnswers, true)
        expect(result).toBeFalsy()
        
        for (const test of testCases) {

            // Get to the right starting screen
            await san.gotoSan('drugs', true)
            if (test.ref == 1) {
                await san.drugs.page1.everUsed.setValue('yes')
                await san.drugs.saveAndContinue()
                await san.drugs.page2.drugType.setValue(['cannabis'])
                await san.drugs.saveAndContinue()
                await san.drugs.page3.cannabisWhenUsed.setValue('lastSix')
                await san.drugs.saveAndContinue()
                await san.drugs.page4.cannabisFrequency.setValue('daily')
                await san.drugs.saveAndContinue()
                await san.drugs.page6.treatment.setValue('no')
            }
            else {
                await san.drugs.previous()
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
        await san.gotoSan('drugs', true)
        await san.drugs.wantChanges.setValue('madeChanges')
        await san.drugs.saveAndContinue()
        await san.returnToOASys()

        await paTest(assessmentPk, san.drugs, oasys, assessment, san)
        await user.logout()
    })
}


async function scenario(test: TestCase, san: San) {

    await san.drugs.page6.motivatedToStop.setValue(test.motivatedToStop)
    await san.drugs.saveAndContinue()
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section8Answers: OasysAnswer[] = [
        { q: '8.8', a: mapping8_8(test) },
        { q: '8.97', a: null },
        { q: '8.98', a: null },
        { q: '8.99', a: null },
        { q: '8_SAN_STRENGTH', a: null },
    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'SMD_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section8Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '8', section8Answers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section8Failed || sanSectionFailed
}

function mapping8_8(test: TestCase): string {

    switch (test.motivatedToStop) {
        case 'noMotivation':
            return '2'
        case 'someMotivation':
            return '1'
        case 'motivated':
            return '0'
        case 'unknown':
            return 'M'
        default:
            return null
    }
}