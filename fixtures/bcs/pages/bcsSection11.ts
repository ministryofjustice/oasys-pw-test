import { BaseAssessmentPage, Element } from 'classes'

export class BcsSection11 extends BaseAssessmentPage {

    name = 'BCSSection11'
    title = '11 - Thinking and Behaviour'
    menu: Menu = { type: 'Floating', level1: 'Section 1 to 12', level2: '11 - Thinking and behaviour' }

    b11_1 = new Element.Select(this.page, '#itm_TR_BCS120')
    b11_2 = new Element.Select(this.page, '#itm_TR_BCS121')
    b11_3 = new Element.Select(this.page, '#itm_TR_BCS123')
    b11_4 = new Element.Textbox(this.page, '#textarea_TR_BCS124')
}
