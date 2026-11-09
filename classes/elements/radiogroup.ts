import { Page } from '@playwright/test'


export class Radiogroup<T extends string> {

    constructor(readonly page: Page, readonly selector: string, readonly options?: (T | '-')[]) { }

    async setValue(value: T): Promise<void> {

        if (this.options && value != null) {  // Indicates an ARNS page if this is specified
            const itemNo = this.options.indexOf(value)
            const itemSuffix = itemNo == 0 ? '' : `-${itemNo + 1}`  // First item has no suffix on the id used to find it, remainder are -2, -3 etc

            let id = this.selector
            if (id.includes('|')) { // Two different IDs for community and custody
                const ids = id.split('|')
                id = sanMode == 'community' ? ids[0] : ids[1]
            } else { 
                id = id.replace('[sanMode]', sanMode)
            }
            await this.page.locator(`${id}${itemSuffix}`).click()
        } else {
            // TODO OASys radiogroups
        }

    }

}
