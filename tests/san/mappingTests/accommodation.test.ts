import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page1: {
        currentAccommodation: CurrentAccommodation,
        temporaryAccommodation: TemporaryAccommodation,
    },
    page2: {
        livingWith: LivingWith[],
        locationSuitable: SanYesNo,
        accommodationSuitable: SanYesNoConcerns,
    }
}

test.describe.configure({ retries: 1 })
test('Mapping test V1: accommodation', async ({ oasys, user, offender, assessment, san }) => {

    const mappingTestOffender = await getMappingTestOffender('accommodation')

    // Open the latest assessment, should be WIP
    await user.prob.probSanUnappr.login()
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.openLatest()
    const assessmentPk = await assessment.queries.getLatestSetPk(mappingTestOffender.probationCrn)

    let failed = 0

    const testCases: TestCase[] = [
        { ref: 1, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['family', 'partner'], locationSuitable: 'yes', accommodationSuitable: 'yes' } },
        { ref: 2, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['unknown'], locationSuitable: 'no', accommodationSuitable: 'yesWithConcerns' } },
        { ref: 3, page1: { currentAccommodation: 'noAccommodation', temporaryAccommodation: null }, page2: null },
        { ref: 4, page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'approvedPremises' }, page2: { livingWith: null, locationSuitable: 'no', accommodationSuitable: 'yes' } },
        { ref: 5, page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'cas2' }, page2: { livingWith: null, locationSuitable: 'yes', accommodationSuitable: 'yesWithConcerns' } },
        { ref: 6, page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'cas3' }, page2: { livingWith: null, locationSuitable: 'no', accommodationSuitable: 'no' } },
        { ref: 7, page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'immigration' }, page2: { livingWith: null, locationSuitable: 'yes', accommodationSuitable: 'yes' } },
        { ref: 8, page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'shortTerm' }, page2: { livingWith: null, locationSuitable: 'no', accommodationSuitable: 'yesWithConcerns' } },
        { ref: 9, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['alone'], locationSuitable: 'yes', accommodationSuitable: 'no' } },
        { ref: 10, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['family', 'partner', 'other'], locationSuitable: 'no', accommodationSuitable: 'yes' } },
        { ref: 11, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['partner', 'other'], locationSuitable: 'yes', accommodationSuitable: 'yesWithConcerns' } },
        { ref: 12, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['family'], locationSuitable: 'no', accommodationSuitable: 'no' } },
        { ref: 13, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['family', 'friends', 'other'], locationSuitable: 'yes', accommodationSuitable: 'yesWithConcerns' } },
        { ref: 14, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['partner', 'friends', 'other'], locationSuitable: 'no', accommodationSuitable: 'no' } },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Accommodation', true)
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
    await san.gotoSan('Accommodation', true)
    await san.accommodation.page2.livingWith.setValue(['alone'])
    await san.accommodation.page2.wantChanges.setValue('madeChanges')
    await san.accommodation.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, san.accommodation, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.accommodation.page1.currentAccommodation.setValue(test.page1.currentAccommodation)
    if (test.page1.currentAccommodation == 'temporary') {
        await san.accommodation.page1.temporaryAccommodationType.setValue(test.page1.temporaryAccommodation)
    }
    if (test.page1.currentAccommodation == 'settled') {
        await san.accommodation.page1.settledAccommodationType.setValue('homeowner')
    }
    if (test.page1.currentAccommodation == 'noAccommodation') {
        await san.accommodation.page1.noAccommodationType.setValue('campsite')
    }
    await san.accommodation.saveAndContinue()
    if (test.page1.currentAccommodation != 'noAccommodation') {
        await san.accommodation.page2.livingWith.setValue(test.page2.livingWith)
        await san.accommodation.page2.accommodationSuitable.setValue(test.page2.accommodationSuitable)
        await san.accommodation.page2.locationSuitable.setValue(test.page2.locationSuitable)
    }
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section3Answers: OasysAnswer[] = [
        { q: '3.3', a: mapping3_3(test) },
        { q: '3.4', a: mapping3_4(test) },
        { q: '3.5', a: mapping3_5(test) },
        { q: '3.6', a: mapping3_6(test) },
    ]
    const section6Answers: OasysAnswer[] = [
        { q: '6.8', a: mapping6_8(test) },
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

    switch (test.page1.currentAccommodation) {
        case 'noAccommodation':
            return 'YES'
        case 'settled':
        case 'temporary':
            return 'NO'
        default:
            return null
    }
}

function mapping3_4(test: TestCase): string {

    if (test.page1.currentAccommodation == 'noAccommodation') {
        return '2'
    }
    switch (test.page2?.accommodationSuitable) {
        case 'yes':
            return '0'
        case 'yesWithConcerns':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping3_5(test: TestCase): string {

    switch (test.page1.currentAccommodation) {
        case 'noAccommodation':
            return '2'
        case 'settled':
            return '0'
        case 'temporary':
            return test.page1.temporaryAccommodation == 'shortTerm' ? '2' : null
        default:
            return null
    }
}

function mapping3_6(test: TestCase): string {

    if (test.page1.currentAccommodation == 'noAccommodation') {
        return '2'
    }
    switch (test.page2?.locationSuitable) {
        case 'yes':
            return '0'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping6_8(test: TestCase): string {

    if (test.page2?.livingWith == null) {
        return '3'
    } else {
        return test.page2.livingWith.includes('partner') ? '1' : '3'
    }
}