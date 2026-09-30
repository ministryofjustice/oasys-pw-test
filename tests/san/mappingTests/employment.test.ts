import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page1: {
        employmentStatus: EmploymentStatus,
        unavailableEmployedBefore: SanYesNo,
        unemployedEmployedBefore: SanYesNo,
    },
    page2: {
        employmentHistory: EmploymentHistory,
        anyQual: SanYesNo,
        qualDetails: string,
        skills: SanYesNoSome,
        difficulties: SanDifficulties[],
        readingLevel: SanSignificantSome,
        writingLevel: SanSignificantSome,
        numeracyLevel: SanSignificantSome,
    }
}

let startPage = 1 // Page that SAN will go back into when opening the section, depends on last page reached in previous scenario

test.describe.configure({ retries: 1 })
test('Mapping test V2: employment and education', async ({ oasys, user, offender, assessment, san }) => {

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
        { ref: 0, page1: { employmentStatus: null, unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: null },
        { ref: 1, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: null },
        { ref: 2, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: null, anyQual: null, qualDetails: null, skills: null, difficulties: [], readingLevel: null, writingLevel: null, numeracyLevel: null } },
        { ref: 3, page1: { employmentStatus: 'retired', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: null },
        { ref: 4, page1: { employmentStatus: 'unavailable', unavailableEmployedBefore: 'yes', unemployedEmployedBefore: null }, page2: null },
        { ref: 5, page1: { employmentStatus: 'unavailable', unavailableEmployedBefore: 'no', unemployedEmployedBefore: null }, page2: null },
        { ref: 6, page1: { employmentStatus: 'unemployed', unavailableEmployedBefore: null, unemployedEmployedBefore: 'yes' }, page2: null },
        { ref: 7, page1: { employmentStatus: 'unemployed', unavailableEmployedBefore: null, unemployedEmployedBefore: 'no' }, page2: null },
        { ref: 8, page1: { employmentStatus: 'unemployed', unavailableEmployedBefore: null, unemployedEmployedBefore: 'yes' }, page2: null },
        { ref: 9, page1: { employmentStatus: 'unemployed', unavailableEmployedBefore: null, unemployedEmployedBefore: 'no' }, page2: null },
        { ref: 10, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: 'continuous', anyQual: 'yes', qualDetails: 'some qualifications', skills: 'yes', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null } },
        { ref: 11, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: 'generallyEmployed', anyQual: 'no', qualDetails: 'some qualifications', skills: 'some', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null } },
        { ref: 12, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: 'unstable', anyQual: 'yes', qualDetails: null, skills: 'no', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null } },
        { ref: 13, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: 'unstable', anyQual: 'yes', qualDetails: utils.oasysString(400), skills: 'no', difficulties: ['reading'], readingLevel: 'some', writingLevel: null, numeracyLevel: null } },
        { ref: 14, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: 'unstable', anyQual: 'no', qualDetails: utils.oasysString(400), skills: 'no', difficulties: ['writing'], readingLevel: null, writingLevel: 'some', numeracyLevel: null } },
        { ref: 15, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: 'unstable', anyQual: 'no', qualDetails: null, skills: 'no', difficulties: ['numeracy'], readingLevel: null, writingLevel: null, numeracyLevel: 'some' } },
        { ref: 16, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: 'unstable', anyQual: 'yes', qualDetails: 'Some text!!!', skills: 'no', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'some', writingLevel: 'some', numeracyLevel: 'some' } },
        { ref: 17, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: 'unstable', anyQual: 'no', qualDetails: 'Some text!!!', skills: 'no', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'significant', writingLevel: 'some', numeracyLevel: 'some' } },
        { ref: 18, page1: { employmentStatus: 'unemployed', unavailableEmployedBefore: null, unemployedEmployedBefore: 'yes' }, page2: { employmentHistory: 'unstable', anyQual: 'yes', qualDetails: null, skills: 'no', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'some', writingLevel: 'significant', numeracyLevel: 'some' } },
        { ref: 19, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: 'unstable', anyQual: 'yes', qualDetails: utils.oasysString(400), skills: 'no', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'some', writingLevel: 'some', numeracyLevel: 'significant' } },
        { ref: 20, page1: { employmentStatus: 'employed', unavailableEmployedBefore: null, unemployedEmployedBefore: null }, page2: { employmentHistory: 'unstable', anyQual: 'yes', qualDetails: utils.oasysString(400), skills: 'no', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null } },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Employment and education', true)
        // Back to the start, depending where the previous scenario ended
        for (let i = 1; i < startPage; i++) {
            await san.employment.previous()
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
    await san.gotoSan('Employment and education', true)
    await san.employment.page2.employmentHistory.setValue('continuous')
    await san.employment.page2.additionalCommitments.setValue(['none'])
    await san.employment.page2.anyQual.setValue('no')
    await san.employment.page2.skills.setValue('no')
    await san.employment.page2.difficulties.setValue(['none'])
    await san.employment.page2.wantChanges.setValue('madeChanges')
    await san.employment.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, san.employment, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.employment.page1.employmentStatus.setValue(test.page1.employmentStatus)
    if (test.page1.employmentStatus == 'unavailable') {
        await san.employment.page1.unavailableEmployedBefore.setValue(test.page1.unavailableEmployedBefore)
    } else if (test.page1.employmentStatus == 'unemployed') {
        await san.employment.page1.unemployedEmployedBefore.setValue(test.page1.unemployedEmployedBefore)
    }

    if (test.page2) {
        await san.employment.saveAndContinue()
        await san.employment.page2.employmentHistory.setValue(test.page2.employmentHistory)
        await san.employment.page2.anyQual.setValue(test.page2.anyQual)
        if (test.page2.anyQual == 'yes') {
            await san.employment.page2.qualDetails.setValue(test.page2.qualDetails)
        }
        await san.employment.page2.skills.setValue(test.page2.skills)
        await san.employment.page2.difficulties.setValue(test.page2.difficulties)
        if (test.page2.difficulties.includes('reading')) {
            await san.employment.page2.readingLevel.setValue(test.page2.readingLevel)
        }
        if (test.page2.difficulties.includes('writing')) {
            await san.employment.page2.writingLevel.setValue(test.page2.writingLevel)
        }
        if (test.page2.difficulties.includes('numeracy')) {
            await san.employment.page2.numeracyLevel.setValue(test.page2.numeracyLevel)
        }
        startPage = 2
    } else {
        startPage = 1
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

    switch (test.page1.employmentStatus) {
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

    if ((test.page1.employmentStatus == 'unemployed' && test.page1.unemployedEmployedBefore == 'no')) {
        return '2'
    }

    switch (test.page2?.employmentHistory) {
        case 'continuous':
            return '0'
        case 'generallyEmployed':
            return '1'
        case 'unstable':
            return '2'
    }
    return null
}

function mapping4_4(test: TestCase): string {

    switch (test.page2?.skills) {
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

    if (test.page2?.difficulties == null || test.page2?.difficulties.length == 0) {
        return null
    }
    if (test.page2?.readingLevel == 'significant' || test.page2?.writingLevel == 'significant' || test.page2?.numeracyLevel == 'significant') {
        return '2'
    }
    if (test.page2?.readingLevel == 'some' || test.page2?.writingLevel == 'some' || test.page2?.numeracyLevel == 'some') {
        return '1'
    }
    return '0'
}

function mapping4_7_1(test: TestCase): string {

    let result = ''

    if (test.page2?.difficulties.includes('numeracy')) {
        result += 'NUMERACY,'
    }
    if (test.page2?.difficulties.includes('reading')) {
        result += 'READING,'
    }
    if (test.page2?.difficulties.includes('writing')) {
        result += 'WRITING,'
    }

    return result == '' ? null : result
}

function mapping4_9(test: TestCase): string {

    switch (test.page2?.anyQual) {
        case 'no':
            return '2'
        case 'yes':
            return '0'
        default:
            return null
    }
}

function mappingSC4(test: TestCase): string {

    if (test.page1.employmentStatus == 'retired') {
        return 'FULLTIME'
    }
    if ((test.page1.employmentStatus == 'unemployed' && test.page1.unemployedEmployedBefore == 'no')
        || (test.page1.employmentStatus == 'unavailable' && test.page1.unavailableEmployedBefore == 'no')) {
        return 'UNEMPLOYED'
    }
    return null

}

function mappingSC5(test: TestCase): string {

    switch (test.page1.employmentStatus) {
        case 'employed':
            return 'YES'
        case 'unemployed':
            return 'NO'
        default:
            return null
    }
}
