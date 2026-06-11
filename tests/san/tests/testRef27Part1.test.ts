import { test } from 'fixtures'
import * as testData from '../data/testRef27'

test('SAN integration - test ref 27 part 1', async ({ oasys, user, offender, assessment, san, sns, sentencePlan }) => {

    log(`Create an offender whose latest assessment is a WIP OASys-SAN assessment without a SARA.
        ALL the SAN data has been validated, sentence plan has been agreed.`, 'Test step')

    await user.prob.probSanUnappr.login()
    const offender1 = await offender.createProbFromStandardOffender({ forename1: 'TestRefTwentySeven' })

    // Check 'Lock Incomplete' - using the OASys application, different ways sends a notification to the SAN Service

    log(`Lock Incomplete OASys-SAN assessment (no SARA) from the Offender's Assessments Tab - SAN Data Validated, Sentence Plan has been agreed`, 'Test step')

    const pk1 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await san.populateMinimal()
    await sentencePlan.populateMinimal('spService')

    log(`Open up the offender record
        Click on the <Lock Incomplete> button and then click <OK> to confirm the action
        Assessment now showing as locked incomplete
        Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'`, 'Test step')

    await san.queries.getSanApiTimeAndCheckDbValues(pk1, 'Y', null)
    await oasys.clickButton('Close')
    await assessment.lockIncomplete()

    log(`A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
        Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
        Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
        Ensure an 'AssSumm' SNS Message has been created containing a URL link for 'asssummsan'`, 'Test step')

    await san.queries.checkSanLockIncompleteCall(pk1, user.prob.probSanUnappr)

    const part1InitialData = await san.queries.getOasysSetUpdateTimes(pk1)
    const part1LastUpdFromSan = oasysDateTime.stringToTimestamp(part1InitialData[0])
    const part1LastUpdDate = oasysDateTime.stringToTimestamp(part1InitialData[1])

    const part1SectionCount = await san.queries.getSanSectionsCount(pk1)
    expect(part1SectionCount).toBe(2)

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])

    const part1Questions1 = await san.queries.getLatestQuestionUpdateTime(pk1)

    log(`Open up the now read only assessment, navigate to the 'Strengths and Needs' screen
        Click on the 'Open Strengths and Needs' button
        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment shows correctly
        Return back to the OASys part of the assessment
        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format
        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
        Close the assessment - back to the offender record`, 'Test step')

    await assessment.openLatest()
    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    await sentencePlan.spService.checkReadOnly()

    await oasys.clickButton('Close')

    log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
        and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`, 'Test step')

    const part1Questions2 = await san.queries.getLatestQuestionUpdateTime(pk1)
    const part1UpdatedSetData = await san.queries.getOasysSetUpdateTimes(pk1)

    const part1LatestQuestionUpdDate1 = oasysDateTime.stringToTimestamp(part1Questions1)
    const part1LatestQuestionUpdDate2 = oasysDateTime.stringToTimestamp(part1Questions2)
    const part1LastUpdFromSan2 = oasysDateTime.stringToTimestamp(part1UpdatedSetData[0])
    const part1LastUpdDate2 = oasysDateTime.stringToTimestamp(part1UpdatedSetData[1])

    expect(oasysDateTime.timestampDiff(part1LatestQuestionUpdDate1, part1LatestQuestionUpdDate2)).toBeLessThanOrEqual(0)
    expect(oasysDateTime.timestampDiff(part1LastUpdFromSan, part1LastUpdFromSan2)).toBeLessThanOrEqual(0)
    expect(oasysDateTime.timestampDiff(part1LastUpdDate, part1LastUpdDate2)).toBeLessThanOrEqual(0)

    log(`Rollback the locked incomplete assessment
        Ensure the SAN service respond with a 200
        Lock incomplete the assessment again without any changes - ensure the SAN Service respond accordingly with a 200`, 'Test step')

    await user.logout()
    await user.admin.login(providers.prob.san)
    await offender.searchAndSelect(offender1)
    await assessment.openLatest()
    await assessment.rollBack('Test 27 part 1')
    await san.queries.checkSanRollbackCall(pk1, user.admin)
    await oasys.clickButton('Close')
    await assessment.lockIncomplete()
    await san.queries.checkSanLockIncompleteCall(pk1, user.admin)

    // Delete assessment in preparation for the next part
    await assessment.deleteLatest()
    await user.logout()

    log(`Lock Incomplete OASys-SAN assessment (no SARA) from the Offender's Assessments Tab - SAN Data Unvalidated, Sentence Plan NOT agreed`, 'Test step')

    log(`Create an offender whose latest assessment is a WIP OASys-SAN assessment without a SARA.  
        The SAN data is unvalidated and the sentence plan is NOT agreed`)

    await user.prob.probSanUnappr.login()
    await offender.searchAndSelect(offender1)

    const pk2 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    log(`Open up the offender record
        From the offender record click on the <Open S&N> button - taken into the SAN Assessment in EDIT mode
        Change or enter more data that will affect OASys into the SAN Assessment. 
        Take screenshots of your input but do not click on <Save and Continue> - just navigate to a different screen - we need 'unvalidated' data
        Return back to the Offender record`, 'Test step')

    await oasys.clickButton('Close')
    await san.gotoSanFromOffender()
    await san.populateSanSections('Test 27 part 2 SAN Alcohol', testData.test2SanAlcohol, true)
    await san.returnToOASys()

    log(`From the offender record click on the <Open SSP> button - taken into the Sentence Plan Service in EDIT mode
        Change or enter more data that changes the sentence plan e.g. add an objective.  Take screenshots of your input but do not agree the plan
        Return back to the Offender record`, 'Test step')

    await sentencePlan.spService.addGoal('offender')

    log(`In the Assessments tab, click on the <Lock Incomplete> button and then click <OK> to confirm the action
        Assessment now showing as locked incomplete
        Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'`, 'Test step')

    await san.queries.getSanApiTimeAndCheckDbValues(pk2, 'Y', null)
    await assessment.lockIncomplete()

    log(`A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
        Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
        Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
        Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`, 'Test step')

    await san.queries.checkSanLockIncompleteCall(pk2, user.prob.probSanUnappr)

    const part2InitialData = await san.queries.getOasysSetUpdateTimes(pk2)
    const part2Questions1 = await san.queries.getLatestQuestionUpdateTime(pk2)

    const part2LastUpdFromSan1 = oasysDateTime.stringToTimestamp(part2InitialData[0])
    const part2LastUpdDate1 = oasysDateTime.stringToTimestamp(part2InitialData[1])
    const part2LatestQuestionUpdDate1 = oasysDateTime.stringToTimestamp(part2Questions1)

    const sectionCount2 = await san.queries.getSanSectionsCount(pk2)
    expect(sectionCount2).toBe(2)
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])

    log(`Open up the now read only assessment, navigate to the 'Strengths and Needs' screen
        Click on the 'Open Strengths and Needs' button
        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment shows correctly including the 'unvalidated' data that was captured in screenshots above (this proves that the SAN service ARE creating versions of the SAN assessment with unvalidated data in it)
        Return back to the OASys part of the assessment
        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format and you can see the screenshot changes that were made above
        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
        Close the assessment - back to the offender record`, 'Test step')

    await assessment.openLatest()
    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    await sentencePlan.spService.checkReadOnly()

    await oasys.clickButton('Close')

    log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
        and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`, 'Test step')

    const part2Questions2 = await san.queries.getLatestQuestionUpdateTime(pk2)
    const part2UpdatedSetData = await san.queries.getOasysSetUpdateTimes(pk2)

    const part2LatestQuestionUpdDate2 = oasysDateTime.stringToTimestamp(part2Questions2)
    const part2LastUpdFromSan2 = oasysDateTime.stringToTimestamp(part2UpdatedSetData[0])
    const part2LastUpdDate2 = oasysDateTime.stringToTimestamp(part2UpdatedSetData[1])

    expect(oasysDateTime.timestampDiff(part2LatestQuestionUpdDate1, part2LatestQuestionUpdDate2)).toBeLessThanOrEqual(0)
    expect(oasysDateTime.timestampDiff(part2LastUpdFromSan1, part2LastUpdFromSan2)).toBeLessThanOrEqual(0)
    expect(oasysDateTime.timestampDiff(part2LastUpdDate1, part2LastUpdDate2)).toBeLessThanOrEqual(0)

    log(`Lock Incomplete a probation OASys-SAN assessment (no SARA) when creating a new assessment and are prompted with decision to make`, 'Test step')

    log(`Create an offender whose latest assessment is a WIP OASys-SAN assessment without a SARA.  
            ALL the SAN data has been validated but the sentence plan is NOT agreed`, 'Test step')

    const pk3 = await assessment.createProb({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await san.gotoSan()
    await san.populateSanSections('Test 27 part 3 Complete SAN', testData.part3CompleteSan, true)
    await san.returnToOASys()
    await user.logout()

    await san.queries.getSanApiTimeAndCheckDbValues(pk3, 'Y', pk2)
    log(`Log in as a user in a different NON SAN PILOT probation area.  
        Search for and open up the Offender record in the SAN Pilot probation area - will currently have 'boilerplate' access
        Click on the <Create Assessment> button - shown 'This offender is currently controlled by….' message
        Click on <Yes> - now get 'WIP Assessment Screen' with various options
        Click on <Yes - Guillotine WIP Immediately> - returns back to the Offender record
        The user still has boilerplate access as they haven't yet created an assessment - just wanted to use this way for guilloting
        Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'`, 'Test step')

    await user.prob.probHeadPdu.login()
    await offender.searchAndSelectByPnc(offender1.pnc, providers.prob.san)
    await oasys.clickButton('Create Assessment')
    await oasys.clickButton('Yes')
    await oasys.clickButton('Yes - Guillotine WIP Immediately')

    log(`A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
        Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
        Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
        Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`, 'Test step')

    await san.queries.checkSanLockIncompleteCall(pk3, user.prob.probHeadPdu)

    const part3InitialData = await san.queries.getOasysSetUpdateTimes(pk3)
    const part3Questions1 = await san.queries.getLatestQuestionUpdateTime(pk3)

    const part3LastUpdFromSan1 = oasysDateTime.stringToTimestamp(part3InitialData[0])
    const part3LastUpdDate1 = oasysDateTime.stringToTimestamp(part3InitialData[1])
    const part3LatestQuestionUpdDate1 = oasysDateTime.stringToTimestamp(part3Questions1)

    const part3Sections = await san.queries.getSanSectionsCount(pk3)
    expect(part3Sections).toBe(2)

    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])
    await user.logout()

    log(`Log back in as a user from the probation area of the offender
            Open up the now read only assessment, navigate to the 'Strengths and Needs' screen
            Click on the 'Open Strengths and Needs' button
            Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment shows correctly
            Return back to the OASys part of the assessment
            Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format
            Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
            Close the assessment - back to the offender record`, 'Test step')

    await user.prob.probSanUnappr.login()
    await oasys.history(offender1)
    await assessment.openLatest()
    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    await sentencePlan.spService.checkReadOnly()

    await oasys.clickButton('Close')

    log(`Check that NONE of the OASys-SAN assessment data has been updated - look at the last update dates in question and answers
        and also on the OASYS_SET record and ensure they are NOT after the date and time noted above`, 'Test step')

    const part3Questions2 = await san.queries.getLatestQuestionUpdateTime(pk3)
    const part3UpdatedSetdata = await san.queries.getOasysSetUpdateTimes(pk3)

    const part3LatestQuestionUpdDate2 = oasysDateTime.stringToTimestamp(part3Questions2)
    const part3LastUpdFromSan2 = oasysDateTime.stringToTimestamp(part3UpdatedSetdata[0])
    const part3LastUpdDate2 = oasysDateTime.stringToTimestamp(part3UpdatedSetdata[1])

    expect(oasysDateTime.timestampDiff(part3LatestQuestionUpdDate1, part3LatestQuestionUpdDate2)).toBeLessThanOrEqual(0)
    expect(oasysDateTime.timestampDiff(part3LastUpdFromSan1, part3LastUpdFromSan2)).toBeLessThanOrEqual(0)
    expect(oasysDateTime.timestampDiff(part3LastUpdDate1, part3LastUpdDate2)).toBeLessThanOrEqual(0)

    await user.logout()
})
