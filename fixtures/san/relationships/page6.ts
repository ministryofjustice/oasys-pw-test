import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page6 extends BaseSanEditPage {

    strangulation = new Element.Radiogroup<SanYesNo>(this.page, '#evidence_of_strangulation', sanYesNoOptions)
    strangulationYesDetails = new Element.Textbox(this.page, '#evidence_of_strangulation_yes_details')
    strangulationNoDetails = new Element.Textbox(this.page, '#evidence_of_strangulation_no_details')

}
