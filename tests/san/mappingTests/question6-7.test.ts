import { test, Oasys, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'


type AbuseOptions = 'yes' | 'no'
type AbuseTypeOptions = 'family' | 'partner' | 'both'
type AnswerType = 'YES' | 'NO'
type TestCase = {
    i: number,
    victim: AbuseOptions, victimType: AbuseTypeOptions,
    perp: AbuseOptions, perpType: AbuseTypeOptions,
    a67: AnswerType, a67VicPartner: AnswerType, a67VicFamily: AnswerType, a67PerpPartner: AnswerType, a67PerpFamily: AnswerType
}


test.describe.configure({ retries: 1 })
test('Mapping test AAP question 6.7', async ({ oasys, user, offender, assessment, san, }) => {

    let failed = false

    const mappingTestOffender = await getMappingTestOffender()

    const testCases: TestCase[] =
        [
            { i: 1, victim: 'no', victimType: null, perp: 'no', perpType: null, a67: 'NO', a67VicPartner: 'NO', a67VicFamily: 'NO', a67PerpPartner: 'NO', a67PerpFamily: 'NO' },
            { i: 2, victim: 'no', victimType: null, perp: 'yes', perpType: 'both', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'NO', a67PerpPartner: 'YES', a67PerpFamily: 'YES' },
            { i: 3, victim: 'no', victimType: null, perp: 'yes', perpType: 'family', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'NO', a67PerpPartner: 'NO', a67PerpFamily: 'YES' },
            { i: 4, victim: 'no', victimType: null, perp: 'yes', perpType: 'partner', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'NO', a67PerpPartner: 'YES', a67PerpFamily: 'NO' },
            { i: 5, victim: 'yes', victimType: 'both', perp: 'no', perpType: null, a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'YES', a67PerpPartner: 'NO', a67PerpFamily: 'NO' },
            { i: 6, victim: 'yes', victimType: 'both', perp: 'yes', perpType: 'both', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'YES', a67PerpPartner: 'YES', a67PerpFamily: 'YES' },
            { i: 7, victim: 'yes', victimType: 'both', perp: 'yes', perpType: 'family', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'YES', a67PerpPartner: 'NO', a67PerpFamily: 'YES' },
            { i: 8, victim: 'yes', victimType: 'both', perp: 'yes', perpType: 'partner', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'YES', a67PerpPartner: 'YES', a67PerpFamily: 'NO' },
            { i: 9, victim: 'yes', victimType: 'family', perp: 'no', perpType: null, a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'YES', a67PerpPartner: 'NO', a67PerpFamily: 'NO' },
            { i: 10, victim: 'yes', victimType: 'family', perp: 'yes', perpType: 'both', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'YES', a67PerpPartner: 'YES', a67PerpFamily: 'YES' },
            { i: 11, victim: 'yes', victimType: 'family', perp: 'yes', perpType: 'family', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'YES', a67PerpPartner: 'NO', a67PerpFamily: 'YES' },
            { i: 12, victim: 'yes', victimType: 'family', perp: 'yes', perpType: 'partner', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'YES', a67PerpPartner: 'YES', a67PerpFamily: 'NO' },
            { i: 13, victim: 'yes', victimType: 'partner', perp: 'no', perpType: null, a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'NO', a67PerpPartner: 'NO', a67PerpFamily: 'NO' },
            { i: 14, victim: 'yes', victimType: 'partner', perp: 'yes', perpType: 'both', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'NO', a67PerpPartner: 'YES', a67PerpFamily: 'YES' },
            { i: 15, victim: 'yes', victimType: 'partner', perp: 'yes', perpType: 'family', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'NO', a67PerpPartner: 'NO', a67PerpFamily: 'YES' },
            { i: 16, victim: 'yes', victimType: 'partner', perp: 'yes', perpType: 'partner', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'NO', a67PerpPartner: 'YES', a67PerpFamily: 'NO' },
        ]

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.deleteLatest()
    await user.logout()

    await user.prob.probSanUnappr.login()
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    const assessmentPk = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    let first = true

    for (const test of testCases) {

        await san.gotoSan('Offence analysis', true)
        if (first) {
            first = false
            await san.offenceAnalysis.page1.offenceDescription.setValue('Offence')
            await san.offenceAnalysis.page1.offenceElements.setValue(['none'])
            await san.offenceAnalysis.page1.reason.setValue('Reason')
            await san.offenceAnalysis.page1.motivations.setValue(['addictions'])
            await san.offenceAnalysis.page1.victimType.setValue(['other'])
            await san.offenceAnalysis.page1.victimTypeDetails.setValue('Victim details')
            await san.offenceAnalysis.saveAndContinue()
            await san.offenceAnalysis.page2.howManyOthers.setValue('0')
            await san.offenceAnalysis.saveAndContinue()
            await san.offenceAnalysis.page3.impact.setValue('no')
            await san.offenceAnalysis.page3.responsibility.setValue('yes')
            await san.offenceAnalysis.page3.responsibilityYesDetails.setValue('Details')
            await san.offenceAnalysis.page3.patterns.setValue('Patterns')
            await san.offenceAnalysis.page3.escalation.setValue('no')
            await san.offenceAnalysis.page3.riskSeriousHarm.setValue('no')
            await san.offenceAnalysis.page3.riskSeriousHarmNoDetails.setValue('Details')

        } else {
            await san.offenceAnalysis.backToStart()
            await san.offenceAnalysis.saveAndContinue()
            await san.offenceAnalysis.saveAndContinue()
        }

        await setOptions(test.perp, test.perpType, test.victim, test.victimType, san)
        log('', JSON.stringify(test))
        console.log(JSON.stringify(test))

        const caseFailed = await checkMapping(assessmentPk, test, oasys, assessment, san)
        if (caseFailed) {
            failed = true
            console.log('failed')
        }
    }

    await user.logout()
    expect(failed).toBeFalsy()
})

async function setOptions(perp: AbuseOptions, perpType: AbuseTypeOptions, victim: AbuseOptions, victimType: AbuseTypeOptions, san: San) {

    await san.offenceAnalysis.page3.domesticAbusePerpetrator.setValue(perp)
    if (perp == 'yes') {
        await san.offenceAnalysis.page3.domesticAbusePerpetratorType.setValue(perpType)
        switch (perpType) {
            case 'family':
                await san.offenceAnalysis.page3.familyPerpetratorDetails.setValue('details')
                break
            case 'partner':
                await san.offenceAnalysis.page3.partnerPerpetratorDetails.setValue('details')
                break
            case 'both':
                await san.offenceAnalysis.page3.bothPerpetratorDetails.setValue('details')
                break
        }
    }
    await san.offenceAnalysis.page3.domesticAbuseVictim.setValue(victim)
    if (victim == 'yes') {
        await san.offenceAnalysis.page3.domesticAbuseVictimType.setValue(victimType)
        switch (victimType) {
            case 'family':
                await san.offenceAnalysis.page3.familyVictimDetails.setValue('details')
                break
            case 'partner':
                await san.offenceAnalysis.page3.partnerVictimDetails.setValue('details')
                break
            case 'both':
                await san.offenceAnalysis.page3.bothVictimDetails.setValue('details')
                break
        }
    }
    await san.offenceAnalysis.saveAndContinue()
}

async function checkMapping(assessmentPk: number, test: TestCase, oasys: Oasys, assessment: Assessment, san: San): Promise<boolean> {

    await san.returnToOASys()
    await oasys.clickButton('Previous', true)
    await oasys.clickButton('Next', true)

    return await assessment.queries.checkSectionAnswers(assessmentPk, '6', [
        { section: '6', q: '6.7da', a: test.a67 },
        { section: '6', q: '6.7.1.1da', a: test.a67VicPartner },
        { section: '6', q: '6.7.1.2da', a: test.a67VicFamily },
        { section: '6', q: '6.7.2.1da', a: test.a67PerpPartner },
        { section: '6', q: '6.7.2.2da', a: test.a67PerpFamily },
    ])
}