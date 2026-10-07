import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './mappingTestOffender'
import { paTest } from './practitionerAnalysis'

type TestCase = {
    ref: number,
    page1: {
        employmentStatus: EmploymentStatus,
        employmentType: EmploymentType,
        unavailableEmployedBefore: SanYesNo,
        lookingEmployedBefore: SanYesNo,
        notLookingEmployedBefore: SanYesNo,
    },
    page2: {
        employmentHistory: EmploymentHistory,
        highestQual: HighestQual,
        professionalQual: SanYesNoUnknown,
        professionalQualDetails: string,
        skills: SanYesNoSome,
        difficulties: SanDifficulties[],
        readingLevel: SanSignificantSome,
        writingLevel: SanSignificantSome,
        numeracyLevel: SanSignificantSome,
        educationExperience: SanExperience,
    }
}

test.describe.configure({ retries: 1 })
test('Mapping test V1: employment and education', async ({ oasys, user, offender, assessment, san }) => {

    const mappingTestOffender = await getMappingTestOffender('employment')

    // Open the latest assessment, should be WIP
    await user.prob.probSanUnappr.login()
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.openLatest()
    const assessmentPk = await assessment.queries.getLatestSetPk(mappingTestOffender.probationCrn)

    let failed = 0

    const testCases: TestCase[] = [
        { ref: 1, page1: { employmentStatus: 'employed', employmentType: 'partTime', unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'continuous', highestQual: 'entryLevel', professionalQual: 'yes', professionalQualDetails: utils.oasysString(400), skills: 'yes', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'positive' } },
        { ref: 2, page1: { employmentStatus: 'selfEmployed', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'generallyEmployed', highestQual: 'level1', professionalQual: 'no', professionalQualDetails: null, skills: 'no', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'mostlyPositive' } },
        { ref: 3, page1: { employmentStatus: 'retired', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'level2', professionalQual: 'unknown', professionalQualDetails: null, skills: 'some', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: null } },
        { ref: 4, page1: { employmentStatus: 'unavailable', employmentType: null, unavailableEmployedBefore: 'yes', lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unknown', highestQual: 'level3', professionalQual: 'no', professionalQualDetails: null, skills: 'yes', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'mostlyNegative' } },
        { ref: 5, page1: { employmentStatus: 'unavailable', employmentType: null, unavailableEmployedBefore: 'no', lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: null, highestQual: 'level4', professionalQual: 'unknown', professionalQualDetails: null, skills: 'no', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'negative' } },
        { ref: 6, page1: { employmentStatus: 'unemployedLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: 'yes', notLookingEmployedBefore: null }, page2: { employmentHistory: 'generallyEmployed', highestQual: 'level5', professionalQual: 'yes', professionalQualDetails: 'Qualifications', skills: 'some', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'unknown' } },
        { ref: 7, page1: { employmentStatus: 'unemployedLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: 'no', notLookingEmployedBefore: null }, page2: { employmentHistory: null, highestQual: 'level6', professionalQual: 'unknown', professionalQualDetails: null, skills: 'yes', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'positive' } },
        { ref: 8, page1: { employmentStatus: 'unemployedNotLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: 'yes' }, page2: { employmentHistory: 'unknown', highestQual: 'level7', professionalQual: 'yes', professionalQualDetails: 'Qualifications', skills: 'no', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'mostlyPositive' } },
        { ref: 9, page1: { employmentStatus: 'unemployedNotLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: 'no' }, page2: { employmentHistory: null, highestQual: 'level8', professionalQual: 'no', professionalQualDetails: null, skills: 'some', difficulties: ['reading'], readingLevel: 'some', writingLevel: null, numeracyLevel: null, educationExperience: 'positiveNegative' } },
        { ref: 10, page1: { employmentStatus: 'employed', employmentType: 'fullTime', unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'generallyEmployed', highestQual: 'none', professionalQual: 'unknown', professionalQualDetails: null, skills: 'yes', difficulties: ['writing'], readingLevel: null, writingLevel: 'some', numeracyLevel: null, educationExperience: 'mostlyNegative' } },
        { ref: 11, page1: { employmentStatus: 'selfEmployed', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'unknown', professionalQual: 'no', professionalQualDetails: null, skills: 'no', difficulties: ['numeracy'], readingLevel: null, writingLevel: null, numeracyLevel: 'some', educationExperience: 'negative' } },
        { ref: 12, page1: { employmentStatus: 'retired', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unknown', highestQual: 'entryLevel', professionalQual: 'unknown', professionalQualDetails: null, skills: 'some', difficulties: ['reading', 'writing'], readingLevel: 'significant', writingLevel: 'some', numeracyLevel: null, educationExperience: null } },
        { ref: 13, page1: { employmentStatus: 'unavailable', employmentType: null, unavailableEmployedBefore: 'yes', lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'continuous', highestQual: 'level1', professionalQual: 'yes', professionalQualDetails: 'Qualifications', skills: 'yes', difficulties: ['reading', 'numeracy'], readingLevel: 'some', writingLevel: null, numeracyLevel: 'significant', educationExperience: 'positive' } },
        { ref: 14, page1: { employmentStatus: 'unavailable', employmentType: null, unavailableEmployedBefore: 'no', lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: null, highestQual: 'level2', professionalQual: 'unknown', professionalQualDetails: null, skills: 'no', difficulties: ['writing', 'numeracy'], readingLevel: null, writingLevel: 'significant', numeracyLevel: 'some', educationExperience: 'mostlyPositive' } },
        { ref: 15, page1: { employmentStatus: 'unemployedLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: 'yes', notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'level3', professionalQual: 'yes', professionalQualDetails: 'Qualifications', skills: 'some', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'significant', writingLevel: 'significant', numeracyLevel: 'significant', educationExperience: 'positiveNegative' } },
        { ref: 16, page1: { employmentStatus: 'unemployedLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: 'no', notLookingEmployedBefore: null }, page2: { employmentHistory: null, highestQual: 'level4', professionalQual: 'no', professionalQualDetails: null, skills: 'yes', difficulties: ['reading', 'writing'], readingLevel: 'some', writingLevel: 'significant', numeracyLevel: null, educationExperience: 'mostlyNegative' } },
        { ref: 17, page1: { employmentStatus: 'unemployedNotLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: 'yes' }, page2: { employmentHistory: 'continuous', highestQual: 'level5', professionalQual: 'unknown', professionalQualDetails: null, skills: 'no', difficulties: ['reading', 'numeracy'], readingLevel: 'significant', writingLevel: null, numeracyLevel: 'some', educationExperience: 'negative' } },
        { ref: 18, page1: { employmentStatus: 'unemployedNotLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: 'no' }, page2: { employmentHistory: null, highestQual: 'level6', professionalQual: 'no', professionalQualDetails: null, skills: 'some', difficulties: ['writing', 'numeracy'], readingLevel: null, writingLevel: 'some', numeracyLevel: 'significant', educationExperience: 'unknown' } },
        { ref: 19, page1: { employmentStatus: 'employed', employmentType: 'temporary', unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'level7', professionalQual: 'unknown', professionalQualDetails: null, skills: 'yes', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'some', writingLevel: 'some', numeracyLevel: 'some', educationExperience: 'positive' } },
        { ref: 20, page1: { employmentStatus: 'employed', employmentType: 'apprenticeship', unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unknown', highestQual: 'level8', professionalQual: 'yes', professionalQualDetails: 'Qualifications', skills: 'no', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'mostlyPositive' } },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Employment and education', true)
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
    await san.gotoSan('Employment and education', true)
    await san.employment.backToStart()
    await san.employment.page1.employmentStatus.setValue('retired')
    await san.employment.saveAndContinue()
    await san.employment.page2.additionalCommitments.setValue(['none'])
    await san.employment.page2.highestQual.setValue('entryLevel')
    await san.employment.page2.professionalQual.setValue('no')
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
    switch (test.page1.employmentStatus) {
        case 'employed':
            await san.employment.page1.employmentType.setValue(test.page1.employmentType)
            break
        case 'unavailable':
            await san.employment.page1.unavailableEmployedBefore.setValue(test.page1.unavailableEmployedBefore)
            break
        case 'unemployedLooking':
            await san.employment.page1.lookingEmployedBefore.setValue(test.page1.lookingEmployedBefore)
            break
        case 'unemployedNotLooking':
            await san.employment.page1.notLookingEmployedBefore.setValue(test.page1.notLookingEmployedBefore)
            break
    }
    await san.employment.saveAndContinue()
    if (test.page2.employmentHistory) {
        await san.employment.page2.employmentHistory.setValue(test.page2.employmentHistory)
    }
    await san.employment.page2.highestQual.setValue(test.page2.highestQual)
    await san.employment.page2.professionalQual.setValue(test.page2.professionalQual)
    if (test.page2.professionalQual == 'yes') {
        await san.employment.page2.professionalQualDetails.setValue(test.page2.professionalQualDetails)
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
    if (test.page1.employmentStatus != 'retired') {
        await san.employment.page2.educationExperience.setValue(test.page2.educationExperience)
        if (test.page2.employmentHistory) {
            await san.employment.page2.employmentExperience.setValue('positive')
        }
    }
    await san.employment.saveAndContinue()
}

async function checkAnswers(assessmentPk: number, test: TestCase, assessment: Assessment): Promise<boolean> {

    const section4Answers: OasysAnswer[] = [
        { q: '4.2', a: mapping4_2(test) },
        { q: '4.3', a: mapping4_3(test) },
        { q: '4.4', a: mapping4_4(test) },
        { q: '4.5', a: null },
        { q: '4.7', a: mapping4_7(test) },
        { q: '4.7.1', a: mapping4_7_1(test) },
        { q: '4.9', a: mapping4_9(test) },
        { q: '4.10', a: mapping4_10(test) },
        { q: '4.90', a: null },
        { q: '4.91', a: null },
        { q: '4.92', a: null },

    ]
    const scAnswers: OasysAnswer[] = [
        { q: 'SC0', a: null },
        { q: 'SC1', a: null },
        { q: 'SC1.t', a: null },
        { q: 'SC2', a: mappingSC2(test) },
        { q: 'SC2.t', a: mappingSC2_t(test) },
        { q: 'SC3', a: mappingSC3(test) },
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
        case 'selfEmployed':
            return 'NO'
        case 'retired':
        case 'unavailable':
            return 'NA'
        case 'unemployedLooking':
        case 'unemployedNotLooking':
            return 'YES'
        default:
            return null
    }
}

function mapping4_3(test: TestCase): string {

    if ((test.page1.employmentStatus == 'unemployedLooking' && test.page1.lookingEmployedBefore == 'no')
        || (test.page1.employmentStatus == 'unemployedNotLooking' && test.page1.notLookingEmployedBefore == 'no')) {
        return '2'
    }

    switch (test.page2?.employmentHistory) {
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

    if (test.page2?.highestQual == null) {
        return null
    }
    if (['level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8'].includes(test.page2?.highestQual)) {
        return '0'
    }
    switch (test.page2?.professionalQual) {
        case 'no':
            return test.page2?.highestQual == 'unknown' ? null : '2'
        case 'yes':
            return '0'
        default:
            return null
    }
}

function mapping4_10(test: TestCase): string {

    switch (test.page2?.educationExperience) {

        case 'positive':
        case 'mostlyPositive':
            return '0'
        case 'positiveNegative':
            return '1'
        case 'mostlyNegative':
        case 'negative':
            return '2'
        default:
            return null
    }
}

function mappingSC2(test: TestCase): string {

    switch (test.page2?.professionalQual) {
        case 'yes':
            return 'YES'
        case 'no':
            return 'NO'
        default:
            return null
    }
}

function mappingSC2_t(test: TestCase): string {

    return test.page2?.professionalQualDetails == '' ? null : test.page2?.professionalQualDetails
}

function mappingSC3(test: TestCase): string {

    switch (test.page2?.highestQual) {
        case 'none':
            return 'NOQUAL'
        case 'entryLevel':
            return 'ANYOTHER'
        case 'level1':
        case 'level2':
        case 'level3':
        case 'level4':
        case 'level5':
        case 'level6':
        case 'level7':
        case 'level8':
            return 'MATHSENGLISH'
        default:
            return null
    }
}

function mappingSC4(test: TestCase): string {

    if (test.page1.employmentStatus == 'employed') {
        return test.page1.employmentType == 'fullTime' ? 'FULLTIME' : 'PARTTIME'
    }
    if (test.page1.employmentStatus == 'retired') {
        return 'FULLTIME'
    }
    if ((test.page1.employmentStatus == 'unemployedLooking' && test.page1.lookingEmployedBefore == 'no')
        || (test.page1.employmentStatus == 'unemployedNotLooking' && test.page1.notLookingEmployedBefore == 'no')
        || (test.page1.employmentStatus == 'unavailable' && test.page1.unavailableEmployedBefore == 'no')) {
        return 'UNEMPLOYED'
    }
    return null

}

function mappingSC5(test: TestCase): string {

    switch (test.page1.employmentStatus) {
        case 'employed':
        case 'selfEmployed':
            return 'YES'
        case 'unemployedLooking':
        case 'unemployedNotLooking':
            return 'NO'
        default:
            return null
    }
}
