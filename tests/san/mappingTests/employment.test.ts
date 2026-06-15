import { test } from 'fixtures'
import { mappingTest } from './xMappingTest'
import * as data from '../data/mapping'

// Ensure tests/data/local/mappingTestsOffender.txt has been updated by running aaSanMappingTestOffender first.

test('Mapping test: employment', async ({ oasys, user, offender, assessment, sections, san }) => {

    await mappingTest(user, offender, assessment, sections, san, data.Employment.script)
})