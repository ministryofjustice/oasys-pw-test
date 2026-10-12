import { Locator, Page } from '@playwright/test'


export class Button {

    selector: Locator

    constructor(readonly page: Page, selector: string) {

        this.selector = selector.startsWith('#') || selector.includes('[')
            ? page.locator(selector).first()
            : page.getByRole('button', { name: selector }).first()
    }

    async click() {
        await this.selector.click()
        await waitForPageUpdate(this.page, 100)
    }

    async checkStatus(status: ElementStatus) {

        const actualStatus = await this.getStatus()
        expect(actualStatus).toBe(status)
    }

    async getStatus(): Promise<ElementStatus> {

        const count = await this.selector.count()
        if (count == 0) {
            return 'notVisible'
        }
        const visible = await this.selector.isVisible()
        const disabled = await this.selector.isDisabled()

        return !visible ? 'notVisible' : disabled ? 'visible' : 'enabled'
    }

}