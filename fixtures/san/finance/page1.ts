import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoUnknownOptions, sanWantChangesOptions, sanYesNoOptions } from '../sanSection'


export class Page1 extends BaseSanEditPage {

    incomeSource = new Element.CheckboxGroup<IncomeSource>(this.page, '#finance_income', ['carersAllowance', 'disabilityBenefits', 'employment', 'family', 'offending', 'pension', 'studentLoan', 'undeclared', 'workBenefits', 'other', 'unknown', '-', 'noMoney'])
    overReliant = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#family_or_friends_details', sanYesNoUnknownOptions)
    overReliantDetails = new Element.Textbox(this.page, '#tbc')
    anyIssues = new Element.Radiogroup<SanYesNo>(this.page, '#finance_concerns', sanYesNoOptions)
    howGoodManaging = new Element.Radiogroup<HowGoodManaging>(this.page, '#finance_money_management', ['ableStrength', 'able', 'unable', 'unableProblems'])
    debt = new Element.CheckboxGroup<'own' | 'someoneElse' | 'no' | 'unknown'>(this.page, '#finance_debt', ['own', 'someoneElse', '-', 'no', 'unknown'])
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#finance_changes', sanWantChangesOptions)


    async populateMinimal() {

        await this.incomeSource.setValue(['employment'])
        await this.anyIssues.setValue('no')
        await this.howGoodManaging.setValue('ableStrength')
        await this.debt.setValue(['no'])
        await this.wantChanges.setValue('notAnswering')
    }
}