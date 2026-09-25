import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanWantChangesOptions, sanYesNoOptions } from '../sanIds'


export class Page2 extends BaseSanEditPage {

    name = 'AccommodationPage2'
    title = 'Accommodation - Strengths and Needs'

    livingWith = new Element.CheckboxGroup<LivingWith>(this.page, '#living_with', ['family', 'friends', 'partner', 'child', 'other', 'unknown', '-', 'alone'])
    locationSuitable = new Element.Radiogroup<SanYesNo>(this.page, '#suitable_housing_location', sanYesNoOptions)
    accommodationSuitable = new Element.Radiogroup<SanYesNoConcerns>(this.page, '#suitable_housing', ['yes', 'yesWithConcerns', 'no'])
    futurePlanned = new Element.Radiogroup<SanYesNo>(this.page, '#suitable_housing_planned', sanYesNoOptions,)
    futureType = new Element.Radiogroup<'awaitingAssessment' | 'awatingPlacement' | 'buyHouse' | 'friends' | 'privateRent' | 'socialRent' | 'healthcare' | 'supported' | 'other'>(this.page, '#future_accommodation_type', ['awaitingAssessment', 'awatingPlacement', 'buyHouse', 'friends', 'privateRent', 'socialRent', 'healthcare', 'supported', 'other'])

    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#accommodation_changes', sanWantChangesOptions)


    async populateMinimal() {

        await this.livingWith.setValue(['alone'])
        await this.locationSuitable.setValue('yes')
        await this.accommodationSuitable.setValue('yes')
        await this.wantChanges.setValue('madeChanges')
    }
}
