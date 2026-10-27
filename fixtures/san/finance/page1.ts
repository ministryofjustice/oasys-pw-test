import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page1 extends BaseSanEditPage {

    incomeSource = new Element.CheckboxGroup<IncomeSource>(this.page, '#[sanMode]_finance_income', ['carersAllowance', 'disabilityBenefits', 'employment', 'family', 'offending', 'pension', 'studentLoan', 'undeclared', 'workBenefits', 'other', 'unknown', '-', 'noMoney'])
    custodyIncomeSource = new Element.CheckboxGroup<'employment' | 'family' | 'pension' | 'unemployment' | 'other' | 'unknown' | 'noMoney'>(this.page, '#custody_tba', ['employment', 'family', 'pension', 'unemployment', 'other', 'unknown', '-', 'noMoney'])


    async populateMinimal() {

        await this.incomeSource.setValue(['employment'])
    }
}