import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page1: {
        evidenceCurrentIssues: EvidenceCurrentIssues,
    },
    page2: {
        bingeDrinking: BingeDrinking,
        pastIssues: SanYesNo,
    }
}

let startPage = 1 // Page that SAN will go back into when opening the section, depends on last page reached in previous scenario

test.describe.configure({ retries: 1 })
test('Mapping test V2: alcohol', async ({ oasys, user, offender, assessment, san }) => {

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
        { ref: 1, page1: { evidenceCurrentIssues: null } , page2: null  },
        { ref: 2, page1: { evidenceCurrentIssues: 'neverDrank' } , page2: null  },
        { ref: 3, page1: { evidenceCurrentIssues: 'noCurrentProblems' } , page2: null  },
        { ref: 4, page1: { evidenceCurrentIssues: 'noCurrentProblems' } , page2: { bingeDrinking: 'noEvidence', pastIssues: 'no' }  },
        { ref: 5, page1: { evidenceCurrentIssues: 'noCurrentProblems' } , page2: { bingeDrinking: 'someEvidence', pastIssues: 'yes' }  },
        { ref: 6, page1: { evidenceCurrentIssues: 'noCurrentProblems' } , page2: { bingeDrinking: 'evidence', pastIssues: 'no' }  },
        { ref: 7, page1: { evidenceCurrentIssues: 'someProblems' } , page2: null  },
        { ref: 8, page1: { evidenceCurrentIssues: 'someProblems' } , page2: { bingeDrinking: 'noEvidence', pastIssues: 'yes' }  },
        { ref: 9, page1: { evidenceCurrentIssues: 'someProblems' } , page2: { bingeDrinking: 'someEvidence', pastIssues: 'no' }  },
        { ref: 10, page1: { evidenceCurrentIssues: 'someProblems' } , page2: { bingeDrinking: 'evidence', pastIssues: 'yes' }  },
        { ref: 11, page1: { evidenceCurrentIssues: 'significant' } , page2: null  },
        { ref: 12, page1: { evidenceCurrentIssues: 'significant' } , page2: { bingeDrinking: 'noEvidence', pastIssues: 'yes' }  },
        { ref: 13, page1: { evidenceCurrentIssues: 'significant' } , page2: { bingeDrinking: 'someEvidence', pastIssues: 'no' }  },
        { ref: 14, page1: { evidenceCurrentIssues: 'significant' } , page2: { bingeDrinking: 'evidence', pastIssues: 'yes' }  },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Alcohol use', true)
        for (let i = 1; i < startPage; i++) {
            await san.alcohol.previous()
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
    await san.gotoSan('Alcohol use', true)
    await san.alcohol.page2.bingeDrinking.setValue('noEvidence')
    await san.alcohol.page2.pastIssues.setValue('no')
    await san.alcohol.page2.anythingHelpedAlcohol.setValue('no')
    await san.alcohol.page2.wantChanges.setValue('madeChanges')
    await san.alcohol.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, san.alcohol, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.alcohol.page1.evidenceCurrentIssues.setValue(test.page1.evidenceCurrentIssues)
    if (test.page2) {
        await san.alcohol.saveAndContinue()
        await san.alcohol.page2.bingeDrinking.setValue(test.page2.bingeDrinking)
        startPage = 2
    } else {
        startPage = 1
    }
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section9Answers: OasysAnswer[] = [
        { q: '9.1', a: mapping9_1(test) },
        { q: '9.1.t', a: null },
        { q: '9.2', a: mapping9_2(test) },
        { q: '9.3', a: null },
        { q: '9.4', a: null },
        { q: '9.5', a: null },
        { q: '9.97', a: mapping9_97(test) },
        { q: '9.98', a: mapping9_98(test) },
        { q: '9.99', a: mapping9_99(test) },
        { q: '9_SAN_STRENGTH', a: null },
    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'AC_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section9Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '9', section9Answers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section9Failed || sanSectionFailed
}


function mapping9_1(test: TestCase): string {

    switch (test.page1.evidenceCurrentIssues) {
        case 'significant':
            return '2'
        case 'someProblems':
            return '1'
        case 'noCurrentProblems':
        case 'neverDrank':
            return '0'
        default:
            return null
    }
}

function mapping9_2(test: TestCase): string {

    if (test.page1.evidenceCurrentIssues == 'neverDrank' || test.page1.evidenceCurrentIssues == 'noCurrentProblems') {
        return '0'
    }
    switch (test.page2?.bingeDrinking) {
        case 'noEvidence':
            return '0'
        case 'someEvidence':
            return '1'
        case 'evidence':
            return '2'
        default:
            return null
    }

}

function mapping9_97(test: TestCase): string {

    return (test.page1.evidenceCurrentIssues == 'neverDrank' || (test.page1.evidenceCurrentIssues == 'noCurrentProblems' && test.page2?.pastIssues == 'no')) ? 'No issues identified' : null
}

function mapping9_98(test: TestCase): string {

    return (test.page1.evidenceCurrentIssues == 'neverDrank' || (test.page1.evidenceCurrentIssues == 'noCurrentProblems' && test.page2?.pastIssues == 'no')) ? 'NO' : null
}

function mapping9_99(test: TestCase): string {

    return (test.page1.evidenceCurrentIssues == 'neverDrank' || (test.page1.evidenceCurrentIssues == 'noCurrentProblems' && test.page2?.pastIssues == 'no')) ? 'NO' : null
}

