import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page1: { anyChildren: AnyChildren[] },
    page2: {
        parentingResponsibilities: SanYesNo,
        manageParenting: SanYesSometimesNoUnknown,
    },
    page3: {
        currentFamilyRelationship: CurrentFamilyRelationship,
        childhoodExperience: SanPositiveMixedNegativeUnknown,
        behaviouralProblems: SanYesNo,
        inARelationship: InARelationship,
        happyWithStatus: HappyWithStatus,
        history: RelationshipHistory,
        domesticAbusePerpetrator: SanYesNo,
        domesticAbusePerpetratorType: FamilyPartnerBoth,
        domesticAbuseVictim: SanYesNo,
        domesticAbuseVictimType: FamilyPartnerBoth,
    }
}

let startPage = 1 // Page that SAN will go back into when opening the section, depends on last page reached in previous scenario

test.describe.configure({ retries: 1 })
test('Mapping test V2: relationships', async ({ oasys, user, offender, assessment, san }) => {

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
        { ref: 1, page1: { anyChildren: ['no'] } , page2: null , page3: { currentFamilyRelationship: null, childhoodExperience: null, behaviouralProblems: null, inARelationship: null, happyWithStatus: null, history: null, domesticAbusePerpetrator: null, domesticAbusePerpetratorType: null, domesticAbuseVictim: null, domesticAbuseVictimType: null }  },
        { ref: 2, page1: { anyChildren: ['yesLiveWith'] } , page2: { parentingResponsibilities: 'no', manageParenting: null } , page3: { currentFamilyRelationship: 'stable', childhoodExperience: null, behaviouralProblems: null, inARelationship: null, happyWithStatus: null, history: null, domesticAbusePerpetrator: null, domesticAbusePerpetratorType: null, domesticAbuseVictim: null, domesticAbuseVictimType: null }  },
        { ref: 3, page1: { anyChildren: ['yesLiveElsewhere'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'yes' } , page3: { currentFamilyRelationship: 'mixed', childhoodExperience: 'mixed', behaviouralProblems: null, inARelationship: null, happyWithStatus: null, history: null, domesticAbusePerpetrator: null, domesticAbusePerpetratorType: null, domesticAbuseVictim: null, domesticAbuseVictimType: null }  },
        { ref: 4, page1: { anyChildren: ['yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'sometimes' } , page3: { currentFamilyRelationship: 'unstable', childhoodExperience: 'unknown', behaviouralProblems: 'yes', inARelationship: null, happyWithStatus: null, history: null, domesticAbusePerpetrator: null, domesticAbusePerpetratorType: null, domesticAbuseVictim: 'no', domesticAbuseVictimType: null }  },
        { ref: 5, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'no' } , page3: { currentFamilyRelationship: 'unknown', childhoodExperience: 'positive', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: null, history: null, domesticAbusePerpetrator: null, domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: null }  },
        { ref: 6, page1: { anyChildren: ['yesLiveWith', 'yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'unknown' } , page3: { currentFamilyRelationship: 'stable', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'happy', history: null, domesticAbusePerpetrator: null, domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'both' }  },
        { ref: 7, page1: { anyChildren: ['yesLiveElsewhere', 'yesVisitRegularly'] } , page2: { parentingResponsibilities: 'no', manageParenting: null } , page3: { currentFamilyRelationship: 'mixed', childhoodExperience: 'mixed', behaviouralProblems: 'no', inARelationship: 'notLivingTogether', happyWithStatus: 'someConcerns', history: 'stable', domesticAbusePerpetrator: null, domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'family' }  },
        { ref: 8, page1: { anyChildren: ['no'] } , page2: null , page3: { currentFamilyRelationship: 'unstable', childhoodExperience: 'unknown', behaviouralProblems: 'yes', inARelationship: 'no', happyWithStatus: 'unhappy', history: 'mixed', domesticAbusePerpetrator: null, domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'partner' }  },
        { ref: 9, page1: { anyChildren: ['yesLiveWith'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'yes' } , page3: { currentFamilyRelationship: 'unknown', childhoodExperience: 'positive', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'happy', history: 'unstable', domesticAbusePerpetrator: 'no', domesticAbusePerpetratorType: null, domesticAbuseVictim: null, domesticAbuseVictimType: null }  },
        { ref: 10, page1: { anyChildren: ['yesLiveElsewhere'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'sometimes' } , page3: { currentFamilyRelationship: 'stable', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'someConcerns', history: 'stable', domesticAbusePerpetrator: 'no', domesticAbusePerpetratorType: null, domesticAbuseVictim: 'no', domesticAbuseVictimType: null }  },
        { ref: 11, page1: { anyChildren: ['yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'no' } , page3: { currentFamilyRelationship: 'mixed', childhoodExperience: 'unknown', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'unhappy', history: 'mixed', domesticAbusePerpetrator: 'no', domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: null }  },
        { ref: 12, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'unknown' } , page3: { currentFamilyRelationship: 'unstable', childhoodExperience: 'positive', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'someConcerns', history: 'unstable', domesticAbusePerpetrator: 'no', domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'both' }  },
        { ref: 13, page1: { anyChildren: ['yesLiveWith', 'yesVisitRegularly'] } , page2: { parentingResponsibilities: 'no', manageParenting: null } , page3: { currentFamilyRelationship: 'unknown', childhoodExperience: 'negative', behaviouralProblems: 'no', inARelationship: 'notLivingTogether', happyWithStatus: 'unhappy', history: 'mixed', domesticAbusePerpetrator: 'no', domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'family' }  },
        { ref: 14, page1: { anyChildren: ['yesLiveElsewhere', 'yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'yes' } , page3: { currentFamilyRelationship: 'stable', childhoodExperience: 'mixed', behaviouralProblems: 'yes', inARelationship: 'no', happyWithStatus: 'happy', history: 'unstable', domesticAbusePerpetrator: 'no', domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'partner' }  },
        { ref: 15, page1: { anyChildren: ['no'] } , page2: null , page3: { currentFamilyRelationship: 'mixed', childhoodExperience: 'positive', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'someConcerns', history: 'stable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: null, domesticAbuseVictim: null, domesticAbuseVictimType: null }  },
        { ref: 16, page1: { anyChildren: ['yesLiveWith'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'sometimes' } , page3: { currentFamilyRelationship: 'unstable', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'unhappy', history: 'unstable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: null, domesticAbuseVictim: 'no', domesticAbuseVictimType: null }  },
        { ref: 17, page1: { anyChildren: ['yesLiveElsewhere'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'no' } , page3: { currentFamilyRelationship: 'unknown', childhoodExperience: 'mixed', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'happy', history: 'mixed', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: null }  },
        { ref: 18, page1: { anyChildren: ['yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'unknown' } , page3: { currentFamilyRelationship: 'stable', childhoodExperience: 'unknown', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'someConcerns', history: 'stable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'both' }  },
        { ref: 19, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] } , page2: { parentingResponsibilities: 'no', manageParenting: null } , page3: { currentFamilyRelationship: 'mixed', childhoodExperience: 'positive', behaviouralProblems: 'no', inARelationship: 'notLivingTogether', happyWithStatus: 'unhappy', history: 'stable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'family' }  },
        { ref: 20, page1: { anyChildren: ['yesLiveWith', 'yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'yes' } , page3: { currentFamilyRelationship: 'unstable', childhoodExperience: 'negative', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'someConcerns', history: 'mixed', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: null, domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'partner' }  },
        { ref: 21, page1: { anyChildren: ['yesLiveElsewhere', 'yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'sometimes' } , page3: { currentFamilyRelationship: 'unknown', childhoodExperience: 'mixed', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'unstable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'both', domesticAbuseVictim: null, domesticAbuseVictimType: null }  },
        { ref: 22, page1: { anyChildren: ['no'] } , page2: null , page3: { currentFamilyRelationship: 'stable', childhoodExperience: 'unknown', behaviouralProblems: 'no', inARelationship: 'notLivingTogether', happyWithStatus: 'happy', history: 'stable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'both', domesticAbuseVictim: 'no', domesticAbuseVictimType: null }  },
        { ref: 23, page1: { anyChildren: ['yesLiveWith'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'no' } , page3: { currentFamilyRelationship: 'mixed', childhoodExperience: 'positive', behaviouralProblems: 'yes', inARelationship: 'no', happyWithStatus: 'someConcerns', history: 'mixed', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'both', domesticAbuseVictim: 'yes', domesticAbuseVictimType: null }  },
        { ref: 24, page1: { anyChildren: ['yesLiveElsewhere'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'unknown' } , page3: { currentFamilyRelationship: 'unstable', childhoodExperience: 'negative', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'unstable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'both', domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'both' }  },
        { ref: 25, page1: { anyChildren: ['yesVisitRegularly'] } , page2: { parentingResponsibilities: 'no', manageParenting: null } , page3: { currentFamilyRelationship: 'unknown', childhoodExperience: 'unknown', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'happy', history: 'mixed', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'both', domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'family' }  },
        { ref: 26, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'yes' } , page3: { currentFamilyRelationship: 'stable', childhoodExperience: 'positive', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'someConcerns', history: 'unstable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'both', domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'partner' }  },
        { ref: 27, page1: { anyChildren: ['yesLiveWith', 'yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'sometimes' } , page3: { currentFamilyRelationship: 'mixed', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'unhappy', history: 'stable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'family', domesticAbuseVictim: null, domesticAbuseVictimType: null }  },
        { ref: 28, page1: { anyChildren: ['yesLiveElsewhere', 'yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'no' } , page3: { currentFamilyRelationship: 'unstable', childhoodExperience: 'mixed', behaviouralProblems: 'no', inARelationship: 'notLivingTogether', happyWithStatus: 'someConcerns', history: 'unstable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'family', domesticAbuseVictim: 'no', domesticAbuseVictimType: null }  },
        { ref: 29, page1: { anyChildren: ['no'] } , page2: null , page3: { currentFamilyRelationship: 'unknown', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'no', happyWithStatus: 'unhappy', history: 'mixed', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'family', domesticAbuseVictim: 'yes', domesticAbuseVictimType: null }  },
        { ref: 30, page1: { anyChildren: ['yesLiveWith'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'unknown' } , page3: { currentFamilyRelationship: 'stable', childhoodExperience: 'unknown', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'happy', history: 'stable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'family', domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'both' }  },
        { ref: 31, page1: { anyChildren: ['yesLiveElsewhere'] } , page2: { parentingResponsibilities: 'no', manageParenting: null } , page3: { currentFamilyRelationship: 'mixed', childhoodExperience: 'positive', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'someConcerns', history: 'mixed', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'family', domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'family' }  },
        { ref: 32, page1: { anyChildren: ['yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'yes' } , page3: { currentFamilyRelationship: 'unstable', childhoodExperience: 'negative', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'unhappy', history: 'unstable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'family', domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'partner' }  },
        { ref: 33, page1: { anyChildren: ['yesLiveWith', 'yesLiveElsewhere'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'sometimes' } , page3: { currentFamilyRelationship: 'unknown', childhoodExperience: 'mixed', behaviouralProblems: 'no', inARelationship: 'livingTogether', happyWithStatus: 'happy', history: 'stable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'partner', domesticAbuseVictim: null, domesticAbuseVictimType: null }  },
        { ref: 34, page1: { anyChildren: ['yesLiveWith', 'yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'no' } , page3: { currentFamilyRelationship: 'stable', childhoodExperience: 'negative', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'someConcerns', history: 'unstable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'partner', domesticAbuseVictim: 'no', domesticAbuseVictimType: null }  },
        { ref: 35, page1: { anyChildren: ['yesLiveElsewhere', 'yesVisitRegularly'] } , page2: { parentingResponsibilities: 'yes', manageParenting: 'unknown' } , page3: { currentFamilyRelationship: 'mixed', childhoodExperience: 'unknown', behaviouralProblems: 'no', inARelationship: 'no', happyWithStatus: 'unhappy', history: 'mixed', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'partner', domesticAbuseVictim: 'yes', domesticAbuseVictimType: null }  },
        { ref: 36, page1: { anyChildren: ['no'] } , page2: null , page3: { currentFamilyRelationship: 'unstable', childhoodExperience: 'positive', behaviouralProblems: 'yes', inARelationship: 'livingTogether', happyWithStatus: 'someConcerns', history: 'unstable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'partner', domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'both' }  },
        { ref: 37, page1: { anyChildren: ['no'] } , page2: null , page3: { currentFamilyRelationship: 'unknown', childhoodExperience: 'negative', behaviouralProblems: 'no', inARelationship: 'notLivingTogether', happyWithStatus: 'unhappy', history: 'stable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'partner', domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'family' }  },
        { ref: 38, page1: { anyChildren: ['no'] } , page2: null , page3: { currentFamilyRelationship: 'stable', childhoodExperience: 'mixed', behaviouralProblems: 'yes', inARelationship: 'notLivingTogether', happyWithStatus: 'unhappy', history: 'unstable', domesticAbusePerpetrator: 'yes', domesticAbusePerpetratorType: 'partner', domesticAbuseVictim: 'yes', domesticAbuseVictimType: 'partner' }  },    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Personal relationships and community', true)
        // Back to the start, depending where the previous scenario ended
        for (let i = 1; i < startPage; i++) {
            await san.relationships.previous()
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

    expect(failed).toBe(0)

    // Complete everything needed for PA
    await san.gotoSan('Personal relationships and community', true)
    await san.relationships.page3.currentFamilyRelationship.setValue('stable')
    await san.relationships.page3.childhoodExperience.setValue('positive')
    await san.relationships.page3.behaviouralProblems.setValue('no')
    await san.relationships.page3.communities.setValue('yes')
    await san.relationships.page3.inARelationship.setValue('no')
    await san.relationships.page3.happyWithStatus.setValue('happy')
    await san.relationships.page3.history.setValue('stable')
    await san.relationships.page3.domesticAbusePerpetrator.setValue('no')
    await san.relationships.page3.domesticAbuseVictim.setValue('no')
    await san.relationships.page3.wantChanges.setValue('madeChanges')
    await san.relationships.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, san.relationships, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.relationships.page1.anyChildren.setValue(test.page1.anyChildren)
    startPage = 1
    if (test.page2 && !test.page1.anyChildren?.includes('no')) {
        await san.relationships.saveAndContinue()
        await san.relationships.page2.parentingResponsibilities.setValue(test.page2.parentingResponsibilities)
        await san.relationships.page2.manageParenting.setValue(test.page2.manageParenting)
        startPage = 2
    }
    if (test.page3) {
        await san.relationships.saveAndContinue()
        await san.relationships.page3.currentFamilyRelationship.setValue(test.page3.currentFamilyRelationship)
        await san.relationships.page3.childhoodExperience.setValue(test.page3.childhoodExperience)
        await san.relationships.page3.behaviouralProblems.setValue(test.page3.behaviouralProblems)
        await san.relationships.page3.inARelationship.setValue(test.page3.inARelationship)
        await san.relationships.page3.happyWithStatus.setValue(test.page3.happyWithStatus)
        await san.relationships.page3.history.setValue(test.page3.history)
        await san.relationships.page3.domesticAbusePerpetrator.setValue(test.page3.domesticAbusePerpetrator)
        await san.relationships.page3.domesticAbusePerpetratorType.setValue(test.page3.domesticAbusePerpetratorType)
        await san.relationships.page3.domesticAbuseVictim.setValue(test.page3.domesticAbuseVictim)
        await san.relationships.page3.domesticAbuseVictimType.setValue(test.page3.domesticAbuseVictimType)
        if (test.page2) {  // Might skip 2 straight to 3
            startPage = 3
        } else {
            startPage = 2
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

    if (test.page3?.domesticAbusePerpetrator == 'yes' || test.page3?.domesticAbuseVictim == 'yes') {
        return 'YES'
    }
    if (test.page3?.domesticAbusePerpetrator == 'no' || test.page3?.domesticAbuseVictim == 'no') {
        return 'NO'
    }
    return null
}

function mapping6_7_1_1da(test: TestCase): string {  // Victim - partner

    switch (test.page3?.domesticAbuseVictim) {
        case 'yes':
            switch (test.page3?.domesticAbuseVictimType) {
                case 'partner':
                case 'both':
                    return 'YES'
                case 'family':
                    return 'NO'
                default:
                    return null
            }
        case 'no':
            return 'NO'
        default:
            return null
    }
}

function mapping6_7_1_2da(test: TestCase): string {  // Victim - family

    switch (test.page3?.domesticAbuseVictim) {
        case 'yes':
            switch (test.page3?.domesticAbuseVictimType) {
                case 'family':
                case 'both':
                    return 'YES'
                case 'partner':
                    return 'NO'
                default:
                    return null
            }
        case 'no':
            return 'NO'
        default:
            return null
    }
}

function mapping6_7_2_1da(test: TestCase): string {  // Perp - partner

    switch (test.page3?.domesticAbusePerpetrator) {
        case 'yes':
            switch (test.page3?.domesticAbusePerpetratorType) {
                case 'partner':
                case 'both':
                    return 'YES'
                case 'family':
                    return 'NO'
                default:
                    return null
            }
        case 'no':
            return 'NO'
        default:
            return null
    }
}

function mapping6_7_2_2da(test: TestCase): string { // Perp = family

    switch (test.page3?.domesticAbusePerpetrator) {
        case 'yes':
            switch (test.page3?.domesticAbusePerpetratorType) {
                case 'family':
                case 'both':
                    return 'YES'
                case 'partner':
                    return 'NO'
                default:
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

    switch (test.page2?.manageParenting) {
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
