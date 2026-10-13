import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanWantChangesOptions, sanYesNoUnknownOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    planToReturn = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#custody_tba', sanYesNoUnknownOptions)
    livingWith = new Element.CheckboxGroup<LivingWith>(this.page, '#[sanMode]_living_with', ['family', 'friends', 'partner', 'child', 'other', 'unknown', '-', 'alone'])
    locationSuitable = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#[sanMode]_suitable_housing_location', sanYesNoUnknownOptions)
    accommodationSuitable = new Element.Radiogroup<SanYesNoConcernsUnknown>(this.page, '#[sanMode]_suitable_housing', ['yes', 'yesWithConcerns', 'no', 'unknown'])
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#[sanMode]_accommodation_changes', sanWantChangesOptions)


    async populateMinimal() {

        await this.livingWith.setValue(['alone'])
        await this.locationSuitable.setValue('yes')
        await this.accommodationSuitable.setValue('yes')
        await this.wantChanges.setValue('madeChanges')
    }
}
