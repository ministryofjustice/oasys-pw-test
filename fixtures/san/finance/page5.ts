import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page5 extends BaseSanEditPage {

    ownDebtType = new Element.CheckboxGroup<'others' | 'formal'>(this.page, '#finance_yes_their_type_of_debt', ['others', 'formal'])
    someoneElseDebtType = new Element.CheckboxGroup<'others' | 'formal'>(this.page, '#finance_yes_someone_else_type_of_debt', ['others', 'formal'])


}