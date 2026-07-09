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

    test(`Test - ${i}`, async ({ user, offender, assessment, sections }) => {

        const data = (await readSheet(filename, sheetName)) as string[][]
        const testCol = i + firstTestCol - 2
        const probationCrn = data[crnRow][testCol]
        const testData = getTestData(data, testCol)

        await user.prob.probHeadPdu.login()

        // TODO open existing offender
        // TODO delete all assessments
        const offender1 = await offender.createProbFromStandardOffender()
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
                    await sections.predictorQuestions.setValues(page.data)
                    break
                case 'Risk screening':
                    await sections.predictorQuestions.goto()
                    await sections.predictorQuestions.setValues(page.data)
                    break
                default:
                    throw ('Page name error')
            }
        }
// TODO save page
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

            switch (questionRow[typeCol - 1]) {
                case 'String':
                case 'Yes/No':
                    pageData[q] = questionRow[testCol]
                    break
                    case 'Date':
                    pageData[q] = // TODO convert Excel date to dd/mm/yyyy
                    break
                case 'Number':
                    pageData[q] = utils.stringToInt(questionRow[testCol])
                    break
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
    '2.2': '',
    '3.4': '',
    '4.2': '',
    '6.4': '',
    '6.7.2.1da': '',
    '6.8': '',
    '7.2': '',
    '8.1': '',
    '8.2.8.1': '',
    '8.2.7.1': '',
    '8.2.11.1': '',
    '8.2.4.1': '',
    '8.2.10.1': '',
    '8.2.9.1': '',
    '8.2.1.1': '',
    '8.2.16.1': '',
    '8.2.2.1': '',
    '8.2.6.1': '',
    '8.2.14.1': '',
    '8.2.3.1': '',
    '8.2.5.1': '',
    '8.2.12.1': '',
    '8.2.15.1': '',
    '8.2.13.1': '',
    '8.8': '',
    '9.1': '',
    '9.2': '',
    '11.2': '',
    '11.4': '',
    '12.1': '',
    'R1.2.6': '',
    'R1.2.7': '',
    'R1.2.8': '',
    'R1.2.10': '',
    'R1.2.2': '',
    'R1.2.1': '',
    'R1.2.9': '',
    'R1.2.12': '',
    'R1.2.13': '',

}