import { test } from 'fixtures'


test('Create probation offenders with countersigned SAN assessment', async ({ oasys, user, offender, assessment, signing }) => {


    for (let i = 1; i <= 5; i++) {

        await user.prob.probSanUnappr.login()
        const offender1 = await offender.createProbFromStandardOffender({ forename1: `CSignedSanForRollback${i}` })
        await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        await assessment.populateMinimal({ layer: 'Layer 3V2' })

        await signing.signAndLock({ expectCountersigner: true, countersigner: user.prob.probSanHeadPdu })

        await user.logout()
        await user.prob.probSanHeadPdu.login()
        await signing.countersign({ offender: offender1 })
        await user.logout()
        
    }

})
