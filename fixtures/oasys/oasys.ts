import { expect, Page, TestInfo } from '@playwright/test'
import { Temporal } from '@js-temporal/polyfill'


export class Oasys {

    constructor(private readonly page: Page, public readonly testInfo: TestInfo) { }


    async clickButton(label: string, suppressLog: Boolean = false) {

        await this.page.getByRole('button', { name: label }).first().click()
        await waitForPageUpdate(this.page, 50)
        if (!suppressLog) log(`Click button: ${label}`)
    }

    /**
     * Selects an item on the history menu.
     * 
     * If no parameters are provided, selects the first item on the menu, otherwise:
     * 
     * - history(surname, forename) - to select an offender by name
     * - history(surname, forename, assessment) - to select an assessment
     * 
     * or replace surname, forename with an Offender object, e.g.
     * 
     * - history(offender1)
     * - history(offender1, 'Start of Community Order')
     * 
     * (NOTE this will not work if the offender object contains auto-generated values that haven't been popuplated)
     */
    async history(): Promise<void>
    async history(surname: string, forename: string, assessment?: PurposeOfAssessment): Promise<void>
    async history(offender: OffenderDef, assessment?: PurposeOfAssessment): Promise<void>
    async history(p1?: OffenderDef | string, p2?: string, p3?: string): Promise<void> {

        await this.page.locator('#oasysmainmenu').getByText('History').click()

        if (p1 === undefined) {
            await this.page.locator('#history_1').click()
            log('First item', 'History menu')
            await waitForPageUpdate(this.page, 500)
            return null
        }

        let surname: string
        let forename: string
        let assessment: string

        if ((p1 as OffenderDef).surname === undefined) { // Not an Offender object, so treat parameters as strings
            surname = p1 as string
            forename = p2
            assessment = p3

        } else {
            const offender = (p1 as OffenderDef)
            surname = offender.surname
            forename = offender.forename1
            assessment = p2
        }

        if (surname === undefined || forename === undefined) {
            throw new Error(`Missing surname or forename in history data: ${surname}, ${forename}`)
        }

        const menuText = assessment == undefined ? `Offender - ${forename} ${surname}` : `${assessment} - ${forename} ${surname}`
        await this.page.getByText(menuText).click()
        log(menuText, 'History menu')
        await waitForPageUpdate(this.page, 500)

        return null
    }


    /**
     * Check for errors on screen in the standard OASys format
     */
    async checkErrorMessage(message: string) {

        await expect(this.page.getByText('Error(s) have occurred')).toBeVisible()
        const errors = await this.page.locator('.a-Notification-list').getByRole('listitem').allTextContents()
        expect(errors).toContain(message)
    }

    /**
     * Clicks the button that should trigger an alert, optionally checks the alert text then and accepts the alert.
     */
    async handleAlert(buttonToClick: string, exptectedText: string = null) {

        // Trap the alert
        this.page.once('dialog', async (dialog) => {
            if (exptectedText != null) {
                expect(dialog.message()).toBe(exptectedText)
                await dialog.accept()
            }
        })
        await this.clickButton(buttonToClick, true)
    }

    async screenshot() {

        const path = `playwright-report/${Temporal.Now.plainTimeISO().toString().replaceAll('/', '-').replaceAll(':', '.')}.png`
        const screenshot = await this.page.screenshot({ path: path, fullPage: true })
        await this.testInfo.attach(path, { body: screenshot, contentType: 'image/png' })
    }
}
