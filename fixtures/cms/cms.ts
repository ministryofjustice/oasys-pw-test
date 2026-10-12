import { Page, TestInfo } from '@playwright/test'

import { Oasys } from 'fixtures'
import * as pages from './pages'


export class Cms {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys) { }

    readonly cmsStub = new pages.CmsStub(this.page)
    readonly maintainCmsStub = new pages.MaintainCmsStub(this.page)
    readonly cmsOffenderDetails = new pages.CmsOffenderDetails(this.page)
    readonly cmsStubEvent = new pages.CmsStubEvent(this.page)
    readonly cmsStubSentenceDetail = new pages.CmsStubSentenceDetail(this.page)
    readonly cmsStubOffence = new pages.CmsStubOffence(this.page)
    readonly cmsStubAlias = new pages.CmsStubAlias(this.page)
    readonly cmsSearchResults = new pages.CmsSearchResults(this.page)
    readonly crnAmendment = new pages.CrnAmendment(this.page)

    async createProbStub(offender: OffenderDef) {

        await this.cmsStub.goto(true)
        await this.cmsStub.createStub.click()

        let stubDetails = JSON.parse(JSON.stringify(offender)) as PageData
        if (stubDetails.event) delete stubDetails.event
        if (stubDetails.aliases) delete stubDetails.aliases
        if (stubDetails.nomisId) delete stubDetails.nomisId
        if (stubDetails.pk) delete stubDetails.pk

        await this.maintainCmsStub.setValues(stubDetails, true)
        await this.maintainCmsStub.addressLine4.setValue(appConfig.currentVersion)
        await this.maintainCmsStub.addressLine5.setValue(this.testInfo.title)
        await this.maintainCmsStub.save.click()

        // Add the event/offence/sentence if included in the offender details
        if (offender.event) {

            await this.maintainCmsStub.event.click()
            await this.maintainCmsStub.sentenceTypeColumn.clickFirstRow()

            if (offender.event.eventDetails) {
                await this.cmsStubEvent.setValues(offender.event.eventDetails, true)
            }
            await this.cmsStubEvent.save.click()

            if (offender.event.sentenceDetails) {

                await this.cmsStubEvent.sentenceDetail.click()
                await this.enterSentenceDetails(offender.event.sentenceDetails)
            }

            if (offender.event.offences) {

                await this.cmsStubEvent.offences.click()
                await this.enterOffences(offender.event.offences)
            }

            await this.cmsStubEvent.close.click()
        }

        if (offender.aliases) {

            await this.maintainCmsStub.offenderAlias.click()
            await this.enterAliases(offender.aliases)
        }
    }

    async cmsOffenderSearch() {

        await this.cmsSearchResults.cmsEventNumberColumn.clickFirstRow()
        await this.cmsOffenderDetails.createOffender.click()
    }
    async cmsAssessmentSearch() {

        await this.crnAmendment.ok.click()
        await this.cmsSearchResults.cmsEventNumberColumn.clickFirstRow()
        await this.cmsOffenderDetails.updateOffender.click()
    }

    /**
     * Create a reception event for an offender.
     * The offender should already have been created in Probation, and have a NOMIS Id, but no stub record.
     */
    async createReceptionEvent(offender: OffenderDef) {

        await this.enterPrisonStubDetailsAndCreateReceptionEvent(offender)
        log(`Created reception event for offender with PNC: ${offender.pnc}, surname: '${offender.surname}', NOMISId: ${offender.nomisId}`)
    }

    /**
     * Enter prison offender details on the stub page, and trigger a reception event.
     */
    async enterPrisonStubDetailsAndCreateReceptionEvent(offender: OffenderDef) {

        await this.cmsStub.goto(true)
        await this.cmsStub.createStub.click()

        let stubDetails = JSON.parse(JSON.stringify(offender)) as PageData
        if (stubDetails.event) delete stubDetails.event
        if (stubDetails.aliases) delete stubDetails.aliases
        if (stubDetails.probationCrn) delete stubDetails.probationCrn
        if (stubDetails.pk) delete stubDetails.pk

        await this.maintainCmsStub.setValues(stubDetails, true)
        await this.maintainCmsStub.addressLine4.setValue(appConfig.currentVersion)
        await this.maintainCmsStub.addressLine5.setValue(this.testInfo.title)

        // Set a default reception code if not defined in the offender
        if (offender.receptionCode == null) {
            await this.maintainCmsStub.receptionCode.setValue('LATE RETURN (INVOLUNTARY)')
        }
        await this.maintainCmsStub.save.click()

        if (offender.event != null) {

            await this.maintainCmsStub.event.click()
            await this.maintainCmsStub.sentenceTypeColumn.clickFirstRow()

            await this.cmsStubEvent.setValues(offender.event.eventDetails, true)
            log(JSON.stringify(offender.event.eventDetails))
            await this.cmsStubEvent.save.click()

            if (offender.event.sentenceDetails != null) {
                await this.cmsStubEvent.sentenceDetail.click()
                await this.enterSentenceDetails(offender.event.sentenceDetails)
            }

            if (offender.event.offences != null) {
                // Use first offence only for prison offenders if there is more than one
                let offence = offender.event.offences.constructor.name == 'Array' ? (offender.event.offences as Offence[])[0] : offender.event.offences as Offence
                await this.cmsStubEvent.offences.click()
                await this.enterOffence(offence)
            }

            await this.cmsStubEvent.close.click()
        }

        if (offender.aliases != null) {
            await this.maintainCmsStub.offenderAlias.click()
            await this.enterAliases(offender.aliases)
        }
        await this.maintainCmsStub.receptionEvent.click()
        await this.page.locator('#apexConfirmBtn').click()

        await this.maintainCmsStub.save.click()
        await this.maintainCmsStub.close.click()
    }

    /**
     * Open an existing offender on the CMS stub, and generate a discharge event.
     */
    async createDischargeEvent(offender: OffenderDef) {

        await this.openStubByNomisId(offender.nomisId)

        await this.maintainCmsStub.dischargeCode.setValue('END OF CUSTODY LICENCE')
        await this.maintainCmsStub.releaseEvent.click()
        await this.page.locator('#apexConfirmBtn').click()

        log(`Created discharge event for offender with PNC: ${offender.pnc}, surname: '${offender.surname}', NOMISId: ${offender.nomisId}`)
    }

    /**
     * Navigates to the CMS stub, searches for a NOMIS Id and opens the stub record
     */
    async openStubByNomisId(nomisId: string) {

        this.cmsStub.goto(true)
        this.cmsStub.nomisId.setValue(nomisId)
        this.cmsStub.search.click()
        this.cmsStub.nomisIdColumn.clickFirstRow()

        log(`Opened stub record for ${nomisId}`)
    }

    /**
     * Add an existing offender to the stub (used when transferring to another probation provider).
     */
    async addProbationOffenderToStub(offender: OffenderDef) {

        await this.cmsStub.goto(true)
        await this.cmsStub.createStub.click()

        let stubDetails = JSON.parse(JSON.stringify(offender)) as PageData
        if (stubDetails.event) delete stubDetails.event
        if (stubDetails.aliases) delete stubDetails.aliases
        if (stubDetails.nomisId) delete stubDetails.nomisId
        if (stubDetails.pk) delete stubDetails.pk

        await this.maintainCmsStub.setValues(stubDetails, true)
        await this.maintainCmsStub.addressLine4.setValue(appConfig.currentVersion)
        await this.maintainCmsStub.addressLine5.setValue(this.testInfo.title)
        await this.maintainCmsStub.save.click()
        await this.maintainCmsStub.close.click()

        log(`Added offender ${JSON.stringify(offender)} to stub`)
    }

    async enterSentenceDetails(sentenceDetails: SentenceDetails | SentenceDetails[]) {

        if (sentenceDetails.constructor.name == 'Array') {
            Array.prototype.forEach.call(sentenceDetails, (async (sentenceDetail: SentenceDetails) => {
                await this.enterSentenceDetail(sentenceDetail)
            }))
        }
        else {
            await this.enterSentenceDetail(sentenceDetails as SentenceDetails)
        }
    }

    async enterSentenceDetail(sentenceDetails: SentenceDetails) {

        await this.cmsStubEvent.createSentenceDetail.click()
        await this.cmsStubSentenceDetail.setValues(sentenceDetails, true)
        await this.cmsStubSentenceDetail.save.click()
        await this.cmsStubSentenceDetail.close.click()
    }

    async enterOffences(offences: Offence | Offence[]) {

        if (offences.constructor.name == 'Array') {
            for (const offence of offences as Offence[]) {
                await this.enterOffence(offence)
            }
        }
        else {
            await this.enterOffence(offences as Offence)
        }
    }

    async enterOffence(offence: Offence) {

        await this.cmsStubEvent.createOffence.click()
        await this.cmsStubOffence.setValues(offence, true)
        await this.cmsStubOffence.save.click()
        await this.cmsStubOffence.close.click()
    }

    async enterAliases(aliases: Alias | Alias[]) {

        if (aliases.constructor.name == 'Array') {
            await Array.prototype.forEach.call(aliases, (async (alias: Alias) => { await this.enterAlias(alias) }))
        }
        else {
            await this.enterAlias(aliases as Alias)
        }
    }

    async enterAlias(alias: Alias) {

        await this.maintainCmsStub.createAlias.click()
        await this.cmsStubAlias.setValues(alias, true)
        await this.cmsStubAlias.save.click()
        await this.cmsStubAlias.close.click()
    }

}
