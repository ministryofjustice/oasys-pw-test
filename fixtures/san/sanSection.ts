import { Page } from '@playwright/test'
import { PractitionerAnalysis } from './pages'



export class BaseSanSection {

    constructor(readonly page: Page) { }

    readonly sectionName: SanSection = null
    readonly paPrefix: string = null
    readonly practitionerAnalysis: PractitionerAnalysis = null

    async goto() {

        await this.page.locator('.moj-side-navigation__item a').filter({ hasText: this.sectionName }).first().click()
    }

    async saveAndContinue() {

        await this.page.locator(`button[value='YES']`).first().click()
    }

    async markAsComplete() {

        await this.page.getByText('Mark as complete').first().click()
    }

    async openPractitionerAnalysis() {

        await this.page.locator('#tab_practitioner-analysis').first().click()
    }

    async change(i = 1) {

        await this.page.locator('.govuk-link:visible').filter({ hasText: 'Change' }).nth(i - 1).click()
    }

    async previous() {

        await this.page.locator('.govuk-back-link').first().click()
    }

    async completed(): Promise<boolean> {

        const changeCount = await this.page.locator('.govuk-link:visible').filter({ hasText: 'Change' }).count()
        return changeCount > 0
    }

    async backToStart() {

        const completed = await this.completed()
        if (completed) {
            await this.change()
            await waitForPageUpdate(this.page)
            // await this.page.locator('.moj-side-navigation__item--active a').filter({ hasText: this.sectionName }).isVisible()  // Ensure page update before next check
            // await this.page.waitForTimeout(1000)
        }
        
        let backCount: number
        do {
            backCount = await this.page.locator('.govuk-back-link').count()
            if (backCount > 0) {
                await this.previous()
                await waitForPageUpdate(this.page)
                // await this.page.locator('.moj-side-navigation__item--active a').filter({ hasText: this.sectionName }).isVisible()  // Ensure page update before next check
                // await this.page.waitForTimeout(1000)
            }
        } while (backCount > 0)
    }
}


// Generic radio/checkbox options
export const sanYesNoOptions: SanYesNo[] = ['yes', 'no']
export const sanYesNoNaOptions: SanYesNoNa[] = ['yes', 'no', 'na']
export const sanYesNoConcernsOptions: SanYesNoConcerns[] = ['yes', 'yesWithConcerns', 'no']
export const sanYesNoUnknownOptions: SanYesNoUnknown[] = ['yes', 'no', 'unknown']
export const sanYesSometimesNoOptions: SanYesSometimesNo[] = ['yes', 'sometimes', 'no']
export const sanNoSometimesYesOptions: SanYesSometimesNo[] = ['no', 'sometimes', 'yes']
export const sanYesPartlyNoOptions: SanYesPartlyNo[] = ['yes', 'partly', 'no']
export const sanYesHasBeenNoOptions: SanYesHasBeenNo[] = ['yes', 'hasBeen', 'no']
export const sanYesUnsureNoOptions: SanYesUnsureNo[] = ['yes', 'unsure', 'no']
export const sanYesLimitedNoOptions: SanYesLimitedNo[] = ['yes', 'limited', 'no']
export const sanYesSometimesNoUnknownOptions: SanYesSometimesNoUnknown[] = ['yes', 'sometimes', 'no', 'unknown']
export const sanYesNoSomeOptions: SanYesNoSome[] = ['yes', 'some', 'no']
export const sanSignificantSomeOptions: SanSignificantSome[] = ['significant', 'some']
export const sanPositiveMixedNegativeOptions: SanPositiveMixedNegative[] = ['positive', 'mixed', 'negative']
export const sanPositiveMixedNegativeUnknownOptions: SanPositiveMixedNegativeUnknown[] = ['positive', 'mixed', 'negative', 'unknown']
export const sanWantChangesOptions: (SanWantChanges | '-')[] = ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable']
