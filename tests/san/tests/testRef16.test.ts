import { test } from 'fixtures'
import * as testData from '../data/testRef16'

/*
New Male offender in PRISON which is a SAN prison area and the CMS stub has a custodial sentence on it for when the reception event takes place.  Age is >18.
Create new OASys-SAN assessment. 
Test will check the reassigning of the WIP task - drop down only comprises of those users who have the SAN Function.
Also incorporates check of Male OPD calculation AND Learning Screening Tool (data taken from the SAN assessment).
*/

test('SAN integration - test ref 16', async ({ oasys, user, offender, assessment, sections, tasks, san, risk }) => {

    await user.pris.prisSanUnappr.login()
    const offender1 = await offender.createPrisFromStandardOffender({ forename1: 'TestRefSixteen' })

    log(`Log in an Assessor who can complete SAN assessments.
        Open up the Offender record, create a new OASys-SAN assessment
        Close out of the OASys-SAN assessment and navigate to the Task Manager`)

    await assessment.createPris({ purposeOfAssessment: 'Start custody' })
    await oasys.clickButton('Close')
    await tasks.taskManager.goto()

    log(`Open up the Assessment WIP task for this assessment
        Click on the <Reassign to User> drop down field
        Ensure that ALL the users SHOWN HAVE the 'Use SAN Service' function in their role(s).
        You should NOT be able to reassign this assessment to a NON SAN service user.
        Pick one of the SAN users and reassign the task to them.`, 'Test step')

    await tasks.search({ taskName: 'Assessment Work in Progress', offenderName: offender1.surname })
    await tasks.selectFirstTask()

    await tasks.assessmentWipTask.reassignToUser.checkValueNotPresent(user.pris.prisSanCAdm.lovLookup)  // Case admin user doesn't have the SAN service so shouldn't be in the list
    await tasks.assessmentWipTask.reassignToUser.setValue(user.pris.prisSanPom.lovLookup)
    await tasks.assessmentWipTask.save.click()

    log(`Log out and log back in as the newly assigned assessor.
        Open up the Offender record and open the WIP OASys-SAN assessment - ensure the assessment is in full edit mode
        Navigate to the RoSH screening Section 1 and set R1.2 'Aggravated Burglary' Previous column to 'Yes' - this will invoke a full analysis`, 'Test step')

    await user.logout()
    await user.pris.prisSanPom.login()
    await offender.searchAndSelect(offender1)
    await assessment.openLatest()
    await san.gotoSan('Accommodation')
    await san.checkSanEditMode(true)
    await san.returnToOASys()

    // new oasys.Pages.Rosh.RoshScreeningSection1().goto().r1_2_6P.setValue('Yes')
    await risk.screeningSection1.goto()
    await risk.screeningSection1.r1_2_6P.setValue('Yes')

    log(`Navigate to the Summary Sheet screen 
        The Learning Screening Tool states 'Not enough items have been scored to identify whether this individual has a learning disability and/or learning challenges.'
        The OPD section states 'It was not possible to identify whether this individual has met criteria for the OPD pathway as not enough items were answered.'`, 'Test step')

    await assessment.summarySheet.goto()
    await assessment.summarySheet.learningScreeningTool.checkValue('Not enough items have been scored to identify whether this individual has a learning disability and/or learning challenges.', true)
    await assessment.summarySheet.opd.checkValue('It was not possible to identify whether this individual has met criteria for the OPD pathway as not enough items were answered.', true)

    log(`Navigate back to Section 1 Offending Information and complete the screen selecting a 'SEXUAL' offence
        Navigate to the RoSH Summary screen and set 10.6 PUBLIC risk to 'High'
        Navigate back to Section 1 Predictors screen and answer the questions making sure 1.8 works out to be >18`, 'Test step')

    await sections.offendingInformation.goto()
    await sections.offendingInformation.setValues({
        offence: '019', subcode: '08', count: '1', offenceDate: { months: -4 }
    })
    await risk.populateWithSpecificRiskLevel('Low')
    await risk.summary.r10_6PublicCommunity.setValue('High')
    await risk.summary.r10_6PublicCustody.setValue('High')

    await sections.predictors.goto(true)
    await sections.predictors.dateFirstSanction.setValue({ years: -3 })
    await sections.predictors.o1_32.setValue(1)
    await sections.predictors.o1_40.setValue(1)
    await sections.predictors.o1_29.setValue({ months: -6 })
    await sections.predictors.o1_44.setValue('No')
    await sections.predictors.o1_33.setValue({ months: -6 })
    await sections.predictors.o1_34.setValue(0)
    await sections.predictors.o1_45.setValue(0)
    await sections.predictors.o1_46.setValue(0)
    await sections.predictors.o1_37.setValue(0)
    await sections.predictors.o1_38.setValue({ months: -1 })

    log(`Navigate to the Summary Sheet screen - ensure that the OPD section has changed to 'This individual does not meet the criteria for the OPD pathway.'
        and the screen override field has defaulted to 'No'
        Now navigate out to the Strengths and Needs sections via the OASys screen`, 'Test step')

    await assessment.summarySheet.goto()
    await assessment.summarySheet.opdOverrideMessage.checkValue('This individual does not meet the criteria for the OPD pathway.', true)
    await assessment.summarySheet.opdOverride.checkValue('No')

    await san.gotoSan()

    log(`In the SAN Assessment answer the following questions as defined below:	
        The following set of SAN questions are for the Learning Screening Tool:
            In Accommodation 'What is ? current accommodation?' - select 'No accommodation'
            In Emplyment and Education 'Select highest level of academic qualification ? has completed' - select 'Entry level…'
            In Employment and Education 'Does ? have skills that could help them in a job or get a job?' - select 'No'
            In Employment and Education 'Does ? have any difficulties with reading, writing or numeracy?' - select 'Some difficulties' for Reading and Numeracy and select 'No difficulties' for Writing
            In Health and Wellbeing 'Does ? have any learning difficulties?' - select 'Yes - some learning difficulties'
            The following set of SAN questions are for the Male OPD score:
            In Offence Analysis 'Does ? Recognise the impact and consequences for others and the wider community' - select No
            In Finance 'Where does ? Currently get money from' - select 'Friends or Family'
            In Finance 'Is ? over reliant on family or friends' - select Yes
            In Thinking, behaviour… 'Does __ show stable behaviour?' - select 'Sometimes shows stable behaviour but can show reckless or risk taking behaviours'
            In Thinking, behaviour… 'Does __ show manipulative behaviour or a predatory lifestyle?' - select 'Some evidence that they show manipulative behaviour or act in a predatory way towards certain individuals'
            In Thinking, behaviour… 'Does ? use violence, aggressive or controlling behaviour to get their own way?' - select 'Some evidence of using violence, aggressive or controlling behaviour to get their own way'
            In Thinking, behaviour… 'Does __ act on impulse?' - select 'Sometimes acts on impulse which causes significant problems'
            In Personal relationships…. 'Did ? have any childhood behavioural problems?' - select Yes`, 'Test step')

    await san.populateSanSections('Test ref 16', testData.sanPopulation, true)

    log(`Return back to the OASys Assessment - goes back to the 'Open Strengths and Needs' screen
        Navigate to the Summary Sheet screen
        Ensure that the Learning Screening Tool section has changed to 'This individual may have a learning disability and/or learning challenges. 
        Further assessment may be needed to determine the support required. Consideration for referral for specialised assessment should be given, if appropriate.'
        Ensure that the OPD section has changed to 'This individual meets the criteria for the OPD pathway.'  
        Leave the assessment as WIP`, 'Test step')

    await san.returnToOASys()
    await assessment.summarySheet.goto()
    await assessment.summarySheet.learningScreeningTool.checkValue(
        'This individual may have a learning disability and/or learning challenges. Further assessment may be needed to determine the support required. Consideration for referral for specialised assessment should be given, if appropriate.',
        true)
    await assessment.summarySheet.opd.checkValue('This individual meets the criteria for the OPD pathway.', true)

    await user.logout()
})
