import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoUnknownOptions, sanWantChangesOptions, incomeSourceOptions, howGoodManagingOptions } from '../sanIds'


export class Page1 extends BaseSanEditPage {

    name = 'FinancePage1'
    title = 'Finances - Strengths and Needs'

    incomeSource = new Element.CheckboxGroup<IncomeSource>(this.page, '#finance_income', incomeSourceOptions)
    overReliant = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#family_or_friends_details', sanYesNoUnknownOptions)
    ownAccount = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#finance_bank_account', sanYesNoUnknownOptions)
    howGoodManaging = new Element.Radiogroup<HowGoodManaging>(this.page, '#finance_money_management', howGoodManagingOptions)
    gambling = new Element.CheckboxGroup<'own' | 'someoneElse' | 'no' | 'unknown'>(this.page, '#finance_gambling', ['own', 'someoneElse', '-', 'no', 'unknown'])
    debt = new Element.CheckboxGroup<'own' | 'someoneElse' | 'no' | 'unknown'>(this.page, '#finance_debt', ['own', 'someoneElse', '-', 'no', 'unknown'])
    wantChangesFinance = new Element.Radiogroup<SanWantChanges>(this.page, '#finance_changes', sanWantChangesOptions)


    async populateMinimal() {

        await this.incomeSource.setValue(['employment'])
        await this.ownAccount.setValue('yes')
        await this.howGoodManaging.setValue('ableStrength')
        await this.gambling.setValue(['no'])
        await this.debt.setValue(['no'])
        await this.wantChangesFinance.setValue('notAnswering')
    }
}