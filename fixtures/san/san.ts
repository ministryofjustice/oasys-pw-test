/**
 * Functions to interact with the SAN assessment and Sentence Plan, and check results.
 */

import { Page } from '@playwright/test'

import { Element } from 'classes'
import { Oasys, OasysDb, Risk, Sections } from 'fixtures'
import * as pages from './pages'
import { sanIds } from './sanIds'
import { Queries } from './queries'
import { BaseSanEditPage } from './pages/baseSanEditPage'
import { Accommodation } from './accommodation/accommodation'
import { Employment } from './employment/employment'
import { Finance } from './finance/finance'
import { Drugs } from './drugs/drugs'
import { Alcohol } from './alcohol/alcohol'
import { Health } from './health/health'
import { Relationships } from './relationships/relationships'
import { Thinking } from './thinking/thinking'
import { OffenceAnalysis } from './offenceAnalysis/offenceAnalysis'


export class San {

    constructor(private readonly page: Page, private readonly oasys: Oasys, private readonly oasysDb: OasysDb) { }

    readonly accommodation = new Accommodation(this.page)
    readonly employment = new Employment(this.page)
    readonly finance = new Finance(this.page)
    readonly drugs = new Drugs(this.page)
    readonly alcohol = new Alcohol(this.page)
    readonly health = new Health(this.page)
    readonly relationships = new Relationships(this.page)
    readonly thinking = new Thinking(this.page)
    readonly offenceAnalysis = new OffenceAnalysis(this.page)

    readonly sanSections = new pages.SanSections(this.page)
    readonly baseSanEditPage = new BaseSanEditPage(this.page)
    readonly landingPage = new pages.LandingPage(this.page)
    readonly accommodationPractitionerAnalysis = new pages.PractitionerAnalysis(this.page, 'Accommodation', 'accommodation')

    readonly queries = new Queries(this.oasysDb)

    async previous() {

        await this.baseSanEditPage.previous.click()
    }

    async saveAndContinue() {

        await this.baseSanEditPage.saveAndContinue.click()
    }

    async openPractitionerAnalysis() {

        await this.page.locator('#tab_practitioner-analysis').first().click()
    }

    async change(i = 1) {

        await this.page.locator('.govuk-link:visible').filter({ hasText: 'Change' }).nth(i - 1).click()
    }

    async markAsComplete() {

        await this.page.getByText('Mark as complete').first().click()
    }

    async populateMinimal(params?: SanPopulationParams) {

        if (params?.from == 'offender') {
            await this.gotoSanFromOffender()
        } else {
            await this.gotoSan()
        }
        log('Minimally populating SAN sections')
        await this.accommodation.populateMinimal()
        await this.employment.populateMinimal()
        await this.finance.populateMinimal()
        await this.drugs.populateMinimal()
        await this.alcohol.populateMinimal()
        await this.health.populateMinimal()
        await this.relationships.populateMinimal()
        await this.thinking.populateMinimal(params)
        await this.offenceAnalysis.populateMinimal()
        await this.returnToOASys()
    }

    async populateForLst(params?: SanPopulationParams) {

        if (params?.from == 'offender') {
            await this.gotoSanFromOffender()
        } else {
            await this.gotoSan()
        }
        log('Populating SAN questions for LST')

        await this.accommodation.populateNoAccommodation()
        await this.employment.populateForLst()
        await this.finance.populateForLst()
        await this.health.populateForLst()
        await this.relationships.populateForLst()
        await this.thinking.populateForLst(params)
        await this.offenceAnalysis.populateForLst()

        await this.returnToOASys()
    }


    async populateForFemaleOpd(params?: SanPopulationParams) {

        if (params?.from == 'offender') {
            await this.gotoSanFromOffender()
        } else {
            await this.gotoSan()
        }
        log('Populating SAN questions for female OPD')

        await this.accommodation.populateForOpd()
        await this.employment.populateMinimal()
        await this.finance.populateMinimal()
        await this.drugs.populateMinimal()
        await this.alcohol.populateMinimal()
        await this.health.populateForOpd()
        await this.relationships.populateForOpd()
        await this.thinking.populateForOpd()
        await this.offenceAnalysis.populateForOpd()

        await this.returnToOASys()
    }

    async populateForSara(params?: SanPopulationParams) {

        if (params?.from == 'offender') {
            await this.gotoSanFromOffender()
        } else {
            await this.gotoSan()
        }
        log('Populating SAN questions for SARA')

        await this.accommodation.populateMinimal()
        await this.employment.populateForSara()
        await this.finance.populateMinimal()
        await this.drugs.populateForSara()
        await this.alcohol.populateForSara()
        await this.health.populateForSara()
        await this.relationships.populateForSara()
        await this.thinking.populateForSara(params)
        await this.offenceAnalysis.populateForSara()

        await this.returnToOASys()
    }

    /**
     * Navigates to the SAN assessment, assuming you are somewhere in the OASys assessment.
     * 
     * The optional parameters can be used to jump straight to a particular section, and optionally into the information or analysis subsections.
     */
    async gotoSan(section: SanSection = null, supressLog: boolean = false) {

        await this.sanSections.goto(true)
        await this.sanSections.openSan.click()

        await this.landingPage.confirmCheck.setValue(true)
        await this.landingPage.confirm.click()

        if (section) {
            await this.goto(section, supressLog)
        }
    }

    async gotoSanFromOffender(readonly = false) {

        await this.oasys.clickButton('Open S&N')
        if (!readonly) {
            await this.landingPage.confirmCheck.setValue(true)
            await this.landingPage.confirm.click()
        }
    }
    /**
     * Navigates to the SAN assessment in readonly mode (no landingPage), assuming you are somewhere in the OASys assessment.
     * 
     * The optional parameters can be used to jump straight to a particular section, and optionally into the information or analysis subsections.
     */
    async gotoSanReadOnly(section: SanSection = null) {

        await this.sanSections.goto(true)
        await this.sanSections.openSan.click()

        if (section) {
            await this.goto(section)
        }
    }

    /**
     * Select a SAN section on the menu using the text label on the menu
     */
    async goto(section: SanSection, supressLog: boolean = false) {

        if (!supressLog) {
            log(`Go to SAN section: ${section}`)
        }
        await this.page.locator('.moj-side-navigation__item a').filter({ hasText: section }).first().click()
    }

    /**
     * Click on the Return to OASys button.
     */
    async returnToOASys() {

        await this.page.locator('#return-to-oasys').click()
        await waitForPageUpdate(this.page)
    }

    /**
     * Check a text value on a readonly assessment.  Parameters are:
     *   - label: the text label for the item to be checked
     *   - text: the text to check
     */
    async checkReadonlyText(label: string, value: string) {

        const count = await this.page.locator('#main-content').locator(`.govuk-summary-list__row:has-text('${label}')`).filter({ hasText: value }).count()
        expect(count).toBeGreaterThan(0)
        log(`Checked value for ${label}`)
    }

    /**
     * Populate one or more sections of a SAN assessment.
     *  - name: text for reporting purposes
     *  - script: a SanPopulation object defining questions/values/button clicks for one or more sections.
     */
    async populateSanSections(name: string, script: SanPopulation, suppressLog: boolean = false) {

        if (suppressLog) {  // Just log the name
            log(name, 'Populating SAN Sections')
        }
        for (let section of script) {
            if (section.section != 'Sentence plan') {
                await this.goto(section.section, suppressLog)
            }
            await this.runScenario(`${name} / ${section.section}`, section.steps, suppressLog)
        }
    }

    /**
     * Populate the currently selected section in a SAN assessment.
     *  - name: text for reporting purposes
     *  - steps: a SanStep array defining all of the questions/values/button clicks required.
     */
    async runScenario(name: string, steps: SanStep[], suppressLog = false) {

        if (!suppressLog) {
            log(' ', '')
            log('', `Scenario: ${name}`)
            console.log(`Scenario: ${name}`)
        }
        for (let step of steps) {
            await this.runStep(step, suppressLog)
        }
    }

    /**
     * Execute a single test step on a SAN or SP screen, e.g. set a value or click a button.  The SanStep parameter defines the item and value(s) required.
     */
    async runStep(step: SanStep, suppressLog: boolean = false) {
        const stepItem = sanIds[step.item]
        if (stepItem == undefined) {
            throw new Error(`Invalid item name: ${step.item}`)
        }

        switch (stepItem.type) {
            case 'radio':
                await Element.Radiogroup.sanSetValue(this.page, stepItem, step.value)
                if (!suppressLog) log(`Radio: ${step.item} - '${step.value}'`)
                break
            case 'checkbox':
                await Element.Checkbox.sanSetValue(this.page, stepItem, step.value)
                if (!suppressLog) log(`Checkbox: ${step.item} - '${step.value}'`)
                break
            case 'textbox':
                await Element.Textbox.sanSetValue(this.page, stepItem, step.value)
                if (!suppressLog) log(`Textbox: ${step.item} - '${step.value.length > 50 ? step.value.substring(0, 50) + '...' : step.value}'`)
                break
            case 'combo':
                await Element.Combo.sanSetValue(this.page, stepItem, step.value)
                if (!suppressLog) log(`Combo: ${step.item} - '${step.value}'`)
                break
            case 'select':
                await Element.Select.sanSetValue(this.page, stepItem, step.value)
                if (!suppressLog) log(`Select: ${step.item} - '${step.value}'`)
                break
            case 'date':
                // await this.enterDate(stepItem, step.value)
                // log(`Date: ${step.item} - '${step.value}'`)
                break
            case 'action':
                await this.action(step.item)
                if (!suppressLog) log(`Action: ${step.item}`)
                break
            case 'button':
                await Element.Button.sanClick(this.page, stepItem)
                if (!suppressLog) log(`Button: ${step.item}`)
                break
        }
    }

    /**
     * Execute a single action-type test step (e.g. clicking a button).
     */
    async action(action: string) {

        switch (action) {
            case 'change':
                await this.page.locator('.govuk-link:visible').filter({ hasText: 'Change' }).first().click()
                break
            case 'change2':
                await this.page.locator('.govuk-link.change-entry:visible').nth(1).click()
                break
            case 'change3':
                await this.page.locator('.govuk-link.change-entry:visible').nth(2).click()
                break
            case 'back':
                await this.page.locator('.govuk-back-link').first().click()
                break
            case 'backIfVisible':
                const backLinks = await this.page.locator('.govuk-back-link').count()
                if (backLinks > 0) {
                    await this.page.locator('.govuk-back-link').first().click()
                }
                break
            case 'changeIfVisible':
                const changeLinks = await this.page.locator('.govuk-link:visible').filter({ hasText: 'Change' }).count()
                if (changeLinks > 0) {
                    await this.page.locator('.govuk-link:visible').filter({ hasText: 'Change' }).first().click()
                }
                break
            case 'practitionerAnalysis':
                await this.page.locator('#tab_practitioner-analysis').first().click()
                break
            case 'changeAnalysis':
                await this.page.locator('a[href*="-analysis"]').filter({ hasText: 'Change' }).first().click()
                break
            case 'continue':
                await this.page.locator('.questiongroup-action-buttons .govuk-button').first().click()
                break
        }
    }


    /**
     * Checks the floating menu to see if sections 2 to 13 and the self-assessment form are there or not, and checks for the SAN and SP sections.
     * Parameter is true for SAN mode, false for normal OASys mode (layer 3.1), the test fails if the menu is not as expected.
     */
    async checkLayer3Menu(sanMode: boolean, sections: Sections) {

        await sections.section2.checkMenuVisibility(!sanMode)
        await sections.section3.checkMenuVisibility(!sanMode)
        await sections.section4.checkMenuVisibility(!sanMode)
        await sections.section5.checkMenuVisibility(!sanMode)
        await sections.section6.checkMenuVisibility(!sanMode)
        await sections.section7.checkMenuVisibility(!sanMode)
        await sections.section8.checkMenuVisibility(!sanMode)
        await sections.section9.checkMenuVisibility(!sanMode)
        await sections.section10.checkMenuVisibility(!sanMode)
        await sections.section11.checkMenuVisibility(!sanMode)
        await sections.section12.checkMenuVisibility(!sanMode)
        await sections.section13.checkMenuVisibility(!sanMode)
        await sections.selfAssessmentForm.checkMenuVisibility(!sanMode)
        await this.sanSections.checkMenuVisibility(sanMode)
    }

    /**
     * Checks that the sections in an OASys SAN assessment are all marked complete or not on the floating menu.
     */
    async checkSanAssessmentCompletionStatus(expectedStatus: boolean, sections: Sections, san: San, risk: Risk) {

        await sections.offenderInformation.checkCompletionStatus(expectedStatus)
        await sections.sourcesOfInformation.checkCompletionStatus(expectedStatus)
        await sections.offendingInformation.checkCompletionStatus(expectedStatus)
        await sections.predictors.checkCompletionStatus(expectedStatus)
        await san.sanSections.checkCompletionStatus(expectedStatus)
        await risk.screeningSection1.checkCompletionStatus(expectedStatus)
        await risk.screeningSection2to4.checkCompletionStatus(expectedStatus)
        await risk.screeningSection5.checkCompletionStatus(expectedStatus)
    }

    /**
     * Assuming you are in the SAN assessment, check that the specified number of SAN sections are showing as complete.
     */
    async checkSanSectionsCompletionStatus(expectComplete: number) {

        await waitForPageUpdate(this.page)
        const count = await this.page.locator('.moj-side-navigation__list').locator('.section-complete').count()
        expect(count).toBe(expectComplete)
        log(`Checked SAN sections completion status: ${expectComplete} sections complete.`)
    }

    /**
     * Assuming you are in a SAN screen (not the section landing screen), checks that it is in edit mode (true) or readonly mode (false).  Test fails if not.
     */
    async checkSanEditMode(expectEdit: boolean) {

        const saveButtons = await this.page.locator('.govuk-button').filter({ hasText: 'Save and continue' }).count()
        const changeLinks = await this.page.locator('.govuk-link').filter({ hasText: 'Change' }).count()

        if (expectEdit && saveButtons == 0 && changeLinks == 0) {
            throw new Error(`Expected SAN to be in edit mode`)
        }
        if (!expectEdit && (saveButtons > 0 || changeLinks > 0)) {
            throw new Error(`Expected SAN NOT to be in edit mode`)
        }
        log(`Checked SAN edit mode: ${expectEdit}.`)
    }

}
