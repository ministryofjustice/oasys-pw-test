import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'

type TestCase = { ref: number, offenceElements: OffenceElements[], victim1: VictimDetails, victim2: VictimDetails }

// test.describe.configure({ retries: 1 })
test('Mapping test V1: victims', async ({ oasys, user, offender, assessment, san }) => {

    const mappingTestOffender = await getMappingTestOffender('victims')

    // Open the latest assessment, should be WIP
    await user.prob.probSanUnappr.login()
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.openLatest()
    const assessmentPk = await assessment.queries.getLatestSetPk(mappingTestOffender.probationCrn)

    let failed = 0

    const testCases: TestCase[] = [
        { ref: 1, offenceElements: ['arson'], victim1: { relationship: 'stranger', age: '0to4', sex: 'male', race: 'White - English, Welsh, Scottish, Northern Irish or British' } , victim2: { relationship: 'otherFamily', age: '26to49', sex: 'intersex', race: 'Mixed - White and Black African' }  },
        { ref: 2, offenceElements: ['arson', 'domesticAbuse'], victim1: { relationship: 'staff', age: '5to11', sex: 'female', race: 'White - Irish' } , victim2: { relationship: 'other', age: '50to64', sex: 'unknown', race: 'Mixed - White and Asian' }  },
        { ref: 3, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence'], victim1: { relationship: 'parent', age: '12to15', sex: 'intersex', race: 'White - Gypsy or Irish Traveller' } , victim2: { relationship: 'other', age: '65plus', sex: 'male', race: 'Mixed - Any other mixed or multiple ethnic background background' }  },
        { ref: 4, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement'], victim1: { relationship: 'partner', age: '16to17', sex: 'unknown', race: 'White - Roma' } , victim2: { relationship: 'stranger', age: '5to11', sex: 'female', race: 'Asian or Asian British - Indian' }  },
        { ref: 5, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'hatred'], victim1: { relationship: 'exPartner', age: '18to20', sex: 'male', race: 'White - Any other White background' } , victim2: { relationship: 'staff', age: '12to15', sex: 'intersex', race: 'Asian or Asian British - Pakistani' }  },
        { ref: 6, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'hatred', 'victimTargeted'], victim1: { relationship: 'child', age: '21to25', sex: 'female', race: 'Mixed - White and Black Caribbean' } , victim2: { relationship: 'parent', age: '16to17', sex: 'unknown', race: 'Asian or Asian British - Bangladeshi' }  },
        { ref: 7, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'hatred', 'victimTargeted', 'violence'], victim1: { relationship: 'otherFamily', age: '26to49', sex: 'intersex', race: 'Mixed - White and Black African' } , victim2: { relationship: 'partner', age: '18to20', sex: 'male', race: 'Asian or Asian British - Chinese' }  },
        { ref: 8, offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'hatred', 'victimTargeted', 'violence', 'weapon'], victim1: { relationship: 'other', age: '50to64', sex: 'unknown', race: 'Mixed - White and Asian' } , victim2: { relationship: 'exPartner', age: '21to25', sex: 'female', race: 'Asian or Asian British - Any other Asian background' }  },
        { ref: 9, offenceElements: ['domesticAbuse', 'excessiveViolence', 'sexualElement', 'hatred', 'victimTargeted', 'violence', 'weapon'], victim1: { relationship: 'other', age: '65plus', sex: 'male', race: 'Mixed - Any other mixed or multiple ethnic background background' } , victim2: { relationship: 'child', age: '26to49', sex: 'intersex', race: 'Black or Black British - Caribbean' }  },
        { ref: 10, offenceElements: ['excessiveViolence', 'sexualElement', 'hatred', 'victimTargeted', 'violence', 'weapon'], victim1: { relationship: 'stranger', age: '5to11', sex: 'female', race: 'Asian or Asian British - Indian' } , victim2: { relationship: 'otherFamily', age: '50to64', sex: 'unknown', race: 'Black or Black British - African' }  },
        { ref: 11, offenceElements: ['sexualElement', 'hatred', 'victimTargeted', 'violence', 'weapon'], victim1: { relationship: 'staff', age: '12to15', sex: 'intersex', race: 'Asian or Asian British - Pakistani' } , victim2: { relationship: 'other', age: '65plus', sex: 'male', race: 'Black or Black British - Any other Black background' }  },
        { ref: 12, offenceElements: ['hatred', 'victimTargeted', 'violence', 'weapon'], victim1: { relationship: 'parent', age: '16to17', sex: 'unknown', race: 'Asian or Asian British - Bangladeshi' } , victim2: { relationship: 'other', age: '0to4', sex: 'female', race: 'Arab' }  },
        { ref: 13, offenceElements: ['victimTargeted', 'violence', 'weapon'], victim1: { relationship: 'partner', age: '18to20', sex: 'male', race: 'Asian or Asian British - Chinese' } , victim2: { relationship: 'stranger', age: '12to15', sex: 'intersex', race: 'Any other ethnic group' }  },
        { ref: 14, offenceElements: ['violence', 'weapon'], victim1: { relationship: 'exPartner', age: '21to25', sex: 'female', race: 'Asian or Asian British - Any other Asian background' } , victim2: { relationship: 'staff', age: '16to17', sex: 'unknown', race: 'Asian or Asian British - Bangladeshi' }  },
        { ref: 15, offenceElements: ['weapon'], victim1: { relationship: 'child', age: '26to49', sex: 'intersex', race: 'Black or Black British - Caribbean' } , victim2: { relationship: 'parent', age: '18to20', sex: 'male', race: 'Unknown' }  },
        { ref: 16, offenceElements: ['arson'], victim1: { relationship: 'otherFamily', age: '50to64', sex: 'unknown', race: 'Black or Black British - African' } , victim2: { relationship: 'partner', age: '21to25', sex: 'female', race: 'White - English, Welsh, Scottish, Northern Irish or British' }  },
        { ref: 17, offenceElements: ['domesticAbuse'], victim1: { relationship: 'other', age: '65plus', sex: 'male', race: 'Black or Black British - Any other Black background' } , victim2: { relationship: 'exPartner', age: '26to49', sex: 'intersex', race: 'White - Irish' }  },
        { ref: 18, offenceElements: ['excessiveViolence'], victim1: { relationship: 'other', age: '0to4', sex: 'female', race: 'Arab' } , victim2: { relationship: 'stranger', age: '0to4', sex: 'male', race: 'White - English, Welsh, Scottish, Northern Irish or British' }  },
        { ref: 19, offenceElements: ['sexualElement'], victim1: { relationship: 'stranger', age: '12to15', sex: 'intersex', race: 'Any other ethnic group' } , victim2: { relationship: 'staff', age: '5to11', sex: 'female', race: 'White - Irish' }  },
        { ref: 20, offenceElements: ['hatred'], victim1: { relationship: 'staff', age: '16to17', sex: 'unknown', race: 'White - Roma' } , victim2: { relationship: 'parent', age: '12to15', sex: 'intersex', race: 'White - Gypsy or Irish Traveller' }  },
        { ref: 21, offenceElements: ['victimTargeted'], victim1: { relationship: 'parent', age: '18to20', sex: 'male', race: 'Unknown' } , victim2: { relationship: 'partner', age: '16to17', sex: 'unknown', race: 'White - Roma' }  },
        { ref: 22, offenceElements: ['violence'], victim1: { relationship: 'partner', age: '21to25', sex: 'female', race: 'White - English, Welsh, Scottish, Northern Irish or British' } , victim2: { relationship: 'exPartner', age: '18to20', sex: 'male', race: 'White - Any other White background' }  },
        { ref: 23, offenceElements: ['weapon'], victim1: { relationship: 'exPartner', age: '26to49', sex: 'intersex', race: 'White - Irish' } , victim2: { relationship: 'child', age: '21to25', sex: 'female', race: 'Mixed - White and Black Caribbean' }  },
        { ref: 24, offenceElements: ['none'], victim1: { relationship: 'child', age: '50to64', sex: 'unknown', race: 'White - Gypsy or Irish Traveller' } , victim2: { relationship: 'stranger', age: '16to17', sex: 'male', race: 'Any other ethnic group' }  },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Offence analysis', true)

        await san.offenceAnalysis.backToStart()
        await san.offenceAnalysis.page1.offenceElements.setValue(test.offenceElements)
        if (test.offenceElements.includes('victimTargeted')) {
            await san.offenceAnalysis.page1.victimTargetedDetails.setValue('Victim targeted details')
        }
        await san.offenceAnalysis.saveAndContinue()
        await san.offenceAnalysis.change()

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

    await san.offenceAnalysis.setVictimDetails(test.victim1)
    await san.offenceAnalysis.change(2)
    await san.offenceAnalysis.setVictimDetails(test.victim2)
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section2Answers: OasysAnswer[] = [
        { q: '2.3', a: mapping2_3(test) },
    ]
    const victimAnswers: Victim[] = [mappingVictim(test.victim1)]
    if (test.victim2) {
        victimAnswers.push(mappingVictim(test.victim2))
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

    if (test.offenceElements.includes('hatred')) {
        result = `${result}HATE,`
    }
    if (test.victim1.relationship == 'stranger' || test.victim2?.relationship == 'stranger') {
        result = `${result}STRANGERS,`
    }
    return result == '' ? null : result
}

function mappingVictim(victim: VictimDetails): Victim {

    return {
        age: mappingVictimAge(victim?.age),
        gender: mappingVictimSex(victim?.sex),
        ethnicCat: mappingVictimRace(victim?.race),
        relationship: mappingVictimRelationship(victim?.relationship)
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
        case 'Unknown':
            return 'NS'
        default:
            return null
    }
}
