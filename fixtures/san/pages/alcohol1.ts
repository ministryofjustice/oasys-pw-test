import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'


export class Alcohol1 extends BaseSanEditPage {

    name = 'Alcohol1'
    title = 'Alcohol use - Strengths and Needs'

    everDrank = new Element.Radiogroup<EverDrank>(this.page, '#alcohol_use', ['yesIncLast3', 'yesNotLast3', 'no'])
}

