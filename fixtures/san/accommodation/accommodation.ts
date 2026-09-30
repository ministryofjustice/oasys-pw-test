import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { PractitionerAnalysis } from '../pages'


export class Accommodation extends BaseSanSection {

    override readonly sectionName: SanSection = 'Accommodation'
    override readonly paPrefix = 'accommodation'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

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

    async populateNoAccommodation() {

        await this.goto()
        await this.page1.currentAccommodation.setValue('noAccommodation')
    }

    async populateForOpd() {

        await this.page1.currentAccommodation.setValue('settled')
        await this.saveAndContinue()
        await this.page2.livingWith.setValue(['family', 'partner'])
        await this.page2.locationSuitable.setValue('yes')
        await this.page2.accommodationSuitable.setValue('yes')
        await this.page2.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateWithRiskOfHarm()
        await this.markAsComplete()
    }
}