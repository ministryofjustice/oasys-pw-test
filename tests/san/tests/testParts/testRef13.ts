import { test } from 'fixtures'
import * as testData from '../../data/testRef13'

export function testRef13(offender1: OffenderDef, pks: number[]) {

    test('SAN integration - test ref 13 - Another 3.2 assessment in pilot area', async ({ offender, tasks, oasys, user, assessment, sections, san, signing }) => {

        log(`Log in as an Assessor that has the SAN function to the PILOT probation area
            Open up the offender record from Test Ref 12.  Transfer the offender back to the SAN PILOT probation area.
            Create a new 'review' assessment electing to use the SAN which has defaulted to NULL.`, 'Test step')

        await user.prob.probSanUnappr.login()
        await offender.searchAndSelectByPnc(offender1.pnc, providers.prob.nonSan)
        await offender.requestTransfer()
        await user.logout()

        await user.prob.probHeadPdu.login()
        await tasks.grantTransfer(offender1.surname)
        await user.logout()

        await user.prob.probSanUnappr.login()
        await offender.searchAndSelect(offender1)
        await assessment.getToCreateAssessmentPage()
        await assessment.createAssessmentPage.purposeOfAssessment.setValue('Review')
        await assessment.createAssessmentPage.includeSanSections.checkValue('')
        await assessment.createAssessmentPage.includeSanSections.setValue('Yes')
        await assessment.createAssessmentPage.create.click()
        const pk1 = (await assessment.queries.getAllSetPksByProbationCrn(offender1.probationCrn))[5]
        pks.push(pk1)

        log(`It will clone from the previous 3.1 assessment BUT then clear out all section 2 to 13 and SAQ data as it has been obtained from the living SAN assessment.
            Check the OASYS_SET record; field CLONED_FROM_PREV_OASYS_SAN_PK has been cloned through from the 3.1 assessment, fields SAN_ASSESSMENT_LINKED_IND = 'Y',
                LASTUPD_FROM_SAN is set from having obtained the SAN data and SAN_ASSESSMENT_VERSION_NO is NULL.`, 'Test step')

        const failed = await assessment.queries.checkAnswers(pk1, testData.clonedData, true)
        expect(failed).toBeFalsy

        log(`Fully complete the 3.2 OASys, you may want to go into the SAN Assessment and change some data and then ensure the SAN assessment is
            fully marked as complete for all sections.`, 'Test step')

        await san.gotoSan()
        await san.populateSanSections('TestRef13 modify SAN', testData.modifySan, true)
        await san.checkSanSectionsCompletionStatus(9)
        await san.returnToOASys()

        await signing.signAndLock({ page: 'spService', expectCountersigner: true, countersigner: user.prob.probSanHeadPdu })
        await user.logout()

        await user.prob.probSanHeadPdu.login()
        await signing.countersign({ offender: offender1 })
        await user.logout()

        log(`With the latest assessment being a completed 3.2, open it up and use the Admin option 'Mark assessments as historic'.
            The offender record is showing the <Open Strengths and Needs> button.  Click on it.  
            The Assessor is taken into the SAN Service and sees the latest SAN Assessment BUT it is in READ ONLY mode 
            (this is because the latest OASys-SAN assessment is now historic).  
            Return back to the Offender record in OASys.`, 'Test step')

        await user.admin.login(providers.prob.san)
        await offender.searchAndSelect(offender1)
        await assessment.openLatest()
        await assessment.markHistoric()
        await user.logout()

        await user.prob.probSanUnappr.login()
        await offender.searchAndSelect(offender1)

        await assessment.openLatest()
        await san.gotoSanReadOnly()
        await san.checkSanEditMode(false)
        await san.returnToOASys()
        await oasys.clickButton('Close')

        log(`Now create a new 3.2 OASys-SAN Assessment, the new SAN question defaults to 'Yes' and during the Create process say 'Yes' to cloning from the historic assessment.
            Check the CreateAssessment API to ensure that it posts TWO PKs across to the SAN service and the user ID and name.
            Check the OASYS_SET record; field CLONED_FROM_PREV_OASYS_SAN_PK has been set to the PK of of the last historic OASys-SAN assessment, fields SAN_ASSESSMENT_LINKED_IND = 'Y', 
            LASTUPD_FROM_SAN is set to a date and time as we have retrieved the data but SAN_ASSESSMENT_VERSION_NO is NULL.`, 'Test step')

        const pk2 = await assessment.createProb({ purposeOfAssessment: 'Review', includeSanSections: 'Yes' }, 'Yes')

        await san.queries.checkSanCreateAssessmentCall(pk2, pk1, pk1, user.prob.probSanUnappr, providers.prob.sanCode, 'REVIEW')

        log(`Check Section 1 of the assessment - ONLY 1.8 has cloned through.  
            The offence will not have cloned through unless it has been setup on the CMS stub and it gets copied from there.
            Data will have been copied through from the 'living' SAN assessment as we said 'Yes' to cloning.
            Leave the 3.2 OASys-SAN assessment as WIP.  This test proves the cloning through from a 'historic' 3.2 assessment.`, 'Test step')

        await sections.offendingInformation.goto()
        await sections.offendingInformation.offence.checkValue('')
        await sections.offendingInformation.sentence.checkValue('')
        await sections.offendingInformation.sentenceDate.checkValue('')

        await sections.predictors.goto()
        await sections.predictors.ageFirstSanction.checkValue('37')
        await sections.predictors.o1_32.checkValue(null)
        await sections.predictors.o1_40.checkValue(null)
        await sections.predictors.o1_29.checkValue('')
        await sections.predictors.o1_30.checkValue('')
        await sections.predictors.o1_38.checkValue('')
        await sections.predictors.arpText.checkValue('Unable to calculate', true)
        await sections.predictors.vrpText.checkValue('Unable to calculate', true)
        await sections.predictors.svrpText.checkValue('Unable to calculate', true)
        await sections.predictors.ospDcText.checkValue('Unable to calculate', true)
        await sections.predictors.ospIicText.checkValue('Unable to calculate', true)

        const failed2 = await assessment.queries.checkAnswers(pk1, testData.clonedAndModifiedData, true)
        expect(failed2).toBeFalsy()
        await user.logout()

    })
}