import { test } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'

type TestCase = { ref: number, offenceDescription: string, result: string }

// test.describe.configure({ retries: 1 })
test('Mapping test V2: control characters', async ({ oasys, user, offender, assessment, san }) => {

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
        { ref: 1, offenceDescription: `''""=-`, result: `''""=-` },
        { ref: 2, offenceDescription: '`', result: `'` },
        { ref: 3, offenceDescription: `%&#– “” ‘’`, result: `%&#- "" ''` },
        { ref: 4, offenceDescription: `\\/<>	`, result: `\\/<>` }, // NOTE Tab is not returned
    ]

    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Offence analysis', true)
        if (test.ref > 1) {
            await san.previous()
        }
        await san.offenceAnalysis1.offenceElements.setValue(['arson'])
        await san.offenceAnalysis1.reason.setValue('Reason')
        await san.offenceAnalysis1.motivations.setValue(['addictions'])
        await san.offenceAnalysis1.victimType.setValue(['other'])
        await san.offenceAnalysis1.victimTypeDetails.setValue('Some details')

        // Set values on SAN, return to OASys and check the results
        await san.offenceAnalysis1.offenceDescription.setValue(test.offenceDescription)
        await san.saveAndContinue()
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

