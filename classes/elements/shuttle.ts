import { Page } from '@playwright/test'


export class Shuttle {

    constructor(readonly page: Page, readonly selector: string) { }

    async addItemUsingFilter(item: string) {

        await this.setFilter('left', item)
        await this.selectVisibleItem('left', 0)
        await this.clickButton('select')
    }

    async addItems(items: string[]) {

        for (const item of items) {

            await this.goToStart('left')
            await this.findAndSelect('left', item)
        }

        log(`Added items to ${this.selector}: ${JSON.stringify(items)}`)
    }

    async setFilter(side: 'left' | 'right', filter: string) {

        const filterSelector = `#${side}Filter${this.selector}`
        await this.page.locator(filterSelector).pressSequentially(filter, { delay: 50 })
    }

    async clickButton(button: 'selectall' | 'select' | 'remove' | 'removeall') {

        const buttonSelector = `#${button}${this.selector}`
        await this.page.locator(buttonSelector).click()
    }

    async selectVisibleItem(side: 'left' | 'right', index: number) {

        const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
        await this.page.locator(`#select${titleCaseSide}${this.selector}`).locator('option').nth(index).click()
    }

    async getItems(side: 'left' | 'right'): Promise<string[]> {

        const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
        const options = await this.page.locator(`#select${titleCaseSide}${this.selector}`).locator('option').allTextContents()
        return options
    }

    async goToStart(side: 'left' | 'right') {

        await this.clickUntilGone(side, 'prev')
    }

    async clickUntilGone(side: 'left' | 'right', button: 'prev' | 'next', attempt = 0) {

        if (attempt === 20) {
            throw new Error(`clickUntilGone failure for ${side}`)
        }

        const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
        const buttonSelector = `#${button}Page${titleCaseSide}${this.selector}`

        const enabledCount = await this.page.locator(`#shuttle${this.selector}`).locator(`${buttonSelector}:enabled`).count()
        if (enabledCount > 0) {
            await this.page.locator(buttonSelector).click()
            await this.clickUntilGone(side, button, ++attempt)
        }
    }

    async findAndSelect(side: 'left' | 'right', item: string, attempt = 0) {

        if (attempt === 20) {
            throw new Error(`findAndSelect failure for ${item}`)
        }

        const titleCaseSide = side.charAt(0).toUpperCase() + side.substring(1)
        const buttonSelector = `#nextPage${titleCaseSide}${this.selector}`

        const items = await this.getItems(side)
        if (items.includes(item)) {
            await this.page.locator(`#select${titleCaseSide}${this.selector}`).locator(`option:has-text('${item}')`).click()
            await this.clickButton('select')
        } else {

            const enabledCount = await this.page.locator(`#shuttle${this.selector}`).locator(`${buttonSelector}:enabled`).count()
            if (enabledCount > 0) {
                await this.page.locator(buttonSelector).click()
                await this.findAndSelect(side, item, ++attempt)
            }
        }

    }
}