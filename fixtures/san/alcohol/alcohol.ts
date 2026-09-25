import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { PractitionerAnalysis } from '../pages'
import { sanIdPrefixLookup } from '../sanIds'


export class Alcohol extends BaseSanSection {

    override readonly section: SanSection = 'Alcohol use'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.section, sanIdPrefixLookup[this.section])

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }

    async populateForSara() {

        await this.goto()

        await this.page1.everDrank.setValue('yesIncLast3')
        await this.saveAndContinue()
        await this.page2.howOftenLast3.setValue('2-3PerWeek')
        await this.page2.typicalUnits.setValue('5To6')
        await this.page2.had8OrMore.setValue('no')
        await this.page2.bingeDrinking.setValue('evidence')
        await this.page2.pastIssues.setValue('no')
        await this.page2.whyDrink.setValue(['enjoyment'])
        await this.page2.impactAlcohol.setValue(['noImpact'])
        await this.page2.anythingHelpedAlcohol.setValue('no')
        await this.page2.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()

    }
}