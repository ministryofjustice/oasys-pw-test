import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { PractitionerAnalysis } from '../pages'
import { sanIdPrefixLookup } from '../sanIds'


export class Health extends BaseSanSection {

    override readonly section: SanSection = 'Health and wellbeing'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.section, sanIdPrefixLookup[this.section])

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.page2.populateMinimal()
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }

    async populateForLst() {

        await this.goto()
        await this.page1.physicalHealthConditions.setValue('no')
        await this.page1.mentalHealthProblems.setValue('no')
        await this.saveAndContinue()
        await this.page2.learningDifficulties.setValue('some')
    }

    async populateForOpd() {

        await this.goto()

        await this.page1.physicalHealthConditions.setValue('no')
        await this.page1.mentalHealthProblems.setValue('yesOngoingSevere')
        await this.saveAndContinue()
        await this.page2.psychTreatment.setValue('yes')
        await this.page2.headInjury.setValue('yes')
        await this.page2.neurodiverse.setValue('yes')
        await this.page2.learningDifficulties.setValue('some')
        await this.page2.coping.setValue('no')
        await this.page2.attitude.setValue('positive')
        await this.page2.selfHarmed.setValue('yes')
        await this.page2.selfHarmedDetails.setValue('Details')
        await this.page2.suicide.setValue('no')
        await this.page2.optimistic.setValue('optimistic')
        await this.page2.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateWithRiskOfHarm()
        await this.markAsComplete()
    }

    async populateForSara() {

        await this.goto()

        await this.page1.physicalHealthConditions.setValue('no')
        await this.page1.mentalHealthProblems.setValue('yesOngoingSevere')
        await this.saveAndContinue()
        await this.page2.psychTreatment.setValue('pending')
        await this.page2.headInjury.setValue('yes')
        await this.page2.neurodiverse.setValue('yes')
        await this.page2.learningDifficulties.setValue('some')
        await this.page2.coping.setValue('no')
        await this.page2.attitude.setValue('positive')
        await this.page2.selfHarmed.setValue('yes')
        await this.page2.selfHarmedDetails.setValue('Details')
        await this.page2.suicide.setValue('yes')
        await this.page2.suicideDetails.setValue('Details')
        await this.page2.optimistic.setValue('optimistic')
        await this.page2.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()

    }
}