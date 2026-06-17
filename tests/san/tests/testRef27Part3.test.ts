import { test } from 'fixtures'

test('SAN integration - test ref 27 part 3', async ({ oasys, user, cms, offender, assessment, san, sentencePlan, sns }) => {

    const offender1: OffenderDef = {

        forename1: 'TestRefTwentySeven-Three',
        gender: 'Male',
        dateOfBirth: { years: -40 },

        event: {
            eventDetails: {
                sentenceType: 'Custody (1 to 4 yrs - ACR)',
                sentenceDate: { months: -6 },
                sentenceMonths: 24,
            },
            offences:
            {
                offence: '028',
                subcode: '01',
            },
        },
    }

    log(`Lock Incomplete a prison OASys-SAN assessment when the Offender has been discharged from Prison (WIP guillotines immediately)`, 'Test step')

    await user.prob.probHeadPdu.login()

    await offender.createProb(offender1)
    await user.logout()

    await user.pris.prisSanUnappr.login()
    await cms.createReceptionEvent(offender1)

    log(`Create a PRISON offender in a SAN PILOT Prison area whose latest assessment is a PRISON WIP OASys-SAN assessment (not signed and locked).  
        ALL the SAN data has been validated and the sentence plan has been agreed
        The offender also has a Probation owner (NON SAN Pilot area).`, 'Test step')

    await offender.searchAndSelect(offender1)
    const pk1 = await assessment.createPris({ purposeOfAssessment: 'Start custody', assessmentLayer: 'Full (Layer 3)', includeSanSections: 'Yes' })

    await san.populateMinimal()
    await sentencePlan.populateMinimal()
    await oasys.clickButton('Next')
    await san.sanSections.checkCompletionStatus(true)
    await sentencePlan.sentencePlanService.checkCompletionStatus(true)

    log(`Open up the offender record
        Using the CMS stub submit a 'discharge' message for the offender
        The offender has now been released from prison - controlling owner is the Probation area and the WIP assessment is now showing as 'locked incomplete'`, 'Test step')

    await oasys.clickButton('Close')
    await cms.createDischargeEvent(offender1)

    log(`Make a note of the date and time in the OASYS_SET field 'LASTUPD_DATE'
        Check that Get Assessment has occurred BEFORE locking incomplete
        A Lock API has been sent to the SAN Service - parameters of OASYS_SET_PK, user ID and name - a 200 response has been received back
        Check that the OASYS_SET record has the field 'SAN_ASSESSMENT_VERSION_NO' and 'SSP_PLAN_VERSION_NO' populated by the return API response
        Ensure the SAN section and the SSP section have both been set to 'COMPLETE_LOCKED'
        Ensure an 'AssSumm' SNS Message has been created containing a ULR link for 'asssummsan'`, 'Test step')

    const oasysSetData1 = await san.queries.getOasysSetUpdateTimes(pk1)
    const lastUpdFromSan1 = oasysDateTime.stringToTimestamp(oasysSetData1[0])
    const lastUpdDate1 = oasysDateTime.stringToTimestamp(oasysSetData1[1])
    const questions1 = oasysDateTime.stringToTimestamp(await san.queries.getLatestQuestionUpdateTime(pk1))

    const sectionCount = await san.queries.getSanSectionsCount(pk1)
    expect(sectionCount).toBe(2)
    await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm'])

    await user.logout()

    await user.prob.probHeadPdu.login()
    await oasys.history(offender1)

    await offender.offenderDetails.controllingOwner.checkValue(providers.prob.nonSan)
    await assessment.assessmentsTab.assessments.checkData([{
        name: 'status',
        values: ['Locked Incomplete Assessment', 'Locked Incomplete Assessment']
    }])

    log(`Log in as a User in the Probation area.
        Search for and open up the now read only locked incomplete assessment, navigate to the 'Strengths and Needs' screen
        Click on the 'Open Strengths and Needs' button
        Taken into the SAN Service - ensure the assessment is shown all in READ ONLY format and that the SAN part of the assessment shows correctly
        Return back to the OASys part of the assessment
        Navigate out to the 'Sentence Plan Service' - ensure the sentence plan is shown all in READ ONLY format
        Return back to the OASys Assessment - goes back to the 'Sentence Plan Service' screen
        Close the assessment - back to the offender record`, 'Test step')

    await assessment.open(2)
    await san.gotoSanReadOnly()
    await san.checkSanEditMode(false)
    await san.returnToOASys()

    await sentencePlan.checkReadOnly()

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