import { Page } from '@playwright/test'

import { Oasys, Cms, Offender, OasysDb, Sections, San, Risk, SentencePlan } from 'fixtures'
import * as pages from './pages'
import { BaseAssessmentPage } from 'classes'
import { TaskManager } from 'fixtures/tasks/pages/taskManager'
import { Queries } from './queries'


export class Assessment {

    constructor(private readonly page: Page, private readonly oasys: Oasys, private readonly cms: Cms,
        private readonly offender: Offender, private readonly oasysDb: OasysDb, private readonly sections: Sections, private readonly san: San,
        private readonly risk: Risk, private readonly sentencePlan: SentencePlan) { }

    assessmentPk: number // Updated on creating an assessment.  Used at lock incomplete and sign&lock to call the OGRS4 regression test

    readonly queries = new Queries(this.oasysDb)

    readonly baseAssessmentPage = new BaseAssessmentPage(this.page)
    readonly createAssessmentPage = new pages.CreateAssessment(this.page)
    readonly assessmentsTab = new pages.AssessmentsTab(this.page)
    readonly deleteAssessment = new pages.DeleteAssessment(this.page)
    readonly rollbackAssessment = new pages.RollbackAssessment(this.page)
    readonly rfis = new pages.Rfis(this.page)
    private readonly markAssessmentHistoric = new pages.MarkAssessmentHistoric(this.page)
    readonly printAssessment = new pages.PrintAssessment(this.page)
    readonly reverseDeletionPage = new pages.ReverseDeletion(this.page)

    readonly summarySheet = new pages.SummarySheet(this.page)


    /**
     * Create a probation assessment with the details provided for the Create Assessment page. Assumes you are starting on the Offender Details page.
     * 
     * The first parameter is an Assessment type object which must include purposeOfAssessment, others can be omitted to use the default values. Properties available:
     *  - purposeOfAssessment: PurposeOfAssessment
     *  - otherPleaseSpecify?: string
     *  - assessmentLayer?: AssessmentLayer
     *  - sentencePlanType?: string
     *  - includeCourtReportTemplate?: string
     *  - includeSanSections?: YesNoAnswer
     *  - selectTeam?: string
     *  - selectAssessor?: string
     *
     * The second (Yes/No) parameter should be supplied if you are expecting the option to clone from a historic assessment.
     * 
     * Returns the assessment PK
     */
    async createProb(assessmentDetails: CreateAssessmentDetails, clonePreviousHistoric?: 'Yes' | 'No'): Promise<number> {

        await this.getToCreateAssessmentPage(true)

        await this.createAssessmentPage.setValues(assessmentDetails, true)
        await this.createAssessmentPage.create.click()
        if (clonePreviousHistoric) {
            await this.oasys.clickButton(clonePreviousHistoric)
        }

        const pnc = await this.baseAssessmentPage.getPncFromScreenContext()
        const pk = await this.getLatestSetPkByPnc(pnc)

        log(`Created assessment PK ${pk}: ${JSON.stringify(assessmentDetails)}`, 'Assessment')
        return pk
    }

    /**
     * Create a prison assessment with the details provided for the Create Assessment page. Assumes you are starting on the Offender Details page.
     * 
     * The first parameter is an Assessment type object which must include purposeOfAssessment, others can be omitted to use the default values. Properties available:
     *  - purposeOfAssessment: PurposeOfAssessment
     *  - otherPleaseSpecify?: string
     *  - assessmentLayer?: AssessmentLayer
     *  - sentencePlanType?: string
     *  - includeCourtReportTemplate?: string
     *  - includeSanSections?: YesNoAnswer
     *  - selectTeam?: string
     *  - selectAssessor?: string
     * 
     */
    async createPris(assessmentDetails: CreateAssessmentDetails): Promise<number> {

        await this.offender.offenderDetails.createAssessment.click()
        await this.createAssessmentPage.setValues(assessmentDetails, true)
        await this.createAssessmentPage.create.click()

        const pnc = await this.baseAssessmentPage.getPncFromScreenContext()
        const pk = await this.getLatestSetPkByPnc(pnc)

        log(`Created assessment PK ${pk}: ${JSON.stringify(assessmentDetails)}`, 'Assessment')
        return pk

    }

    /**
     * Go from the offender details page through CMS screens to the create assessment page for a probation offender. The process depends on the force CRN setting.
     */
    async getToCreateAssessmentPage(suppressLog: boolean = false) {

        await this.offender.offenderDetails.createAssessment.click()
        await waitForPageUpdate(this.page)
        if (appConfig.probForceCrn) {
            await this.cms.cmsAssessmentSearch()
        }

        if (!suppressLog) log('Navigated to CreateAssessment page')
    }

    async populateMinimal(params?: PopulateAssessmentParams) {

        await this.sections.populateMinimal(params)

        if (params?.layer == 'Layer 3V2') {
            await this.san.populateMinimal()
        }
        await this.risk.screeningNoRisks()
        if (params.layer != 'Layer 1V2') {
            await this.sentencePlan.populateMinimal()
        }

        log(`Minimally populated assessment: ${JSON.stringify(params)}`)
    }

    async populateFull(params: PopulateAssessmentParams) {

        await this.sections.populateFull(params)
        await this.risk.populateFull(params)

        if (params?.layer == 'Layer 3V2') {
            // await this.san.populateFull()  // TODO
        }
        if (params.layer != 'Layer 1V2') {
            await this.sentencePlan.populateFull()
        }

        log(`Fully populated assessment: ${JSON.stringify(params)}`)
    }


    /**
     * Select any existing assessments and delete them.  Assumes you have the appropriate rights and are on the OffenderDetails page with the assessments tab visible.
     */
    async deleteAll(surname: string, forename: string) {

        const count = await this.assessmentsTab.assessments.purposeOfAssessment.getCount()

        for (let i = 0; i < count; i++) {
            await this.assessmentsTab.assessments.purposeOfAssessment.clickFirstRow()
            await this.deleteAssessment.goto(true)
            await this.deleteAssessment.reasonForDeletion.setValue('Testing')
            await this.deleteAssessment.ok.click()
            await this.oasys.history(surname, forename)
        }
        log(`Deleted ${count} assessment(s)`)
    }

    /**
     * Delete the most recent assessment.  Assumes you have the appropriate rights and are on the OffenderDetails page with the assessments tab visible.
     */
    async deleteLatest() {

        await this.openLatest()
        await this.deleteAssessment.goto(true)
        await this.deleteAssessment.reasonForDeletion.setValue('Testing')
        await this.deleteAssessment.ok.click()

        log(`Deleted latest assessment`)
    }

    /**
     * Reverses the deletion of an assessment or subassessment.  Optional comment (otherwise generic text is used)
     */
    async reverseDeletion(offender: OffenderDef, type: 'Assessment' | 'Basic Custody Screening' | 'Sub Assessment - SARA', assessment: string, comment?: string) {

        await this.reverseDeletionPage.goto()
        await this.reverseDeletionPage.type.setValue(type)
        await this.reverseDeletionPage.offenderSearch.setValue(offender.pnc)
        await this.page.locator('#P10_SIGNING_COMMENTS').click()  // Force refresh to show offender LOV
        await this.reverseDeletionPage.offender.setValue(offender.surname)
        await this.reverseDeletionPage.assessment.setValue(assessment)
        await this.reverseDeletionPage.reason.setValue(comment ?? 'Reversing deletion')
        await this.reverseDeletionPage.ok.click()
        await this.reverseDeletionPage.ok.click()
        await new TaskManager(this.page).checkCurrent()
        log(`Reversed deletion for ${offender.pnc}, ${type}, ${assessment} `)
    }

    /**
     * Roll back the assessment.  Assumes you are on an assessment page.
     */
    async rollBack(comment?: string) {

        await this.rollbackAssessment.goto()
        await this.rollbackAssessment.ok.click()
        await this.rollbackAssessment.enterAComment.setValue(comment ?? 'Rollback test comment')
        await this.rollbackAssessment.ok.click()

        log('Rolled back assessment')
    }

    /**
     * Make the assessment historic.  Assumes you are on an assessment page.
     */
    async markHistoric() {

        await this.markAssessmentHistoric.goto()
        await this.markAssessmentHistoric.ok.click()
    }
    /**
     * Open the latest assessment, assuming you have the assessments tab showing.
     */
    async openLatest() {

        await this.assessmentsTab.assessments.clickFirstRow()
        await waitForPageUpdate(this.page)
        log('Opened latest assessment')
    }

    /**
     * Open an assessment selected by the row number in the table (1 at the top), assuming you have the assessments tab showing.
     */
    async open(row: number) {

        await this.assessmentsTab.assessments.clickNthRow(row)
        log(`Opened assessment ${row}`)
    }

    /**
     * Assuming you have the offender details open with assessment tab showing, clicks the Lock Incomplete button,
     * then checks and accepts the alert message (using a default if not specified).  Optionally pass an assessment PK to check the OGRS4 calculation
     */
    async lockIncomplete(message = 'Do you wish to lock the assessment as incomplete?') {

        await this.oasys.handleAlert('Lock Incomplete', message)
        // Check it's worked in case of SAN failure
        const lockIncompleteColumn = await this.assessmentsTab.assessments.lockAssessment.getValues()
        expect(lockIncompleteColumn).not.toContain('Lock Incomplete')
        log('Locked assessment incomplete')
    }

    /**
     * Finds the latest non-deleted oasys_set record for a given offender PNC
     */
    async getLatestSetPkByPnc(pnc: string): Promise<number> {

        const query = `select oasys_set_pk from eor.oasys_set where pnc = '${pnc}' and deleted_date is null order by create_date desc`
        return await this.getPk(query) as number
    }

    async getPk(query: string, returnAll: boolean = false): Promise<number | number[]> {

        const data = await this.oasysDb.getData(query)
        if (data.length > 0) {
            if (returnAll) {
                const pks: number[] = []
                data.forEach((pk) => pks.push(Number.parseInt(pk[0])))
                return pks
            } else {
                const pk = Number.parseInt(data[0][0])
                return pk
            }
        } else {
            return null
        }
    }

}