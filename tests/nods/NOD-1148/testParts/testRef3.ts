import { test } from 'fixtures'


/**
 * Create a RoSHA assessment for a newly created MALE PROBATION offender - non-sexual offence
 * Check the 'Predictor' screen layout etc., calculation of new algorithms and so on
 * Invoke a full analysis - check the screen layout as per revised layout
 */

export function testRef3(offender1: OffenderDef, pks: { [key: number]: number }) {

    test('OGRS regression test ref 3', async ({ oasys, user, assessment, sections, risk, sns, signing, ogrs }) => {

        await user.prob.probHeadPdu.login()
        await oasys.history(offender1)
        pks[1] = await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

        log('Check the unpopulated values', 'Test step')
        await sections.roshaPredictors.goto()
        await sections.roshaPredictors.save.click() // generate a calculation
        let ogrsResult = await ogrs.checkOgrsInOasysSet(pks[1])

        log(`Go to the RoSH Screening section 1 and mark everything as 'No'
        Go to the RoSH Screening section 2 to 4 and mark everything as 'No' except R3.4 Vulnerability and answer that 'Yes'
        Navigate to the RoSH Summary screen
        Check that the RSR and OSP sections state the same as on the Predictors screen - 'Unable to calculate nnn due to missing details'`, 'Test step')
        await risk.screeningSection1.populateMinimal()
        await risk.screeningSection2to4.populateMinimal()
        await risk.screeningSection2to4.r3_4.setValue('Yes')
        await risk.screeningSection2to4.save.click()
        await ogrs.checkResultsOnRiskSummary(ogrsResult)

        log(`Enter in a date at 'Date of first sanction' to get 1.8 Age at first sanction' populated
            At 1.32 total number of sanctions enter 4
            At 1.40 How many of the total number of sanctions involved violent offences ? LEAVE BLANK
            At 1.29 enter in a date for 'Date of current conviction'
            At 1.30 select 'No'
            At 1.38 enter in a date for 'Date of commencement of community sentence or earliest possible release from custody'
            If 1.43 'Since dd/mm/yyyy, has Offender name committed any offences?  If Yes, what is the date the most recent offence was committed?' is shown on screen just leave it blank
            DO NOT ENTER ANY OTHER DATA   
            Click on the < SAVE > button and screen refreshes`, 'Test step')

        await sections.roshaPredictors.goto()
        await sections.roshaPredictors.dateFirstSanction.setValue({ years: -3 })
        await sections.roshaPredictors.o1_32.setValue(4)
        await sections.roshaPredictors.o1_29.setValue({ months: -6 })
        await sections.roshaPredictors.o1_30.setValue('No')
        await sections.roshaPredictors.o1_38.setValue({ months: -3 })
        await sections.roshaPredictors.save.click()

        log('Check the predictor values', 'Test step')
        ogrsResult = await ogrs.checkOgrsInOasysSet(pks[1])
        await ogrs.checkResultsOnRoshaPredictorsScreen(ogrsResult)

        log(`Now change 1.40 How many of the total number of sanctions involved violent offences? and enter 2
        Click on the <SAVE> button and screen refreshes`, 'Test step')

        await sections.roshaPredictors.o1_40.setValue(4)
        await sections.roshaPredictors.save.click()
        ogrsResult = await ogrs.checkOgrsInOasysSet(pks[1])
        await ogrs.checkResultsOnRoshaPredictorsScreen(ogrsResult)

        log(`On the Predictors screen compete entry of ALL the dynamic questions as below:
                2.2 weapon = No, 3.4 = 1 Some problems, 4.2 = 0 Not available for work, 6.4 = 2 significant problems, 6.7 = No, 6.8 = In a relationship living together, 7.2 = 1-Some problems'
                8.1 = Yes, Drugs table: for 'crack/cocaine' select 'Daily' for current usage and tick the other 3 checkboxes, for 'Ecstasy' select 'Occasional' and tick previous usage,
                for 'Spice' select 'Monthly' but leave previous usage blank
                8.8 = 1 some problems, 9.1 through to 12.1 select '1 some problems' for all of them
            Navigate to the next screen.
            Check the OASYS_SET record and ensure that along with other fields, OGP2_CALCULATED = 'Y' and the fields OGP2_PERCENTAGE_2YR and OGP2_BAND_RISK_RECON_ELM are populated,
            OVP2_CALCULATED = 'Y' and  the fields OVP2_PERCENTAGE_2YR and OVP2_BAND_RISK_RECON_ELM are populated
            Note: other fields maybe populated but these fields being populated means the code was called as we now have dynamic scores
            Also check that the original OGRS3 fields are set on the OASYS_SET record`, 'Test step')

        await sections.roshaPredictors.o1_39.setValue('Yes')
        await sections.roshaPredictors.o2_2.setValue('No')
        await sections.roshaPredictors.o3_4.setValue('1-Some problems')
        await sections.roshaPredictors.o4_2.setValue('0-Not available for work')
        await sections.roshaPredictors.o6_4.setValue('2-Significant problems')
        await sections.roshaPredictors.o6_7.setValue('No')
        await sections.roshaPredictors.o6_8.setValue('In a relationship, living together')
        await sections.roshaPredictors.o7_2.setValue('1-Some problems')
        await sections.roshaPredictors.o8_1.setValue('Yes')
        await sections.roshaPredictors.dCurrent.setValue('Daily')
        await sections.roshaPredictors.dCurrentlyInjected.setValue(true)
        await sections.roshaPredictors.dPrevious.setValue(true)
        await sections.roshaPredictors.dPreviouslyInjected.setValue(true)
        await sections.roshaPredictors.jCurrent.setValue('Occasional')
        await sections.roshaPredictors.jPrevious.setValue(true)
        await sections.roshaPredictors.jPrevious.setValue(true)
        await sections.roshaPredictors.pCurrent.setValue('Monthly')
        await sections.roshaPredictors.o8_8.setValue('1-Some problems')
        await sections.roshaPredictors.o9_1.setValue('1-Some problems')
        await sections.roshaPredictors.o9_2.setValue('1-Some problems')
        await sections.roshaPredictors.o11_2.setValue('1-Some problems')
        await sections.roshaPredictors.o11_4.setValue('1-Some problems')
        await sections.roshaPredictors.o12_1.setValue('1-Some problems')
        await sections.roshaPredictors.next.click()

        ogrsResult = await ogrs.checkOgrsInOasysSet(pks[1])
        expect(ogrsResult.outputParams.OGP2_CALCULATED).toBe('Y')
        expect(ogrsResult.outputParams.OGP2_PERCENTAGE).not.toBeNull()
        expect(ogrsResult.outputParams.OGP2_BAND).not.toBeNull()
        expect(ogrsResult.outputParams.OVP2_CALCULATED).toBe('Y')
        expect(ogrsResult.outputParams.OVP2_PERCENTAGE).not.toBeNull()
        expect(ogrsResult.outputParams.OVP2_BAND).not.toBeNull()
        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pks[1]}`, { ogrs3_1year: '34', ogrs3_2year: '51' })

        await oasys.clickButton('Previous')
        await ogrs.checkResultsOnRoshaPredictorsScreen(ogrsResult)

        log(`Complete entry of the full analysis, ensure that the DC-SRP, IIC-SRP and CSRP graphs show correctly on the ROSH Summary screen and select 'M' for the overall risk category
        Go back to the RoSH Screening , section 2 to 4 - will need to say 'No' at 2.3 and enter text 'Rationale'
        Sign and lock the assessment, ensure the CSRP message is still given
        Check that three SNS messages are created (asssumm, ogrs, rsr)`, 'Test step')

        await risk.fullAnalysisSection8.goto()
        await risk.fullAnalysisSection8.vulnerabilityAnalysis.setValue('Vulnerability')
        await risk.fullAnalysisSection8.roshOthers.setValue('No')
        await risk.summary.populateWithSpecificRiskLevel('Medium')
        await risk.rmp.populateFull({ layer: 'Layer 1V2' })
        await risk.screeningSection2to4.goto()
        await risk.screeningSection2to4.r2_3.setValue('No')
        await risk.screeningSection2to4.rationale.setValue('Because')

        await signing.signAndLock({ page: 'rmp', expectCsrpScore: true, csrpScoreMessage: '2.94% (Medium)' })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

        log(`Check that there is a record in the new table 'PREDICTOR_FEATURE_LINES' for this OASYS_SET_PK and it has stored ALL the fields coming back from the new Predictor calculator as at the last time it run
        Check the OASYS_SET record has the OGRS 3 yr1 and yr2 fields set and the existing OSP-DC, OSP-IIC, RSR and new predictor fields set correctly
        Open up the RoSHA - opens in READ ONLY mode throughout, not able to change anything`, 'Test step')

        await ogrs.checkFeatureLines(ogrsResult, pks[1])
        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pks[1]}`, { ogrs3_1year: '34', ogrs3_2year: '51' })
        await oasys.history(offender1, 'Risk of Harm Assessment')
        await sections.roshaPredictors.goto()
        await sections.roshaPredictors.o1_32.checkStatus('readonly')

        await user.logout()
    })

}