import { test, Oasys, Assessment, San } from 'fixtures'
import { getMappingTestOffender } from './xMappingTest'


type HighestQualOptions = 'entryLevel' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6' | 'level7' | 'level8' | 'none' | 'unknown'
type ProfessionalQualOptions = 'yes' | 'no' | 'unknown'

test('Mapping test for question 4.9', async ({ oasys, user, offender, assessment, san, }) => {

    /*
        If "Select the highest level of education [subject] has completed"
            Case 'LEVEL_2', 'LEVEL_3', 'LEVEL_4', 'LEVEL_5', 'LEVEL_6', 'LEVEL_7', 'LEVEL_8'  (they do  have an educational qualification)
                o4-9 = 0
        Else 
            (the do not have an educational qualification so check for proof of vocatonal)
            Select Case "Does [subject] have any professional or vocational qualifications?"
                Case 'NO'
                    o4-9 = 2
                Case 'YES'
                    o4-9 = 0
            End Select
        End if
    */

    let failed = false

    const mappingTestOffender = await getMappingTestOffender()

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
    await user.logout()

    await user.prob.probSanUnappr.login()
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    const assessmentPk = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    const testCases: { i: number, highestQual: HighestQualOptions, professionalQual: ProfessionalQualOptions, mapping: number }[] =
        [
            { i: 1, highestQual: null, professionalQual: null, mapping: null },
            { i: 2, highestQual: 'entryLevel', professionalQual: null, mapping: null },
            { i: 3, highestQual: 'level1', professionalQual: null, mapping: null },
            { i: 4, highestQual: 'level2', professionalQual: null, mapping: 0 },
            { i: 5, highestQual: 'level3', professionalQual: null, mapping: 0 },
            { i: 6, highestQual: 'level4', professionalQual: null, mapping: 0 },
            { i: 7, highestQual: 'level5', professionalQual: null, mapping: 0 },
            { i: 8, highestQual: 'level6', professionalQual: null, mapping: 0 },
            { i: 9, highestQual: 'level7', professionalQual: null, mapping: 0 },
            { i: 10, highestQual: 'level8', professionalQual: null, mapping: 0 },
            { i: 11, highestQual: 'none', professionalQual: null, mapping: null },
            { i: 12, highestQual: 'unknown', professionalQual: null, mapping: null },
            { i: 13, highestQual: null, professionalQual: 'yes', mapping: 0 },
            { i: 14, highestQual: 'entryLevel', professionalQual: 'yes', mapping: 0 },
            { i: 15, highestQual: 'level1', professionalQual: 'yes', mapping: 0 },
            { i: 16, highestQual: 'level2', professionalQual: 'yes', mapping: 0 },
            { i: 17, highestQual: 'level3', professionalQual: 'yes', mapping: 0 },
            { i: 18, highestQual: 'level4', professionalQual: 'yes', mapping: 0 },
            { i: 19, highestQual: 'level5', professionalQual: 'yes', mapping: 0 },
            { i: 20, highestQual: 'level6', professionalQual: 'yes', mapping: 0 },
            { i: 21, highestQual: 'level7', professionalQual: 'yes', mapping: 0 },
            { i: 22, highestQual: 'level8', professionalQual: 'yes', mapping: 0 },
            { i: 23, highestQual: 'none', professionalQual: 'yes', mapping: 0 },
            { i: 24, highestQual: 'unknown', professionalQual: 'yes', mapping: 0 },
            { i: 25, highestQual: null, professionalQual: 'no', mapping: null },
            { i: 26, highestQual: 'entryLevel', professionalQual: 'no', mapping: 2 },
            { i: 27, highestQual: 'level1', professionalQual: 'no', mapping: 2 },
            { i: 28, highestQual: 'level2', professionalQual: 'no', mapping: 0 },
            { i: 29, highestQual: 'level3', professionalQual: 'no', mapping: 0 },
            { i: 30, highestQual: 'level4', professionalQual: 'no', mapping: 0 },
            { i: 31, highestQual: 'level5', professionalQual: 'no', mapping: 0 },
            { i: 32, highestQual: 'level6', professionalQual: 'no', mapping: 0 },
            { i: 33, highestQual: 'level7', professionalQual: 'no', mapping: 0 },
            { i: 34, highestQual: 'level8', professionalQual: 'no', mapping: 0 },
            { i: 35, highestQual: 'none', professionalQual: 'no', mapping: 2 },
            { i: 36, highestQual: 'unknown', professionalQual: 'no', mapping: null },
            { i: 37, highestQual: null, professionalQual: 'unknown', mapping: null },
            { i: 38, highestQual: 'entryLevel', professionalQual: 'unknown', mapping: null },
            { i: 39, highestQual: 'level1', professionalQual: 'unknown', mapping: null },
            { i: 40, highestQual: 'level2', professionalQual: 'unknown', mapping: 0 },
            { i: 41, highestQual: 'level3', professionalQual: 'unknown', mapping: 0 },
            { i: 42, highestQual: 'level4', professionalQual: 'unknown', mapping: 0 },
            { i: 43, highestQual: 'level5', professionalQual: 'unknown', mapping: 0 },
            { i: 44, highestQual: 'level6', professionalQual: 'unknown', mapping: 0 },
            { i: 45, highestQual: 'level7', professionalQual: 'unknown', mapping: 0 },
            { i: 46, highestQual: 'level8', professionalQual: 'unknown', mapping: 0 },
            { i: 47, highestQual: 'none', professionalQual: 'unknown', mapping: null },
            { i: 48, highestQual: 'unknown', professionalQual: 'unknown', mapping: null },
        ]

    let first = true
    for (const test of testCases) {

        await san.gotoSan('Employment and education', true)
        if (first) {
            await san.employment1.employmentStatus.setValue('retired')
            await san.employment1.saveAndContinue.click()
            first = false
        }
        await setOptions(test.highestQual, test.professionalQual, san)
        log('', JSON.stringify(test))
        console.log(JSON.stringify(test))

        const caseFailed = await checkMapping(assessmentPk, test.mapping, test.i, oasys, assessment, san)
        if (caseFailed) {
            failed = true
            console.log('failed')
        }
    }

    await user.logout()
    expect(failed).toBeFalsy()
})

async function setOptions(highestQual: HighestQualOptions, professionalQual: ProfessionalQualOptions, san: San) {

    await san.employment2.highestQual.setValue(highestQual)
    await san.employment2.professionalQual.setValue(professionalQual)
}


async function checkMapping(assessmentPk: number, expectedValue: number, testCase: number, oasys: Oasys, assessment: Assessment, san: San): Promise<boolean> {

    await san.returnToOASys()
    await oasys.clickButton('Previous', true)
    await oasys.clickButton('Next', true)

    return await assessment.queries.checkSingleAnswer(assessmentPk, '4', '4.9', 'refAnswer', expectedValue?.toString(), testCase)
}