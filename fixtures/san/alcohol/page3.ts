import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page3 extends BaseSanEditPage {

    anythingHelped = new Element.Radiogroup<SanYesNo>(this.page, '#alcohol_stopped_or_reduced', ['yes', 'no'])
    anythingHelpedPast = new Element.Radiogroup<SanYesNo>(this.page, '#alcohol_stopped_or_reduced_past', ['yes', 'no'])
}
