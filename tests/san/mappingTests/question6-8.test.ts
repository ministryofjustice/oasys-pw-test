import { test, Oasys, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './xMappingTest'


type AccommodationOptions = 'family' | 'friends' | 'partner' | 'child' | 'other' | 'unknown' | 'alone'
type RelationshipOptions = 'partner' | 'ownChildren' | 'otherChildren' | 'family' | 'friends' | 'other'

test('Mapping test for question 6.8', async ({ oasys, user, offender, assessment, san, }) => {

    /*
    Who is [subject] living with?
        If living_with contains 'PARTNER' then
            6-8 = 1
        else if 'Who are the important people in [subject]'s life?' = 'PARTNER_INTIMATE_RELATIONSHIP' Then
            6-8 = 2
        else
            6-8 = 3
        End If
    */

    let failed = false

    const mappingTestOffender = await getMappingTestOffender()

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
    await user.logout()

    await user.prob.probSanUnappr.login()
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    const assessmentPk = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    const testCases: { accommodation: AccommodationOptions[], relationship: RelationshipOptions[], mapping: number }[] =
        [
            { accommodation: [], relationship: [], mapping: 3 },
            { accommodation: ['alone'], relationship: [], mapping: 3 },
            { accommodation: [], relationship: ['other'], mapping: 3 },
            { accommodation: [], relationship: ['partner'], mapping: 2 },
            { accommodation: ['partner'], relationship: [], mapping: 1 }, //5
            { accommodation: ['child'], relationship: ['other'], mapping: 3 },
            { accommodation: ['family'], relationship: ['other'], mapping: 3 },
            { accommodation: ['friends'], relationship: ['other'], mapping: 3 },
            { accommodation: ['other'], relationship: ['other'], mapping: 3 },
            { accommodation: ['partner'], relationship: ['other'], mapping: 1 }, // 10
            { accommodation: ['unknown'], relationship: ['other'], mapping: 3 },
            { accommodation: ['child', 'partner'], relationship: ['other'], mapping: 1 },
            { accommodation: ['family', 'partner'], relationship: ['other'], mapping: 1 },
            { accommodation: ['friends', 'partner'], relationship: ['other'], mapping: 1 },
            { accommodation: ['other', 'partner'], relationship: ['other'], mapping: 1 }, // 15
            { accommodation: ['unknown', 'partner'], relationship: ['other'], mapping: 1 },
            { accommodation: ['alone'], relationship: ['family'], mapping: 3 },
            { accommodation: ['alone'], relationship: ['friends'], mapping: 3 },
            { accommodation: ['alone'], relationship: ['other'], mapping: 3 },
            { accommodation: ['alone'], relationship: ['otherChildren'], mapping: 3 }, // 20
            { accommodation: ['alone'], relationship: ['ownChildren'], mapping: 3 },
            { accommodation: ['alone'], relationship: ['partner'], mapping: 2 },
            { accommodation: ['alone'], relationship: ['family', 'partner'], mapping: 2 },
            { accommodation: ['alone'], relationship: ['friends', 'partner'], mapping: 2 },
            { accommodation: ['alone'], relationship: ['other', 'partner'], mapping: 2 }, // 25
            { accommodation: ['alone'], relationship: ['otherChildren', 'partner'], mapping: 2 },
            { accommodation: ['alone'], relationship: ['ownChildren', 'partner'], mapping: 2 },
            { accommodation: ['child', 'partner'], relationship: ['family', 'partner'], mapping: 1 },
            { accommodation: ['family', 'partner'], relationship: ['friends', 'partner'], mapping: 1 },
            { accommodation: ['other', 'partner'], relationship: ['other', 'partner'], mapping: 1 }, // 30
            { accommodation: ['alone'], relationship: ['otherChildren', 'partner'], mapping: 2 },
            { accommodation: ['unknown', 'partner'], relationship: ['ownChildren', 'partner'], mapping: 1 },
        ]

    let first = true
    let i = 1
    for (const test of testCases) {

        if (first) {
            // Extra case 0 without any accommodation
            await san.gotoSan('Accommodation', true)
            await san.accommodation1.currentAccommodation.setValue('noAccommodation')

            await setRelationshipOptions(['partner'], true, san)
            const caseFailed = await checkMapping(assessmentPk, 2, 0, oasys, assessment, san)
            if (caseFailed) failed = true
        }
        await san.gotoSan('Accommodation', true)
        await setAccommodationOptions(test.accommodation, first, san)
        await setRelationshipOptions(test.relationship, false, san)
        log('', `Test case ${i}: ${JSON.stringify(test)}`)
        console.log(`Test case ${i}: ${JSON.stringify(test)}`)

        const caseFailed = await checkMapping(assessmentPk, test.mapping, i, oasys, assessment, san)
        if (caseFailed) failed = true
        first = false
        i++
    }

    await user.logout()
    expect(failed).toBeFalsy()
})

async function setAccommodationOptions(options: AccommodationOptions[], firstRun: boolean, san: San) {

    if (firstRun) {
        await san.accommodation1.currentAccommodation.setValue('settled')
        await san.accommodation1.settledAccommodationType.setValue('homeowner')
    }
    await san.accommodation1.saveAndContinue.click()
    await san.accommodation2.livingWith.setValue(options)
}

async function setRelationshipOptions(options: RelationshipOptions[], firstRun: boolean, san: San) {

    await san.goto('Personal relationships and community')
    if (firstRun) {
        await san.relationships1.anyChildren.setValue(['no'])
        await san.relationships1.saveAndContinue.click()
    }
    await san.relationships2.importantPeople.setValue(options)
}


async function checkMapping(assessmentPk: number, expectedValue: number, testCase: number, oasys: Oasys, assessment: Assessment, san: San): Promise<boolean> {

    await san.returnToOASys()
    await oasys.clickButton('Previous', true)
    await oasys.clickButton('Next', true)

    return await assessment.queries.checkSingleAnswer(assessmentPk, '6', '6.8', 'refAnswer', expectedValue == null ? null : expectedValue.toString(), testCase)
}