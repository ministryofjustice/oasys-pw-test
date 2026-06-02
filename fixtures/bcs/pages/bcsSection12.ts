import { BaseAssessmentPage, Element } from 'classes'

export class BcsSection12 extends BaseAssessmentPage {

    name = 'BCSSection12'
    title = '12 - Communication Issues'
    menu: Menu = { type: 'Floating', level1: 'Section 1 to 12', level2: '12 - Communication Issues' }

    b12_1 = new Element.Select(this.page, '#itm_TR_BCS1201')
    b12_1t = new Element.Textbox(this.page, '#textarea_TR_BCS1201_t')
    b12_2 = new Element.Select(this.page, '#itm_TR_BCS1202')
    b12_3 = new Element.Textbox(this.page, '#textarea_TR_BCS1203')
}
