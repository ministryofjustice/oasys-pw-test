import { BaseSanSection, sanYesConcernsNoOptions, sanYesNoOptions, sanYesNoUnknownOptions } from '../sanSection'
import { Element } from 'classes'
import { PractitionerAnalysis } from '../pages'

export class Accommodation extends BaseSanSection {

    override readonly sectionName: SanSectionTitle = 'Accommodation'
    override readonly paPrefix = 'accommodation'

    // page 1
    readonly somewhereToLive = new Element.Radiogroup<SanYesNo>(this.page, '#community_current_accommodation|custody_future_accommodation', sanYesNoOptions)
    // page 2
    readonly accommodationSettled = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_current_accommodation_settled', sanYesNoOptions)
    // page 2b why no accommodation
    // page 3
    readonly locationSuitable = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_suitable_housing_location', sanYesNoOptions)
    // page 4 - optional reasons if location is not suitable
    // page 5
    readonly accommodationSuitable = new Element.Radiogroup<SanYesConcernsNo>(this.page, '#[sanMode]_suitable_housing', sanYesConcernsNoOptions)
    // page 6 - optional reasons if accommodation not suitable

    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

    async populateMinimal() {

        await this.goto()
        await this.somewhereToLive.setValue('yes')
        await this.saveAndContinue()
        await this.accommodationSettled.setValue('yes')
        await this.saveAndContinue()
        await this.locationSuitable.setValue('yes')
        await this.saveAndContinue()
        await this.accommodationSuitable.setValue('yes')
        await this.saveAndContinue()
        await this.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }

    async populateNoAccommodation() {

        await this.goto()
        await this.somewhereToLive.setValue('no')
        await this.saveAndContinue()
    }

    async populateForOpd() {

        await this.somewhereToLive.setValue('yes')
        await this.saveAndContinue()
        await this.accommodationSettled.setValue('yes')
        await this.saveAndContinue()
        await this.locationSuitable.setValue('yes')
        await this.saveAndContinue()
        await this.accommodationSuitable.setValue('yes')
        await this.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateWithRiskOfHarm()
        await this.markAsComplete()
    }
}