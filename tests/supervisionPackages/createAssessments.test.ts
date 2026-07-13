import { readSheet } from 'read-excel-file/node'

import { test } from 'fixtures'


const filename = 'tests/supervisionPackages/data/OGRS4 test inputs.xlsx'
const sheetName = 'Layer 1'
const pageCol = 1
const questionCol = 2
const typeCol = 4
const firstTestCol = 10
const numTests = 2
const crnRow = 2

type TestData = { page: string, data: PageData }[]

test.describe.serial('Create assessments', async () => {

    for (let i = 1; i <= numTests; i++) {
        runTest(i)
    }
})

function runTest(i: number) {

    test(`Create assessment - test case ${i}`, async ({ oasys, user, offender, assessment, sections, risk }) => {

        const data = (await readSheet(filename, sheetName)) as string[][]
        const testCol = i + firstTestCol - 2
        const probationCrn = data[crnRow - 1][testCol]
        const testData = getTestData(data, testCol)

        await user.admin.login(providers.prob.nonSan)
        await offender.searchAndSelectByCrn(probationCrn)
        await assessment.deleteLatest()
        await user.logout()
        await user.prob.probHeadPdu.login()
        await offender.searchAndSelectByCrn(probationCrn)
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })

        for (const page of testData) {

            switch (page.page) {
                case 'Predictors':
                    await sections.predictors.goto()
                    await sections.predictors.setValues(page.data)
                    break
                case 'Offence analysis':
                    await sections.layer1Section2.goto()
                    await sections.layer1Section2.setValues(page.data)
                    break
                case 'Predictor questions':
                    await sections.predictorQuestions.goto()
                    for (let elementName of Object.keys(page.data)) {

                        const element = sections.predictorQuestions[elementName as keyof sections.predictorQuestions]
                        await element.setValue(page.data[elementName])
                    }
            
                    break
                case 'Risk screening':
                    await risk.screeningSection1.goto()
                    await risk.screeningSection1.setValues(page.data)
                    break
                default:
                    throw ('Page name error')
            }
        }
        await oasys.clickButton('Save')
        await user.logout()
    })
}


function getTestData(data: string[][], testCol: number): TestData {

    const result: TestData = []
    const pages = data.map((row) => row[0]).filter(utils.onlyUnique).filter((value, index, array) => ![null, 'Page'].includes(array[index]))

    for (const page of pages) {

        const filteredData = data.filter((value, index, array) => array[index][pageCol - 1] == page)
        const pageData: PageData = {}

        for (const questionRow of filteredData) {

            const q = questionLookup[questionRow[questionCol - 1]]
            const a = questionRow[testCol]

            if (a) {
                switch (questionRow[typeCol - 1]) {
                    case 'String':
                    case 'Yes/No':
                        pageData[q] = a
                        break
                    case 'Date':
                        pageData[q] = ((a as unknown) as Date)?.toLocaleDateString()
                        break
                    case 'Number':
                        pageData[q] = utils.stringToInt(a)
                        break
                }
            }
        }
        result.push({ page: page, data: pageData })
    }

    return result
}


const questionLookup: { [key: string]: string } = {
    '1.8': 'dateFirstSanction',
    '1.32': 'o1_32',
    '1.40': 'o1_40',
    '1.29': 'o1_29',
    '1.30': 'o1_30',
    '1.41': 'o1_41',
    '1.44': 'o1_44',
    '1.33': 'o1_33',
    '1.34': 'o1_34',
    '1.45': 'o1_45',
    '1.46': 'o1_46',
    '1.37': 'o1_37',
    '1.38': 'o1_38',
    '1.43': 'o1_43',
    '2.2': 'o2_2Weapon',
    '3.4': 'o3_4',
    '4.2': 'o4_2',
    '6.4': 'o6_4',
    '6.7.2.1da': '',
    '6.8': 'o6_8',
    '7.2': 'o7_2',
    '8.1': 'o8_1',
    '8.2.8.1': 'hCurrent',
    '8.2.7.1': 'gCurrent',
    '8.2.11.1': 'kCurrent',
    '8.2.4.1': 'dCurrent',
    '8.2.10.1': 'jCurrent',
    '8.2.9.1': 'iCurrent',
    '8.2.1.1': 'aCurrent',
    '8.2.16.1': 'qCurrent',
    '8.2.2.1': 'bCurrent',
    '8.2.6.1': 'fCurrent',
    '8.2.14.1': 'nCurrent',
    '8.2.3.1': 'cCurrent',
    '8.2.5.1': 'eCurrent',
    '8.2.12.1': 'lCurrent',
    '8.2.15.1': 'pCurrent',
    '8.2.13.1': 'mCurrent',
    '8.8': 'o8_8',
    '9.1': 'o9_1',
    '9.2': 'o9_2',
    '11.2': 'o11_2',
    '11.4': 'o11_4',
    '12.1': 'o12_1',
    'R1.2.6': 'r1_2_6P',
    'R1.2.7': 'r1_2_7P',
    'R1.2.8': 'r1_2_8P',
    'R1.2.10': 'r1_2_10P',
    'R1.2.2': 'r1_2_2P',
    'R1.2.1': 'r1_2_1P',
    'R1.2.9': 'r1_2_9P',
    'R1.2.12': 'r1_2_12P',
    'R1.2.13': 'r1_2_13P',

}