import { OasysPage, Element } from 'classes'

export class CompletionCheck extends OasysPage {

    name = 'CompletionCheck'
    title = 'Completion Check (Part 1)'
    menu: Menu = { type: 'Floating', level1: 'Completion Check' }

    signNow = new Element.Button(this.page, 'Sign Now')
    bq1 = new Element.Textbox(this.page, '#itm_TR_BCS144')
    bq2 = new Element.Textbox(this.page, '#itm_TR_BCS145')
}
