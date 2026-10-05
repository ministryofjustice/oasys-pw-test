import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'

type TestCase = {
    ref: number,
    page1: {
        offenceDescription: string,
        offenceElements: OffenceElements[],
        reason: string,
        motivations: Motivations[],
        motivationOther: string,
    },
    page2: {
        howManyOthers: HowManyOthers,
    },
    page3: {
        leader: SanYesNo,
        leaderYesDetails: string,
        leaderNoDetails: string,
        impact: SanYesNo,
        responsibility: SanYesNo,
        responsibilityYesDetails: string,
        responsibilityNoDetails: string,
        patterns: string,
        escalation: SanYesNoNa,
        riskSeriousHarm: SanYesNo,
        riskSeriousHarmYesDetails: string,
        riskSeriousHarmNoDetails: string,
    }
}

let startPage = 1 // Page that SAN will go back into when opening the section, depends on last page reached in previous scenario

test.describe.configure({ retries: 1 })
test('Mapping test V2: offence analysis', async ({ sections, oasys, user, offender, assessment, san }) => {

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
        { ref: 1, page1: { offenceDescription: null, offenceElements: null, reason: null, motivations: null, motivationOther: null }, page2: null, page3: null },
        { ref: 2, page1: { offenceDescription: utils.oasysString(4000), offenceElements: ['arson'], reason: utils.oasysString(4000), motivations: ['addictions'], motivationOther: null }, page2: null, page3: null },
        { ref: 3, page1: { offenceDescription: 'Offence description', offenceElements: ['arson', 'domesticAbuse'], reason: 'Reason', motivations: ['addictions', 'pressure'], motivationOther: null }, page2: null, page3: null },
        { ref: 4, page1: { offenceDescription: 'Offence description', offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence'], reason: 'Reason', motivations: ['addictions', 'pressure', 'financial'], motivationOther: null }, page2: { howManyOthers: '0' }, page3: null },
        { ref: 5, page1: { offenceDescription: 'Offence description', offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement'], reason: 'Reason', motivations: ['addictions', 'pressure', 'financial', 'hatred'], motivationOther: null }, page2: { howManyOthers: '1' }, page3: null },
        { ref: 6, page1: { offenceDescription: 'Offence description', offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'stalking'], reason: 'Reason', motivations: ['addictions', 'pressure', 'financial', 'hatred', 'power'], motivationOther: null }, page2: { howManyOthers: '2' }, page3: null },
        { ref: 7, page1: { offenceDescription: 'Offence description', offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'stalking', 'victimTargeted'], reason: 'Reason', motivations: ['addictions', 'pressure', 'financial', 'hatred', 'power', 'sexual'], motivationOther: null }, page2: { howManyOthers: '3' }, page3: { leader: 'yes', leaderYesDetails: null, leaderNoDetails: null, impact: null, responsibility: null, responsibilityYesDetails: null, responsibilityNoDetails: null, patterns: null, escalation: null, riskSeriousHarm: null, riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 8, page1: { offenceDescription: 'Offence description', offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'stalking', 'victimTargeted', 'violence'], reason: 'Reason', motivations: ['addictions', 'pressure', 'financial', 'hatred', 'power', 'sexual', 'thrill'], motivationOther: null }, page2: { howManyOthers: '4' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: null, impact: null, responsibility: null, responsibilityYesDetails: null, responsibilityNoDetails: null, patterns: null, escalation: null, riskSeriousHarm: null, riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 9, page1: { offenceDescription: 'Offence description', offenceElements: ['arson', 'domesticAbuse', 'excessiveViolence', 'sexualElement', 'stalking', 'victimTargeted', 'violence', 'weapon'], reason: 'Reason', motivations: ['addictions', 'pressure', 'financial', 'hatred', 'power', 'sexual', 'thrill', 'other'], motivationOther: utils.oasysString(128) }, page2: { howManyOthers: '5' }, page3: { leader: 'yes', leaderYesDetails: utils.oasysString(4000), leaderNoDetails: null, impact: 'yes', responsibility: null, responsibilityYesDetails: null, responsibilityNoDetails: null, patterns: null, escalation: null, riskSeriousHarm: null, riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 10, page1: { offenceDescription: 'Offence description', offenceElements: ['domesticAbuse', 'excessiveViolence', 'sexualElement', 'stalking', 'victimTargeted', 'violence', 'weapon'], reason: 'Reason', motivations: ['pressure', 'financial', 'hatred', 'power', 'sexual', 'thrill', 'other'], motivationOther: 'Other motivation' }, page2: { howManyOthers: '6to10' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: 'Leader no details', impact: 'yes', responsibility: 'yes', responsibilityYesDetails: null, responsibilityNoDetails: null, patterns: null, escalation: null, riskSeriousHarm: null, riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 11, page1: { offenceDescription: 'Offence description', offenceElements: ['excessiveViolence', 'sexualElement', 'stalking', 'victimTargeted', 'violence', 'weapon'], reason: 'Reason', motivations: ['financial', 'hatred', 'power', 'sexual', 'thrill', 'other'], motivationOther: 'Other motivation' }, page2: { howManyOthers: '11to15' }, page3: { leader: 'yes', leaderYesDetails: 'Leader yes details', leaderNoDetails: null, impact: 'no', responsibility: 'yes', responsibilityYesDetails: utils.oasysString(4000), responsibilityNoDetails: null, patterns: null, escalation: null, riskSeriousHarm: null, riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 12, page1: { offenceDescription: 'Offence description', offenceElements: ['sexualElement', 'stalking', 'victimTargeted', 'violence', 'weapon'], reason: 'Reason', motivations: ['hatred', 'power', 'sexual', 'thrill', 'other'], motivationOther: 'Other motivation' }, page2: { howManyOthers: 'more' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: 'Leader no details', impact: 'no', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: null, escalation: null, riskSeriousHarm: null, riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 13, page1: { offenceDescription: 'Offence description', offenceElements: ['stalking', 'victimTargeted', 'violence', 'weapon'], reason: 'Reason', motivations: ['power', 'sexual', 'thrill', 'other', 'emotional'], motivationOther: 'Other motivation' }, page2: { howManyOthers: '0' }, page3: { leader: null, leaderYesDetails: null, leaderNoDetails: null, impact: 'yes', responsibility: 'no', responsibilityYesDetails: null, responsibilityNoDetails: null, patterns: utils.oasysString(4000), escalation: null, riskSeriousHarm: null, riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 14, page1: { offenceDescription: 'Offence description', offenceElements: ['victimTargeted', 'violence', 'weapon'], reason: 'Reason', motivations: ['sexual', 'thrill', 'other'], motivationOther: 'Other motivation' }, page2: { howManyOthers: '1' }, page3: { leader: 'yes', leaderYesDetails: 'Leader yes details', leaderNoDetails: null, impact: 'yes', responsibility: 'no', responsibilityYesDetails: null, responsibilityNoDetails: 'Responsibility no details', patterns: 'Patterns of offending', escalation: 'yes', riskSeriousHarm: null, riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 15, page1: { offenceDescription: 'Offence description', offenceElements: ['violence', 'weapon'], reason: 'Reason', motivations: ['thrill', 'other'], motivationOther: 'Other motivation' }, page2: { howManyOthers: '2' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: utils.oasysString(4000), impact: 'no', responsibility: 'no', responsibilityYesDetails: null, responsibilityNoDetails: 'Responsibility no details', patterns: 'Patterns of offending', escalation: 'no', riskSeriousHarm: 'yes', riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 16, page1: { offenceDescription: 'Offence description', offenceElements: ['weapon'], reason: 'Reason', motivations: ['other'], motivationOther: 'Other motivation' }, page2: { howManyOthers: '3' }, page3: { leader: 'yes', leaderYesDetails: 'Leader yes details', leaderNoDetails: null, impact: 'no', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: 'Patterns of offending', escalation: 'na', riskSeriousHarm: 'yes', riskSeriousHarmYesDetails: utils.oasysString(4000), riskSeriousHarmNoDetails: null } },
        { ref: 17, page1: { offenceDescription: 'Offence description', offenceElements: ['arson'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '4' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: 'Leader no details', impact: 'yes', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: 'Patterns of offending', escalation: 'yes', riskSeriousHarm: 'yes', riskSeriousHarmYesDetails: 'Risk of harm yes details', riskSeriousHarmNoDetails: null } },
        { ref: 18, page1: { offenceDescription: 'Offence description', offenceElements: ['domesticAbuse'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '5' }, page3: { leader: 'yes', leaderYesDetails: 'Leader yes details', leaderNoDetails: null, impact: 'yes', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: 'Patterns of offending', escalation: 'no', riskSeriousHarm: 'yes', riskSeriousHarmYesDetails: 'Risk of harm yes details', riskSeriousHarmNoDetails: null } },
        { ref: 19, page1: { offenceDescription: 'Offence description', offenceElements: ['excessiveViolence'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '6to10' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: 'Leader no details', impact: 'no', responsibility: 'no', responsibilityYesDetails: null, responsibilityNoDetails: 'Responsibility no details', patterns: 'Patterns of offending', escalation: 'na', riskSeriousHarm: 'yes', riskSeriousHarmYesDetails: 'Risk of harm yes details', riskSeriousHarmNoDetails: null } },
        { ref: 20, page1: { offenceDescription: 'Offence description', offenceElements: ['sexualElement'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '11to15' }, page3: { leader: 'yes', leaderYesDetails: 'Leader yes details', leaderNoDetails: null, impact: 'no', responsibility: 'no', responsibilityYesDetails: null, responsibilityNoDetails: utils.oasysString(4000), patterns: 'Patterns of offending', escalation: 'yes', riskSeriousHarm: 'no', riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 21, page1: { offenceDescription: 'Offence description', offenceElements: ['stalking'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: 'more' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: 'Leader no details', impact: 'yes', responsibility: 'no', responsibilityYesDetails: null, responsibilityNoDetails: 'Responsibility no details', patterns: 'Patterns of offending', escalation: 'no', riskSeriousHarm: 'no', riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: utils.oasysString(4000) } },
        { ref: 22, page1: { offenceDescription: 'Offence description', offenceElements: ['victimTargeted'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '0' }, page3: { leader: null, leaderYesDetails: null, leaderNoDetails: null, impact: 'yes', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: 'Patterns of offending', escalation: 'na', riskSeriousHarm: 'no', riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: 'Risk of harm no details' } },
        { ref: 23, page1: { offenceDescription: 'Offence description', offenceElements: ['violence'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '1' }, page3: { leader: 'yes', leaderYesDetails: 'Leader yes details', leaderNoDetails: null, impact: 'no', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: 'Patterns of offending', escalation: 'yes', riskSeriousHarm: 'no', riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: 'Risk of harm no details' } },
        { ref: 24, page1: { offenceDescription: 'Offence description', offenceElements: ['weapon'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '2' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: 'Leader no details', impact: 'no', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: 'Patterns of offending', escalation: 'no', riskSeriousHarm: 'no', riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: 'Risk of harm no details' } },
        { ref: 25, page1: { offenceDescription: 'Offence description', offenceElements: ['none'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '3' }, page3: { leader: 'yes', leaderYesDetails: 'Leader yes details', leaderNoDetails: null, impact: 'yes', responsibility: 'no', responsibilityYesDetails: null, responsibilityNoDetails: 'Responsibility no details', patterns: 'Patterns of offending', escalation: 'na', riskSeriousHarm: 'yes', riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: null } },
        { ref: 26, page1: { offenceDescription: 'Offence description', offenceElements: ['arson', 'domesticAbuse'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '4' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: 'Leader no details', impact: 'yes', responsibility: 'no', responsibilityYesDetails: null, responsibilityNoDetails: 'Responsibility no details', patterns: 'Patterns of offending', escalation: 'yes', riskSeriousHarm: 'yes', riskSeriousHarmYesDetails: utils.oasysString(4000), riskSeriousHarmNoDetails: null } },
        { ref: 27, page1: { offenceDescription: 'Offence description', offenceElements: ['domesticAbuse', 'excessiveViolence'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '5' }, page3: { leader: 'yes', leaderYesDetails: 'Leader yes details', leaderNoDetails: null, impact: 'no', responsibility: 'no', responsibilityYesDetails: null, responsibilityNoDetails: 'Responsibility no details', patterns: 'Patterns of offending', escalation: 'no', riskSeriousHarm: 'yes', riskSeriousHarmYesDetails: 'Risk of harm yes details', riskSeriousHarmNoDetails: null } },
        { ref: 28, page1: { offenceDescription: 'Offence description', offenceElements: ['excessiveViolence', 'sexualElement'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '6to10' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: 'Leader no details', impact: 'no', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: 'Patterns of offending', escalation: 'na', riskSeriousHarm: 'yes', riskSeriousHarmYesDetails: 'Risk of harm yes details', riskSeriousHarmNoDetails: null } },
        { ref: 29, page1: { offenceDescription: 'Offence description', offenceElements: ['sexualElement', 'stalking'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '11to15' }, page3: { leader: 'yes', leaderYesDetails: 'Leader yes details', leaderNoDetails: null, impact: 'yes', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: 'Patterns of offending', escalation: 'yes', riskSeriousHarm: 'yes', riskSeriousHarmYesDetails: 'Risk of harm yes details', riskSeriousHarmNoDetails: null } },
        { ref: 30, page1: { offenceDescription: 'Offence description', offenceElements: ['stalking', 'victimTargeted'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: 'more' }, page3: { leader: 'no', leaderYesDetails: null, leaderNoDetails: 'Leader no details', impact: 'yes', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: 'Patterns of offending', escalation: 'no', riskSeriousHarm: 'no', riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: 'Risk of harm no details' } },
        { ref: 31, page1: { offenceDescription: 'Offence description', offenceElements: ['victimTargeted', 'violence'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '0' }, page3: { leader: null, leaderYesDetails: null, leaderNoDetails: null, impact: 'no', responsibility: 'no', responsibilityYesDetails: null, responsibilityNoDetails: 'Responsibility no details', patterns: 'Patterns of offending', escalation: 'na', riskSeriousHarm: 'no', riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: 'Risk of harm no details' } },
        { ref: 32, page1: { offenceDescription: 'Offence description', offenceElements: ['violence', 'weapon'], reason: 'Reason', motivations: null, motivationOther: null }, page2: { howManyOthers: '1' }, page3: { leader: 'yes', leaderYesDetails: 'Leader yes details', leaderNoDetails: null, impact: 'no', responsibility: 'yes', responsibilityYesDetails: 'Responsibility yes details', responsibilityNoDetails: null, patterns: 'Patterns of offending', escalation: 'yes', riskSeriousHarm: 'no', riskSeriousHarmYesDetails: null, riskSeriousHarmNoDetails: 'Risk of harm no details' } },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Offence analysis', true)
        // Back to the start, depending where the previous scenario ended
        for (let i = 1; i < startPage; i++) {
            await san.offenceAnalysis.previous()
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

        // Reset 1.30 if required ready for the next scenario
        if (test.ref < 22 && (test.page1.offenceElements.includes('sexualElement') || test.page1.motivations.includes('sexual'))) {
            await san.gotoSan('Offence analysis', true)
            for (let i = 1; i < startPage; i++) {
                await san.offenceAnalysis.previous()
            }
            startPage = 1
            await san.offenceAnalysis.page1.offenceElements.setValue(['arson'])
            await san.offenceAnalysis.page1.motivations.setValue(['addictions'])
            await san.returnToOASys()
            await sections.predictors.goto()
            await sections.predictors.o1_30.setValue('')
        }

    }
    await user.logout()

    expect(failed).toBe(0)

})


async function scenario(test: TestCase, san: San) {

    await san.offenceAnalysis.page1.offenceDescription.setValue(test.page1.offenceDescription)
    await san.offenceAnalysis.page1.offenceElements.setValue(test.page1.offenceElements)
    await san.offenceAnalysis.page1.reason.setValue(test.page1.reason)
    await san.offenceAnalysis.page1.motivations.setValue(test.page1.motivations)
    if (test.page1.motivations.includes('other')) {
        await san.offenceAnalysis.page1.motivationOther.setValue(test.page1.motivationOther)
    }

    if (test.page2) {
        if (test.page1.offenceElements.includes('victimTargeted')) {
            await san.offenceAnalysis.page1.victimTargetedDetails.setValue('Some details')
        }
        await san.offenceAnalysis.page1.victimType.setValue(['other'])
        await san.offenceAnalysis.page1.victimTypeDetails.setValue('Some details')
        await san.offenceAnalysis.saveAndContinue()
        await san.offenceAnalysis.page2.howManyOthers.setValue(test.page2.howManyOthers

        )
        if (test.page3) {
            await san.offenceAnalysis.saveAndContinue()

            if (test.page3.leader) {
                await san.offenceAnalysis.page3.leader.setValue(test.page3.leader)
                if (test.page3.leader == 'yes') {
                    await san.offenceAnalysis.page3.leaderYesDetails.setValue(test.page3.leaderYesDetails)
                } else if (test.page3.leader == 'no') {
                    await san.offenceAnalysis.page3.leaderNoDetails.setValue(test.page3.leaderNoDetails)
                }
            }
            await san.offenceAnalysis.page3.impact.setValue(test.page3.impact)
            await san.offenceAnalysis.page3.responsibility.setValue(test.page3.responsibility)
            if (test.page3.responsibility == 'yes') {
                await san.offenceAnalysis.page3.responsibilityYesDetails.setValue(test.page3.responsibilityYesDetails)
            } else if (test.page3.responsibility == 'no') {
                await san.offenceAnalysis.page3.responsibilityNoDetails.setValue(test.page3.responsibilityNoDetails)
            }
            await san.offenceAnalysis.page3.patterns.setValue(test.page3.patterns)
            await san.offenceAnalysis.page3.escalation.setValue(test.page3.escalation)
            await san.offenceAnalysis.page3.riskSeriousHarm.setValue(test.page3.riskSeriousHarm)
            if (test.page3.riskSeriousHarm == 'yes') {
                await san.offenceAnalysis.page3.riskSeriousHarmYesDetails.setValue(test.page3.riskSeriousHarmYesDetails)
            } else if (test.page3.riskSeriousHarm == 'no') {
                await san.offenceAnalysis.page3.riskSeriousHarmNoDetails.setValue(test.page3.riskSeriousHarmNoDetails)
            }

            startPage = 3
        } else {
            startPage = 2
        }
    } else {
        startPage = 1
    }
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section1Answers: OasysAnswer[] = [
        { q: '1.30', a: mapping1_30(test) },
    ]
    const section2Answers: OasysAnswer[] = [
        { q: '2.1', a: mapping2_1(test) },
        { q: '2.2_V2_WEAPON', a: mapping2_2(test, 'weapon') },
        { q: '2.2_V2_ANYVIOL', a: mapping2_2(test, 'violence') },
        { q: '2.2_V2_ARSON', a: mapping2_2(test, 'arson') },
        { q: '2.2_V2_DOM_ABUSE', a: mapping2_2(test, 'domesticAbuse') },
        { q: '2.2_V2_EXCESSIVE', a: mapping2_2(test, 'excessiveViolence') },
        { q: '2.2_V2_PHYSICALDAM', a: null },
        { q: '2.2_V2_SEXUAL', a: mapping2_2(test, 'sexualElement') },
        { q: '2.3', a: mapping2_3(test) },
        { q: '2.6', a: mapping2_6(test) },
        { q: '2.7', a: mapping2_7(test) },
        { q: '2.7.1', a: mapping2_7_1(test) },
        { q: '2.7.2', a: mapping2_7_2(test) },
        { q: '2.7.3', a: mapping2_7_3(test) },
        { q: '2.8', a: mapping2_8(test) },
        { q: '2.9_V2_SEXUAL', a: mapping2_9(test, 'sexual') },
        { q: '2.9_V2_FINANCIAL', a: mapping2_9(test, 'financial') },
        { q: '2.9_V2_ADDICTION', a: mapping2_9(test, 'addictions') },
        { q: '2.9_V2_EMOTIONAL', a: mapping2_9(test, 'emotional') },
        { q: '2.9_V2_RACIAL', a: mapping2_9(test, 'hatred') },
        { q: '2.9_V2_THRILL', a: mapping2_9(test, 'thrill') },
        { q: '2.9_V2_OTHER', a: mapping2_9(test, 'other') },
        { q: '2.9.t_V2', a: mapping2_9t_V2(test) },
        { q: '2.11', a: mapping2_11(test) },
        { q: '2.11.t', a: mapping2_11t(test) },
        { q: '2.12', a: mapping2_12(test) },
        { q: '2.13', a: mapping2_13(test) },
        { q: '2.98', a: mapping2_98(test) },
        { q: '2.99', a: mapping2_99(test) },

    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'OA_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section1Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '1', section1Answers, true)
    const section2Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '2', section2Answers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section1Failed || section2Failed || sanSectionFailed
}

function mapping1_30(test: TestCase): string {

    return test.page1.offenceElements.includes('sexualElement') || test.page1.motivations.includes('sexual') ? 'YES' : null
}

function mapping2_1(test: TestCase): string {

    return test.page1.offenceDescription
}

function mapping2_2(test: TestCase, element: OffenceElements): string {

    if (test.page1.offenceElements.includes(element)) {
        return 'YES'
    }
    return 'NO'
}

function mapping2_3(test: TestCase): string {

    let result = ''
    if (test.page1.offenceElements.includes('victimTargeted')) {
        result = 'DIRECTCONT,'
    }

    if (test.page1.offenceElements.includes('stalking')) {
        result = `${result}STALKING,`
    }
    return result == '' ? null : result
}

function mapping2_6(test: TestCase): string {

    return test.page3?.impact?.toUpperCase()
}

function mapping2_7(test: TestCase): string {

    return test.page2?.howManyOthers == null ? null : test.page2?.howManyOthers == '0' ? 'NO' : 'YES'
}

function mapping2_7_1(test: TestCase): string {

    switch (test.page2?.howManyOthers) {
        case '1':
            return '110'
        case '2':
            return '120'
        case '3':
            return '130'
        case '4':
            return '140'
        case '5':
            return '150'
        case '6to10':
            return '160'
        case '11to15':
            return '170'
        case 'more':
            return '180'
        default:
            return null
    }
}

function mapping2_7_2(test: TestCase): string {

    return test.page1.motivations.includes('pressure') ? 'YES' : 'NO'
}

function mapping2_7_3(test: TestCase): string {

    if (test.page3?.leader == 'yes') {
        return `Yes - ${test.page3?.leaderYesDetails}`
    } else if (test.page3?.leader == 'no') {
        return `No - ${test.page3?.leaderNoDetails}`
    }
    return null
}

function mapping2_8(test: TestCase): string {

    return test.page1.reason
}

function mapping2_9(test: TestCase, motivation: Motivations): string {

    if (test.page1.motivations.includes(motivation)) {
        return 'YES'
    }
    return 'NO'
}

function mapping2_9t_V2(test: TestCase): string {

    return test.page1.motivationOther
}

function mapping2_11(test: TestCase): string {

    return test.page3?.responsibility?.toUpperCase()
}

function mapping2_11t(test: TestCase): string {

    switch (test.page3?.responsibility) {
        case 'yes':
            return test.page3?.responsibilityYesDetails
        case 'no':
            return test.page3?.responsibilityNoDetails
        default:
            return null
    }
}

function mapping2_12(test: TestCase): string {

    return test.page3?.patterns
}

function mapping2_13(test: TestCase): string {

    switch (test.page3?.escalation) {
        case 'yes':
            return 'YES'
        case 'no':
            return 'NO'
        default:
            return null
    }
}

function mapping2_98(test: TestCase): string {

    switch (test.page3?.riskSeriousHarm) {
        case 'yes':
            return test.page3?.riskSeriousHarmYesDetails
        case 'no':
            return test.page3?.riskSeriousHarmNoDetails
        default:
            return null
    }
}

function mapping2_99(test: TestCase): string {

    return test.page3?.riskSeriousHarm?.toUpperCase()
}

