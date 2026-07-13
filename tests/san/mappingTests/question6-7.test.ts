import { test, Oasys, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './xMappingTest'


type AbuseOptions = 'yes' | 'no'
type AbuseTypeOptions = 'family' | 'partner' | 'both'
type AnswerType = 'YES' | 'NO'
type TestCase = {
    i: number, reset: boolean,
    victim: AbuseOptions, victimType: AbuseTypeOptions,
    perp: AbuseOptions, perpType: AbuseTypeOptions,
    a67: AnswerType, a67VicPartner: AnswerType, a67VicFamily: AnswerType, a67PerpPartner: AnswerType, a67PerpFamily: AnswerType
}



test('Mapping test for question 6.7', async ({ oasys, user, offender, assessment, san, }) => {

    /*

    */

    let failed = false

    const mappingTestOffender = await getMappingTestOffender()

    const testCases: TestCase[] =
        [
            { i: 1, reset: true, victim: null, victimType: null, perp: null, perpType: null, a67: null, a67VicPartner: null, a67VicFamily: null, a67PerpPartner: null, a67PerpFamily: null},
            { i: 2, reset: false, victim: null, victimType: null, perp: 'no', perpType: null, a67: null, a67VicPartner: null, a67VicFamily: null, a67PerpPartner: 'NO', a67PerpFamily: 'NO'},
            { i: 3, reset: false, victim: null, victimType: null, perp: 'yes', perpType: null, a67: 'YES', a67VicPartner: null, a67VicFamily: null, a67PerpPartner: null, a67PerpFamily: null},
            { i: 4, reset: false, victim: null, victimType: null, perp: 'yes', perpType: 'both', a67: 'YES', a67VicPartner: null, a67VicFamily: null, a67PerpPartner: 'YES', a67PerpFamily: 'YES'},
            { i: 5, reset: false, victim: null, victimType: null, perp: 'yes', perpType: 'family', a67: 'YES', a67VicPartner: null, a67VicFamily: null, a67PerpPartner: 'NO', a67PerpFamily: 'YES'},
            { i: 6, reset: false, victim: null, victimType: null, perp: 'yes', perpType: 'partner', a67: 'YES', a67VicPartner: null, a67VicFamily: null, a67PerpPartner: 'YES', a67PerpFamily: 'NO'},
            { i: 7, reset: true, victim: 'no', victimType: null, perp: null, perpType: null, a67: null, a67VicPartner: 'NO', a67VicFamily: 'NO', a67PerpPartner: null, a67PerpFamily: null},
            { i: 8, reset: false, victim: 'no', victimType: null, perp: 'no', perpType: null, a67: 'NO', a67VicPartner: 'NO', a67VicFamily: 'NO', a67PerpPartner: 'NO', a67PerpFamily: 'NO'},
            { i: 9, reset: false, victim: 'no', victimType: null, perp: 'yes', perpType: null, a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'NO', a67PerpPartner: null, a67PerpFamily: null},
            { i: 10, reset: false, victim: 'no', victimType: null, perp: 'yes', perpType: 'both', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'NO', a67PerpPartner: 'YES', a67PerpFamily: 'YES'},
            { i: 11, reset: false, victim: 'no', victimType: null, perp: 'yes', perpType: 'family', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'NO', a67PerpPartner: 'NO', a67PerpFamily: 'YES'},
            { i: 12, reset: false, victim: 'no', victimType: null, perp: 'yes', perpType: 'partner', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'NO', a67PerpPartner: 'YES', a67PerpFamily: 'NO'},
            { i: 13, reset: true, victim: 'yes', victimType: null, perp: null, perpType: null, a67: 'YES', a67VicPartner: null, a67VicFamily: null, a67PerpPartner: null, a67PerpFamily: null},
            { i: 14, reset: false, victim: 'yes', victimType: null, perp: 'no', perpType: null, a67: 'YES', a67VicPartner: null, a67VicFamily: null, a67PerpPartner: 'NO', a67PerpFamily: 'NO'},
            { i: 15, reset: false, victim: 'yes', victimType: null, perp: 'yes', perpType: null, a67: 'YES', a67VicPartner: null, a67VicFamily: null, a67PerpPartner: null, a67PerpFamily: null},
            { i: 16, reset: false, victim: 'yes', victimType: null, perp: 'yes', perpType: 'both', a67: 'YES', a67VicPartner: null, a67VicFamily: null, a67PerpPartner: 'YES', a67PerpFamily: 'YES'},
            { i: 17, reset: false, victim: 'yes', victimType: null, perp: 'yes', perpType: 'family', a67: 'YES', a67VicPartner: null, a67VicFamily: null, a67PerpPartner: 'NO', a67PerpFamily: 'YES'},
            { i: 18, reset: false, victim: 'yes', victimType: null, perp: 'yes', perpType: 'partner', a67: 'YES', a67VicPartner: null, a67VicFamily: null, a67PerpPartner: 'YES', a67PerpFamily: 'NO'},
            { i: 19, reset: true, victim: 'yes', victimType: 'both', perp: null, perpType: null, a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'YES', a67PerpPartner: null, a67PerpFamily: null},
            { i: 20, reset: false, victim: 'yes', victimType: 'both', perp: 'no', perpType: null, a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'YES', a67PerpPartner: 'NO', a67PerpFamily: 'NO'},
            { i: 21, reset: false, victim: 'yes', victimType: 'both', perp: 'yes', perpType: null, a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'YES', a67PerpPartner: null, a67PerpFamily: null},
            { i: 22, reset: false, victim: 'yes', victimType: 'both', perp: 'yes', perpType: 'both', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'YES', a67PerpPartner: 'YES', a67PerpFamily: 'YES'},
            { i: 23, reset: false, victim: 'yes', victimType: 'both', perp: 'yes', perpType: 'family', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'YES', a67PerpPartner: 'NO', a67PerpFamily: 'YES'},
            { i: 24, reset: false, victim: 'yes', victimType: 'both', perp: 'yes', perpType: 'partner', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'YES', a67PerpPartner: 'YES', a67PerpFamily: 'NO'},
            { i: 25, reset: true, victim: 'yes', victimType: 'family', perp: null, perpType: null, a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'YES', a67PerpPartner: null, a67PerpFamily: null},
            { i: 26, reset: false, victim: 'yes', victimType: 'family', perp: 'no', perpType: null, a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'YES', a67PerpPartner: 'NO', a67PerpFamily: 'NO'},
            { i: 27, reset: false, victim: 'yes', victimType: 'family', perp: 'yes', perpType: null, a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'YES', a67PerpPartner: null, a67PerpFamily: null},
            { i: 28, reset: false, victim: 'yes', victimType: 'family', perp: 'yes', perpType: 'both', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'YES', a67PerpPartner: 'YES', a67PerpFamily: 'YES'},
            { i: 29, reset: false, victim: 'yes', victimType: 'family', perp: 'yes', perpType: 'family', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'YES', a67PerpPartner: 'NO', a67PerpFamily: 'YES'},
            { i: 30, reset: false, victim: 'yes', victimType: 'family', perp: 'yes', perpType: 'partner', a67: 'YES', a67VicPartner: 'NO', a67VicFamily: 'YES', a67PerpPartner: 'YES', a67PerpFamily: 'NO'},
            { i: 31, reset: true, victim: 'yes', victimType: 'partner', perp: null, perpType: null, a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'NO', a67PerpPartner: null, a67PerpFamily: null},
            { i: 32, reset: false, victim: 'yes', victimType: 'partner', perp: 'no', perpType: null, a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'NO', a67PerpPartner: 'NO', a67PerpFamily: 'NO'},
            { i: 33, reset: false, victim: 'yes', victimType: 'partner', perp: 'yes', perpType: null, a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'NO', a67PerpPartner: null, a67PerpFamily: null},
            { i: 34, reset: false, victim: 'yes', victimType: 'partner', perp: 'yes', perpType: 'both', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'NO', a67PerpPartner: 'YES', a67PerpFamily: 'YES'},
            { i: 35, reset: false, victim: 'yes', victimType: 'partner', perp: 'yes', perpType: 'family', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'NO', a67PerpPartner: 'NO', a67PerpFamily: 'YES'},
            { i: 36, reset: false, victim: 'yes', victimType: 'partner', perp: 'yes', perpType: 'partner', a67: 'YES', a67VicPartner: 'YES', a67VicFamily: 'NO', a67PerpPartner: 'YES', a67PerpFamily: 'NO'},
        ]

    let first = true
    let assessmentPk: number

    for (const test of testCases) {

        if (test.reset) {
            if (first) {
                first = false
            } else {
                await user.logout()
            }
            await user.admin.login(providers.prob.san)
            await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
            await assessment.deleteLatest()
            await user.logout()

            await user.prob.probSanUnappr.login()
            await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
            assessmentPk = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

            await san.gotoSan('Offence analysis', true)
            await san.offenceAnalysis1.offenceDescription.setValue('Offence')
            await san.offenceAnalysis1.offenceElements.setValue(['none'])
            await san.offenceAnalysis1.reason.setValue('Reason')
            await san.offenceAnalysis1.motivations.setValue(['addictions'])
            await san.offenceAnalysis1.victimType.setValue(['other'])
            await san.offenceAnalysis1.victimTypeDetails.setValue('Victim details')
            await san.offenceAnalysis1.saveAndContinue.click()
            await san.offenceAnalysis2.howManyOthers.setValue('0')
            await san.offenceAnalysis2.saveAndContinue.click()
        } else {
            await san.gotoSan('Offence analysis', true)
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

    await san.offenceAnalysis3.domesticAbusePerpertrator.setValue(perp)
    if (perp == 'yes') {
        await san.offenceAnalysis3.domesticAbusePerpertratorType.setValue(perpType)
    }
    await san.offenceAnalysis3.domesticAbuseVictim.setValue(victim)
    if (victim == 'yes') {
        await san.offenceAnalysis3.domesticAbuseVictimType.setValue(victimType)
    }
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