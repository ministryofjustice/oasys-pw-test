import { Page } from '@playwright/test'


export class Lov {

    constructor(readonly page: Page, readonly selector: string) { }

    async setValue(value: string) {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let link = `div[aria-labelledby='${id}'] a`
        await this.page.locator(link).click()

        const frame = this.page.locator(`iframe[title='Search Dialog']`).contentFrame()
        await frame.locator('#SEARCH').fill(value)
        await frame.locator(`input[type='button'][value='Search']`).click()
        await frame.getByRole('link').filter({ hasText: value }).click()
    }

    async getValue(): Promise<string> {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let div = `div[aria-labelledby='${id}']`
        return await this.page.locator(`${div} input`).inputValue()
    }

    async checkValueNotPresent(value: string) {

        let id = this.selector.charAt(0) == '#' ? this.selector.substring(1) : this.selector
        let link = `div[aria-labelledby='${id}'] a`
        await this.page.locator(link).click()

        const frame = this.page.locator(`iframe[title='Search Dialog']`).contentFrame()
        await frame.locator('#SEARCH').fill(value)
        await frame.locator(`input[type='button'][value='Search']`).click()

        await frame.getByRole('link').filter({ hasText: '- All -' }).isVisible()  // Wait for search results
        const count = await frame.getByRole('link').filter({ hasText: value }).count()
        expect(count).toBe(0)

        await this.page.locator('button[title="Close"]').click()
    }
}
