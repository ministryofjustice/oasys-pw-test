import { Locator, Page } from '@playwright/test'


export class Checkbox {

    selector: Locator

    constructor(page: Page, selector: string) {

        this.selector = page.locator(selector)
    }

    async setValue(value: boolean) {

        if (value) {
            await this.selector.check()
        }
        else {
            await this.selector.uncheck()
        }
    }

    async checkValue(value: boolean) {

        const statusAndValue = await this.getStatusAndValue()
        const actualValue = statusAndValue.value == 'true'
        expect(actualValue).toBe(value)
    }

    async checkStatus(status: ElementStatus) {

        const statusAndValue = await this.getStatusAndValue()    
        expect(statusAndValue.status).toBe(status)
    }

    /**
     * Gets the current value the checkbox, assumes it exists.
     */
    async getValue(): Promise<boolean> {

        const statusAndValue = await this.getStatusAndValue()
        return (statusAndValue.value == 'true')
    }


    /**
    * Gets the current status and value of a text element, assumes it exists
    * The return value is an ElementStatusAndValue object, containing status and value properties.
    */
    async getStatusAndValue(): Promise<ElementStatusAndValue> {

        const result: ElementStatusAndValue = { status: 'notVisible', value: '' }

        const count = await this.selector.count()

        if (count == 0) {
            return result
        }
        const visible = await this.selector.isVisible()
        const disabled = await this.selector.isDisabled()

        result.status = !visible ? 'notVisible' : disabled ? 'visible' : 'enabled'
        result.value = (await this.selector.isChecked()).toString()

        return result
    }

}
