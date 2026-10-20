import { test } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'

type TestCase = { ref: number, offenceDescription: string, result: string }

// test.describe.configure({ retries: 1 })

for (const mode of ['community', 'custody']) {
    test(`Mapping test V2 ${mode}: control characters`, async ({ oasys, user, offender, assessment, san }) => {

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
        { ref: 1, offenceDescription: `''""=-`, result: `''""=-` },
        { ref: 2, offenceDescription: '`', result: `'` },
        { ref: 3, offenceDescription: `%&#– “” ‘’`, result: `%&#- "" ''` },
        { ref: 4, offenceDescription: `\\/<>	`, result: `\\/<>` }, // NOTE Tab is not returned
        { ref: 5, offenceDescription: `${utils.oasysString(3995)}€ „ …`, result: `${utils.oasysString(3995)}€ „ …` },
        { ref: 6, offenceDescription: `£5 café naïve Ñandú Über straße ½ © ° ± × ÷ « » € „ ‚ … • † ‡ ‰ ™ Š š Ž ž Œ œ Ÿ ƒ ‹ ›`, result: `£5 café naïve Ñandú Über straße ½ © ° ± × ÷ « » € „ ‚ … • † ‡ ‰ ™ Š š Ž ž Œ œ Ÿ ƒ ‹ ›` },
        { ref: 7, offenceDescription: `Gwŷn Llŵyd Łódź Ștefan Ğül Ωmega Жора → ≤ ≠ ✓`, result: `Gwyn Llwyd Lódz ¿tefan Gül Omega ¿¿¿¿ ¿ = ¿ ¿` },
        { ref: 8, offenceDescription: `${utils.oasysString(3915)}£5 café naïve Ñandú Über straße ½ © ° ± × ÷ « » € „ ‚ … • † ‡ ‰ ™ Š š Ž ž Œ œ Ÿ ƒ ‹ ›`, result: `${utils.oasysString(3915)}£5 café naïve Ñandú Über straße ½ © ° ± × ÷ « » € „ ‚ … • † ‡ ‰ ™ Š š Ž ž Œ œ Ÿ ƒ ‹ ›` },
    ]

        for (const test of testCases) {
            // Get to the right starting screen
            await san.gotoSan('offenceAnalysis', true)
            if (test.ref > 1) {
                await san.offenceAnalysis.previous()
            }
            await san.offenceAnalysis.page1.offenceElements.setValue(['arson'])
            await san.offenceAnalysis.page1.reason.setValue('Reason')
            await san.offenceAnalysis.page1.motivations.setValue(['addictions'])
            await san.offenceAnalysis.page1.victimType.setValue(['other'])
            await san.offenceAnalysis.page1.victimTypeDetails.setValue('Some details')

            // Set values on SAN, return to OASys and check the results
            await san.offenceAnalysis.page1.offenceDescription.setValue(test.offenceDescription)
            await san.offenceAnalysis.saveAndContinue()
            await san.returnToOASys()
            await oasys.clickButton('Previous', true)
            await oasys.clickButton('Next', true)

            log(JSON.stringify(test))
            const scenarioFailed = await assessment.queries.checkSingleAnswer(assessmentPk, '2', '2.1', 'additionalNote', test.result)
            if (scenarioFailed) {
                failed++
            }
            console.log(`Ref ${test.ref} ${scenarioFailed ? 'FAILED' : 'Passed'}`)

        }
        await user.logout()

        expect(failed).toBe(0)

    })
}
