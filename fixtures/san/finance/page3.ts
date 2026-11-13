import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'


export class Page3 extends BaseSanEditPage {

    incomeSourceInCustody = new Element.CheckboxGroup<IncomeSourceInCustody>(this.page, 'custody_finance_income_in_custody', ['employment', 'family', 'pension', 'unemploymentPay', 'other', 'unknown', '-', 'noMoney'])
    anyIssues = new Element.Radiogroup<SanYesNo>(this.page, '#finance_concerns', sanYesNoOptions)


    async populateMinimal() {

        await this.anyIssues.setValue('no')
    }
}