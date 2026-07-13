import { Page } from '@playwright/test'

import { Oasys } from 'fixtures'
import * as pages from './pages'
import { Psr } from './psr/psr'


export class SentencePlan {

    constructor(private readonly page: Page, private readonly oasys: Oasys) { }

    readonly psr = new Psr(this.page)
    readonly sentencePlanService = new pages.SentencePlanService(this.page)
    readonly landingPage = new pages.LandingPage(this.page)
    readonly sentencePlan = new pages.SentencePlan(this.page)
    readonly steps = new pages.Steps(this.page)
    readonly agreePlan = new pages.AgreePlan(this.page)
    readonly updateGoalAndSteps = new pages.UpdateGoalAndSteps(this.page)

    async gotoSpService(from: 'offender' | 'assessment', readonly: boolean = false) {

        if (from == 'offender') {
            await this.oasys.clickButton('Open SP')
        } else {
            await this.sentencePlanService.goto(true)
            await this.sentencePlanService.openSp.click()
        }
        if (!readonly) {
            await this.landingPage.confirmCheck.setValue(true)
            await this.landingPage.confirm.click()
        }
    }

    async returnToOasys() {

        await this.oasys.clickButton('Return to OASys')
    }

    async openAndReturn(from: 'offender' | 'assessment', readonly: boolean = false) {

        await this.gotoSpService(from, readonly)
        await this.returnToOasys()
    }

    async populateMinimal(from: 'offender' | 'assessment' = 'assessment') {

        await this.gotoSpService(from)
        await this.sentencePlan.createGoal.click()

        const createGoal = new pages.CreateGoal(this.page)
        await createGoal.goal.setValue('Score a goal')
        await createGoal.related.setValue('no')
        await createGoal.startNow.setValue('yes')
        await createGoal.targetDate.setValue('3months')
        await createGoal.addSteps.click()

        await this.steps.who.setValue('probation_practitioner')
        await this.steps.step.setValue('Do some stuff')
        await this.steps.status.setValue('IN_PROGRESS')
        await this.steps.saveAndContinue.click()

        await this.sentencePlan.agreePlan.click()
        await this.page.getByRole('radio', { name: 'Yes, I agree' }).check()
        await this.page.getByRole('button', { name: 'Save' }).click()

        await this.returnToOasys()
    }

    async populateTwoGoals(from: 'offender' | 'assessment' = 'assessment') {
        
        await this.gotoSpService(from)
        await this.sentencePlan.createGoal.click()

        const createGoal = new pages.CreateGoal(this.page)
        await createGoal.goal.setValue('Score a goal')
        await createGoal.related.setValue('no')
        await createGoal.startNow.setValue('yes')
        await createGoal.targetDate.setValue('3months')
        await createGoal.addSteps.click()

        await this.steps.who.setValue('probation_practitioner')
        await this.steps.step.setValue('Do stuff')
        await this.steps.status.setValue('IN_PROGRESS')
        await this.steps.saveAndContinue.click()

        await this.sentencePlan.createGoal.click()

        await createGoal.goal.setValue('Do something else')
        await createGoal.related.setValue('no')
        await createGoal.startNow.setValue('yes')
        await createGoal.targetDate.setValue('6months')
        await createGoal.addSteps.click()

        await this.steps.who.setValue('probation_practitioner')
        await this.steps.step.setValue('Some other stuff')
        await this.steps.status.setValue('IN_PROGRESS')
        await this.steps.saveAndContinue.click()

        await this.sentencePlan.agreePlan.click()
        await this.page.getByRole('radio', { name: 'Yes, I agree' }).check()
        await this.page.getByRole('button', { name: 'Save' }).click()

        await this.returnToOasys()
    }

    async checkReadOnly(from: 'assessment' | 'offender' = 'assessment') {

        await this.gotoSpService(from, true)
        const createGoalStatus = await this.sentencePlan.createGoal.getStatus()
        expect(createGoalStatus).not.toBe('enabled')
        await this.returnToOasys()
    }

    async checkGoalCount(expectedCurrent: number, expectedFuture: number, expectedAchieved: number, from: 'assessment' | 'offender' = 'assessment', readonly: boolean = false) {

        log(`Checking SP goal count - current: ${expectedCurrent}, future: ${expectedFuture}, achieved: ${expectedAchieved}`)
        await this.gotoSpService(from, readonly)
        const currentText = await this.sentencePlan.currentGoalCount.getFullText()
        const futureText = await this.sentencePlan.futureGoalCount.getFullText()

        const actualCurrent = this.findGoalCount(currentText)
        const actualFuture = this.findGoalCount(futureText)

        expect(actualCurrent).toBe(expectedCurrent)
        expect(actualFuture).toBe(expectedFuture)

        if (expectedAchieved > 0) {
            const achievedText = await this.sentencePlan.achievedGoalCount.getFullText()
            const actualAchieved = this.findGoalCount(achievedText)
            expect(actualAchieved).toBe(expectedAchieved)
        }

        await this.returnToOasys()
    }

    private findGoalCount(linkText: string): number {

        const openBracket = linkText.indexOf('(')
        const closeBracket = linkText.indexOf(')')
        try {
            return Number.parseInt(linkText.substring(openBracket + 1, closeBracket))
        } catch (e) {
            return null
        }

    }

    async addGoal(from: 'assessment' | 'offender' = 'assessment') {

        log('Adding a goal')
        await this.gotoSpService(from)

        await this.sentencePlan.createGoal.click()

        const createGoal = new pages.CreateGoal(this.page)
        await createGoal.goal.setValue('Adding a goal')
        await createGoal.related.setValue('no')
        await createGoal.startNow.setValue('yes')
        await createGoal.targetDate.setValue('3months')
        await createGoal.addSteps.click()

        await this.steps.who.setValue('probation_practitioner')
        await this.steps.step.setValue('Do some additional stuff')
        await this.steps.status.setValue('IN_PROGRESS')
        await this.steps.saveAndContinue.click()

        await this.returnToOasys()
    }

    async completeFirstGoal(from: 'assessment' | 'offender' = 'assessment') {

        log('Completing the first goal')
        await this.gotoSpService(from)

        await this.sentencePlan.update.click()
        await this.updateGoalAndSteps.markAsAchieved.click()
        await this.page.getByRole('button', { name: 'Confirm' }).click()

        await this.returnToOasys()
    }

    async completeSecondGoal(from: 'assessment' | 'offender' = 'assessment') {

        log('Completing the second goal')
        await this.gotoSpService(from)

        await this.sentencePlan.update.click()
        await this.updateGoalAndSteps.markAsAchieved.click()
        await this.page.getByRole('button', { name: 'Confirm' }).click()

        await this.returnToOasys()
    }


}