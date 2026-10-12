import { Page } from '@playwright/test'

export class CheckboxGroup<T extends string> {

    conditionalDisplay: boolean

    constructor(readonly page: Page, readonly selector: string, readonly options: (T | '-')[], conditionalDisplay: boolean = false) {

        this.conditionalDisplay = conditionalDisplay
    }

    async setValue(values: T[]) {

        if (values != null) {
            for (let i = 0; i < this.options.length; i++) {
                const itemSuffix = i == 0 ? '' : `-${i + 1}`

                if (this.options[i] != '-') {   // '-' is used as a separator in the list of IDs
                    if (values.includes(this.options[i] as T)) {
                        await this.page.locator(`${this.selector.replace('[sanMode]', sanMode)}${itemSuffix}`).check()

                    } else if (this.conditionalDisplay) {

                        const checkboxVisible = await this.page.locator('#main-content').locator(`${this.selector.replace('[sanMode]', sanMode)}${itemSuffix}:visible`).count()
                        if (checkboxVisible == 1) {
                            await this.page.locator(`${this.selector.replace('[sanMode]', sanMode)}${itemSuffix}`).uncheck()
                        }
                    } else {
                        await this.page.locator(`${this.selector.replace('[sanMode]', sanMode)}${itemSuffix}`).uncheck()
                    }
                }
            }
        }
    }

}
