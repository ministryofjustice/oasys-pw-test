import { test, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './xMappingTest'
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

let startPage = 1 // Page that SAN will go back into when opening the section, depends on last page reached in previous scenario

// test.describe.configure({ retries: 1 })
test('Mapping test V2: employment and education', async ({ page, oasys, user, offender, assessment, san }) => {

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
        { ref: 0, page1: { employmentStatus: null, employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: null },
        { ref: 1, page1: { employmentStatus: 'employed', employmentType: 'partTime', unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: null },
        { ref: 2, page1: { employmentStatus: 'selfEmployed', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: null, highestQual: null, professionalQual: null, professionalQualDetails: null, skills: null, difficulties: [], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: null } },
        { ref: 3, page1: { employmentStatus: 'retired', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: null },
        { ref: 4, page1: { employmentStatus: 'unavailable', employmentType: null, unavailableEmployedBefore: 'yes', lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: null },
        { ref: 5, page1: { employmentStatus: 'unavailable', employmentType: null, unavailableEmployedBefore: 'no', lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: null },
        { ref: 6, page1: { employmentStatus: 'unemployedLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: 'yes', notLookingEmployedBefore: null }, page2: null },
        { ref: 7, page1: { employmentStatus: 'unemployedLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: 'no', notLookingEmployedBefore: null }, page2: null },
        { ref: 8, page1: { employmentStatus: 'unemployedNotLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: 'yes' }, page2: null },
        { ref: 9, page1: { employmentStatus: 'unemployedNotLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: 'no' }, page2: null },
        { ref: 10, page1: { employmentStatus: 'employed', employmentType: 'partTime', unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'continuous', highestQual: 'entryLevel', professionalQual: 'yes', professionalQualDetails: 'some qualifications', skills: 'yes', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'positive' } },
        { ref: 11, page1: { employmentStatus: 'selfEmployed', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'generallyEmployed', highestQual: 'level1', professionalQual: 'no', professionalQualDetails: null, skills: 'some', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'mostlyPositive' } },
        { ref: 12, page1: { employmentStatus: 'employed', employmentType: 'fullTime', unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'level2', professionalQual: 'unknown', professionalQualDetails: null, skills: 'no', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'positiveNegative' } },
        { ref: 13, page1: { employmentStatus: 'selfEmployed', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'level3', professionalQual: 'yes', professionalQualDetails: utils.oasysString(400), skills: 'no', difficulties: ['reading'], readingLevel: 'some', writingLevel: null, numeracyLevel: null, educationExperience: 'mostlyNegative' } },
        { ref: 14, page1: { employmentStatus: 'employed', employmentType: 'temporary', unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'level4', professionalQual: 'no', professionalQualDetails: null, skills: 'no', difficulties: ['writing'], readingLevel: null, writingLevel: 'some', numeracyLevel: null, educationExperience: 'negative' } },
        { ref: 15, page1: { employmentStatus: 'selfEmployed', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'level5', professionalQual: 'unknown', professionalQualDetails: null, skills: 'no', difficulties: ['numeracy'], readingLevel: null, writingLevel: null, numeracyLevel: 'some', educationExperience: 'unknown' } },
        { ref: 16, page1: { employmentStatus: 'selfEmployed', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'level6', professionalQual: 'yes', professionalQualDetails: 'Some text!!!', skills: 'no', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'some', writingLevel: 'some', numeracyLevel: 'some', educationExperience: 'positive' } },
        { ref: 17, page1: { employmentStatus: 'employed', employmentType: 'apprenticeship', unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'level7', professionalQual: 'no', professionalQualDetails: null, skills: 'no', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'significant', writingLevel: 'some', numeracyLevel: 'some', educationExperience: 'mostlyPositive' } },
        { ref: 18, page1: { employmentStatus: 'unemployedLooking', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: 'yes', notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'level8', professionalQual: 'unknown', professionalQualDetails: null, skills: 'no', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'some', writingLevel: 'significant', numeracyLevel: 'some', educationExperience: 'positiveNegative' } },
        { ref: 19, page1: { employmentStatus: 'selfEmployed', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'none', professionalQual: 'yes', professionalQualDetails: utils.oasysString(400), skills: 'no', difficulties: ['reading', 'writing', 'numeracy'], readingLevel: 'some', writingLevel: 'some', numeracyLevel: 'significant', educationExperience: 'mostlyNegative' } },
        { ref: 20, page1: { employmentStatus: 'selfEmployed', employmentType: null, unavailableEmployedBefore: null, lookingEmployedBefore: null, notLookingEmployedBefore: null }, page2: { employmentHistory: 'unstable', highestQual: 'unknown', professionalQual: 'no', professionalQualDetails: null, skills: 'no', difficulties: ['none'], readingLevel: null, writingLevel: null, numeracyLevel: null, educationExperience: 'negative' } },
    ]


    for (const test of testCases) {
        // Get to the right starting screen
        await san.gotoSan('Employment and education', true)
        // Back to the start, depending where the previous scenario ended
        for (let i = 1; i < startPage; i++) {
            await san.previous()
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
    await san.employment2.employmentHistory.setValue('continuous')
    await san.employment2.additionalCommitments.setValue(['none'])
    await san.employment2.highestQual.setValue('entryLevel')
    await san.employment2.professionalQual.setValue('no')
    await san.employment2.skills.setValue('no')
    await san.employment2.difficulties.setValue(['none'])
    await san.employment2.employmentExperience.setValue('unknown')
    await san.employment2.educationExperience.setValue('unknown')
    await san.employment2.wantChangesEmployment.setValue('madeChanges')
    await san.saveAndContinue()
    await san.returnToOASys()

    await paTest(assessmentPk, 'Employment and education', page, oasys, assessment, san)
    await user.logout()
})


async function scenario(test: TestCase, san: San) {

    await san.employment1.employmentStatus.setValue(test.page1.employmentStatus)
    switch (test.page1.employmentStatus) {
        case 'employed':
            await san.employment1.employmentType.setValue('partTime')
            break
        case 'unavailable':
            await san.employment1.unavailableEmployedBefore.setValue(test.page1.unavailableEmployedBefore)
            break
        case 'unemployedLooking':
            await san.employment1.lookingEmployedBefore.setValue(test.page1.lookingEmployedBefore)
            break
        case 'unemployedNotLooking':
            await san.employment1.notLookingEmployedBefore.setValue(test.page1.notLookingEmployedBefore)
            break
    }
    if (test.page2) {
        await san.saveAndContinue()
        await san.employment2.employmentHistory.setValue(test.page2.employmentHistory)
        await san.employment2.highestQual.setValue(test.page2.highestQual)
        await san.employment2.professionalQual.setValue(test.page2.professionalQual)
        if (test.page2.professionalQual == 'yes') {
            await san.employment2.professionalQualDetails.setValue(test.page2.professionalQualDetails)
        }
        await san.employment2.skills.setValue(test.page2.skills)
        await san.employment2.difficulties.setValue(test.page2.difficulties)
        if (test.page2.difficulties.includes('reading')) {
            await san.employment2.readingLevel.setValue(test.page2.readingLevel)
        }
        if (test.page2.difficulties.includes('writing')) {
            await san.employment2.writingLevel.setValue(test.page2.writingLevel)
        }
        if (test.page2.difficulties.includes('numeracy')) {
            await san.employment2.numeracyLevel.setValue(test.page2.numeracyLevel)
        }
        await san.employment2.educationExperience.setValue(test.page2.educationExperience)
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
        { q: '4.9', a: mapping4_9(test) },
        { q: '4.10', a: mapping4_10(test) },
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

    if (test.page2?.highestQual == null) {
        return null
    }
    if (['level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8'].includes(test.page2?.highestQual)) {
        return '0'
    }
    switch (test.page2?.professionalQual) {
        case 'no':
            return '2'
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
