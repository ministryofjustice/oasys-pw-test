import { OasysPage, Element } from 'classes'

export class AmendRoshaDate extends OasysPage {

    name = 'AmendRoshaDate'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Amend Date of Commencement of Community Sentence or Earliest Possible Release from Custody' }

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    o1_38 = new Element.Textbox<OasysDate>(this.page, '#P3_DATE_IN_COMMUNITY', true)
    auditText = new Element.Textbox(this.page, '#P3_QU_1_38_T')
    rsrScore = new Element.Textbox(this.page, '#P3_RSR')
}
