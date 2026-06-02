import { BaseAssessmentPage, Element } from 'classes'

export class BcsSection3 extends BaseAssessmentPage {

    name = 'BCSSection3'
    title = '3 - Accommodation'
    menu: Menu = { type: 'Floating', level1: 'Section 1 to 12', level2: '3 - Accommodation' }

    b3_1 = new Element.Select(this.page, '#itm_TR_BCS33')
    b3_2Line1 = new Element.Textbox(this.page, '#P2_TR_CURRENT_ADDRESS_LINE_1')
    b3_2Line2 = new Element.Textbox(this.page, '#P2_TR_CURRENT_ADDRESS_LINE_2')
    b3_2Line3 = new Element.Textbox(this.page, '#P2_TR_CURRENT_ADDRESS_LINE_3')
    b3_2Line4 = new Element.Textbox(this.page, '#P2_TR_CURRENT_ADDRESS_LINE_4')
    b3_2Line5 = new Element.Textbox(this.page, '#P2_TR_CURRENT_ADDRESS_LINE_5')
    b3_2Line6 = new Element.Textbox(this.page, '#P2_TR_CURRENT_ADDRESS_LINE_6')
    b3_2Postcode = new Element.Textbox(this.page, '#P2_TR_CURRENT_POST_CODE')
    b3_3 = new Element.Select(this.page, '#P2_TR_CURRENT_LOCAL_AUTHORITY_ELM')
    b3_4 = new Element.Select(this.page, '#itm_TR_BCS36')
    b3_5 = new Element.Select(this.page, '#itm_TR_BCS37')
    b3_6 = new Element.Select(this.page, '#itm_TR_BCS38')
    b3_7 = new Element.Select(this.page, '#itm_TR_BCS39')
    b3_8 = new Element.Select(this.page, '#itm_TR_BCS40')
    b3_9 = new Element.Select(this.page, '#itm_TR_BCS309')
    b3_10Line1 = new Element.Textbox(this.page, '#P2_TR_DISCHARGE_ADDRESS_LINE_1')
    b3_10Line2 = new Element.Textbox(this.page, '#P2_TR_DISCHARGE_ADDRESS_LINE_2')
    b3_10Line3 = new Element.Textbox(this.page, '#P2_TR_DISCHARGE_ADDRESS_LINE_3')
    b3_10Line4 = new Element.Textbox(this.page, '#P2_TR_DISCHARGE_ADDRESS_LINE_4')
    b3_10Line5 = new Element.Textbox(this.page, '#P2_TR_DISCHARGE_ADDRESS_LINE_5')
    b3_10Line6 = new Element.Textbox(this.page, '#P2_TR_DISCHARGE_ADDRESS_LINE_6')
    b3_10Postcode = new Element.Textbox(this.page, '#P2_TR_DISCHARGE_POST_CODE')
    b3_11 = new Element.Select(this.page, '#P2_TR_DISCHARGE_LOCAL_AUTHORITY_ELM')
    b3_12 = new Element.Select(this.page, '#itm_TR_BCS43')
    b3_13 = new Element.Textbox(this.page, '#textarea_TR_BCS44')
}
