import { Expect, Page } from '@playwright/test'

import { OasysDateTime } from 'lib/oasysDateTime'
import { Utils } from 'lib/utils'

declare global {

    var expect: Expect<{}>
    var oasysDateTime: OasysDateTime
    var utils: Utils
    var providers: {
        prob: {
            nonSan: string,
            nonSanCode: string,
            san: string,
            sanCode: string,
        },
        pris: {
            nonSan: string,
            nonSanCode: string,
            san: string,
            sanCode: string,
        }
    }
    var waitForPageUpdate: (page: Page, initialDelay?: number) => Promise<void>
    var log: (logtext: string, type?: string) => void
    var fileLog: (logtext: string) => void
    var statsLog: (type: string, time: number) => void
    var appConfig: AppConfig
}
