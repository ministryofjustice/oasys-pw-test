import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'

type TestCaseVictim = { victimRelationship: VictimRelationship, victimAge: VictimAge, victimSex: VictimSex, victimRace: VictimRace }
type TestCase = { ref: number, offenceElements: OffenceElements[], victim1: TestCaseVictim, victim2: TestCaseVictim, victim3: TestCaseVictim }

test.describe.configure({ retries: 1 })
test('Mapping test V2: victims', async ({ oasys, user, offender, assessment, san }) => {

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
        { ref: 1, offenceElements: ['arson'], victim1: null , victim2: null , victim3: null  },
        { ref: 2, offenceElements: ['arson', 'domesticAbuse'], victim1: { victimRelationship: 'stranger', victimAge: '0to4', victimSex: 'male', victimRace: 'White - English, Welsh, Scottish, Northern Irish or British' } , victim2: null , victim3: null  },
        { ref: 3, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence'], victim1: { victimRelationship: 'staff', victimAge: '5to11', victimSex: 'female', victimRace: 'White - Irish' } , victim2: null , victim3: null  },
        { ref: 4, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement'], victim1: { victimRelationship: 'parent', victimAge: '12to15', victimSex: 'intersex', victimRace: 'White - Gypsy or Irish Traveller' } , victim2: null , victim3: null  },
        { ref: 5, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'stalking'], victim1: { victimRelationship: 'partner', victimAge: '16to17', victimSex: 'unknown', victimRace: 'White - Roma' } , victim2: null , victim3: null  },
        { ref: 6, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'stalking', 'victimTargeted'], victim1: { victimRelationship: 'exPartner', victimAge: '18to20', victimSex: 'male', victimRace: 'White - Any other White background' } , victim2: null , victim3: null  },
        { ref: 7, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'stalking', 'victimTargeted', 'violence'], victim1: { victimRelationship: 'child', victimAge: '21to25', victimSex: 'female', victimRace: 'Mixed - White and Black Caribbean' } , victim2: null , victim3: null  },
        { ref: 8, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'stalking', 'victimTargeted', 'violence', 'weapon'], victim1: { victimRelationship: 'otherFamily', victimAge: '26to49', victimSex: 'intersex', victimRace: 'Mixed - White and Black African' } , victim2: null , victim3: null  },
        { ref: 9, offenceElements: ['domesticAbuse', 'excessiveViolence', 'sexualElement', 'stalking', 'victimTargeted', 'violence', 'weapon'], victim1: { victimRelationship: 'friend', victimAge: '50to64', victimSex: 'unknown', victimRace: 'Mixed - White and Asian' } , victim2: null , victim3: null  },
        { ref: 10, offenceElements: ['excessiveViolence', 'sexualElement', 'stalking', 'victimTargeted', 'violence', 'weapon'], victim1: { victimRelationship: 'other', victimAge: '65plus', victimSex: 'male', victimRace: 'Mixed - Any other mixed or multiple ethnic background background' } , victim2: null , victim3: null  },
        { ref: 11, offenceElements: ['sexualElement', 'stalking', 'victimTargeted', 'violence', 'weapon'], victim1: { victimRelationship: 'stranger', victimAge: '5to11', victimSex: 'female', victimRace: 'Asian or Asian British - Indian' } , victim2: null , victim3: null  },
        { ref: 12, offenceElements: ['stalking', 'victimTargeted', 'violence', 'weapon'], victim1: { victimRelationship: 'staff', victimAge: '12to15', victimSex: 'intersex', victimRace: 'Asian or Asian British - Pakistani' } , victim2: null , victim3: null  },
        { ref: 13, offenceElements: ['victimTargeted', 'violence', 'weapon'], victim1: { victimRelationship: 'parent', victimAge: '16to17', victimSex: 'unknown', victimRace: 'Asian or Asian British - Bangladeshi' } , victim2: null , victim3: null  },
        { ref: 14, offenceElements: ['violence', 'weapon'], victim1: { victimRelationship: 'partner', victimAge: '18to20', victimSex: 'male', victimRace: 'Asian or Asian British - Chinese' } , victim2: null , victim3: null  },
        { ref: 15, offenceElements: ['weapon'], victim1: { victimRelationship: 'exPartner', victimAge: '21to25', victimSex: 'female', victimRace: 'Asian or Asian British - Any other Asian background' } , victim2: null , victim3: null  },
        { ref: 16, offenceElements: ['arson'], victim1: { victimRelationship: 'child', victimAge: '26to49', victimSex: 'intersex', victimRace: 'Black or Black British - Caribbean' } , victim2: null , victim3: null  },
        { ref: 17, offenceElements: ['domesticAbuse'], victim1: { victimRelationship: 'otherFamily', victimAge: '50to64', victimSex: 'unknown', victimRace: 'Black or Black British - African' } , victim2: null , victim3: null  },
        { ref: 18, offenceElements: ['excessiveViolence'], victim1: { victimRelationship: 'friend', victimAge: '65plus', victimSex: 'male', victimRace: 'Black or Black British - Any other Black background' } , victim2: null , victim3: null  },
        { ref: 19, offenceElements: ['sexualElement'], victim1: { victimRelationship: 'other', victimAge: '0to4', victimSex: 'female', victimRace: 'Arab' } , victim2: null , victim3: null  },
        { ref: 20, offenceElements: ['stalking'], victim1: { victimRelationship: 'stranger', victimAge: '12to15', victimSex: 'intersex', victimRace: 'Any other ethnic group' } , victim2: null , victim3: null  },
        { ref: 21, offenceElements: ['victimTargeted'], victim1: { victimRelationship: 'staff', victimAge: '16to17', victimSex: 'unknown', victimRace: 'Not stated' } , victim2: { victimRelationship: 'otherFamily', victimAge: '65plus', victimSex: 'female', victimRace: 'Black or Black British - African' } , victim3: null  },
        { ref: 22, offenceElements: ['violence'], victim1: { victimRelationship: 'parent', victimAge: '18to20', victimSex: 'male', victimRace: 'Unknown' } , victim2: { victimRelationship: 'friend', victimAge: '5to11', victimSex: 'intersex', victimRace: 'Black or Black British - Any other Black background' } , victim3: null  },
        { ref: 23, offenceElements: ['weapon'], victim1: { victimRelationship: 'partner', victimAge: '21to25', victimSex: 'female', victimRace: 'White - English, Welsh, Scottish, Northern Irish or British' } , victim2: { victimRelationship: 'other', victimAge: '12to15', victimSex: 'unknown', victimRace: 'Arab' } , victim3: { victimRelationship: 'stranger', victimAge: '0to4', victimSex: 'male', victimRace: 'Not stated' }  },
        { ref: 24, offenceElements: ['none'], victim1: { victimRelationship: 'exPartner', victimAge: '26to49', victimSex: 'intersex', victimRace: 'White - Irish' } , victim2: { victimRelationship: 'stranger', victimAge: '16to17', victimSex: 'male', victimRace: 'Any other ethnic group' } , victim3: { victimRelationship: 'staff', victimAge: '12to15', victimSex: 'female', victimRace: 'Unknown' }  },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Offence analysis', true)
        if (test.ref == 1) {
            await san.offenceAnalysis.page1.offenceDescription.setValue('Description')
            await san.offenceAnalysis.page1.offenceElements.setValue(test.offenceElements)
            if (test.offenceElements.includes('victimTargeted')) {
                await san.offenceAnalysis.page1.victimTargetedDetails.setValue('Victim targeted details')
            }
            await san.offenceAnalysis.page1.reason.setValue('Reason')
            await san.offenceAnalysis.page1.motivations.setValue(['addictions'])
            await san.offenceAnalysis.page1.victimType.setValue(['people'])
            await san.offenceAnalysis.saveAndContinue()
        } else {
            await san.offenceAnalysis.previous()
            await san.offenceAnalysis.page1.offenceElements.setValue(test.offenceElements)
            if (test.offenceElements.includes('victimTargeted')) {
                await san.offenceAnalysis.page1.victimTargetedDetails.setValue('Victim targeted details')
            }
            await san.offenceAnalysis.saveAndContinue()
            await san.offenceAnalysis.change()
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
    await user.logout()

    expect(failed).toBe(0)
})


async function scenario(test: TestCase, san: San) {

    await setVictimDetails(test.victim1, san)
    if (test.victim2) {
        if (test.ref == 16) {
            await san.offenceAnalysis.victims.addAnotherVictim.click()
        } else {
            await san.offenceAnalysis.change(2)
        }
        await setVictimDetails(test.victim2, san)
        if (test.victim3) {
            if (test.ref == 18) {
                await san.offenceAnalysis.victims.addAnotherVictim.click()
            } else {
                await san.offenceAnalysis.change(3)
            }
            await setVictimDetails(test.victim3, san)
        }
    }
}

async function setVictimDetails(victim: TestCaseVictim, san: San) {

    await san.offenceAnalysis.victims.victimRelationship.setValue(victim.victimRelationship)
    if (victim.victimRelationship == 'other') {
        await san.offenceAnalysis.victims.victimRelationshipOtherDetails.setValue('Other details')
    }
    await san.offenceAnalysis.victims.victimAge.setValue(victim.victimAge)
    await san.offenceAnalysis.victims.victimSex.setValue(victim.victimSex)
    await san.offenceAnalysis.victims.victimRace.setValue(victim.victimRace)
    await san.offenceAnalysis.saveAndContinue()
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section2Answers: OasysAnswer[] = [
        { q: '2.3', a: mapping2_3(test) },
    ]
    const victimAnswers: Victim[] = [mappingVictim(test.victim1)]
    if (test.victim2) {
        victimAnswers.push(mappingVictim(test.victim2))
    }
    if (test.victim3) {
        victimAnswers.push(mappingVictim(test.victim3))
    }

    const section2Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '2', section2Answers, true)
    const victimsFailed = await assessment.queries.checkVictims(assessmentPk, victimAnswers, true)
    return section2Failed || victimsFailed
}

function mapping2_3(test: TestCase): string {

    let result = ''
    if (test.offenceElements.includes('victimTargeted')) {
        result = 'DIRECTCONT,'
    }

    if (test.offenceElements.includes('stalking')) {
        result = `${result}STALKING,`
    }
    if (test.victim1.victimRelationship == 'stranger' || test.victim2?.victimRelationship == 'stranger' || test.victim3?.victimRelationship == 'stranger') {
        result = `${result}STRANGERS,`
    }
    return result == '' ? null : result
}

function mappingVictim(victim: TestCaseVictim): Victim {

    return {
        age: mappingVictimAge(victim?.victimAge),
        gender: mappingVictimSex(victim?.victimSex),
        ethnicCat: mappingVictimRace(victim?.victimRace),
        relationship: mappingVictimRelationship(victim?.victimRelationship)
    }
}

function mappingVictimRelationship(relationship: VictimRelationship): string {

    switch (relationship) {
        case 'stranger':
            return '0'
        case 'staff':
            return '12'
        case 'parent':
            return '14'
        case 'partner':
            return '1'
        case 'exPartner':
            return '15'
        case 'child':
            return '5'
        case 'otherFamily':
            return '6'
        case 'other':
            return '13'
        default:
            return null
    }
}

function mappingVictimAge(age: VictimAge): string {

    switch (age) {
        case '0to4':
            return '0'
        case '5to11':
            return '1'
        case '12to15':
            return '2'
        case '16to17':
            return '3'
        case '18to20':
            return '4'
        case '21to25':
            return '5'
        case '26to49':
            return '6'
        case '50to64':
            return '7'
        case '65plus':
            return '8'
        default:
            return null
    }
}

function mappingVictimSex(sex: VictimSex): string {

    switch (sex) {
        case 'male':
            return '1'
        case 'female':
            return '2'
        case 'unknown':
            return '0'
        default:
            return null
    }
}

function mappingVictimRace(race: VictimRace): string {

    switch (race) {
        case 'White - English, Welsh, Scottish, Northern Irish or British':
            return 'W1'
        case 'White - Irish':
            return 'W2'
        case 'White - Gypsy or Irish Traveller':
            return 'W4'
        case 'White - Roma':
            return 'W5'
        case 'White - Any other White background':
            return 'W9'
        case 'Mixed - White and Black Caribbean':
            return 'M1'
        case 'Mixed - White and Black African':
            return 'M2'
        case 'Mixed - White and Asian':
            return 'M3'
        case 'Mixed - Any other mixed or multiple ethnic background background':
            return 'M9'
        case 'Asian or Asian British - Indian':
            return 'A1'
        case 'Asian or Asian British - Pakistani':
            return 'A2'
        case 'Asian or Asian British - Bangladeshi':
            return 'A3'
        case 'Asian or Asian British - Chinese':
            return 'A4'
        case 'Asian or Asian British - Any other Asian background':
            return 'A9'
        case 'Black or Black British - Caribbean':
            return 'B1'
        case 'Black or Black British - African':
            return 'B2'
        case 'Black or Black British - Any other Black background':
            return 'B9'
        case 'Arab':
            return 'O2'
        case 'Any other ethnic group':
            return 'O9'
        case 'Not stated':
            return null
        case 'Unknown':
            return 'NS'
        default:
            return null
    }
}
