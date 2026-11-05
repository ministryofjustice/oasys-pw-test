import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page1: { anyChildren: AnyChildren[] },
    page2: { parentingResponsibilities: SanYesNo }
    page3: {
        manageParenting: SanYesSometimesNoUnknown,
        currentFamilyRelationship: CurrentFamilyRelationship,
        childhoodExperience: SanPositiveMixedNegativeUnknown,
        behaviouralProblems: SanYesNo,
        inARelationship: InARelationship,
        happyWithStatus: HappyWithStatus,
        history: RelationshipHistory,
    },
    page4: { domesticAbusePerpetrator: SanYesNo },
    page5: { domesticAbusePerpetratorType: FamilyPartner[] },
    page7: { domesticAbuseVictim: SanYesNo, },
    page8: { domesticAbuseVictimType: FamilyPartner[], },
}

test.describe.configure({ retries: 1 })

for (const mode of ['community', 'custody']) {
    test(`Mapping test V2 ${mode}: relationships`, async ({ oasys, user, offender, assessment, san }) => {

        sanMode = mode as SanMode
        const mappingTestOffender = await getMappingTestOffender()

        // Delete previous assessments so no data gets cloned
        await user.admin.login(sanMode == 'community' ? providers.prob.san : providers.pris.san)
        await offender.searchAndSelectByPnc(mappingTestOffender.pnc)
        await assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
        await user.logout()

        // Create a new SAN assessment
        if (sanMode == 'community') {
            await user.prob.probSanUnappr.login()
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
            { ref: 1, page1: { anyChildren: ['no'] }, page2: null, page3: null, page4: { domesticAbusePerpetrator: null }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: null }, page8: { domesticAbuseVictimType: null } },
            { ref: 2, page1: { anyChildren: ['yesLiveWith'] }, page2: { parentingResponsibilities: 'no' }, page3: null, page4: { domesticAbusePerpetrator: null }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: null }, page8: { domesticAbuseVictimType: null } },
            { ref: 3, page1: { anyChildren: ['yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'stable', childhoodExperience: 'mixed', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'happy', history: 'stable' }, page4: { domesticAbusePerpetrator: null }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: null }, page8: { domesticAbuseVictimType: null } },
            { ref: 4, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'stable', childhoodExperience: 'unknown', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'happy', history: 'mixed' }, page4: { domesticAbusePerpetrator: null }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: null }, page8: { domesticAbuseVictimType: null } },
            { ref: 5, page1: { anyChildren: ['no'] }, page2: null, page3: { manageParenting: null, currentFamilyRelationship: 'stable', childhoodExperience: 'positive', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'happy', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: null }, page8: { domesticAbuseVictimType: null } },
            { ref: 6, page1: { anyChildren: ['yesLiveWith'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'yes', currentFamilyRelationship: 'stable', childhoodExperience: 'negative', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'happy', history: 'stable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family'] }, page7: { domesticAbuseVictim: null }, page8: { domesticAbuseVictimType: null } },
            { ref: 7, page1: { anyChildren: ['yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'sometimes', currentFamilyRelationship: 'stable', childhoodExperience: 'mixed', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'happy', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['partner'] }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family'] } },
            { ref: 8, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'no', currentFamilyRelationship: 'stable', childhoodExperience: 'unknown', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'happy', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family', 'partner'] }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['partner'] } },
            { ref: 9, page1: { anyChildren: ['no'] }, page2: null, page3: { manageParenting: null, currentFamilyRelationship: 'mixed', childhoodExperience: 'positive', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'happy', history: 'stable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family'] }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family', 'partner'] } },
            { ref: 10, page1: { anyChildren: ['yesLiveWith'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'mixed', childhoodExperience: 'negative', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'someConcerns', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['partner'] }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family'] } },
            { ref: 11, page1: { anyChildren: ['yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'mixed', childhoodExperience: 'unknown', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'someConcerns', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family', 'partner'] }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['partner'] } },
            { ref: 12, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'mixed', childhoodExperience: 'positive', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'someConcerns', history: 'stable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family'] }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family', 'partner'] } },
            { ref: 13, page1: { anyChildren: ['no'] }, page2: null, page3: { manageParenting: null, currentFamilyRelationship: 'mixed', childhoodExperience: 'negative', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'someConcerns', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['partner'] }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family'] } },
            { ref: 14, page1: { anyChildren: ['yesLiveWith'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'unknown', currentFamilyRelationship: 'mixed', childhoodExperience: 'mixed', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'someConcerns', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family', 'partner'] }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['partner'] } },
            { ref: 15, page1: { anyChildren: ['yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'yes', currentFamilyRelationship: 'mixed', childhoodExperience: 'positive', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'someConcerns', history: 'stable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family'] }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 16, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'sometimes', currentFamilyRelationship: 'mixed', childhoodExperience: 'negative', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'someConcerns', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['partner'] }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 17, page1: { anyChildren: ['no'] }, page2: null, page3: { manageParenting: null, currentFamilyRelationship: 'unstable', childhoodExperience: 'mixed', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'someConcerns', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family', 'partner'] }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 18, page1: { anyChildren: ['yesLiveWith'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'unstable', childhoodExperience: 'unknown', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'someConcerns', history: 'stable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family'] }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 19, page1: { anyChildren: ['yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'unstable', childhoodExperience: 'positive', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['partner'] }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 20, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'unstable', childhoodExperience: 'negative', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family', 'partner'] }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 21, page1: { anyChildren: ['no'] }, page2: null, page3: { manageParenting: null, currentFamilyRelationship: 'unstable', childhoodExperience: 'mixed', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'stable' }, page4: { domesticAbusePerpetrator: 'yes' }, page5: { domesticAbusePerpetratorType: ['family'] }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 22, page1: { anyChildren: ['yesLiveWith'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'no', currentFamilyRelationship: 'unstable', childhoodExperience: 'unknown', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 23, page1: { anyChildren: ['yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'unknown', currentFamilyRelationship: 'unstable', childhoodExperience: 'positive', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family', 'partner'] } },
            { ref: 24, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'yes', currentFamilyRelationship: 'unstable', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'stable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family'] } },
            { ref: 25, page1: { anyChildren: ['no'] }, page2: null, page3: { manageParenting: null, currentFamilyRelationship: 'unknown', childhoodExperience: 'unknown', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['partner'] } },
            { ref: 26, page1: { anyChildren: ['yesLiveWith'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'unknown', childhoodExperience: 'positive', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family', 'partner'] } },
            { ref: 27, page1: { anyChildren: ['yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'unknown', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'stable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family'] } },
            { ref: 28, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'unknown', childhoodExperience: 'mixed', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['partner'] } },
            { ref: 29, page1: { anyChildren: ['no'] }, page2: null, page3: { manageParenting: null, currentFamilyRelationship: 'unknown', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'happy', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family', 'partner'] } },
            { ref: 30, page1: { anyChildren: ['yesLiveWith'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'sometimes', currentFamilyRelationship: 'unknown', childhoodExperience: 'unknown', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'happy', history: 'stable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['family'] } },
            { ref: 31, page1: { anyChildren: ['yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'no', currentFamilyRelationship: 'unknown', childhoodExperience: 'positive', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'happy', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 32, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'unknown', currentFamilyRelationship: 'unknown', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'someConcerns', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 33, page1: { anyChildren: ['no'] }, page2: null, page3: { manageParenting: null, currentFamilyRelationship: 'stable', childhoodExperience: 'mixed', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'someConcerns', history: 'stable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 34, page1: { anyChildren: ['yesLiveWith'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'mixed', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'someConcerns', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 35, page1: { anyChildren: ['yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'unstable', childhoodExperience: 'unknown', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'someConcerns', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 36, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'no' }, page3: { manageParenting: null, currentFamilyRelationship: 'unknown', childhoodExperience: 'positive', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'someConcerns', history: 'stable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 37, page1: { anyChildren: ['no'] }, page2: null, page3: { manageParenting: null, currentFamilyRelationship: 'stable', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'unhappy', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 38, page1: { anyChildren: ['yesLiveWith'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'yes', currentFamilyRelationship: 'mixed', childhoodExperience: 'mixed', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'unhappy', history: 'unstable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
            { ref: 39, page1: { anyChildren: ['yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'sometimes', currentFamilyRelationship: 'unstable', childhoodExperience: 'positive', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'unhappy', history: 'stable' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'yes' }, page8: { domesticAbuseVictimType: ['partner'] } },
            { ref: 40, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] }, page2: { parentingResponsibilities: 'yes' }, page3: { manageParenting: 'no', currentFamilyRelationship: 'unknown', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'unhappy', history: 'mixed' }, page4: { domesticAbusePerpetrator: 'no' }, page5: { domesticAbusePerpetratorType: null }, page7: { domesticAbuseVictim: 'no' }, page8: { domesticAbuseVictimType: null } },
        ]

        for (const test of testCases) {
            // Get to the right starting screen
            await san.gotoSan('relationships', true)
            await san.relationships.backToStart()
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
        await san.gotoSan('relationships', true)
        await san.relationships.page1.populateMinimal()
        await san.relationships.saveAndContinue()
        await san.relationships.page3.populateMinimal()
        await san.relationships.saveAndContinue()
        await san.relationships.page4.populateMinimal()
        await san.relationships.saveAndContinue()
        await san.relationships.page7.populateMinimal()
        await san.relationships.saveAndContinue()
        await san.relationships.wantChanges.setValue('madeChanges')
        await san.relationships.saveAndContinue()

        await san.returnToOASys()

        await paTest(assessmentPk, san.relationships, oasys, assessment, san)
        await user.logout()
    })
}


async function scenario(test: TestCase, san: San) {

    await san.relationships.page1.anyChildren.setValue(test.page1.anyChildren)
    await san.relationships.saveAndContinue()
    if (test.page2) {
        await san.relationships.page2.parentingResponsibilities.setValue(test.page2.parentingResponsibilities)
        await san.relationships.saveAndContinue()
    }
    if (test.page3) {
        await san.relationships.page3.manageParenting.setValue(test.page3.manageParenting)
        // if (sanMode == 'custody') {  // TODO add back in for custody
        //     await san.relationships.page2.childrenVisiting.setValue('no')
        // }
        await san.relationships.page3.currentFamilyRelationship.setValue(test.page3.currentFamilyRelationship)
        await san.relationships.page3.childhoodExperience.setValue(test.page3.childhoodExperience)
        await san.relationships.page3.behaviouralProblems.setValue(test.page3.behaviouralProblems)
        await san.relationships.page3.partOfGroups.setValue('Some groups')
        await san.relationships.page3.inARelationship.setValue(test.page3.inARelationship)
        await san.relationships.page3.happyWithStatus.setValue(test.page3.happyWithStatus)
        await san.relationships.page3.history.setValue(test.page3.history)
        await san.relationships.saveAndContinue()
        if (test.page4) {
            await san.relationships.page4.domesticAbusePerpetrator.setValue(test.page4.domesticAbusePerpetrator)
            await san.relationships.saveAndContinue()
            if (test.page5) {
                await san.relationships.page5.domesticAbusePerpetratorType.setValue(test.page5.domesticAbusePerpetratorType)
                await san.relationships.saveAndContinue()
                if (test.page5.domesticAbusePerpetratorType.includes('partner')) {
                    await san.relationships.page6.strangulation.setValue('no')
                    await san.relationships.page6.strangulationNoDetails.setValue('details')
                    await san.relationships.saveAndContinue()
                }
                if (test.page7) {
                    await san.relationships.page7.domesticAbuseVictim.setValue(test.page7.domesticAbuseVictim)
                    await san.relationships.saveAndContinue()
                    if (test.page8) {
                        await san.relationships.page8.domesticAbuseVictimType.setValue(test.page8.domesticAbuseVictimType)
                        await san.relationships.saveAndContinue()
                    }
                }
            }
        }
    }
}


async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section6Answers: OasysAnswer[] = [
        { q: '6.1', a: mapping6_1(test) },
        { q: '6.3', a: mapping6_3(test) },
        { q: '6.8', a: mapping6_8(test) },
        { q: '6.4', a: mapping6_4(test) },
        { q: '6.6', a: mapping6_6(test) },
        { q: '6.7da', a: mapping6_7da(test) },
        { q: '6.7.1.1da', a: mapping6_7_1_1da(test) },
        { q: '6.7.1.2da', a: mapping6_7_1_2da(test) },
        { q: '6.7.2.1da', a: mapping6_7_2_1da(test) },
        { q: '6.7.2.2da', a: mapping6_7_2_2da(test) },
        { q: '6.9', a: mapping6_9(test) },
        { q: '6.10', a: mapping6_10(test) },
        { q: '6_SAN_STRENGTH', a: null },
    ]
    const section10Answers: OasysAnswer[] = [
        { q: '10.7_V2_CHILDHOOD', a: mapping10_7_V2_CHILDHOOD(test) },
    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'PRC_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section6Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '6', section6Answers, true)
    const section10Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '10', section10Answers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section6Failed || section10Failed || sanSectionFailed
}

function mapping6_1(test: TestCase): string {

    switch (test.page3?.currentFamilyRelationship) {
        case 'stable':
            return '0'
        case 'mixed':
            return '1'
        case 'unstable':
            return '2'
        case 'unknown':
            return 'M'
        default:
            return null
    }
}

function mapping6_3(test: TestCase): string {

    switch (test.page3?.childhoodExperience) {
        case 'positive':
            return '0'
        case 'mixed':
            return '1'
        case 'negative':
            return '2'
        case 'unknown':
            return 'M'
        default:
            return null
    }
}

function mapping6_8(test: TestCase): string {

    switch (test.page3?.inARelationship) {
        case 'livingTogether':
            return '1'
        case 'notLivingTogether':
            return '2'
        case 'no':
            return '3'
        default:
            return null
    }
}


function mapping6_4(test: TestCase): string {

    switch (test.page3?.happyWithStatus) {
        case 'happy':
            return '0'
        case 'someConcerns':
            return '1'
        case 'unhappy':
            return '2'
        default:
            return null
    }
}

function mapping6_6(test: TestCase): string {

    switch (test.page3?.history) {
        case 'stable':
            return '0'
        case 'mixed':
            return '1'
        case 'unstable':
            return '2'
        default:
            return null
    }
}

function mapping6_7da(test: TestCase): string {

    if (test.page4?.domesticAbusePerpetrator == 'yes' || test.page7?.domesticAbuseVictim == 'yes') {
        return 'YES'
    }
    if (test.page4?.domesticAbusePerpetrator == 'no' && test.page7?.domesticAbuseVictim == 'no') {
        return 'NO'
    }
    return null
}

function mapping6_7_1_1da(test: TestCase): string {  // Victim - partner

    switch (test.page7?.domesticAbuseVictim) {
        case 'yes':
            if (test.page8?.domesticAbuseVictimType.includes('partner')) {
                return 'YES'
            } else if (test.page8?.domesticAbuseVictimType.includes('family')) {
                return 'NO'
            } else {
                return null
            }
        case 'no':
            return 'NO'
        default:
            return null
    }
}

function mapping6_7_1_2da(test: TestCase): string {  // Victim - family

    switch (test.page7?.domesticAbuseVictim) {
        case 'yes':
            if (test.page8?.domesticAbuseVictimType.includes('family')) {
                return 'YES'
            } else if (test.page8?.domesticAbuseVictimType.includes('partner')) {
                return 'NO'
            } else {
                return null
            }
        case 'no':
            return 'NO'
        default:
            return null
    }
}

function mapping6_7_2_1da(test: TestCase): string {  // Perp - partner

    switch (test.page4?.domesticAbusePerpetrator) {
        case 'yes':
            if (test.page5?.domesticAbusePerpetratorType.includes('partner')) {
                return 'YES'
            } else if (test.page5?.domesticAbusePerpetratorType.includes('family')) {
                return 'NO'
            } else {
                return null
            }
        case 'no':
            return 'NO'
        default:
            return null
    }
}

function mapping6_7_2_2da(test: TestCase): string { // Perp = family

    switch (test.page4?.domesticAbusePerpetrator) {
        case 'yes':
            if (test.page5?.domesticAbusePerpetratorType.includes('family')) {
                return 'YES'
            } else if (test.page5?.domesticAbusePerpetratorType.includes('partner')) {
                return 'NO'
            } else {
                return null
            }
        case 'no':
            return 'NO'
        default:
            return null
    }
}

function mapping6_9(test: TestCase): string {

    if (test.page1.anyChildren.includes('no')) {
        return 'NO'
    }
    return test.page2?.parentingResponsibilities?.toUpperCase()
}

function mapping6_10(test: TestCase): string {

    switch (test.page3?.manageParenting) {
        case 'yes':
            return 'Noproblems'
        case 'sometimes':
            return 'Someproblems'
        case 'no':
            return 'Significantproblems'
        default:
            return null
    }
}

function mapping10_7_V2_CHILDHOOD(test: TestCase): string {

    return test.page3?.behaviouralProblems?.toUpperCase()
}
