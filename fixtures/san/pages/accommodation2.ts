import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { sanWantChangesOptions, sanYesNoOptions } from '../sanIds'


export class Accommodation2 extends BaseSanEditPage {

    name = 'Accommodation2'
    title = 'Accommodation - Strengths and Needs'

    livingWith = new Element.CheckboxGroup<LivingWith>(this.page, '#living_with', ['family', 'friends', 'partner', 'child', 'other', 'unknown', '-', 'alone'])
    locationSuitable = new Element.Radiogroup<SanYesNo>(this.page, '#suitable_housing_location', sanYesNoOptions)
    accommodationSuitable = new Element.Radiogroup<SanYesNoConcerns>(this.page, '#suitable_housing', ['yes', 'yesWithConcerns', 'no'])
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#accommodation_changes', sanWantChangesOptions)

}
/*
futurePlanned = new Element.Radiogroup(this.page, '#suitable_housing_planned', ['yes', 'no'])
futureType = new Element.Radiogroup(this.page, '#future_accommodation_type', ['awaitingAssessment', 'awatingPlacement', 'buyHouse', 'friends', 'privateRent', 'socialRent', 'healthcare', 'supported', 'other')


*/