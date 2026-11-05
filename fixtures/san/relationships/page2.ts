import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    parentingResponsibilities = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_personal_relationships_community_parental_responsibilities', sanYesNoOptions)

}
