import { test } from 'fixtures'
import { ogrsCsvTest } from './testLib'

const dataFile = 'tests/ogrs/data/dsTestCases.csv'
const outputFileY = 'test-results/dsTestResultsY.csv'
const outputFileN = 'test-results/dsTestResultsN.csv'
const reportMode: ReportMode = 'none'


test('OGRS calculator test - data science test cases (static flag N, mephedrone null)', async ({ ogrs }) => {

    await ogrsCsvTest(dataFile, 'N', null, reportMode, outputFileN, ogrs)
})

test('OGRS calculator test - data science test cases (static flag Y, mephedrone null)', async ({ ogrs }) => {

    await ogrsCsvTest(dataFile, 'Y', null, reportMode, outputFileY, ogrs)
})

test('OGRS calculator test - data science test cases (static flag N, mephedrone Y)', async ({ ogrs }) => {

    await ogrsCsvTest(dataFile, 'N', 'Y', reportMode, outputFileN, ogrs)
})

test('OGRS calculator test - data science test cases (static flag Y, mephedrone Y)', async ({ ogrs }) => {

    await ogrsCsvTest(dataFile, 'Y', 'Y', reportMode, outputFileY, ogrs)
})
