import { test } from 'fixtures'
import { mappingTest } from './xMappingTest'
import * as data from '../data/mapping'

// Ensure tests/data/local/mappingTestsOffender.txt has been updated by running tests/setup/sanMappingTestOffender first.

test('Mapping test: accommodation', async ({ oasys, user, offender, assessment, sections, san }) => {

    await mappingTest(user, offender, assessment, sections, san, data.Accommodation.script)
})