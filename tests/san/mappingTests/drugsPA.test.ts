import { test, Oasys, User, Offender, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './xMappingTest'

type TextType = 'normal' | 'max' | 'empty'
type Motivation = 'noMotivation' | 'someMotivation' | 'motivated' | 'unknown'
type TestCase = {
    ref: number, strengths: boolean, riskOfHarm: boolean, riskOfReoffending: boolean,
    strengthsText: TextType, riskOfHarmText: TextType, riskOfReoffendingText: TextType,
    motivated: Motivation
}


test('Mapping test for drugs practitioner analysis', async ({ oasys, user, offender, assessment, san }) => {

    await paTest(oasys, user, offender, assessment, san)
})

async function paTest(oasys: Oasys, user: User, offender: Offender, assessment: Assessment, san: San) {

    // Get offender details (run aaSanMappingTestOffender if required to create the offender)

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

    let failed = false
    const testCases: TestCase[] =
        [
            { ref: 1, strengths: true, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal', motivated: null },
            { ref: 2, strengths: false, riskOfHarm: true, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal', motivated: 'motivated' },
            { ref: 3, strengths: false, riskOfHarm: false, riskOfReoffending: true, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal', motivated: 'someMotivation' },
            { ref: 4, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal', motivated: 'noMotivation' },
            { ref: 5, strengths: true, riskOfHarm: true, riskOfReoffending: true, strengthsText: 'max', riskOfHarmText: 'max', riskOfReoffendingText: 'max', motivated: 'unknown' },
            { ref: 6, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'empty', riskOfHarmText: 'empty', riskOfReoffendingText: 'empty', motivated: 'motivated' },
            { ref: 7, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'empty', riskOfHarmText: 'normal', riskOfReoffendingText: 'normal', motivated: 'someMotivation' },
            { ref: 8, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'empty', riskOfReoffendingText: 'normal', motivated: 'noMotivation' },
            { ref: 9, strengths: false, riskOfHarm: false, riskOfReoffending: false, strengthsText: 'normal', riskOfHarmText: 'normal', riskOfReoffendingText: 'empty', motivated: 'unknown' },
        ]

    for (const test of testCases) {

        // Get to the right starting screen

        if (test.ref == 1) {
            await san.gotoSan('Drug use', true)
            await san.drugs1.everUsed.setValue('yes')  // Need to set this otherwise the motivation question doesn't get returned
            await san.drugs1.saveAndContinue.click()
            await san.drugs2.drugType.setValue(['cannabis'])
            await san.drugs2.cannabisLastSixMonths.setValue('no')
            await san.drugs2.saveAndContinue.click()
            await san.drugs3.detailsNotLastSixMonths.setValue('details')
            await san.drugs3.treatment.setValue('no')
            await san.drugs3.saveAndContinue.click()
            await san.drugs4.whyStarted.setValue(['cultural'])
            await san.drugs4.impactDrugs.setValue(['behavioural'])
            await san.drugs4.wantChanges.setValue('madeChanges')
            await san.drugs4.saveAndContinue.click()
            await san.informationSummary.analysis.click()
        } else {
            await san.gotoSan('Drug use', true)
            await san.informationSummary.analysis.click()
            if (test.ref > 2) {
                await san.drugsPractitionerAnalysis.change.click()
            }
        }

        // Set values on SAN, return to OASys and check the results
        await scenario(test, san)
        await san.returnToOASys()
        await oasys.clickButton('Previous', true)
        await oasys.clickButton('Next', true)

        log('', JSON.stringify(test))
        const scenarioFailed = await checkAnswers(assessmentPk, test, assessment)
        if (scenarioFailed) {
            failed = true
        }
        console.log(`Ref ${test.ref} ${scenarioFailed ? 'FAILED' : 'Passed'}`)
    }

    expect(failed).toBeFalsy()
}

async function scenario(test: TestCase, san: San) {

    await san.drugsPractitionerAnalysis.motivatedToStop.setValue(test.motivated)
    await setValues('strengths', test, san)
    await setValues('riskOfHarm', test, san)
    await setValues('riskOfReoffending', test, san)
    await san.drugsPractitionerAnalysis.saveAndContinue.click()
}

async function setValues(question: 'strengths' | 'riskOfHarm' | 'riskOfReoffending', test: TestCase, san: San) {

    if (test[question]) {
        await san.drugsPractitionerAnalysis[question].setValue('yes')
        await san.drugsPractitionerAnalysis[`${question}YesDetails`].setValue(getText(question, true, test[`${question}Text`]))
    } else {
        await san.drugsPractitionerAnalysis[question].setValue('no')
        await san.drugsPractitionerAnalysis[`${question}NoDetails`].setValue(getText(question, false, test[`${question}Text`]))
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

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    /*
        8.8: motivation - 0/1/2/M
        8.97: combined text
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

        8.98: risk of harm - YES or NO
        8.99: risk of reoffending - YES or NO
        8_SAN_STRENGTH: strenthgs - YES or NO
        SMD_SAN_SECTION_COMP: section complete - YES or NO
    */

    const motivation = test.motivated == 'motivated' ? '0'
        : test.motivated == 'someMotivation' ? '1'
            : test.motivated == 'noMotivation' ? '2'
                : test.motivated == 'unknown' ? 'M' : null

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
    /*
    
        If riskSeriousHarmText <> "" And riskReoffendingText <> "" Then
            riskSeriousHarmText = riskSeriousHarmText & vbNewLine
        End If
        
        x_97 = strengthsText & riskSeriousHarmText & riskReoffendingText
        If x_97 = "" Then x_97 = "null"
    */

    const expectedAnswers: OasysAnswer[] = [
        { section: '8', q: '8.8', a: motivation },
        { section: '8', q: '8.97', a: text },
        { section: '8', q: '8.98', a: test.riskOfHarm == null ? null : test.riskOfHarm ? 'YES' : 'NO' },
        { section: '8', q: '8.99', a: test.riskOfReoffending == null ? null : test.riskOfReoffending ? 'YES' : 'NO' },
        { section: '8', q: '8_SAN_STRENGTH', a: test.strengths == null ? null : test.strengths ? 'YES' : 'NO' },
    ]

    const result = await assessment.queries.checkSectionAnswers(assessmentPk, '8', expectedAnswers, true)
    return result
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