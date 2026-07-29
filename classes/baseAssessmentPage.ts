import { OasysPage, Element } from 'classes'
import { Sns } from 'fixtures'

/**
 * this.page is a base class for assessment pages that contain the standard navigation buttons
 */
export class BaseAssessmentPage extends OasysPage {

    name = 'BaseAssessmentPage'

    context = new Element.Text(this.page, '#contextright')
    private saveButton = new Element.Button(this.page, 'Save')
    private nextButton = new Element.Button(this.page, 'Next')
    private previousButton = new Element.Button(this.page, 'Previous')
    private closeButton = new Element.Button(this.page, 'Close')
    print = new Element.Button(this.page, 'Print')
    markAsComplete = new Element.Button(this.page, 'Mark As Complete')

    async save() {

        await this.saveButton.click()
    }

    async next() {

        await this.nextButton.click()
    }

    async previous() {

        await this.previousButton.click()
    }

    async close() {

        await this.closeButton.click()
    }

    /**
     * Navigate to the page, click on Mark as Complete, and then check that the section is marked complete.
     */
    async markCompleteAndCheck() {

        await this.goto()
        await this.markAsComplete.click()
        await this.checkCompletionStatus(true)
    }

    /**
     * Checks that a section has the expected completion status on the floating menu.  Parameter is true if expected to be complete.
     */
    async checkCompletionStatus(expectedStatus: boolean) {

        let imageTitle: string
        await this.waitForAnimation(this.floatingMenu)

        if (this.menu.level2 === undefined) {
            imageTitle = await this.floatingMenu.locator(`li:has-text('${this.menu.level1}') img`).getAttribute('title')

        } else {
            // two levels: check if first level is expanded already, if not then click on the first
            const level1LinkExpanded = this.page.locator('.active.expanded').filter({ hasText: this.menu.level1 })
            const level1Expanded = await level1LinkExpanded.isVisible()

            if (!level1Expanded) {
                await this.floatingMenu.locator('.expandable').filter({ hasText: this.menu.level1 }).click()
                await this.waitForAnimation(this.floatingMenu)
            }
            const imageCount = await this.floatingMenu.locator(`li:has-text('${this.menu.level1}') li:has-text('${this.menu.level2}') img`).count()
            if (imageCount > 0) {
                imageTitle = await this.floatingMenu.locator(`li:has-text('${this.menu.level1}') li:has-text('${this.menu.level2}') img`).getAttribute('title')
            }
        }

        const complete = imageTitle == 'Section Complete'

        expect(complete).toBe(expectedStatus)
        log(`${this.name} - completion status: ${complete}.`)
    }

    async getPncFromScreenContext(): Promise<string> {

        await expect(this.page.locator('#contextright')).toContainText('|')
        const context = await this.context.getValue()
        return context.split('|')[3].trim()
    }

    async saveAndCheckSns(probationCrn: string, expectRosh: boolean, expectPredictors: boolean, sns: Sns) {

        await this.save()
        await sns.testWipAssessmentMessages(probationCrn, expectRosh, expectPredictors)
    }

    async nextAndCheckSns(probationCrn: string, expectRosh: boolean, expectPredictors: boolean, sns: Sns) {

        await this.next()
        await sns.testWipAssessmentMessages(probationCrn, expectRosh, expectPredictors)
    }

    async previousAndCheckSns(probationCrn: string, expectRosh: boolean, expectPredictors: boolean, sns: Sns) {

        await this.previous()
        await sns.testWipAssessmentMessages(probationCrn, expectRosh, expectPredictors)
    }

}


