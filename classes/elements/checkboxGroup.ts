import { Page } from '@playwright/test'

export class CheckboxGroup<T extends string> {

    selector: string
    options: (T | '-')[]
    conditionalDisplay: boolean

    constructor(readonly page: Page, selector: string, options: (T | '-')[], conditionalDisplay: boolean = false) {

        this.selector = selector
        this.options = options
        this.conditionalDisplay = conditionalDisplay
    }

    async setValue(values: T[]) {

        if (values != null) {
            for (let i = 0; i < this.options.length; i++) {
                const itemSuffix = i == 0 ? '' : `-${i + 1}`

                if (this.options[i] != '-') {   // '-' is used as a separator in the list of IDs
                    if (values.includes(this.options[i] as T)) {
                        await this.page.locator(`${this.selector}${itemSuffix}`).check()

                    } else if (this.conditionalDisplay) {

                        const checkboxVisible = await this.page.locator('#main-content').locator(`${this.selector}${itemSuffix}:visible`).count()
                        if (checkboxVisible == 1) {
                            await this.page.locator(`${this.selector}${itemSuffix}`).uncheck()
                        }
                    } else {
                        await this.page.locator(`${this.selector}${itemSuffix}`).uncheck()
                    }
                }
            }
        }
    }

}
