import { test } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'

type TestCase = { ref: number, offenceDescription: string, result: string }

test.describe.configure({ retries: 1 })
test('Mapping test V1: control characters', async ({ oasys, user, offender, assessment, san }) => {

    const mappingTestOffender = await getMappingTestOffender('controlCharacters')

    // Open the latest assessment, should be WIP
    await user.prob.probSanUnappr.login()
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.openLatest()
    const assessmentPk = await assessment.queries.getLatestSetPk(mappingTestOffender.probationCrn)

    let failed = 0

    const testCases: TestCase[] = [
        { ref: 1, offenceDescription: `''""=-`, result: `''""=-` },
        { ref: 2, offenceDescription: '`', result: `'` },
        { ref: 3, offenceDescription: `%&#– “” ‘’`, result: `%&#- "" ''` },
        { ref: 4, offenceDescription: `\\/<>	`, result: `\\/<>` }, // NOTE Tab is not returned
    ]

    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Offence analysis', true)
        await san.offenceAnalysis.backToStart()
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

