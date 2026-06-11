import { test } from 'fixtures'
import { mappingTest } from './xMappingTest'
import * as data from '../data/mapping'

// Ensure tests/data/local/mappingTestsOffender.txt has been updated by running aaSanMappingTestOffender first.

test('Mapping test: offence analysis part 2', async ({ oasys, user, offender, assessment, sections, san }) => {

    await mappingTest(user, offender, assessment, sections, san, data.OffenceAnalysis2.script, true)
})