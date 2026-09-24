import * as fs from 'fs-extra'

import { User, Offender, Assessment, Sections, San } from 'fixtures'

/**
 * Test script used by all of the mapping tests.  Need to run the aaSanMappingTestOffender script first to create an offender and store the details in a local file.
 */

export const mappingTestOffenderFile = 'tests/data/local/mappingTestsOffender'

export async function mappingTest(user: User, offender: Offender, assessment: Assessment, sections: Sections, san: San, script: SanScript, reset130: boolean = false) {

    const mappingTestOffender = await getMappingTestOffender()

    await user.admin.login(providers.prob.san)
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)
    await assessment.deleteAll(mappingTestOffender.surname, mappingTestOffender.forename1)
    await user.logout()

    await user.prob.probSanHeadPdu.login()
    await offender.searchAndSelectByCrn(mappingTestOffender.probationCrn)

    const assessmentPk = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })

    const failed = await san.runScript(assessmentPk, script, reset130, sections.predictors)
    expect(failed).toBeFalsy()

    await user.logout()
}

export async function getMappingTestOffender(): Promise<OffenderDef> {

    const testProcess = Number.parseInt(process.env.TEST_PARALLEL_INDEX)
    const offenderDetails = await fs.readFile(`${mappingTestOffenderFile}${testProcess}`)
    return JSON.parse(offenderDetails.toString()) as OffenderDef
}