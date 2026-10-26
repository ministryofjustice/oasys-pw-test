import { test } from 'fixtures'
import { ogrsOracleTest } from './testLib'

// const pk = 4192377  // fully populated
// const pk = 9527359  // old 2.2 weapon
const pk = 2519012965


test(`OGRS calculator test - Assessment pk ${pk}`, async ({ ogrs }) => {

    await ogrsOracleTest('assessment', 1, `oasys_set_pk = ${pk}`, 'verbose', ogrs)
})

