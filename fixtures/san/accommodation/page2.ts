import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanWantChangesOptions, sanYesNoOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    livingWith = new Element.CheckboxGroup<LivingWith>(this.page, '#[sanMode]_living_with', ['family', 'friends', 'partner', 'child', 'other', 'unknown', '-', 'alone'])
    locationSuitable = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_suitable_housing_location', sanYesNoOptions)
    accommodationSuitable = new Element.Radiogroup<SanYesNoConcerns>(this.page, '#[sanMode]_suitable_housing', ['yes', 'yesWithConcerns', 'no'])
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#[sanMode]_accommodation_changes', sanWantChangesOptions)


    async populateMinimal() {

        await this.livingWith.setValue(['alone'])
        await this.locationSuitable.setValue('yes')
        await this.accommodationSuitable.setValue('yes')
        await this.wantChanges.setValue('madeChanges')
    }
}
