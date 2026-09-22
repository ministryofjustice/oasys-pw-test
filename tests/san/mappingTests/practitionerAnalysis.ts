import { Page } from '@playwright/test'

import { Oasys, Assessment, San } from 'fixtures'
import { PractitionerAnalysis, SanSections } from 'fixtures/san/pages'

type TextType = 'normal' | 'max' | 'empty'
type TestCase = {
    ref: number,
    strengths: boolean, riskOfHarm: boolean, riskOfReoffending: boolean,
    strengthsText: TextType, riskOfHarmText: TextType, riskOfReoffendingText: TextType
}

/**
 * Run the practitioner analysis tests for any SAN section
 */
export async function paTest(assessmentPk: number, sanSection: SanSection, page: Page, oasys: Oasys, assessment: Assessment, san: San) {

    const practitionerAnalysis = new PractitionerAnalysis(page, sanSection, sanIdPrefixLookup[sanSection])
    let failed = false
    const testCases: TestCase[] =
        [
            { ref: 1, strengths: true, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal' },
            { ref: 2, strengths: false, riskOfHarm: true, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal' },
            { ref: 3, strengths: false, riskOfHarm: false, riskOfReoffending: true, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal' },
            { ref: 4, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal' },
            { ref: 5, strengths: true, riskOfHarm: true, riskOfReoffending: true, strengthsText: 'max', riskOfHarmText: 'max', riskOfReoffendingText: 'max' },
            { ref: 6, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'empty', riskOfHarmText: 'empty', riskOfReoffendingText: 'empty' },
            { ref: 7, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'empty', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal' },
            { ref: 8, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'empty', riskOfReoffendingText: 'normal' },
            { ref: 9, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'empty' },
        ]

    log('', 'Practitioner analysis')
    console.log('')
    console.log('Practitioner analysis')

    for (const test of testCases) {

        // Get to the right starting screen
        await san.gotoSan(sanSection, true)
        await san.practitionerAnalysis()
        if (test.ref > 1) {
            await san.change()
        }

        // Set values on SAN, return to OASys and check the results
        await scenario(test, practitionerAnalysis)
        await san.markAsComplete()
        await san.returnToOASys()
        await oasys.clickButton('Previous', true)
        await oasys.clickButton('Next', true)

        log(JSON.stringify(test))
        const scenarioFailed = await checkAnswers(assessmentPk, sanSection, test, assessment)
        if (scenarioFailed) {
            failed = true
        }
        console.log(`Ref ${test.ref} ${scenarioFailed ? 'FAILED' : 'Passed'}`)
    }

    expect(failed).toBeFalsy()
}

async function scenario(test: TestCase, practitionerAnalysis: PractitionerAnalysis) {

    await setValues('strengths', test, practitionerAnalysis)
    await setValues('riskOfHarm', test, practitionerAnalysis)
    await setValues('riskOfReoffending', test, practitionerAnalysis)
}

async function setValues(question: 'strengths' | 'riskOfHarm' | 'riskOfReoffending', test: TestCase, practitionerAnalysis: PractitionerAnalysis) {

    if (test[question]) {
        await practitionerAnalysis[question].setValue('yes')
        await practitionerAnalysis[`${question}YesDetails`].setValue(getText(question, true, test[`${question}Text`]))
    } else {
        await practitionerAnalysis[question].setValue('no')
        await practitionerAnalysis[`${question}NoDetails`].setValue(getText(question, false, test[`${question}Text`]))
    }
}

function getText(question: 'strengths' | 'riskOfHarm' | 'riskOfReoffending', yes: boolean, textType: 'normal' | 'max' | 'empty'): string {

    switch (textType) {
        case 'normal':
            return `${question} text - ${yes ? 'yes' : 'no'} selected`
        case 'max':
            return utils.oasysString(question == 'riskOfReoffending' ? 1000 : 1425)
        case 'empty':
            return ''
    }
}

async function checkAnswers(assessmentPk: number, sanSection: SanSection, test: TestCase, assessment: Assessment): Promise<boolean> {

    /*
        x.97: combined text
            if riskOfHarm
                'Area linked to serious harm notes - ' + relevant text + newline
            else
                'Area not linked to serious harm notes - ' + relevant text + newline

            if strengths
                'Strengths and protective factor notes - ' + relevant text + newline
            else
                'Area not linked to strengths and positive factors notes - ' + relevant text + newline

            if riskOfReoffending
                'Risk of reoffending notes - ' + relevant text
            else
                'Area not linked to reoffending notes - ' + relevant text

        x.98: risk of harm - YES or NO
        x.99: risk of reoffending - YES or NO
        x_SAN_STRENGTH: strengths - YES or NO
        xx_SAN_SECTION_COMPLETE - YES or NO
    */

    let text: string = null
    if (test.strengthsText != 'empty' || test.riskOfHarmText != 'empty' || test.riskOfReoffendingText != 'empty') {
        let strengthsText = answerText('strengths', test)
        let riskOfHarmText = answerText('riskOfHarm', test)
        const riskOfReoffendingText = answerText('riskOfReoffending', test)

        if (strengthsText != '' && `${riskOfHarmText}${riskOfReoffendingText}` != '') {
            strengthsText = `${strengthsText}\n`
        }
        if (riskOfHarmText != '' && riskOfReoffendingText != '') {
            riskOfHarmText = `${riskOfHarmText}\n`
        }
        text = `${strengthsText}${riskOfHarmText}${riskOfReoffendingText}`
    }

    const oasysSection = oasysSectionLookup[sanSection]

    const issuesQuestion = sanSection == 'Employment and education' ? '.94' : '.97'
    const harmQuestion = sanSection == 'Employment and education' ? '.96' : '.98'
    const reoffendingQuestion = sanSection == 'Employment and education' ? '.98' : '.99'

    const expectedSectionAnswers: OasysAnswer[] = [
        { q: `${oasysSection}${issuesQuestion}`, a: text },
        { q: `${oasysSection}${harmQuestion}`, a: test.riskOfHarm == null ? null : test.riskOfHarm ? 'YES' : 'NO' },
        { q: `${oasysSection}${reoffendingQuestion}`, a: test.riskOfReoffending == null ? null : test.riskOfReoffending ? 'YES' : 'NO' },
    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: `${sanCompletionPrefixLookup[sanSection]}_SAN_SECTION_COMP`, a: 'YES' },
    ]

    if (sanSection == 'Thinking, behaviours and attitudes') {
        expectedSanSectionAnswers.push({ q: `TBA_SAN_STRENGTH`, a: test.strengths == null ? null : test.strengths ? 'YES' : 'NO' })
    } else {
        expectedSectionAnswers.push({ q: `${oasysSection}_SAN_STRENGTH`, a: test.strengths == null ? null : test.strengths ? 'YES' : 'NO' })
    }

    let sectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, oasysSection, expectedSectionAnswers, true)
    if (sanSection == 'Thinking, behaviours and attitudes') {
        const expectedSection11Answers: OasysAnswer[] = [
            { q: `11${issuesQuestion}`, a: text },
            { q: `11${harmQuestion}`, a: test.riskOfHarm == null ? null : test.riskOfHarm ? 'YES' : 'NO' },
            { q: `11${reoffendingQuestion}`, a: test.riskOfReoffending == null ? null : test.riskOfReoffending ? 'YES' : 'NO' },
        ]
        const expectedSection12Answers: OasysAnswer[] = [
            { q: `12${issuesQuestion}`, a: text },
            { q: `12${harmQuestion}`, a: test.riskOfHarm == null ? null : test.riskOfHarm ? 'YES' : 'NO' },
            { q: `12${reoffendingQuestion}`, a: test.riskOfReoffending == null ? null : test.riskOfReoffending ? 'YES' : 'NO' },
        ]
        const section11Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '11', expectedSection11Answers, true)
        const section12Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '12', expectedSection12Answers, true)
        sectionFailed = sectionFailed || section11Failed || section12Failed
    }

    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return sectionFailed || sanSectionFailed
}

function answerText(question: 'strengths' | 'riskOfHarm' | 'riskOfReoffending', test: TestCase): string {

    const yesPrefix = {
        strengths: 'Strengths and protective factor notes - ',
        riskOfHarm: 'Area linked to serious harm notes - ',
        riskOfReoffending: 'Risk of reoffending notes - ',
    }
    const noPrefix = {
        strengths: 'Area not linked to strengths and positive factors notes - ',
        riskOfHarm: 'Area not linked to serious harm notes - ',
        riskOfReoffending: 'Area not linked to reoffending notes - ',
    }

    return test[`${question}Text`] == 'empty'
        ? ''
        : `${test[question]
            ? yesPrefix[question]
            : noPrefix[question]}${getText(question, test[question], test[`${question}Text`])}`
}

const sanIdPrefixLookup: { [key in SanSection]: string } = {
    'Accommodation': 'accommodation',
    'Employment and education': 'employment_education',
    'Finances': 'finance',
    'Drug use': 'drug_use',
    'Alcohol use': 'alcohol_use',
    'Health and wellbeing': 'health_wellbeing',
    'Personal relationships and community': 'personal_relationships_community',
    'Thinking, behaviours and attitudes': 'thinking_behaviours_attitudes',
    'Offence analysis': '',
    'Sentence plan': '',
}

const sanCompletionPrefixLookup: { [key in SanSection]: string } = {
    'Accommodation': 'AC',
    'Employment and education': 'EE',
    'Finances': 'FI',
    'Drug use': 'SMD',
    'Alcohol use': 'SMA',
    'Health and wellbeing': 'HW',
    'Personal relationships and community': 'PRC',
    'Thinking, behaviours and attitudes': 'TBA',
    'Offence analysis': 'OA',
    'Sentence plan': '',
}

const oasysSectionLookup: { [key in SanSection]: string } = {
    'Accommodation': '3',
    'Employment and education': '4',
    'Finances': '5',
    'Drug use': '8',
    'Alcohol use': '9',
    'Health and wellbeing': '10',
    'Personal relationships and community': '6',
    'Thinking, behaviours and attitudes': '7',  // Plus 11 and 12
    'Offence analysis': '2',
    'Sentence plan': '',
}