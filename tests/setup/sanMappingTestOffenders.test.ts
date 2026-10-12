import * as fs from 'fs-extra'

import { test } from 'fixtures'
import { userSuffixes } from 'localSettings'
import { mappingTestOffenderFile } from 'tests/san/mappingTests/mappingTestOffender'

/**
 * Creates an offender and writes the details to a local file.  This should be run before running any of the mapping tests.
 */

test('Create offender for SAN mapping tests', async ({ user, offender }) => {

    await user.prob.probSanUnappr.login()

    for (let i = 0; i < userSuffixes.length; i++) {
        const mappingTestOffender = await offender.createProbFromStandardOffender({ type: 'noEvent' })
        await fs.writeFile(`${mappingTestOffenderFile}-community-${i}`, JSON.stringify(mappingTestOffender))
    }

    await user.logout()
    
    await user.pris.prisSanPom.login()

    for (let i = 0; i < userSuffixes.length; i++) {
        const mappingTestOffender = await offender.createPrisFromStandardOffender({ type: 'noEvent' })
        await fs.writeFile(`${mappingTestOffenderFile}-custody-${i}`, JSON.stringify(mappingTestOffender))
    }

    await user.logout()
})


