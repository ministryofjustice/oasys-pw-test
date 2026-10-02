import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions, sanYesSometimesNoUnknownOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    parentingResponsibilities = new Element.Radiogroup<SanYesNo>(this.page, '#personal_relationships_community_parental_responsibilities', sanYesNoOptions)
    manageParenting = new Element.Radiogroup<SanYesSometimesNoUnknown>(this.page, '#personal_relationships_community_manage_parental_responsibilities', sanYesSometimesNoUnknownOptions)
   
    async populateMinimal() {

        await this.parentingResponsibilities.setValue('no')
    }
}
