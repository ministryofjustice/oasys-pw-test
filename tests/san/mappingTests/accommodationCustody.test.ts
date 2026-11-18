import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    plansForRelease: SanYesNoUnknown,
    locationSuitable: SanYesNoUnknown,
    accommodationSuitable: SanYesConcernsNoUnknown,
}

test.describe.configure({ retries: 1 })

test(`Mapping test V2: accommodation (custody)`, async ({ oasys, user, offender, assessment, san }) => {

    sanMode = 'custody'
    const mappingTestOffender = await getMappingTestOffender()

    // Delete previous assessments so no data gets cloned
    await user.admin.login(providers.pris.san)
    await offender.searchAndSelectByPnc(mappingTestOffender.pnc)
    await assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
    await user.logout()

    // Create a new SAN assessment
    await user.pris.prisSanPom.login()
    await offender.searchAndSelectByPnc(mappingTestOffender.pnc)
    let assessmentPk: number
    assessmentPk = await assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)' })

    let failed = 0

    const testCases: TestCase[] = [
        {ref: 1, plansForRelease: null, locationSuitable: null, accommodationSuitable: null } ,
        {ref: 2, plansForRelease: 'no', locationSuitable: null, accommodationSuitable: null } ,
        {ref: 3, plansForRelease: 'yes', locationSuitable: 'yes', accommodationSuitable: 'yes' } ,
        {ref: 4, plansForRelease: 'yes', locationSuitable: 'yes', accommodationSuitable: 'no' } ,
        {ref: 5, plansForRelease: 'yes', locationSuitable: 'yes', accommodationSuitable: 'concerns' } ,
        {ref: 6, plansForRelease: 'yes', locationSuitable: 'yes', accommodationSuitable: 'unknown' } ,
        {ref: 7, plansForRelease: 'yes', locationSuitable: 'no', accommodationSuitable: 'yes' } ,
        {ref: 8, plansForRelease: 'yes', locationSuitable: 'no', accommodationSuitable: 'no' } ,
        {ref: 9, plansForRelease: 'yes', locationSuitable: 'no', accommodationSuitable: 'concerns' } ,
        {ref: 10, plansForRelease: 'yes', locationSuitable: 'no', accommodationSuitable: 'unknown' } ,
        {ref: 11, plansForRelease: 'yes', locationSuitable: 'unknown', accommodationSuitable: 'yes' } ,
        {ref: 12, plansForRelease: 'yes', locationSuitable: 'unknown', accommodationSuitable: 'no' } ,
        {ref: 13, plansForRelease: 'yes', locationSuitable: 'unknown', accommodationSuitable: 'concerns' } ,
        {ref: 14, plansForRelease: 'yes', locationSuitable: 'unknown', accommodationSuitable: 'unknown' } ,
        {ref: 15, plansForRelease: 'unknown', locationSuitable: 'yes', accommodationSuitable: 'yes' } ,
        {ref: 16, plansForRelease: 'unknown', locationSuitable: 'yes', accommodationSuitable: 'no' } ,
        {ref: 17, plansForRelease: 'unknown', locationSuitable: 'yes', accommodationSuitable: 'concerns' } ,
        {ref: 18, plansForRelease: 'unknown', locationSuitable: 'yes', accommodationSuitable: 'unknown' } ,
        {ref: 19, plansForRelease: 'unknown', locationSuitable: 'no', accommodationSuitable: 'yes' } ,
        {ref: 20, plansForRelease: 'unknown', locationSuitable: 'no', accommodationSuitable: 'no' } ,
        {ref: 21, plansForRelease: 'unknown', locationSuitable: 'no', accommodationSuitable: 'concerns' } ,
        {ref: 22, plansForRelease: 'unknown', locationSuitable: 'no', accommodationSuitable: 'unknown' } ,
        {ref: 23, plansForRelease: 'unknown', locationSuitable: 'unknown', accommodationSuitable: 'yes' } ,
        {ref: 24, plansForRelease: 'unknown', locationSuitable: 'unknown', accommodationSuitable: 'no' } ,
        {ref: 25, plansForRelease: 'unknown', locationSuitable: 'unknown', accommodationSuitable: 'concerns' } ,
        {ref: 26, plansForRelease: 'unknown', locationSuitable: 'unknown', accommodationSuitable: 'unknown' } ,
    ]

    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('accommodation', true)
        await san.accommodation.backToStart()
        await san.accommodation.somewhereToLive.setValue('no')
        await san.accommodation.saveAndContinue()
        await san.accommodation.whyNoAccommodation.setValue('alcohol')
        await san.accommodation.saveAndContinue()
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
    await san.accommodation.plansForRelease.setValue('no')
    await san.accommodation.saveAndContinue()
    await san.accommodation.wantChanges.setValue('madeChanges')
    await san.accommodation.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, san.accommodation, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.accommodation.plansForRelease.setValue(test.plansForRelease)
    await san.accommodation.saveAndContinue()
    if (test.plansForRelease == 'yes') {
        await san.accommodation.livingWith.setValue(['alone'])
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

    switch (test.plansForRelease) {
        case 'yes':
            return 'NO'
        case 'no':
            return 'YES'
        case 'unknown':
            return 'M'
        default:
            return null
    }
}

function mapping3_4(test: TestCase): string {

    switch (test.plansForRelease) {
        case 'yes':
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
        case 'no':
            return '2'
        case 'unknown':
            return 'M'
        default:
            return null
    }
}

function mapping3_5(test: TestCase): string {

    if (test.plansForRelease == 'no') {
        return '2'
    } else if (test.plansForRelease == 'unknown') {
        return 'M'
    }
    return null
}

function mapping3_6(test: TestCase): string {

    switch (test.plansForRelease) {
        case 'yes':
            switch (test.locationSuitable) {
                case 'yes':
                    return '0'
                case 'no':
                    return '2'
                default:
                    return null
            }
        case 'no':
            return '2'
        case 'unknown':
            return 'M'
        default:
            return null
    }
}
