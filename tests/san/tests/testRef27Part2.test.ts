import { test } from 'fixtures'
import * as testData from '../data/testRef27'

test('SAN integration - test ref 27 part 2', async ({ oasys, user, cms, offender, assessment, san, sentencePlan }) => {

    log(`Lock Incomplete a prison OASys-SAN assessment when creating a new assessment where the internal transfer has stalled
        Create PRISON offender in a SAN PILOT Prison area whose latest assessment is a WIP OASys-SAN assessment (not signed and locked) and does NOT have a SARA.
        ALL the SAN data has been validated and the sentence plan has been agreed`, 'Test step')

    await user.pris.prisSanUnappr.login()
    const offender1 = await offender.createPrisFromStandardOffender({ forename1: 'TestRefTwentySeven-Two' })
    await user.logout()

    // First delete the BCS as it prevents the transfer
    await user.admin.login(providers.pris.san)
    await offender.searchAndSelect(offender1)
    await assessment.deleteLatest()
    await user.logout()

    await user.pris.prisSanUnappr.login()
    await offender.searchAndSelect(offender1)
    const pk1 = await assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await san.populateMinimal()
    await sentencePlan.populateMinimal()
    await oasys.clickButton('Previous')

    let failed = await assessment.queries.checkSingleAnswer(pk1, '9', '9.2', 'refAnswer', '0')  // above population sets binge drinking to no
    expect(failed).toBeFalsy()

    log(`Open up the offender record
        From the offender record click on the <Open S&N> button - taken into the SAN Assessment in EDIT mode
        Change or enter more data that will affect OASys into the SAN Assessment.  
        Take screenshots of your input but do not click on <Save and Continue> - just navigate to a different screen - we need 'unvalidated' data
        Return back to the Offender record`, 'Test step')

    await oasys.clickButton('Close')
    await san.gotoSanFromOffender()
    await san.populateSanSections('Test 27 part 4 SAN Alcohol', testData.test4ModifyAlcohol, true)
    await san.returnToOASys()

    log(`From the offender record click on the <Open SSP> button - taken into the Sentence Plan Service in EDIT mode
        Change or enter more data that changes the sentence plan e.g. add an objective.  Take screenshots of your input but do not agree the plan
        Return back to the Offender record`, 'Test step')

    await sentencePlan.spService.addGoal('offender')
    await user.logout()

    log(`Using the CMS stub submit an internal reception event to a NON SAN PILOT Prison area
            - the transfer will stall due to the WIP OASys assessment, the new prison will be noted in the 'Awaiting prison' field on the Offender Management tab
        Now log in as a user to the 'awaiting' NON SAN PILOT prison area.  
        Search for and open up the Offender record currently owned by the SAN Pilot probation area - will have 'full' access to the offender record`, 'Test step')

    await user.pris.prisHomds.login()
    offender1.receptionCode = 'TRANSFER IN FROM OTHER ESTABLISHMENT'
    await cms.enterPrisonStubDetailsAndCreateReceptionEvent(offender1)
    await offender.searchAndSelectByPnc(offender1.pnc, providers.pris.san)

    await offender.offenderDetails.offenderManagementTab.click()
    await offender.offenderManagementTab.awaitingPrisonOwner.checkValue(providers.pris.nonSan)

    log(`Click on the <Create Assessment> button - shown 'Work In Progress Assessment at another Establishment…. Recording (Work in Progress)….' message
        Click on the <Lock Incomplete> button - returns back to the Offender record
        The user now has full access to the offender and the assessment is showing as Locked Incomplete
        The controlling owner is now set to the Awaiting Prison Owner`, 'Test step')

    await oasys.clickButton('Create Assessment')
    await oasys.clickButton('Lock Incomplete')
    await offender.offenderDetails.controllingOwner.checkValue(providers.pris.nonSan)

    log(`Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'
        Check that Get Assessment has occurred BEFORE locking incomplete
        A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
        Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' populate by the return API response
        Check the database for the assessment and it shows data mapped from the updates carried out on the offender record
            above before the assessment was locked incomplete
        Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
        Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'`, 'Test step')

    await san.queries.checkSanLockIncompleteCall(pk1, user.pris.prisHomds)

    const oasysSetData1 = await san.queries.getOasysSetUpdateTimes(pk1)
    const lastUpdFromSan1 = oasysDateTime.stringToTimestamp(oasysSetData1[0])
    const lastUpdDate1 = oasysDateTime.stringToTimestamp(oasysSetData1[1])
    const questions1 = oasysDateTime.stringToTimestamp(await san.queries.getLatestQuestionUpdateTime(pk1))

    const sectionCount = await san.queries.getSanSectionsCount(pk1)
    expect(sectionCount).toBe(2)

    await san.queries.checkSanGetAssessmentCall(pk1, 0)
    failed = await assessment.queries.checkSingleAnswer(pk1, '9', '9.2', 'refAnswer', '2')  // change from offender record sets binge drinking
    expect(failed).toBeFalsy()

    log(`Open up the now read only assessment, navigate to the 'Strengths and Needs' screen
            Click on the 'Open Strengths and Needs' button
            Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment 
                shows correctly including the 'unvalidated' data that was captured in screenshots above (this proves that the SAN service ARE 
                creating versions of the SAN assessment with unvalidated data in it)
            Return back to the OASys part of the assessment
            Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format and you 
                can see the screenshot changes that were made above
            Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
            Close the assessment - back to the offender record`, 'Test step')

    await assessment.openLatest()
    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.goto('Alcohol use')
    await san.checkReadonlyText(
        `Has ${offender1.forename1} shown evidence of binge drinking or excessive alcohol use in the last 6 months?`,
        'Evidence of binge drinking or excessive alcohol use')
    await san.returnToOASys()

    await sentencePlan.spService.checkGoalCount(2, 0, 0, 'assessment', true)

    await oasys.clickButton('Close')

    log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
        and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`, 'Test step')

    const oasysSetData2 = await san.queries.getOasysSetUpdateTimes(pk1)
    const lastUpdFromSan2 = oasysDateTime.stringToTimestamp(oasysSetData2[0])
    const lastUpdDate2 = oasysDateTime.stringToTimestamp(oasysSetData2[1])
    const questions2 = oasysDateTime.stringToTimestamp(await san.queries.getLatestQuestionUpdateTime(pk1))

    expect(oasysDateTime.timestampDiff(questions1, questions2)).toBeLessThanOrEqual(0)
    expect(oasysDateTime.timestampDiff(lastUpdFromSan1, lastUpdFromSan2)).toBeLessThanOrEqual(0)
    expect(oasysDateTime.timestampDiff(lastUpdDate1, lastUpdDate2)).toBeLessThanOrEqual(0)

    await user.logout()

})