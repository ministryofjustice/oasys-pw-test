import { readSheet } from 'read-excel-file/node'

import { test } from 'fixtures'


const filename = 'tests/supervisionPackages/data/OGRS4 test inputs.xlsx'
const pageCol = 1
const questionCol = 2
const typeCol = 4
const firstTestCol = 10
const crnRow = 2


test.describe.serial('Create assessments', async () => {

    let data: string[][]

    test('Load data', async () => {

        data = (await readSheet(filename, 'Layer 1')) as string[][]
        const tests = data[0].length - firstTestCol

        for (let i = 1; i <= tests; i++) {

            const testCol = i + firstTestCol - 2
            const probationCrn = data[crnRow][testCol]
            const testData = getTestData(data, testCol)
            await runTest(probationCrn, testData)
        }
    })
})

type TestData = { page: string, data: PageData, }[]

function getTestData(data: string[][], testCol: number): TestData {

    const result: TestData = []
    const pages = data.map((row) => row[0]).filter(utils.onlyUnique).filter((value, index, array) => ![null, 'Page'].includes(array[index]))

    for (const page of pages) {

        const filteredData = data.filter((value, index, array) => array[index][pageCol - 1] == page)
        const pageData: PageData = {}
        for (const question of filteredData) {
            pageData[question[questionCol - 1]] = question[testCol]
        }
        result.push({ page: page, data: pageData })
    }

    return result
}

async function runTest(probationCrn: string, testData: TestData) {

    test('test', async ({ offender, assessment, sections }) => {

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
                default:
                    throw ('Page name error')
            }
        }

    })
}




type Questions = 'o1_8' | 'o1_32' | 'o1_40' | 'o1_29' | 'o1_30' | 'o1_41' | 'o1_44' | 'o1_33' | 'o1_34' | 'o1_45' | 'o1_46' | 'o1_37' | 'o1_38' | 'o1_43'

const rowLookup: { [key in Questions]: number } = {

    o1_8: 0,
    o1_32: 1,
    o1_40: 2,
    o1_29: 3,
    o1_30: 4,
    o1_41: 5,
    o1_44: 6,
    o1_33: 7,
    o1_34: 8,
    o1_45: 9,
    o1_46: 10,
    o1_37: 11,
    o1_38: 12,
    o1_43: 13,
}