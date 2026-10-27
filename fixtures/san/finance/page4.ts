import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page4 extends BaseSanEditPage {

    howGoodManaging = new Element.Radiogroup<HowGoodManaging>(this.page, '#finance_money_management', ['ableStrength', 'able', 'unable', 'unableProblems'])
    debt = new Element.CheckboxGroup<'own' | 'someoneElse' | 'no' | 'unknown'>(this.page, '#finance_debt', ['own', 'someoneElse', '-', 'no', 'unknown'])


    async populateMinimal() {

        await this.howGoodManaging.setValue('ableStrength')
        await this.debt.setValue(['no'])
    }
}