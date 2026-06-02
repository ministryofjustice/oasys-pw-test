import { BaseAssessmentPage, Element } from 'classes'

export class BcsSection8 extends BaseAssessmentPage {

    name = 'BCSSection8'
    title = '8 - Health and well-being'
    menu: Menu = { type: 'Floating', level1: 'Section 1 to 12', level2: '8 - Health and Well-being' }

    b8_1 = new Element.Select(this.page, '#itm_TR_BCS801')
    b8_2 = new Element.Select(this.page, '#itm_TR_BCS77')
    b8_3 = new Element.Select(this.page, '#itm_TR_BCS803')
    b8_4 = new Element.Select(this.page, '#itm_TR_BCS804')
    b8_5 = new Element.Select(this.page, '#itm_TR_BCS805')
    b8_5t = new Element.Textbox(this.page, '#textarea_TR_BCS805_t')
    b8_6 = new Element.Select(this.page, '#itm_TR_BCS806')
    b8_7 = new Element.Select(this.page, '#itm_TR_BCS807')
    b8_8 = new Element.Textbox(this.page, '#textarea_TR_BCS808')
    b8_9 = new Element.Select(this.page, '#itm_TR_BCS91')
    b8_10 = new Element.Textbox(this.page, '#textarea_TR_BCS92')
}
