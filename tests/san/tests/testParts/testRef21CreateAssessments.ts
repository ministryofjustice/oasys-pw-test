import { test } from 'fixtures'
import * as testData from '../../data/testRef21'

export function testRef21CreateAssessments(offender1: OffenderDef, offender2: OffenderDef, offender1Pks: number[], offender2Pks: number[]) {

    test('SAN integration - test ref 21 create assessments', async ({ oasys, user, offender, assessment, signing, sections, san, risk, sns, tasks }) => {

        log(`SET UP OFFENDER 1 - is in a NON SAN pilot probation area - PNC is set to UNKNOWN PNC
            Offender has just one assessment
            FIRST - LAYER 3 v1 - oasys_set.cloned_from_previous_san_pk is NULL`, 'Test step')

        await user.prob.probHeadPdu.login()
        await oasys.history(offender1)
        // new oasys.Pages.Offender.OffenderDetails().pnc.setValue('UNKNOWN PNC')

        // Create assessment
        const offender1Pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })
        offender1Pks.push(offender1Pk1)
        await assessment.populateMinimal({ layer: 'Layer 3', populate6_11: 'No' })
        await signing.signAndLock({ expectRsrWarning: true })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS'])

        await user.logout()

        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${offender1Pk1}`, {
            SAN_ASSESSMENT_LINKED_IND: null,
            CLONED_FROM_PREV_OASYS_SAN_PK: null,
            SAN_ASSESSMENT_VERSION_NO: null,
            CLONED_IND: 'N',
        })

        log(`Set up offender 2.  Create these assessments in this order, doesn't matter what data is used, just need to get the assessments	
            FIRST - LAYER 1 V1 - oasys_set.cloned_from_previous_san_pk is NULL	
            SECOND - LAYER 3 v1 - oasys_set.cloned_from_previous_san_pk is NULL	
            THIRD - LAYER 3 v2 - oasys_set.cloned_from_previous_san_pk is NULL	
            Offender transfers to NON SAN pilot area	
            FOURTH - LAYER 3 v1 - oasys_set.cloned_from_previous_san_pk is SET to the PK of the THIRD assessment	
            Offender transfers back to SAN pilot area	
            FIFTH - LAYER 3 v2 - oasys_set.cloned_from_previous_san_pk is SET to the PK of the THIRD assessment	
            SIXTH - LAYER3 v2 - LAYER 3 v2 - oasys_set.cloned_from_previous_san_pk is SET to the PK of the FIFTH assessment`, 'Test step')

        await user.prob.probSanHeadPdu.login()  // No countersigning for this test

        // Create and complete assessment 1 (layer 1 v1)
        await oasys.history(offender2)
        const offender2Pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Basic (Layer 1)' })
        offender2Pks.push(offender2Pk1)

        await assessment.populateMinimal({ layer: 'Layer 1', sentencePlan: 'spService' })
        await signing.signAndLock()
        await sns.testSnsMessageData(offender2.probationCrn, 'assessment', ['AssSumm', 'OGRS'])

        // Create and complete assessment 2 (layer 3 v1)
        await oasys.history(offender2)
        const offender2Pk2 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'No' })
        offender2Pks.push(offender2Pk2)

        await sections.sections2To13NoIssues({ populate6_11: 'No' })
        await sections.selfAssessmentForm.populateMinimal()
        await signing.signAndLock({ page: 'spService', expectRsrWarning: true })
        await sns.testSnsMessageData(offender2.probationCrn, 'assessment', ['AssSumm', 'OGRS'])

        // Create and complete assessment 3 (layer 3 v2)
        await oasys.history(offender2)
        const offender2Pk3 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        offender2Pks.push(offender2Pk3)
        await san.gotoSan()
        await san.populateSanSections('Test ref 21', testData.assessment3, true)
        await san.returnToOASys()

        await risk.setRationaleText()
        await signing.signAndLock({ page: 'spService', expectRsrWarning: true })
        await sns.testSnsMessageData(offender2.probationCrn, 'assessment', ['AssSumm', 'OGRS'])
        await user.logout()

        // Transfer to Bedfordshire
        await user.prob.probHeadPdu.login()
        await offender.searchAndSelectByPnc(offender2.pnc, providers.prob.san)
        await offender.requestTransfer()
        await user.logout()

        await user.prob.probSanUnappr.login()
        await tasks.grantTransfer(offender2.surname)
        await user.logout()

        // Create and complete assessment 4 (layer 3 v1)
        await user.prob.probHeadPdu.login()
        await oasys.history(offender2)
        const offender2Pk4 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)' })
        offender2Pks.push(offender2Pk4)

        await sections.sections2To13NoIssues()
        await sections.selfAssessmentForm.populateMinimal()
        await signing.signAndLock({ page: 'spService', expectRsrWarning: true })
        await sns.testSnsMessageData(offender2.probationCrn, 'assessment', ['AssSumm', 'OGRS'])
        await user.logout()

        // Transfer back to Durham
        await user.prob.probSanHeadPdu.login()
        await oasys.history(offender2)
        await offender.requestTransfer()
        await user.logout()

        await user.prob.probHeadPdu.login()
        await tasks.grantTransfer(offender2.surname)
        await user.logout()

        // Create and complete assessment 5 (layer 3 v2)
        await user.prob.probSanHeadPdu.login()
        await oasys.history(offender2)
        const offender2Pk5 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        offender2Pks.push(offender2Pk5)

        await san.gotoSan()
        await san.populateSanSections('Test ref 21', testData.assessment5, true)
        await san.returnToOASys()
        await risk.setRationaleText()
        await signing.signAndLock({ page: 'spService', expectRsrWarning: true })
        await sns.testSnsMessageData(offender2.probationCrn, 'assessment', ['AssSumm', 'OGRS'])

        // Create and complete assessment 6 (layer 3 v2)
        await oasys.history(offender2)
        const offender2Pk6 = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        offender2Pks.push(offender2Pk6)
        await san.gotoSan()
        await san.populateSanSections('Test ref 21', testData.assessment6, true)
        await san.returnToOASys()
        await risk.setRationaleText()
        await signing.signAndLock({ page: 'spService', expectRsrWarning: true })
        await sns.testSnsMessageData(offender2.probationCrn, 'assessment', ['AssSumm', 'OGRS'])

        await user.logout()


    })
}
