import { test } from 'fixtures'
import { ogrsDf453Test } from './testLib'

const dataFile = 'tests/ogrs/data/local/unemployedRetest.csv'
const outputFile = 'test-results/ppUnemployed.csv'
const reportMode: ReportMode = 'none'
const count = 0

const specificPks = ['2516218746']
// const specificPks: string[] = null

test('OGRS pre-prod unemployed', async ({ ogrs }) => {

    test.setTimeout(0)
    await ogrsDf453Test(dataFile, count, reportMode, outputFile, ogrs, specificPks)
})
