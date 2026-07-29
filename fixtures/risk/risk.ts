import { Page } from '@playwright/test'

import { Oasys, Sara, Sns } from 'fixtures'
import * as pages from './pages'
import { BaseAssessmentPage } from 'classes'


export class Risk {

    constructor(private readonly page: Page, private readonly oasys: Oasys, private readonly sara: Sara, private readonly sns: Sns) { }

    readonly baseAssessmentPage = new BaseAssessmentPage(this.page)
    readonly screeningSection1 = new pages.ScreeningSection1(this.page)
    readonly screeningSection2to4 = new pages.ScreeningSection2to4(this.page)
    readonly screeningSection5 = new pages.ScreeningSection5(this.page)
    readonly fullAnalysisSection62 = new pages.FullAnalysisSection62(this.page)
    readonly fullAnalysisSection7 = new pages.FullAnalysisSection7(this.page)
    readonly childAtRisk = new pages.ChildAtRisk(this.page)
    readonly fullAnalysisSection8 = new pages.FullAnalysisSection8(this.page)
    readonly fullAnalysisSection9 = new pages.FullAnalysisSection9(this.page)
    readonly summary = new pages.Summary(this.page)
    readonly rmp = new pages.Rmp(this.page)

    async screeningNoRisks(withRationale = false, probationCrn?: string) {

        await this.screeningSection1.populateMinimal()
        await this.screeningSection2to4.populateMinimal(withRationale)
    }

    /**
     * Enters minimum Rosh screening responses but with R1.2.1P set to Yes to get full analysis.
     * Sets risk flags to the risk level specified, and enters some basic text on risk summary and RMP.
     */
    async populateWithSpecificRiskLevel(risk: RiskLevel, probationCrn?: string, withRationale: boolean = false, provider?: Provider) {

        await this.screeningSection1.populateMinimal()
        await this.screeningSection1.r1_2_1P.setValue('Yes')
        await this.screeningSection2to4.populateMinimal(withRationale)
        await this.summary.populateWithSpecificRiskLevel(risk)
        if (probationCrn) {
            await this.saveAndCheckSns(probationCrn, true, false)
        }
        if (risk != 'Low') {
            await this.rmp.populateMinimalWithTextFields(provider == 'pris')
        }
    }

    async setRationaleText(text?: string) {

        await this.screeningSection2to4.goto()
        await this.screeningSection2to4.rationale.setValue(text ?? 'Generic rationale text')
    }

    async populateFull(params?: PopulateAssessmentParams) {

        await this.screeningSection1.populateFull(params)
        if (params.layer == 'Layer 3') {
            await this.oasys.clickButton('Next')    // Trigger SARA prompt
            await this.sara.cancelSara()
        }
        await this.screeningSection2to4.populateFull()
        await this.screeningSection5.populateFull()

        await this.fullAnalysisSection62.populateFull(params.maxStrings)
        await this.fullAnalysisSection7.goto()
        await this.childAtRisk.populateFullChild1(params.maxStrings)
        await this.childAtRisk.populateFullChild2(params.maxStrings)
        await this.fullAnalysisSection8.populateFull(params)
        await this.fullAnalysisSection9.populateFull(params.maxStrings)
        await this.summary.populateFull(params.maxStrings)
        if (params?.probationCrn) {
            await this.saveAndCheckSns(params.probationCrn, true, false)
        }
        await this.rmp.populateFull(params)
    }


    async saveAndCheckSns(probationCrn: string, expectRosh: boolean, expectPredictors: boolean) {

        await this.baseAssessmentPage.saveAndCheckSns(probationCrn, expectRosh, expectPredictors, this.sns)
    }

}