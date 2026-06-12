import { Page } from '@playwright/test'


export class Combo {


    /**
       * Select an item in a combo box.  Parameters are:
       *   - item: a SanId defining a San combo
       *   - text: the text to select
       */
    static async sanSetValue(page: Page, item: SanId, value: string) {

        await page.locator(item.id).fill(value)
    }
}