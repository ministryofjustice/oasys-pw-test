import { Page } from '@playwright/test'

export class ConditionalCheckboxGroup<T extends string> {

    private options: string[]

    constructor(private readonly page: Page, private readonly valuesLookup: { [key in T]: string }) {

        this.options = Object.keys(valuesLookup)
    }

    async setValue(values: T[]) {

        if (values != null) {

            for (let i = 0; i < this.options.length; i++) {

                const option = this.options[i] as T
                const locator = this.page.locator(`[value='${this.valuesLookup[option]}']`)

                if (values.includes(option)) {
                    await locator.check()
                } else {
                    const checkboxVisible = await locator.count()
                    if (checkboxVisible == 1) {
                        await locator.uncheck()
                    }
                }
            }
        }
    }

}
