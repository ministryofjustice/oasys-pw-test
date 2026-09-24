import * as fs from 'fs-extra'

/**
 * Offender script used by all of the mapping tests.  Need to run the /setup/sanMappingTestOffenders script first to create an offender and store the details in a local file.
 */

export const mappingTestOffenderFile = 'tests/data/local/mappingTestsOffender'

export async function getMappingTestOffender(): Promise<OffenderDef> {

    const testProcess = Number.parseInt(process.env.TEST_PARALLEL_INDEX)
    const offenderDetails = await fs.readFile(`${mappingTestOffenderFile}${testProcess}`)
    return JSON.parse(offenderDetails.toString()) as OffenderDef
}