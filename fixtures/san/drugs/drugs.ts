import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { Page4 } from './page4'
import { Page5 } from './page5'
import { Page6 } from './page6'
import { PractitionerAnalysis } from '../pages'


export class Drugs extends BaseSanSection {

    override readonly sectionName: SanSectionTitle = 'Drug use'
    override readonly paPrefix = 'drug_use'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    readonly page4 = new Page4(this.page)
    readonly page5 = new Page5(this.page)
    readonly page6 = new Page6(this.page)
    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.markAsComplete()
    }

    async populateWithSomeDrugs() {

        await this.goto()
        await this.page1.everUsed.setValue('yes')
        await this.saveAndContinue()
        await this.page2.drugType.setValue(['amphetamines', 'other'])
        await this.saveAndContinue()
        await this.page3.amphetaminesWhenUsed.setValue('lastSix')
        await this.page3.otherDrugName.setValue(utils.oasysString(200))
        await this.page3.otherWhenUsed.setValue('lastSix')
        await this.saveAndContinue()
        await this.page4.amphetaminesFrequency.setValue('daily')
        await this.page4.otherFrequency.setValue('occasionally')
        await this.saveAndContinue()
        await this.page5.injected.setValue(['amphetamines', 'other'])
        await this.page5.amphetaminesWhenInjected.setValue(['lastSix', 'moreThanSix'])
        await this.page5.otherWhenInjected.setValue(['lastSix', 'moreThanSix'])
        await this.saveAndContinue()
        await this.page6.treatment.setValue('no')
        await this.page6.motivatedToStop.setValue('motivated')
        await this.saveAndContinue()
        await this.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }

    async populateForSara() {

        await this.goto()

        await this.page1.everUsed.setValue('yes')
        await this.saveAndContinue()
        await this.page2.drugType.setValue(['heroin'])
        await this.saveAndContinue()
        await this.page3.heroinWhenUsed.setValue('lastSix')
        await this.saveAndContinue()
        await this.page4.heroinFrequency.setValue('weekly')
        await this.saveAndContinue()
        await this.page5.injected.setValue(['heroin'])
        await this.page5.heroinWhenInjected.setValue(['lastSix'])
        await this.saveAndContinue()
        await this.page6.treatment.setValue('no')
        await this.page6.motivatedToStop.setValue('someMotivation')
        await this.saveAndContinue()
        await this.wantChanges.setValue('notAnswering')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }
}

export const drugsWhenUsedOptions: DrugsWhenUsed[] = ['lastSix', 'moreThanSix']