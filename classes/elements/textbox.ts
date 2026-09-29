import { Locator, Page } from '@playwright/test'


export class Textbox<T> {

    selector: Locator

    constructor(private readonly page: Page, selector: string, private readonly dateType: boolean = false) {

        this.selector = page.locator(selector)
    }

    async setValue(value: T) {

        let textValue = value as string
        if (value == null) {
            textValue = ''
        } else if (typeof value == 'number') {
            textValue = value == 0 ? '0' : value.toString()
        } else if (typeof value != 'string') {
            textValue = oasysDateTime.oasysDateAsString(value as OasysDate)
        }
        if (this.dateType) {  // Handle date fields, the normal fill doesn't work for these
            await this.page.waitForTimeout(200)
            await this.selector.clear()
            await this.page.waitForTimeout(200)
            await this.selector.pressSequentially(textValue, { delay: 100 })
        } else {
            await this.selector.fill(textValue)
        }
    }

    async checkValue(value: T, partial: boolean = false) {

        let textValue = value as string
        if (value == null) {
            textValue = ''
        } else if (typeof value == 'number') {
            textValue = value == 0 ? '0' : value.toString()
        } else if (typeof value != 'string') {
            textValue = oasysDateTime.oasysDateAsString(value as OasysDate)
        }

        const statusAndValue = await this.getStatusAndValue()
        if (partial) {
            expect(statusAndValue.value).toContain(value)
        } else {
            expect(statusAndValue.value).toBe(textValue)
        }
    }

    async getValue(): Promise<string> {

        const statusAndValue = await this.getStatusAndValue()
        return statusAndValue.value
    }

    async checkStatus(status: ElementStatus) {

        const statusAndValue = await this.getStatusAndValue()
        expect(statusAndValue.status).toBe(status)
    }

    /**
     * Gets the current status and value of a text element, assumes it exists
     * 
     * The return value is an ElementStatusAndValue object, containing status and value properties.
     */
    async getStatusAndValue(): Promise<ElementStatusAndValue> {

        const result: ElementStatusAndValue = { status: 'notVisible', value: '' }
        const count = await this.selector.count()

        if (count > 0) { // If element exists in the DOM
            const visible = await this.selector.isVisible()
            if (visible) {

                let editable = await this.selector.isEditable()
                if (editable) {
                    const oasysReadonly =
                        (await this.selector.getAttribute('class'))?.includes('input_readonly') ||
                        (await this.selector.getAttribute('readonly')) == 'true' ||
                        (await this.selector.getAttribute('mimic_readonly')) == 'true' ||
                        (await this.selector.getAttribute('data-mimic_readonly')) == 'true'
                    result.status = oasysReadonly ? 'readonly' : 'enabled'
                } else {
                    result.status = 'readonly'
                }
            }
            result.value = await this.selector.inputValue()
        }

        return result
    }

}
