import { Element, OasysPage } from 'classes'


export class Page1 extends OasysPage {

    everDrank = new Element.Radiogroup<EverDrank>(this.page, '#alcohol_use', ['yesIncLast3', 'yesNotLast3', 'no'])


    async populateMinimal() {

        await this.everDrank.setValue('no')
    }
}

