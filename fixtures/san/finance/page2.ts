import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoUnknownOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    overReliant = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#[sanMode]_finance_income_friends_family', sanYesNoUnknownOptions)
    overReliantDetails = new Element.Textbox(this.page, '#[sanMode]_finance_income_friends_family_yes_details')

}