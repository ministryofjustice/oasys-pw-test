import { Locator, Page } from '@playwright/test'

/**
 * SAN custom select list, really a button with a dropdown list
 */
export class Dropdown<T extends string> {

    private selector: Locator

    constructor(private readonly page: Page, selector: string) {

        this.selector = page.locator(selector)
    }

    async setValue(value: T) {

        await this.selector.click()
        await this.page.locator(`[data-value='${value}']`).click()
    }

    async setValueByIndex(index: number) {

        await this.selector.selectOption({ index: index })
    }


}
