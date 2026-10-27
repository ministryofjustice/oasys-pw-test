import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page2 extends BaseSanEditPage {

    employedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_ever_had_a_job', sanYesNoOptions)


}
