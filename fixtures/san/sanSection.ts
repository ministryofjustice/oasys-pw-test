import { Page } from '@playwright/test'

import { San } from 'fixtures'


export class BaseSanSection {

    constructor(readonly page: Page, readonly san: San) { }

    readonly section: SanSection = null

    async goto() {

        await this.san.goto(this.section)
    }

    async saveAndContinue() {

        await this.san.saveAndContinue()
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