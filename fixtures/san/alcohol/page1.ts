import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page1 extends BaseSanEditPage {

    name = 'AlcoholPage1'
    title = 'Alcohol use - Strengths and Needs'

    everDrank = new Element.Radiogroup<EverDrank>(this.page, '#alcohol_use', ['yesIncLast3', 'yesNotLast3', 'no'])


    async populateMinimal() {

        await this.everDrank.setValue('no')
    }
}

