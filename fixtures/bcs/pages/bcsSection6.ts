import { BaseAssessmentPage, Element } from 'classes'

export class BcsSection6 extends BaseAssessmentPage {

    name = 'BCSSection6'
    title = '6 - Relationships'
    menu: Menu = { type: 'Floating', level1: 'Section 1 to 12', level2: '6 - Relationships' }

    b6_1 = new Element.Select(this.page, '#itm_TR_BCS93')
    b6_23 = new Element.Select(this.page, '#itm_TR_BCS933')
    b6_24 = new Element.Select(this.page, '#itm_TR_BCS934')
    b6_2 = new Element.Textbox(this.page, '#itm_TR_BCS94')
    b6_3 = new Element.Textbox(this.page, '#textarea_TR_BCS95')
    b6_4 = new Element.Textbox(this.page, '#textarea_TR_BCS99')
    b6_5 = new Element.Select(this.page, '#itm_TR_BCS102')
    b6_6 = new Element.Textbox(this.page, '#textarea_TR_BCS103')
    b6_7 = new Element.Select(this.page, '#itm_TR_BCS104')
    b6_8 = new Element.Textbox(this.page, '#textarea_TR_BCS105')
    b6_9 = new Element.Select(this.page, '#itm_TR_BCS100')
    b6_10 = new Element.Textbox(this.page, '#textarea_TR_BCS101')
    b6_11 = new Element.Textbox(this.page, '#itm_TR_BCS611')
    b6_12 = new Element.Textbox(this.page, '#textarea_TR_BCS612')
    b6_13 = new Element.Textbox(this.page, '#textarea_TR_BCS613')
    b6_14 = new Element.Select(this.page, '#itm_TR_BCS614')
    b6_15 = new Element.Textbox(this.page, '#textarea_TR_BCS615')
    b6_16 = new Element.Select(this.page, '#itm_TR_BCS106')
    b6_16t = new Element.Text(this.page, '#itm_TR_BCS225')
    b6_17 = new Element.Select(this.page, '#itm_TR_BCS109')
    b6_18 = new Element.Select(this.page, '#itm_TR_BCS110')
    b6_19 = new Element.Select(this.page, '#itm_TR_BCS619')
    b6_20 = new Element.Select(this.page, '#itm_TR_BCS112')
    b6_21 = new Element.Select(this.page, '#itm_TR_BCS115')
    b6_22 = new Element.Textbox(this.page, '#textarea_TR_BCS116')
}
