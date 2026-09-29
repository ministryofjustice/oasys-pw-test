/**
 * Functions to interact with the SAN assessment and Sentence Plan, and check results.
 */

import { Page } from '@playwright/test'

import { Oasys, OasysDb, Risk, Sections } from 'fixtures'
import * as pages from './pages'
import { Queries } from './queries'
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

    readonly oasysSanSections = new pages.OasysSanSections(this.page)
    readonly landingPage = new pages.LandingPage(this.page)

    readonly queries = new Queries(this.oasysDb)


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
        await this.offenceAnalysis.populateMinimal(params)
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

    async populateForMaturityFlag(params?: SanPopulationParams) {

        if (params?.from == 'offender') {
            await this.gotoSanFromOffender()
        } else {
            await this.gotoSan()
        }
        log('Populating SAN questions for Maturity Flag')

        await this.accommodation.populateMinimal()
        await this.employment.populateMinimal()
        await this.finance.populateMinimal()
        await this.drugs.populateMinimal()
        await this.alcohol.populateMinimal()
        await this.health.populateMinimal()
        await this.relationships.populateMinimal()
        await this.thinking.populateForMaturityFlag()
        await this.offenceAnalysis.populateMinimal()

        await this.returnToOASys()
    }

    /**
     * Navigates to the SAN assessment, assuming you are somewhere in the OASys assessment.
     * 
     * The optional parameters can be used to jump straight to a particular section, and optionally into the information or analysis subsections.
     */
    async gotoSan(section: SanSection = null, supressLog: boolean = false) {

        await this.oasysSanSections.goto(true)
        await this.oasysSanSections.openSan.click()

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

        await this.oasysSanSections.goto(true)
        await this.oasysSanSections.openSan.click()

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
        await this.oasysSanSections.checkMenuVisibility(sanMode)
    }

    /**
     * Checks that the sections in an OASys SAN assessment are all marked complete or not on the floating menu.
     */
    async checkSanAssessmentCompletionStatus(expectedStatus: boolean, sections: Sections, san: San, risk: Risk) {

        await sections.offenderInformation.checkCompletionStatus(expectedStatus)
        await sections.sourcesOfInformation.checkCompletionStatus(expectedStatus)
        await sections.offendingInformation.checkCompletionStatus(expectedStatus)
        await sections.predictors.checkCompletionStatus(expectedStatus)
        await san.oasysSanSections.checkCompletionStatus(expectedStatus)
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
