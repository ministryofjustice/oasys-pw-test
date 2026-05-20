import { BaseAssessmentPage, Element } from 'classes'

export class BcsSection4 extends BaseAssessmentPage {

    name = 'BCSSection4'
    title = '4 - Education Training and Employability'
    menu: Menu = { type: 'Floating', level1: 'Section 1 to 12', level2: '4 - Education, Training and Employability' }

    b4_1 = new Element.Select(this.page, '#itm_TR_BCS401')
    b4_2 = new Element.Textbox(this.page, '#textarea_TR_BCS58')
    b4_3 = new Element.Select(this.page, '#itm_TR_BCS403')
    b4_4 = new Element.Select(this.page, '#itm_TR_BCS404')
    b4_4t = new Element.Textbox(this.page, '#textarea_TR_BCS404_t')
    b4_5 = new Element.Select(this.page, '#itm_TR_BCS405')
    b4_6 = new Element.Select(this.page, '#itm_TR_BCS406')
    b4_7 = new Element.Select(this.page, '#itm_TR_BCS407')
    b4_8 = new Element.Select(this.page, '#itm_TR_BCS408')
    b4_9 = new Element.Select(this.page, '#itm_TR_BCS409')
    b4_10 = new Element.Select(this.page, '#itm_TR_BCS410')
    b4_11 = new Element.Select(this.page, '#itm_TR_BCS74')
    b4_12 = new Element.Select(this.page, '#itm_TR_BCS66')
    b4_13 = new Element.Select(this.page, '#itm_TR_BCS70')
    b4_14 = new Element.Select(this.page, '#itm_TR_BCS414')
    b4_14t = new Element.Textbox(this.page, '#textarea_TR_BCS414_t')
    b4_15 = new Element.Select(this.page, '#itm_TR_BCS75')
    b4_16 = new Element.Textbox(this.page, '#textarea_TR_BCS76')
}
