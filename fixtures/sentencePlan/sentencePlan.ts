import { Page } from '@playwright/test'

import { Oasys } from 'fixtures'
import * as pages from './pages'
import { SpService } from './spService/spService'
import { Psr } from './psr/psr'


export class SentencePlan {


    constructor(private readonly page: Page, private readonly oasys: Oasys) { }

    readonly rspSection72to10 = new pages.RspSection72to10(this.page)
    readonly spService = new SpService(this.page, this.oasys)
    readonly psr = new Psr(this.page)
    readonly changeSentencePlan = new pages.ChangeSentencePlan(this.page)


    /**
     * Navigate to the sentence plan and populate the sentence plan with the minimum required to allow sign and lock.
     * 
     * - sentencePlan: defaults to spService
     * - from: defaults to assessment, allows opening spService from the offender details page (not applicable for other SP types)
     */
    async populateMinimal(sentencePlan: SpType = 'spService', from: 'assessment' | 'offender' = 'assessment') {

        switch (sentencePlan) {
            case 'spService':  // TODO others
                await this.spService.gotoSpService(from)
                await this.spService.populateMinimal()
                break
            case 'rsp':
                await this.rspSection72to10.populateMinimal()
                break
        }
    }

    async populateFull(sentencePlan: SpType = 'spService', from: 'assessment' | 'offender' = 'assessment') {

        switch (sentencePlan) {
            case 'spService':  // TODO others
                await this.spService.gotoSpService(from)
                // await this.spService.populateFull()  // TODO
                break
            case 'rsp':
                // await this.rspSection72to10.populateFull()  // TODO
                break
        }
    }

    async goto(planType: SpType, suppressLog = false) {

        await this.spService.sentencePlanService.goto(suppressLog)
    }

}