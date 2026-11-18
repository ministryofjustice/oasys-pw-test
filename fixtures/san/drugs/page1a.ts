import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page1a extends BaseSanEditPage {

    usedInCustody = new Element.Radiogroup<SanYesNo>(this.page, '#custody_drug_use_in_custody', sanYesNoOptions)
    usedInCustodyYesDetails = new Element.Textbox(this.page, '#custody_drug_use_in_custody_yes_details')

}
