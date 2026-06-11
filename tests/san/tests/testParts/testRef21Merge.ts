import { San, SentencePlan, test } from 'fixtures'
import * as testData from '../../data/testRef21'

export function testRef21Merge(offender1: OffenderDef, offender2: OffenderDef, offender2Pks: number[]) {

    test('SAN integration - test ref 21 merge assessments', async ({ page, oasys, user, oasysDb, offender, assessment, signing, san, risk, sentencePlan, tasks }) => {

        log('Check original cloning details', 'Test step')
        const oasysSetQuery = `select os.cloned_from_prev_oasys_san_pk from eor.offender o, eor.oasys_assessment_group oag, eor.oasys_set os 
                                    where o.cms_prob_number = '${offender2.probationCrn}'
                                    and o.deleted_date is null
                                    and oag.offender_pk = o.offender_pk
                                    and os.oasys_assessment_group_pk = oag.oasys_assessment_group_pk
                                    order by os.initiation_date desc`
        const originalOffender2OasysSetData = await oasysDb.getData(oasysSetQuery)
        expect(originalOffender2OasysSetData[0][0]).toBe(offender2Pks[4].toString()) // Assessment 6
        expect(originalOffender2OasysSetData[1][0]).toBe(offender2Pks[2].toString()) // Assessment 5
        expect(originalOffender2OasysSetData[2][0]).toBe(offender2Pks[2].toString()) // Assessment 4
        expect(originalOffender2OasysSetData[3][0]).toBe(null) // Assessment 3
        expect(originalOffender2OasysSetData[4][0]).toBe(null) // Assessment 2
        expect(originalOffender2OasysSetData[5][0]).toBe(null) // Assessment 1

        log('Change offender 1 PNC to trigger the merge', 'Test step')

        await user.prob.probHeadPdu.login()
        await oasys.history(offender1)
        await offender.offenderDetails.pnc.setValue(offender2.pnc)
        page.once('dialog', async (dialog) => {
            await dialog.accept()
        })
        await offender.offenderDetails.save.click()
        await user.logout()

        log('Login to pilot area to grant the merge and retain ownership', 'Test step')
        await user.prob.probSanHeadPdu.login()
        await tasks.grantMerge(offender2.surname)

        log('Get new assessment PKs and oasys_set data', 'Test step')
        const mergedPks = await assessment.queries.getAllSetPksByPnc(offender2.pnc, true)

        const mergedOasysSetData = await oasysDb.getData(oasysSetQuery)

        expect(mergedOasysSetData[0][0]).toBe(mergedPks[5].toString()) // Assessment 6
        expect(mergedOasysSetData[1][0]).toBe(mergedPks[3].toString()) // Assessment 5
        expect(mergedOasysSetData[2][0]).toBe(mergedPks[3].toString()) // Assessment 4
        expect(mergedOasysSetData[3][0]).toBe(null) // Assessment 3
        expect(mergedOasysSetData[4][0]).toBe(null) // Assessment 2
        expect(mergedOasysSetData[5][0]).toBe(null) // Assessment 1
        expect(mergedOasysSetData[6][0]).toBe(null) // Assessment on offender 1

        await san.queries.checkSanMergeCall(user.prob.probSanHeadPdu, 5)

        /**
         * Merged offender has 7 assessments (latest on top)
         *  - 3.2 (Durham)
         *  - 3.2 (Durham)
         *  - 3.1 (Bedfordshire)
         *  - 3.2 (Durham)
         *  - 3.1 (Durham)
         *  - L1 (Durham)
         *  - 3.1 (Bedfordshire - offender 1)
         */
        await offender.searchAndSelect(offender2)
        await assessment.assessmentsTab.assessments.checkRowCount(7)

        log(`Check each of the 3.2 assessments - ensure you can open them up (READ ONLY) and navigate out to the SAN Service which opens that 
                version of the SAN assessment in READ ONLY MODE`, 'Test step')

        // 4th assessment (3rd from offender 2)
        await assessment.assessmentsTab.assessments.clickNthRow(4)
        await checkAssessment(user.prob.probSanHeadPdu.forenameSurname, offender2, mergedPks[3], san, sentencePlan)
        await oasys.clickButton('Close')

        // 6th assessment (5rd from offender 2)
        await assessment.assessmentsTab.assessments.clickNthRow(2)
        await checkAssessment(user.prob.probSanHeadPdu.forenameSurname, offender2, mergedPks[5], san, sentencePlan)
        await oasys.clickButton('Close')

        // 7th assessment (6th from offender 2)
        await assessment.assessmentsTab.assessments.clickNthRow(1)
        await checkAssessment(user.prob.probSanHeadPdu.forenameSurname, offender2, mergedPks[6], san, sentencePlan)
        await oasys.clickButton('Close')

        log('Test ref 21 part 5 - create assessment on merged offender', 'Test step')

        // Create and complete assessment 8 (layer 3 v2)
        const pk = await assessment.createProb({ purposeOfAssessment: 'Review', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })
        offender2Pks.push(pk)
        await san.gotoSan()
        await san.populateSanSections('Test ref 21', testData.assessment7, true)
        await san.returnToOASys()
        await risk.setRationaleText()
        await signing.signAndLock({ page: 'spService', expectRsrWarning: true })

        await user.logout()
    })
}

async function checkAssessment(user: string, offender1: OffenderDef, pk: number, san: San, sentencePlan: SentencePlan) {

    log(`Checking assessment pk ${pk}`)
    await san.gotoSanReadOnly()
    await san.queries.checkSanOtlCall(pk,
        {
            'crn': offender1.probationCrn,
            'pnc': offender1.pnc,
            'nomisId': null,
            'givenName': offender1.forename1,
            'familyName': offender1.surname,
            'dateOfBirth': offender1.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        {
            'displayName': user,
            'accessMode': 'READ_ONLY',
        },
        'san', 'assessment'
    )
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    await sentencePlan.spService.checkReadOnly()
    await san.queries.checkSanOtlCall(pk,
        {
            'crn': offender1.probationCrn,
            'pnc': offender1.pnc,
            'nomisId': null,
            'givenName': offender1.forename1,
            'familyName': offender1.surname,
            'dateOfBirth': offender1.dateOfBirth,
            'gender': '1',
            'location': 'COMMUNITY',
            'sexuallyMotivatedOffenceHistory': null,
        },
        {
            'displayName': user,
            'planAccessMode': 'READ_ONLY',
        },
        'sp', 'assessment'
    )
}