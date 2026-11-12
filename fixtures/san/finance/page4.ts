import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanGoodToBadOptions } from '../sanSection'


export class Page4 extends BaseSanEditPage {

    howGoodManaging = new Element.Radiogroup<SanGoodToBad>(this.page, '#finance_money_management', sanGoodToBadOptions)
    debt = new Element.CheckboxGroup<'own' | 'someoneElse' | 'no' | 'unknown'>(this.page, '#finance_debt', ['own', 'someoneElse', '-', 'no', 'unknown'])


    async populateMinimal() {

        await this.howGoodManaging.setValue('good')
        await this.debt.setValue(['no'])
    }
}