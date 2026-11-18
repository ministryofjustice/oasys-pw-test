import { BaseSanSection, sanYesConcernsNoUnknownOptions, sanYesNoOptions, sanYesNoUnknownOptions } from '../sanSection'
import { Element } from 'classes'
import { PractitionerAnalysis } from '../pages'

export class Accommodation extends BaseSanSection {

    override readonly sectionName: SanSectionTitle = 'Accommodation'
    override readonly paPrefix = 'accommodation'

    // page 1
    readonly somewhereToLive = new Element.Radiogroup<SanYesNo>(this.page, '#community_current_accommodation|#custody_past_accommodation', sanYesNoOptions)
    // page 2
    readonly accommodationSettled = new Element.Radiogroup<SanYesNo>(this.page, '#community_current_accommodation_settled|custody_type_of_past_accommodation', sanYesNoOptions)
    // page 2a
    readonly plansForRelease = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#custody_plans_for_accommodation', sanYesNoUnknownOptions)
    // page 2b
    readonly livingWith = new Element.CheckboxGroup<LivingWith>(this.page, '#custody_living_with', ['family', 'friends', 'partner', 'child', 'other', 'unknown', 'alone'])

    // page 3
    readonly locationSuitable = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#[sanMode]_suitable_housing_location', sanYesNoUnknownOptions)
    // NOTE - unknown for custody only

    // page 4 - optional reasons if location is not suitable

    // page 5
    readonly accommodationSuitable = new Element.Radiogroup<SanYesConcernsNoUnknown>(this.page, '#[sanMode]_suitable_housing', sanYesConcernsNoUnknownOptions)
    // NOTE - unknown for custody only

    // page 6 - optional reasons if accommodation not suitable
    // page 7 - if no accommodation
    readonly whyNoAccommodation = new Element.Radiogroup<'alcohol' | 'drugs' | 'financial' | 'leftRiskToOthers' | 'leftForSafety' | 'noAccommodationOnRelease' | 'other'>(this.page, '#community_no_accommodation_reason|custody_no_accommodation_concerns', ['alcohol', 'drugs', 'financial', 'leftRiskToOthers', 'leftForSafety', 'noAccommodationOnRelease', 'other'])

    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

    async populateMinimal() {

        await this.goto()
        await this.somewhereToLive.setValue('yes')
        await this.saveAndContinue()
        await this.accommodationSettled.setValue('yes')
        await this.saveAndContinue()
        if (sanMode == 'custody') {
            await this.plansForRelease.setValue('yes')
            await this.saveAndContinue()
            await this.livingWith.setValue(['family'])
            await this.saveAndContinue()
        }
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
        await this.whyNoAccommodation.setValue('alcohol')
        await this.saveAndContinue()
        if (sanMode == 'custody') {
            await this.plansForRelease.setValue('no')
            await this.saveAndContinue()
        }
    }

    async populateForOpd() {

        await this.somewhereToLive.setValue('yes')
        await this.saveAndContinue()
        await this.accommodationSettled.setValue('yes')
        await this.saveAndContinue()
        if (sanMode == 'custody') {
            await this.plansForRelease.setValue('yes')
            await this.saveAndContinue()
            await this.livingWith.setValue(['family'])
            await this.saveAndContinue()
        }
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