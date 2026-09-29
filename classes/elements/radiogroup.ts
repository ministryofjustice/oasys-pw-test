import { Page } from '@playwright/test'


export class Radiogroup<T extends string> {

    constructor(readonly page: Page, readonly selector: string, readonly options?: (T | '-')[]) { }

    async setValue(value: T): Promise<void> {

        if (this.options && value != null) {  // Indicates an ARNS page if this is specified
            const itemNo = this.options.indexOf(value)
            const itemSuffix = itemNo == 0 ? '' : `-${itemNo + 1}`  // First item has no suffix on the id used to find it, remainder are -2, -3 etc
            await this.page.locator(`${this.selector}${itemSuffix}`).click()
        } else {
            // TODO OASys radiogroups
        }

    }

}
