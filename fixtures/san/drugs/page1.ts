import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page1 extends BaseSanEditPage {

    everUsed = new Element.Radiogroup<SanYesNo>(this.page, '#drug_use', sanYesNoOptions)


    async populateMinimal() {

        await this.everUsed.setValue('no')
    }
}
