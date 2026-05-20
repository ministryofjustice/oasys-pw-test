import { BaseAssessmentPage, Element } from 'classes'

export class BcsSection1 extends BaseAssessmentPage {

    name = 'BCSSection1'
    title = '1 - Offending Information'
    menu: Menu = { type: 'Floating', level1: 'Section 1 to 12', level2: '1 - Offending Information' }

    offence = new Element.Textbox(this.page, '#P2_CT_OFFENCE_CODE')
    offenceLov = new Element.Link(this.page, '//input[@id="P2_CT_OFFENCE_CODE"]/following::a/img')
    offenceDescription = new Element.Textbox(this.page, '#LOVDSC_P2_CT_OFFENCE_CODE')
    subcode = new Element.Textbox(this.page, '#P2_CT_OFFENCE_SUBCODE')
    subcodeLov = new Element.Link(this.page, '//input[@id="P2_CT_OFFENCE_SUBCODE"]/following::a/img')
    subcodeDescription = new Element.Textbox(this.page, '#LOVDSC_P2_CT_OFFENCE_SUBCODE')
    count = new Element.Textbox(this.page, '#P2_COUNT_OF_OFFENCES')
    codeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Code')
    subcodeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Subcode')
    descriptionColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Description')
    countColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Count')
    deleteColumn = new Element.Column(this.page, Element.ColumnType.ButtonColumn, 'Delete')
    addAdditionalOffences = new Element.Button(this.page, 'Add Additional Offences')
    b1_1 = new Element.Textbox(this.page, '#itm_TR_BCS24')
    b1_2 = new Element.Textbox(this.page, '#itm_TR_BCS25')
    b1_3 = new Element.Textbox(this.page, '#itm_TR_BCS26')
    b1_4 = new Element.Textbox(this.page, '#itm_TR_BCS27')
    b1_5 = new Element.Textbox(this.page, '#itm_TR_BCS28')
}
