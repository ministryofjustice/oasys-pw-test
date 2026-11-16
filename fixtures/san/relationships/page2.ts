import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    howAffected = new Element.Textbox(this.page, '#custody_personal_relationships_children_affected')
    childrenVisitingInCustody = new Element.Radiogroup<SanYesNo>(this.page, '',sanYesNoOptions)
    parentingResponsibilities = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_personal_relationships_community_parental_responsibilities', sanYesNoOptions)

}
