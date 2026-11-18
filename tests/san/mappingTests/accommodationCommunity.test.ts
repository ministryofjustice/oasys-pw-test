import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    somewhereToLive: SanYesNo,
    accommodationSettled: SanYesNo,
    locationSuitable: SanYesNo,
    accommodationSuitable: SanYesConcernsNo,
}

test.describe.configure({ retries: 1 })

test(`Mapping test V2: accommodation (community)`, async ({ oasys, user, offender, assessment, san }) => {

    sanMode = 'community'
    const mappingTestOffender = await getMappingTestOffender()

    // Delete previous assessments so no data gets cloned
    await user.admin.login(providers.prob.san)
    await offender.searchAndSelectByPnc(mappingTestOffender.pnc)
    await assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
    await user.logout()

    // Create a new SAN assessment
    await user.prob.probSanUnappr.login()
    await offender.searchAndSelectByPnc(mappingTestOffender.pnc)
    let assessmentPk: number
    assessmentPk = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    let failed = 0

    const testCases: TestCase[] = [
        { ref: 1, somewhereToLive: null, accommodationSettled: null, locationSuitable: null, accommodationSuitable: null },
        { ref: 2, somewhereToLive: 'yes', accommodationSettled: 'yes', locationSuitable: 'yes', accommodationSuitable: 'yes' },
        { ref: 3, somewhereToLive: 'yes', accommodationSettled: 'yes', locationSuitable: 'yes', accommodationSuitable: 'no' },
        { ref: 4, somewhereToLive: 'yes', accommodationSettled: 'yes', locationSuitable: 'yes', accommodationSuitable: 'concerns' },
        { ref: 5, somewhereToLive: 'yes', accommodationSettled: 'yes', locationSuitable: 'no', accommodationSuitable: 'yes' },
        { ref: 6, somewhereToLive: 'yes', accommodationSettled: 'yes', locationSuitable: 'no', accommodationSuitable: 'no' },
        { ref: 7, somewhereToLive: 'yes', accommodationSettled: 'yes', locationSuitable: 'no', accommodationSuitable: 'concerns' },
        { ref: 8, somewhereToLive: 'yes', accommodationSettled: 'no', locationSuitable: 'yes', accommodationSuitable: 'yes' },
        { ref: 9, somewhereToLive: 'yes', accommodationSettled: 'no', locationSuitable: 'yes', accommodationSuitable: 'no' },
        { ref: 10, somewhereToLive: 'yes', accommodationSettled: 'no', locationSuitable: 'yes', accommodationSuitable: 'concerns' },
        { ref: 11, somewhereToLive: 'yes', accommodationSettled: 'no', locationSuitable: 'no', accommodationSuitable: 'yes' },
        { ref: 12, somewhereToLive: 'yes', accommodationSettled: 'no', locationSuitable: 'no', accommodationSuitable: 'no' },
        { ref: 13, somewhereToLive: 'yes', accommodationSettled: 'no', locationSuitable: 'no', accommodationSuitable: 'concerns' },
        { ref: 14, somewhereToLive: 'no', accommodationSettled: null, locationSuitable: null, accommodationSuitable: null },
    ]

    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('accommodation', true)
        await san.accommodation.backToStart()
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
    await san.gotoSan('accommodation', true)
    await san.accommodation.backToStart()
    await san.accommodation.somewhereToLive.setValue('yes')
    await san.accommodation.saveAndContinue()
    await san.accommodation.accommodationSettled.setValue('yes')
    await san.accommodation.saveAndContinue()
    await san.accommodation.locationSuitable.setValue('yes')
    await san.accommodation.saveAndContinue()
    await san.accommodation.accommodationSuitable.setValue('yes')
    await san.accommodation.saveAndContinue()
    await san.accommodation.wantChanges.setValue('madeChanges')
    await san.accommodation.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, san.accommodation, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.accommodation.somewhereToLive.setValue(test.somewhereToLive)
    await san.accommodation.saveAndContinue()
    if (test.somewhereToLive == 'yes') {
        await san.accommodation.accommodationSettled.setValue(test.accommodationSettled)
        await san.accommodation.saveAndContinue()
        await san.accommodation.locationSuitable.setValue(test.locationSuitable)
        await san.accommodation.saveAndContinue()
        if (test.locationSuitable == 'no') {
            await san.accommodation.saveAndContinue()
        }
        await san.accommodation.accommodationSuitable.setValue(test.accommodationSuitable)
        await san.accommodation.saveAndContinue()
    }
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section3Answers: OasysAnswer[] = [
        { q: '3.3', a: mapping3_3(test) },
        { q: '3.4', a: mapping3_4(test) },
        { q: '3.5', a: mapping3_5(test) },
        { q: '3.6', a: mapping3_6(test) },
        { q: '3.97', a: null },
        { q: '3.98', a: null },
        { q: '3.99', a: null },
        { q: '3_SAN_STRENGTH', a: null },
    ]
    const section6Answers: OasysAnswer[] = [
        { q: '6.8', a: null },
    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'AC_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section3Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '3', section3Answers, true)
    const section6Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '6', section6Answers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section3Failed || section6Failed || sanSectionFailed
}

function mapping3_3(test: TestCase): string {

    switch (test.somewhereToLive) {
        case 'no':
            return 'YES'
        case 'yes':
            return 'NO'
        default:
            return null
    }
}

function mapping3_4(test: TestCase): string {

    if (test.somewhereToLive == 'no') {
        return '2'
    }
    switch (test.accommodationSuitable) {
        case 'yes':
            return '0'
        case 'concerns':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping3_5(test: TestCase): string {

    if (test.somewhereToLive == 'no' || test.accommodationSettled == 'no') {
        return '2'
    }
    if (test.accommodationSettled == 'yes') {
        return '0'
    }
    return null
}

function mapping3_6(test: TestCase): string {

    if (test.somewhereToLive == 'no' || test.locationSuitable == 'no') {
        return '2'
    }
    if (test.locationSuitable == 'yes') {
        return '0'
    }
    return null
}
