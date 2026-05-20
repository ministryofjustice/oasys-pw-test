import { Page } from '@playwright/test'

import { Oasys } from 'fixtures'
import * as pages from './pages'
import { SpService } from './spService/spService'
import { Psr } from './psr/psr'


export class SentencePlan {


    constructor(private readonly page: Page, private readonly oasys: Oasys) { }

    readonly basicSentencePlan = new pages.BasicSentencePlan(this.page)
    readonly ispSection52to8 = new pages.IspSection52to8(this.page)
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
            case 'isp':
                await this.ispSection52to8.populateMinimal()
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
            case 'isp':
                // await this.ispSection52to8.populateFull()  // TODO
                break
            case 'rsp':
                // await this.rspSection72to10.populateFull()  // TODO
                break
        }
    }

    async goto(planType: SpType, suppressLog = false) {

        switch (planType) {
            case 'basic':
                await this.basicSentencePlan.goto(suppressLog)
                break
            case 'spService':
                await this.spService.sentencePlanService.goto(suppressLog)
                break
        }
    }

    // export function ispFullyPopulated(params: PopulateAssessmentParams) {

    //     populate.SentencePlanPages.IspSection1to4.fullyPopulated(params.maxStrings)
    //     populate.SentencePlanPages.IspSection5.fullyPopulated(params.maxStrings)
    //     populate.SentencePlanPages.IspSection52to8.fullyPopulated(params.maxStrings)
    // }

    // export function rspFullyPopulated(params: PopulateAssessmentParams) {

    //     populate.SentencePlanPages.RspSection1to2.fullyPopulated(params.maxStrings)
    //     populate.SentencePlanPages.RspSection3to63.fullyPopulated(params.maxStrings)
    //     populate.SentencePlanPages.RspSection7.fullyPopulated(params.maxStrings)
    //     populate.SentencePlanPages.RspSection72to10.fullyPopulated(params.maxStrings)
    //     // Transfer page TODO
    // }
}