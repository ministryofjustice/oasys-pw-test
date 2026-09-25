import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { Page4 } from './page4'
import { DrugsPractitionerAnalysis } from './drugsPractitionerAnalysis'


export class Drugs extends BaseSanSection {

    override readonly section: SanSection = 'Drug use'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    readonly page4 = new Page4(this.page)
    readonly practitionerAnalysis = new DrugsPractitionerAnalysis(this.page)

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }

    async populateWithSomeDrugs() {

        await this.goto()
        await this.page1.everUsed.setValue('yes')
        await this.saveAndContinue()
        await this.page2.drugType.setValue(['amphetamines', 'other'])
        await this.page2.amphetaminesLastSixMonths.setValue('yes')
        await this.page2.drugTypeOther.setValue(utils.oasysString(200))
        await this.page2.otherLastSixMonths.setValue('yes')
        await this.saveAndContinue()
        await this.page3.amphetaminesFrequency.setValue('daily')
        await this.page3.otherFrequency.setValue('occasionally')
        await this.page3.injected.setValue(['amphetamines', 'other'])
        await this.page3.amphetaminesInjectedLastSixMonths.setValue(['lastSix', 'moreThanSix'])
        await this.page3.otherInjectedLastSixMonths.setValue(['lastSix', 'moreThanSix'])
        await this.page3.treatment.setValue('no')
        await this.saveAndContinue()
        await this.page4.whyStarted.setValue(['cultural'])
        await this.page4.impactDrugs.setValue(['behavioural'])
        await this.page4.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimalWithMotivation()
        await this.markAsComplete()
    }

    async populateForSara() {

        await this.goto()

        await this.page1.everUsed.setValue('yes')
        await this.saveAndContinue()
        await this.page2.drugType.setValue(['heroin'])
        await this.page2.heroinLastSixMonths.setValue('yes')
        await this.saveAndContinue()
        await this.page3.heroinFrequency.setValue('weekly')
        await this.page3.injected.setValue(['heroin'])
        await this.page3.heroinInjectedLastSixMonths.setValue(['lastSix'])
        await this.page3.treatment.setValue('no')
        await this.saveAndContinue()
        await this.page4.whyStarted.setValue(['cultural'])
        await this.page4.impactDrugs.setValue(['behavioural'])
        await this.page4.wantChanges.setValue('notAnswering')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.motivatedToStop.setValue('someMotivation')
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }
}