import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'

export class Page1 extends BaseSanEditPage {

    name = 'DrugsPage1'
    title = 'Drug usage - Strengths and Needs'

    everUsed = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_use', ['yes', 'no'])


    async populateMinimal() {

        await this.everUsed.setValue('no')
    }
}
