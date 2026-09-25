import { Page } from '@playwright/test'


export class BaseSanSection {

    constructor(readonly page: Page) { }

    readonly section: SanSection = null

    async goto() {

        await this.page.locator('.moj-side-navigation__item a').filter({ hasText: this.section }).first().click()
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
}