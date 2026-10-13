import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoUnknownOptions, sanWantChangesOptions, sanYesNoOptions } from '../sanSection'


export class Page1 extends BaseSanEditPage {

    incomeSource = new Element.CheckboxGroup<IncomeSource>(this.page, '#[sanMode]_finance_income', ['carersAllowance', 'disabilityBenefits', 'employment', 'family', 'offending', 'pension', 'studentLoan', 'undeclared', 'workBenefits', 'other', 'unknown', '-', 'noMoney'])
    custodyIncomeSource = new Element.CheckboxGroup<'employment' | 'family' | 'pension' | 'unemployment' | 'other' | 'unknown' | 'noMoney'>(this.page, '#custody_tba', ['employment', 'family', 'pension', 'unemployment', 'other', 'unknown', '-', 'noMoney'])
    overReliant = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#[sanMode]_family_or_friends_details', sanYesNoUnknownOptions)
    overReliantDetails = new Element.Textbox(this.page, '#[sanMode]_tbc')
    anyIssues = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_finance_concerns', sanYesNoOptions)
    howGoodManaging = new Element.Radiogroup<HowGoodManaging>(this.page, '#[sanMode]_finance_money_management', ['ableStrength', 'able', 'unable', 'unableProblems'])
    debt = new Element.CheckboxGroup<'own' | 'someoneElse' | 'no' | 'unknown'>(this.page, '#[sanMode]_finance_debt', ['own', 'someoneElse', '-', 'no', 'unknown'])
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#[sanMode]_finance_changes', sanWantChangesOptions)


    async populateMinimal() {

        await this.incomeSource.setValue(['employment'])
        await this.anyIssues.setValue('no')
        await this.howGoodManaging.setValue('ableStrength')
        await this.debt.setValue(['no'])
        await this.wantChanges.setValue('notAnswering')
    }
}