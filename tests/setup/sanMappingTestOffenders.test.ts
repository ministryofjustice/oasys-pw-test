import * as fs from 'fs-extra'

import { test } from 'fixtures'
import { userSuffixes } from 'localSettings'
import { mappingTestOffenderFile } from 'tests/san/mappingTests/xMappingTest'

/**
 * Creates an offender and writes the details to a local file.  This should be run before running any of the mapping tests.
 */

const initialOffenderDetails: OffenderDef = {

    forename1: 'MappingTest',
    gender: 'Male',
    dateOfBirth: { years: -40 },
}


test('Create offender for SAN mapping tests', async ({ oasys, offender }) => {

    await oasys.login(oasys.users.probSanHeadPdu)

    for (let i = 0; i < userSuffixes.length; i++) {
        const mappingTestOffender = await offender.createProb(initialOffenderDetails)
        await fs.writeFile(`${mappingTestOffenderFile}${i}`, JSON.stringify(mappingTestOffender))
    }

    await oasys.logout()
})


