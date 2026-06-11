import { Page, expect } from '@playwright/test'

import { OasysDateTime } from 'lib/oasysDateTime'
import { Utils } from 'lib/utils'

export function initialiseGlobals() {

    globalThis.expect = expect
    globalThis.oasysDateTime = new OasysDateTime()
    globalThis.utils = new Utils()
    globalThis.appConfig = null

    /////////////// Providers //////////////
    globalThis.providers = {
        prob: {
            nonSan: 'Bedfordshire',
            nonSanCode: 'BED',
            san: 'Durham',
            sanCode: 'DRH',
        },
        pris: {
            nonSan: 'Risley (HMP)',
            nonSanCode: '560',
            san: 'Leeds (HMP)',
            sanCode: '730',
        }
    }


    globalThis.waitForPageUpdate = async (page: Page, initialDelay?: number) => {

        let updatingElement = page.locator('*[class~="blockUI"],*[class~="u-Processing"]')

        await page.waitForTimeout(initialDelay ?? 250)
        let pleaseWaitCount = await updatingElement.count()
        while (pleaseWaitCount > 0) {
            pleaseWaitCount = await updatingElement.count()
        }
    }
}