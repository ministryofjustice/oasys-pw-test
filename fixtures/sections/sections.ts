import { Page } from '@playwright/test'

import * as pages from './pages'


export class Sections {

    constructor(private readonly page: Page) { }

    assessmentPk: number // Updated on creating an assessment.  Used at lock incomplete and sign&lock to call the OGRS4 regression test

    // Common pages
    readonly offenderInformation = new pages.OffenderInformation(this.page)
    readonly offendingInformation = new pages.OffendingInformation(this.page)
    readonly sourcesOfInformation = new pages.SourcesOfInformation(this.page)
    readonly predictors = new pages.Predictors(this.page)
    readonly selfAssessmentForm = new pages.SelfAssessmentForm(this.page)
    readonly additionalOffences = new pages.AdditionalOffences(this.page)

    // Layer 1
    readonly layer1Section2 = new pages.Layer1Section2(this.page)

    /**    
     * - A Heroin
     * - B Methadone(not prescribed)
     * - C Other opiates
     * - D Crack/Cocaine
     * - E Cocaine Hydrochloride
     * - F Misused prescribed drugs
     * - G Benzodiazepines
     * - H Amphetamines
     * - I Hallucinogens
     * - J Ecstasy
     * - K Cannabis
     * - L Solvents
     * - M Steroids
     * - P Spice
     * - Q Ketamine
     * - N Other
     */
    readonly predictorQuestions = new pages.PredictorQuestions(this.page)

    /**    
     * - A Heroin
     * - B Methadone(not prescribed)
     * - C Other opiates
     * - D Crack/Cocaine
     * - E Cocaine Hydrochloride
     * - F Misused prescribed drugs
     * - G Benzodiazepines
     * - H Amphetamines
     * - I Hallucinogens
     * - J Ecstasy
     * - K Cannabis
     * - L Solvents
     * - M Steroids
     * - P Spice
     * - Q Ketamine
     * - N Other
     */
    readonly roshaPredictors = new pages.RoshaPredictors(this.page)

    // Layer 3
    readonly section2 = new pages.Section2(this.page)
    readonly victim = new pages.Victim(this.page)
    readonly section3 = new pages.Section3(this.page)
    readonly section4 = new pages.Section4(this.page)
    readonly section5 = new pages.Section5(this.page)
    readonly section6 = new pages.Section6(this.page)
    readonly section7 = new pages.Section7(this.page)
    readonly section8 = new pages.Section8(this.page)
    readonly section9 = new pages.Section9(this.page)
    readonly section10 = new pages.Section10(this.page)
    readonly section11 = new pages.Section11(this.page)
    readonly section12 = new pages.Section12(this.page)
    readonly section13 = new pages.Section13(this.page)
    readonly summarySheet = new pages.SummarySheet(this.page)
    readonly fastReview = new pages.FastReview(this.page)


    async populateMinimal(params?: PopulateAssessmentParams) {

        switch (params?.layer) {
            case 'Layer 1':
                await this.offendingInformation.populateMinimal()
                await this.predictors.populateMinimal(params)
                await this.layer1Section2.populateMinimal()
                await this.selfAssessmentForm.populateMinimal()
                break
            case 'Layer 1V2':
                await this.roshaPredictors.populateMinimal(params)
                break
            case 'Layer 3':
                await this.offendingInformation.populateMinimal()
                await this.predictors.populateMinimal(params)
                await this.sections2To13NoIssues(params)
                await this.selfAssessmentForm.populateMinimal()
                break
            case 'Layer 3V2':
                await this.offendingInformation.populateMinimal()
                await this.predictors.populateMinimal(params)
                break
        }
    }

    async populateFull(params: PopulateAssessmentParams) {

        switch (params?.layer) {
            case 'Layer 1':
                await this.offendingInformation.populateFull(params)
                await this.predictors.populateFull(params)
                await this.layer1Section2.populateFull()
                await this.victim.victim1()
                await this.victim.victim2()
                await this.predictorQuestions.populateFull(true)
                await this.selfAssessmentForm.populateFull()
                break
            case 'Layer 1V2':
                await this.roshaPredictors.populateFull()
                break
            case 'Layer 3':
                await this.offendingInformation.populateFull(params)
                await this.predictors.populateFull(params)
                await this.sections2To13populateFull(params)
                await this.selfAssessmentForm.populateFull(params.maxStrings)
                break
            //     case 'Layer 3V2':
            //         await this.predictors.populateFull()
            //         await this.offendingInformation.populateFull()
            //         break
        }

    }


    async sections2To13NoIssues(params?: PopulateAssessmentParams) {

        await this.section2.populateNoIssues(true)
        await this.section3.populateNoIssues(true)
        await this.section4.populateNoIssues(true)
        await this.section5.populateNoIssues(true)
        await this.section6.populateNoIssues(params?.populate6_11, true)
        await this.section7.populateNoIssues(true)
        await this.section8.populateNoIssues(true)
        await this.section9.populateNoIssues(true)
        await this.section10.populateNoIssues(true)
        await this.section11.populateNoIssues(true)
        await this.section12.populateNoIssues(true)
    }

    async sections2To13populateFull(params: PopulateAssessmentParams) {

        await this.section2.populateFull(params.maxStrings)
        await this.victim.victim1()
        await this.victim.victim2()
        await this.section3.populateFull(params.maxStrings)
        await this.section4.populateFull(params)
        await this.section5.populateFull(params.maxStrings)
        await this.section6.populateFull(params.maxStrings)
        await this.section7.populateFull(params.maxStrings)
        await this.section8.populateFull(params.maxStrings)
        await this.section9.populateFull(params.maxStrings)
        await this.section10.populateFull(params.maxStrings)
        await this.section11.populateFull(params.maxStrings)
        await this.section12.populateFull(params.maxStrings)
        await this.section13.populateFull(params.maxStrings)
    }


}