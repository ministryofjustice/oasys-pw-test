import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { PractitionerAnalysis } from '../pages'
import { sanIdPrefixLookup } from '../sanIds'


export class Thinking extends BaseSanSection {

    override readonly section: SanSection = 'Thinking, behaviours and attitudes'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.section, sanIdPrefixLookup[this.section])

    async populateMinimal(params?: SanPopulationParams) {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        if (params?.o1_30Yes) {
            await this.saveAndContinue()
            await this.page3.populateMinimal()
        } else {
            await this.page2.populateMinimal()
        }
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }

    async populateForLst(params: SanPopulationParams) {

        await this.goto()
        await this.page1.awareConsequences.setValue('yes')
        await this.page1.stableBehaviour.setValue('sometimes')
        await this.page1.activitiesLinkedOffending.setValue('no')
        await this.page1.resilient.setValue('yes')
        await this.page1.ableSolveProblems.setValue('yes')
        await this.page1.understandOthers.setValue('no')
        await this.page1.manipulativeBehaviour.setValue('some')
        await this.page1.manageTemper.setValue('no')
        await this.page1.violence.setValue('sometimes')
        await this.page1.impulse.setValue('sometimes')
        await this.page1.positiveAttitude.setValue('no')
        await this.page1.hostileOrientation.setValue('no')
        await this.page1.acceptSupervision.setValue('no')
        await this.page1.supportCriminalBehaviour.setValue('no')
        await this.page1.wantChangesThinking.setValue('madeChanges')
        await this.saveAndContinue()
        if (!params?.o1_30Yes) {
            await this.page2.riskOfSexualHarm.setValue('yes')
        }
        await this.saveAndContinue()
        await this.page3.sexualPreoccupation.setValue('unknown')
        await this.page3.sexualInterests.setValue('no')
        await this.page3.emotionalIntimacy.setValue('sometimes')
    }

    async populateForOpd() {

        await this.goto()

        await this.page1.awareConsequences.setValue('yes')
        await this.page1.stableBehaviour.setValue('yes')
        await this.page1.activitiesLinkedOffending.setValue('no')
        await this.page1.resilient.setValue('yes')
        await this.page1.ableSolveProblems.setValue('yes')
        await this.page1.understandOthers.setValue('no')
        await this.page1.manipulativeBehaviour.setValue('some')
        await this.page1.manageTemper.setValue('no')
        await this.page1.violence.setValue('no')
        await this.page1.impulse.setValue('no')
        await this.page1.positiveAttitude.setValue('no')
        await this.page1.hostileOrientation.setValue('no')
        await this.page1.acceptSupervision.setValue('no')
        await this.page1.supportCriminalBehaviour.setValue('no')
        await this.page1.wantChangesThinking.setValue('madeChanges')
        await this.saveAndContinue()
        await this.page2.riskOfSexualHarm.setValue('no')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateWithRiskOfHarm()
        await this.markAsComplete()
    }
}