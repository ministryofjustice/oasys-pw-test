import { BaseAssessmentPage, Element } from 'classes'

export class BcsSection5 extends BaseAssessmentPage {

    name = 'BCSSection5'
    title = '5 - Financial Management and Income'
    menu: Menu = { type: 'Floating', level1: 'Section 1 to 12', level2: '5 - Financial Management and Income' }

    b5_1 = new Element.Select(this.page, '#itm_TR_BCS45')
    b5_2 = new Element.Select(this.page, '#itm_TR_BCS50')
    b5_3 = new Element.Textbox(this.page, '#textarea_TR_BCS54')
    b5_4 = new Element.Select(this.page, '#itm_TR_BCS55')
    b5_5 = new Element.Select(this.page, '#itm_TR_BCS56')
    b5_6 = new Element.Textbox(this.page, '#textarea_TR_BCS57')
}
