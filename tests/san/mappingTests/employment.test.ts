import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    employmentStatus: EmploymentStatus,
    employedBefore: SanYesNo,
    employmentHistory: EmploymentHistory,
    anyQual: SanYesNoUnknown,
    skills: SanYesNoSome,
    difficulties: SanDifficulties[],
    readingLevel: SanSignificantSome,
    writingLevel: SanSignificantSome,
    numeracyLevel: SanSignificantSome,
}

test.describe.configure({ retries: 1 })

for (const mode of ['community', 'custody']) {
    test(`Mapping test V2 ${mode}: employment and education`, async ({ oasys, user, offender, assessment, san }) => {

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
            { ref: 1, employmentStatus: null, employedBefore: null, employmentHistory: null, anyQual: null, skills: null, difficulties: null, readingLevel: null, writingLevel: null, numeracyLevel: null },
            { ref: 2, employmentStatus: 'employed', employedBefore: null, employmentHistory: null, anyQual: null, skills: null, difficulties: null, readingLevel: null, writingLevel: null, numeracyLevel: null },
            { ref: 3, employmentStatus: 'retired', employedBefore: null, employmentHistory: null, anyQual: null, skills: null, difficulties: null, readingLevel: null, writingLevel: null, numeracyLevel: null },
            { ref: 4, employmentStatus: 'unavailable', employedBefore: 'yes', employmentHistory: null, anyQual: null, skills: null, difficulties: null, readingLevel: null, writingLevel: null, numeracyLevel: null },
            { ref: 5, employmentStatus: 'unavailable', employedBefore: 'no', employmentHistory: null, anyQual: null, skills: null, difficulties: null, readingLevel: null, writingLevel: null, numeracyLevel: null },
            { ref: 6, employmentStatus: 'unemployed', employedBefore: 'yes', employmentHistory: null, anyQual: null, skills: null, difficulties: null, readingLevel: null, writingLevel: null, numeracyLevel: null },
            { ref: 7, employmentStatus: 'unemployed', employedBefore: 'no', employmentHistory: null, anyQual: 'no', skills: 'no', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: null, writingLevel: null, numeracyLevel: null },
            { ref: 8, employmentStatus: 'employed', employedBefore: null, employmentHistory: 'continuous', anyQual: 'yes', skills: 'yes', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null },
            { ref: 9, employmentStatus: 'retired', employedBefore: null, employmentHistory: 'generallyEmployed', anyQual: 'no', skills: 'no', difficulties: ['reading'], readingLevel: 'some', writingLevel: null, numeracyLevel: null },
            { ref: 10, employmentStatus: 'unavailable', employedBefore: 'yes', employmentHistory: 'unstable', anyQual: 'yes', skills: 'some', difficulties: ['writing'], readingLevel: null, writingLevel: 'some', numeracyLevel: null },
            { ref: 11, employmentStatus: 'unavailable', employedBefore: 'no', employmentHistory: null, anyQual: 'no', skills: 'yes', difficulties: ['numeracy'], readingLevel: null, writingLevel: null, numeracyLevel: 'some' },
            { ref: 12, employmentStatus: 'unemployed', employedBefore: 'yes', employmentHistory: 'unknown', anyQual: 'yes', skills: 'no', difficulties: ['reading', 'writing'], readingLevel: 'significant', writingLevel: 'some', numeracyLevel: null },
            { ref: 13, employmentStatus: 'unemployed', employedBefore: 'no', employmentHistory: null, anyQual: 'no', skills: 'some', difficulties: ['reading', 'numeracy'], readingLevel: 'some', writingLevel: null, numeracyLevel: 'significant' },
            { ref: 14, employmentStatus: 'employed', employedBefore: null, employmentHistory: 'unstable', anyQual: 'yes', skills: 'yes', difficulties: ['writing', 'numeracy'], readingLevel: null, writingLevel: 'significant', numeracyLevel: 'some' },
            { ref: 15, employmentStatus: 'retired', employedBefore: null, employmentHistory: 'unknown', anyQual: 'no', skills: 'no', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'significant', writingLevel: 'significant', numeracyLevel: 'significant' },
            { ref: 16, employmentStatus: 'unavailable', employedBefore: 'yes', employmentHistory: 'continuous', anyQual: 'yes', skills: 'some', difficulties: ['reading', 'writing'], readingLevel: 'some', writingLevel: 'significant', numeracyLevel: null },
            { ref: 17, employmentStatus: 'unavailable', employedBefore: 'no', employmentHistory: null, anyQual: 'no', skills: 'yes', difficulties: ['reading', 'numeracy'], readingLevel: 'significant', writingLevel: null, numeracyLevel: 'some' },
            { ref: 18, employmentStatus: 'unemployed', employedBefore: 'yes', employmentHistory: 'generallyEmployed', anyQual: 'yes', skills: 'no', difficulties: ['writing', 'numeracy'], readingLevel: null, writingLevel: 'some', numeracyLevel: 'significant' },
            { ref: 19, employmentStatus: 'unemployed', employedBefore: 'no', employmentHistory: null, anyQual: 'no', skills: 'some', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'some', writingLevel: 'some', numeracyLevel: 'some' },
        ]


        for (const test of testCases) {
            // Get to the right starting screen
            await san.gotoSan('employment', true)
            await san.employment.backToStart()
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
        await san.gotoSan('employment', true)
        await san.employment.backToStart()
        await san.employment.page1.populateMinimal()
        await san.employment.saveAndContinue()
        await san.employment.page3.populateMinimal()
        await san.employment.wantChanges.setValue('madeChanges')
        await san.employment.saveAndContinue()
        await san.returnToOASys()

        await paTest(assessmentPk, san.employment, oasys, assessment, san)
        await user.logout()
    })
}


async function scenario(test: TestCase, san: San) {

    await san.employment.page1.employmentStatus.setValue(test.employmentStatus)
    await san.employment.saveAndContinue()
    if (test.employmentStatus == 'unavailable' || test.employmentStatus == 'unemployed') {
        await san.employment.page2.employedBefore.setValue(test.employedBefore)
        await san.employment.saveAndContinue()
    }

    if (test.anyQual) {
        await san.employment.page3.anyQual.setValue(test.anyQual)
        await san.employment.page3.skills.setValue(test.skills)
        await san.employment.page3.difficulties.setValue(test.difficulties)
        await san.employment.saveAndContinue()
        if (test.difficulties && (test.readingLevel || test.writingLevel || test.numeracyLevel))
            if (test.difficulties.includes('reading')) {
                await san.employment.page4.readingLevel.setValue(test.readingLevel)
            }
        if (test.difficulties.includes('writing')) {
            await san.employment.page4.writingLevel.setValue(test.writingLevel)
        }
        if (test.difficulties.includes('numeracy')) {
            await san.employment.page4.numeracyLevel.setValue(test.numeracyLevel)
        }
    }
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section4Answers: OasysAnswer[] = [
        { q: '4.2', a: mapping4_2(test) },
        { q: '4.3', a: mapping4_3(test) },
        { q: '4.4', a: mapping4_4(test) },
        { q: '4.5', a: null },
        { q: '4.7', a: mapping4_7(test) },
        { q: '4.7.1', a: mapping4_7_1(test) },
        { q: '4.8', a: null },
        { q: '4.9', a: mapping4_9(test) },
        { q: '4.10', a: null },
        { q: '4.90', a: null },
        { q: '4.91', a: null },
        { q: '4.92', a: null },
        { q: '4.94', a: null },
        { q: '4.96', a: null },
        { q: '4.98', a: null },
        { q: '4_SAN_STRENGTH', a: null },
    ]
    const scAnswers: OasysAnswer[] = [
        { q: 'SC0', a: null },
        { q: 'SC1', a: null },
        { q: 'SC1.t', a: null },
        { q: 'SC2', a: null },
        { q: 'SC2.t', a: null },
        { q: 'SC3', a: null },
        { q: 'SC3.t', a: null },
        { q: 'SC4', a: mappingSC4(test) },
        { q: 'SC4.t', a: null },
        { q: 'SC5', a: mappingSC5(test) },
        { q: 'SC6', a: null },
        { q: 'SC7', a: null },
        { q: 'SC7.t', a: null },
        { q: 'SC8.t', a: null },
        { q: 'SC9', a: null },
        { q: 'SC9.t', a: null },
        { q: 'SC10', a: null },
        { q: 'SC10.t', a: null },
    ]
    const expectedSanSectionAnswers: OasysAnswer[] = [
        { q: 'EE_SAN_SECTION_COMP', a: 'NO' },
    ]
    const section4Failed = await assessment.queries.checkSectionAnswers(assessmentPk, '4', section4Answers, true)
    const scFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SKILLSCHECKER', scAnswers, true)
    const sanSectionFailed = await assessment.queries.checkSectionAnswers(assessmentPk, 'SAN', expectedSanSectionAnswers, true)
    return section4Failed || scFailed || sanSectionFailed
}


function mapping4_2(test: TestCase): string {

    switch (test.employmentStatus) {
        case 'employed':
            return 'NO'
        case 'retired':
        case 'unavailable':
            return 'NA'
        case 'unemployed':
            return 'YES'
        default:
            return null
    }
}

function mapping4_3(test: TestCase): string {

    if ((test.employmentStatus == 'unemployed' && test.employedBefore == 'no')) {
        return '2'
    }

    switch (test.employmentHistory) {
        case 'continuous':
            return '0'
        case 'generallyEmployed':
            return '1'
        case 'unstable':
            return '2'
        case 'unknown':
            return 'M'
        default:
            return null
    }
}

function mapping4_4(test: TestCase): string {

    switch (test.skills) {
        case 'yes':
            return '0'
        case 'some':
            return '1'
        case 'no':
            return '2'
        default:
            return null
    }
}

function mapping4_7(test: TestCase): string {

    if (test.difficulties == null || test.difficulties.length == 0) {
        return null
    }
    if (test.readingLevel == 'significant' || test.writingLevel == 'significant' || test.numeracyLevel == 'significant') {
        return '2'
    }
    if (test.readingLevel == 'some' || test.writingLevel == 'some' || test.numeracyLevel == 'some') {
        return '1'
    }
    return '0'
}

function mapping4_7_1(test: TestCase): string {

    let result = ''

    if (test.difficulties.includes('numeracy')) {
        result += 'NUMERACY,'
    }
    if (test.difficulties.includes('reading')) {
        result += 'READING,'
    }
    if (test.difficulties.includes('writing')) {
        result += 'WRITING,'
    }

    return result == '' ? null : result
}

function mapping4_9(test: TestCase): string {

    switch (test.anyQual) {
        case 'no':
            return '2'
        case 'yes':
            return '0'
        case 'unknown':
            return 'M'
        default:
            return null
    }
}

function mappingSC4(test: TestCase): string {

    if (test.employmentStatus == 'retired') {
        return 'FULLTIME'
    }
    if (test.employmentStatus == 'unemployed' || test.employmentStatus == 'unavailable') {
        if (test.employedBefore == 'no') {
            return 'UNEMPLOYED'
        } else if (test.employedBefore == 'yes') {
            return 'PARTTIME'
        }
    }
    return null

}

function mappingSC5(test: TestCase): string {

    switch (test.employmentStatus) {
        case 'employed':
            return 'YES'
        case 'unemployed':
            return 'NO'
        default:
            return null
    }
}
