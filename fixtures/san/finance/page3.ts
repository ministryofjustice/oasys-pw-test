import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'


export class Page3 extends BaseSanEditPage {

    anyIssues = new Element.Radiogroup<SanYesNo>(this.page, '#finance_concerns', sanYesNoOptions)


    async populateMinimal() {

        await this.anyIssues.setValue('no')
    }
}