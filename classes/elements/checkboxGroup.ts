import { Page } from '@playwright/test'

export class CheckboxGroup<T extends string> {

    constructor(private readonly page: Page, private readonly selector: string, private readonly options: (T | '-')[]) { }

    async setValue(values: T[]) {

        if (values != null) {
            for (let i = 0; i < this.options.length; i++) {
                const itemSuffix = i == 0 ? '' : `-${i + 1}`

                if (this.options[i] != '-') {   // '-' is used as a separator in the list of IDs
                    if (values.includes(this.options[i] as T)) {
                        await this.page.locator(`${this.selector}${itemSuffix}`).check()
                    } else {
                        await this.page.locator(`${this.selector}${itemSuffix}`).uncheck()
                    }
                }
            }
        }
    }

}
