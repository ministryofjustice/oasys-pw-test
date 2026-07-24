import { Page, TestInfo } from '@playwright/test'

import { Oasys, Cms, OasysDb } from 'fixtures'
import * as pages from './pages'
import * as offenders from './offenderLib'
import { Queries } from './queries'
import { TestUser } from 'fixtures/user/testUsers'


export class Offender {

    constructor(public readonly page: Page, public readonly testInfo: TestInfo, readonly oasys: Oasys, readonly cms: Cms, readonly oasysDb: OasysDb) { }

    readonly offenderSearch = new pages.OffenderSearch(this.page)
    readonly offenderDetails = new pages.OffenderDetails(this.page)
    readonly offenderManagementTab = new pages.OffenderManagementTab(this.page)
    readonly rfi = new pages.Rfi(this.page)

    /**    
     * - A Heroin
     * - B Methadone(not prescribed)
     * - C Other opiates
     * - D Crack/Cocaine
     * - E Cocaine Hydrochloride
     * - F Misused prescribed drugs
     * - G Benzodiazepines
     * - H Amphetamines
     * - I Hallucinogens
     * - J Ecstasy
     * - K Cannabis
     * - L Solvents
     * - M Steroids
     * - P Spice
     * - Q Ketamine
     * - N Other
     */
    readonly standaloneCsrp = new pages.StandaloneCsrp(this.page)
    readonly deleteStandaloneCsrp = new pages.DeleteStandaloneCsrp(this.page)
    readonly lao = new pages.Lao(this.page)
    readonly requestTransferPage = new pages.RequestTransfer(this.page)

    readonly queries = new Queries(this.oasysDb)

    /**
     * Create a probation offender using the details provided in an Offender type object.
     * 
     * Any '#auto...' data items will be generated and updated in the object.
     * 
     * The object needs to include all mandatory items for a probation offender, but if there is no CRN property, a new one will be generated.
     * If there is a NOMIS ID this will be ignored.
     * 
     * Address lines 4 and 5 are automatically populated with the OASys version and test script name respectively.
     */

    getStandardOffenderDef(provider: Provider, params?: OffenderLibParams): OffenderDef {

        const offenderSet = provider == 'pris' ? offenders.prison : offenders.probation
        const offenderDef = params?.type ? offenderSet[params.type] : offenderSet.burglary

        // Get a copy of the offender data (to avoid changing it for other offenders in the same test based on the same source offender),
        const offender = JSON.parse(JSON.stringify(offenderDef)) as OffenderDef
        if (params?.gender) {
            offender.gender = params.gender
        }
        if (params?.forename1) {
            offender.forename1 = params.forename1
        }
        if (params?.age) {
            offender.dateOfBirth = { years: -params.age }
        }

        return offender
    }

    async createProbFromStandardOffender(params?: OffenderLibParams): Promise<OffenderDef> {

        const offender = this.getStandardOffenderDef('prob', params)
        return await this.createProb(offender)
    }

    async createPrisFromStandardOffender(params?: OffenderLibParams): Promise<OffenderDef> {

        const offender = this.getStandardOffenderDef('pris', params)
        return await this.createPris(offender)
    }

    async createProb(offender: OffenderDef): Promise<OffenderDef> {

        // Populate any null key fields (PNC, CRN, NOMIS ID and Surname).
        await this.oasysDb.populateAutoData(offender)
        offender.dateOfBirth = oasysDateTime.oasysDateAsString(offender.dateOfBirth) // Calculate date if a # value has been specified

        await this.cms.createProbStub(offender)

        // Now create the offender record in OASys
        await this.offenderSearch.goto(true)
        await this.offenderSearch.search.click()
        await this.offenderSearch.searchCms.setValue('Yes')
        await this.offenderSearch.probationCrn.setValue(offender.probationCrn)
        await this.offenderSearch.search.click()

        await this.cms.cmsOffenderSearch()

        log(`Created offender with PNC: ${offender.pnc}, surname: '${offender.surname}', forename: '${offender.forename1}', CRN: ${offender.probationCrn}, date of birth: ${offender.dateOfBirth}`, 'Offender')

        await this.addOffenderPk(offender)
        return offender
    }

    /**
     * Create a prison offender using the details provided in an Offender type object.
     * 
     * Any '#auto...' data items will be evaluated and updated in the object.
     * 
     * The object needs to include all mandatory items for a probation offender, but if there is no NOMISId property, a new one will be generated.
     * If there is a probation CRN this will be ignored.
     *  
     * Address lines 4 and 5 are automatically populated with the OASys version and test script name respectively.
     */
    async createPris(source: OffenderDef): Promise<OffenderDef> {

        // Get a copy of the offender data (to avoid changing it for other offenders in the same test based on the same source offender),
        let offender = JSON.parse(JSON.stringify(source)) as OffenderDef

        // Populate any null key fields (PNC, CRN, NOMIS ID and Surname).
        await this.oasysDb.populateAutoData(offender)
        offender.dateOfBirth = oasysDateTime.oasysDateAsString(offender.dateOfBirth) // Calculate date if a # value has been specified

        await this.cms.enterPrisonStubDetailsAndCreateReceptionEvent(offender)
        await this.searchAndSelectByNomisId(offender.nomisId, true)

        log(`Created offender with PNC: ${offender.pnc}, surname: '${offender.surname}', forename: '${offender.forename1}', NOMISId: ${offender.nomisId}, date of birth: ${offender.dateOfBirth}`, 'Offender')

        await this.addOffenderPk(offender)
        return offender
    }

    private async addOffenderPk(offender: OffenderDef) {

        const query = `select offender_pk from eor.offender where pnc = '${offender.pnc}'`
        const pk = await this.oasysDb.getSingleNumericValue(query)
        offender.pk = pk
    }

    /**
     * Navigate to the Offender Search page, then search and select an offender by PNC.
     * 
     * Selects the first result if the search returns multiple rows.
     */
    async searchAndSelectByPnc(pnc: string, provider?: string) {

        const params: { [key: string]: string } = { pnc: pnc }
        if (provider != undefined) {
            params['provider'] = provider
        }
        await this.offenderSearchAndSelect(params)
    }

    /**
     * Navigate to the Offender Search page, then search and select an offender by NOMIS Id.
     * 
     * Selects the first result if the search returns multiple rows.
     */
    async searchAndSelectByNomisId(nomisId: string, suppressLog: Boolean = false) {

        await this.offenderSearchAndSelect({ prisonNomisNumber: nomisId }, suppressLog)
    }

    /**
     * Navigate to the Offender Search page, then search and select an offender by Probation CRN.
     * 
     * Selects the first result if the search returns multiple rows.
     */
    async searchAndSelectByCrn(crn: string) {

        await this.offenderSearchAndSelect({ probationCrn: crn })
    }

    /**
     * Navigate to the Offender Search page, then search and select an offender by surname and optional first name.
     * 
     * Selects the first result if the search returns multiple rows.
     */
    async searchAndSelectByName(surname: string, forename: string = '') {

        await this.offenderSearchAndSelect({ surname: surname, forename: forename })
    }

    /**
     * Navigate to the Offender Search page, search for the specified offender then select the first row in the result table.
     * 
     * Parameter can be either:
     * 
     * - a pre-defined Offender object, referred to by an alias name '@...'.  In this case it uses (in order of preference) the PNC, Probation CRN or NOMIS Id
     *     on the assumption that at least one of these has been set and is unique.
     * - a Values object containing name/value pairs, using the element names defined for the Offender Search page
     *
     * Selects the first result if the search returns multiple rows.
     */
    async searchAndSelect(offender: OffenderDef): Promise<void>
    async searchAndSelect(data: PageData): Promise<void>
    async searchAndSelect(p1: OffenderDef | PageData) {

        if (p1['pnc']) {  // OffenderDef object
            await this.searchAndSelectByPnc(p1['pnc'] as string)
        } else {
            await this.offenderSearchAndSelect(p1 as PageData)
        }
    }

    async offenderSearchAndSelect(data: PageData, suppressLog: Boolean = false) {

        await this.offenderSearch.goto(true)

        await this.offenderSearch.setValues(data, true)
        await this.offenderSearch.search.click()
        await this.offenderSearch.surnameColumn.clickFirstRow()

        if (!suppressLog) log(`Search and select offender: ${JSON.stringify(data)}`)
    }

    async setLaoReader(user: TestUser) {

        await this.lao.goto()

        await this.lao.setLaoStatus.setValue('Yes')
        await this.lao.laoReaders.addItemUsingFilter(user.lovLookup)
        await this.lao.save.click()
        log('Set LAO reader')
        await this.lao.close.click()
    }

    async demerge(oasys: Oasys) {

        await oasys.clickButton('Demerge')
        await oasys.clickButton('Confirm Demerge')
        await oasys.clickButton('Demerge')
        await this.page.locator('#apexConfirmBtn').click()
    }

    async requestTransfer() {

        await this.offenderDetails.requestTransfer.click()
        await this.requestTransferPage.submit.click()
    }

    async deleteAllStandalone(probationCrn: string) {

        const standaloneCount = await this.oasysDb.getSingleNumericValue(`select count(*) from eor.offender_rsr_scores where cms_prob_number = '${probationCrn}' and deleted_date is null`)
        for (let i = 0; i < standaloneCount; i++) {
            await this.deleteStandaloneCsrp.goto()
            await this.deleteStandaloneCsrp.reasonForDeletion.setValue('Testing')
            await this.deleteStandaloneCsrp.ok.click()
        }
    }

    /**
     * Add a record in the IOM stub (using the configured address for the current environment). Sets the following values:
     *  - probation CRN
     *  - IOM (Y or N)
     *  - number of records
     *  - error type (OK/Record is not found/Forbidden/Internal Server Error)
     *  - MAPPA (Y or N)
     */
    // export function createIomStub(probationCrn: string, isIom: 'Y' | 'N', records: number,
    //     error: 'OK' | 'Record is not found' | 'Forbidden' | 'Internal Server Error', mappa: 'Y' | 'N' | '') {

    //     cy.visit(testEnvironment.iomStub)
    //     cy.wait(5000)
    //     const stub = new oasys.Pages.Offender.IomStub()
    //     stub.probationCrn.setValue(probationCrn)
    //     stub.isIom.setValue(isIom)
    //     stub.records.setValue(records.toString())
    //     stub.error.setValue(error)
    //     stub.mappa.setValue(mappa)

    //     stub.add.click()
    //     log(`Added offender to IOM stub - CRN: ${probationCrn}, IOM: ${isIom}, number of records: ${records}, error code: ${error}, mappa: ${mappa}`)
    // }
}
