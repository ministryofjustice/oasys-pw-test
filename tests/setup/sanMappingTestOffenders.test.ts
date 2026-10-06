import * as fs from 'fs-extra'

import { test } from 'fixtures'
import { mappingTestOffenderFile } from 'tests/san/mappingTests/mappingTestOffender'
import { userSuffixes } from 'localSettings'

const tests = [
    'accommodation',
    'alcohol',
    'controlCharacters',
    'drugsDetails',
    'drugsPA',
    'employment',
    'finance',
    'health',
    'offenceAnalysis',
    'question4-9',
    'question6-7',
    'question6-8',
    'relationships',
    'thinking',
    'victims',
]
/**
 * Creates an offender and writes the details to a local file; creates an assessment to be used after deployment of SAN v2
 */

test('Create offender for SAN mapping tests', async ({ assessment, user, offender }) => {

    await user.prob.probSanUnappr.login()

    for (let u = 0; u < userSuffixes.length; u++) {
        for (const t of tests) {
            const mappingTestOffender = await offender.createProbFromStandardOffender({ type: 'noEvent', forename1: `SANV1-${t}${userSuffixes[u]}` })
            await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes', selectAssessor: `[AUTOSANUNAPPR${userSuffixes[u]}]` })
            await fs.writeFile(`${mappingTestOffenderFile}-${t}-${u}`, JSON.stringify(mappingTestOffender))
        }
    }

    await user.logout()
})


