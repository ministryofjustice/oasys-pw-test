import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    sanMode: SanMode,
    page1: {
        currentAccommodation: CurrentAccommodation,
        temporaryAccommodation: TemporaryAccommodation,
    },
    page2: {
        livingWith: LivingWith[],
        locationSuitable: SanYesNoUnknown,
        accommodationSuitable: SanYesNoConcernsUnknown,
    }
}

test.describe.configure({ retries: 1 })

for (const mode of ['community', 'custody']) {
    test(`Mapping test V2 ${mode}: accommodation`, async ({ oasys, user, offender, assessment, san }) => {

        sanMode = mode as SanMode
        const mappingTestOffender = await getMappingTestOffender()

        // Delete previous assessments so no data gets cloned
        await user.admin.login(sanMode == 'community' ? providers.prob.san : providers.pris.san)
        await offender.searchAndSelectByPnc(mappingTestOffender.pnc)
        await assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
        await user.logout()

        // Create a new SAN assessment
        if (sanMode == 'community') {
            await user.pris.prisSanPom.login()
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
            { ref: 1, sanMode: null, page1: { currentAccommodation: null, temporaryAccommodation: null }, page2: null },
            { ref: 2, sanMode: null, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: null },
            { ref: 3, sanMode: null, page1: { currentAccommodation: 'noAccommodation', temporaryAccommodation: null }, page2: null },
            { ref: 4, sanMode: null, page1: { currentAccommodation: 'temporary', temporaryAccommodation: null }, page2: null },
            { ref: 5, sanMode: 'custody', page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'approvedPremises' }, page2: null },
            { ref: 6, sanMode: 'custody', page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'cas2' }, page2: null },
            { ref: 7, sanMode: 'custody', page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'cas3' }, page2: null },
            { ref: 8, sanMode: 'custody', page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'immigration' }, page2: null },
            { ref: 9, sanMode: 'custody', page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'shortTerm' }, page2: null },
            { ref: 10, sanMode: null, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['family', 'partner'], locationSuitable: null, accommodationSuitable: null } },
            { ref: 11, sanMode: null, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['partner', 'child'], locationSuitable: 'yes', accommodationSuitable: null } },
            { ref: 12, sanMode: null, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['partner', 'other'], locationSuitable: 'no', accommodationSuitable: null } },
            { ref: 13, sanMode: null, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['family'], locationSuitable: 'yes', accommodationSuitable: 'yes' } },
            { ref: 14, sanMode: null, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: ['family', 'friends', 'other'], locationSuitable: 'yes', accommodationSuitable: 'yesWithConcerns' } },
            { ref: 15, sanMode: null, page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: null, locationSuitable: 'yes', accommodationSuitable: 'no' } },
            { ref: 16, sanMode: 'custody', page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: null, locationSuitable: 'yes', accommodationSuitable: 'unknown' } },
            { ref: 17, sanMode: 'custody', page1: { currentAccommodation: 'settled', temporaryAccommodation: null }, page2: { livingWith: null, locationSuitable: 'unknown', accommodationSuitable: 'no' } },
            { ref: 18, sanMode: 'custody', page1: { currentAccommodation: 'temporary', temporaryAccommodation: 'shortTerm' }, page2: { livingWith: null, locationSuitable: 'yes', accommodationSuitable: 'yes' } },
        ]


        for (const test of testCases) {
            if (!test.sanMode || test.sanMode == sanMode) {
                // Get to the right starting screen
                await san.gotoSan('accommodation', true)
                // Back to the start, depending where the previous scenario ended
                for (let i = 1; i < startPage; i++) {
                    await san.accommodation.previous()
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
        }

        expect(failed).toBe(0)

        // Complete everything needed for PA
        await san.gotoSan('accommodation', true)
        if (sanMode == 'custody') {
            await san.accommodation.page2.planToReturn.setValue('yes')
        }
        await san.accommodation.page2.livingWith.setValue(['alone'])
        await san.accommodation.page2.wantChanges.setValue('madeChanges')
        await san.accommodation.saveAndContinue()
        await san.returnToOASys()

        await paTest(assessmentPk, san.accommodation, oasys, assessment, san)
        await user.logout()
    })
}


async function scenario(test: TestCase, san: San) {

    await san.accommodation.page1.currentAccommodation.setValue(test.page1.currentAccommodation)
    if (test.page1.currentAccommodation == 'temporary' && sanMode == 'custody') {
        await san.accommodation.page1.temporaryAccommodationType.setValue(test.page1.temporaryAccommodation)
    }
    await san.accommodation.saveAndContinue()
    if (test.page2) {
        if (test.page1.currentAccommodation == 'settled') {
            await san.accommodation.page2.livingWith.setValue(test.page2.livingWith)
        }
        await san.accommodation.page2.accommodationSuitable.setValue(test.page2.accommodationSuitable)
        await san.accommodation.page2.locationSuitable.setValue(test.page2.locationSuitable)
        await san.accommodation.page2.wantChanges.setValue('madeChanges')
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
        case 'unknown':
            return 'M'
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
        case 'unknown':
            return 'M'
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