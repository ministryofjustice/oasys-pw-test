import { BaseAssessmentPage, Element } from 'classes'

export class BcsRiskScreening extends BaseAssessmentPage {

    name = 'BCSRiskScreening'
    title = 'Risk Screening'
    menu: Menu = { type: 'Floating', level1: 'Risk Screening' }

    signAndLock = new Element.Button(this.page, 'Sign & Lock')
    lockIncomplete = new Element.Button(this.page, 'Lock Incomplete')
    br1 = new Element.Select(this.page, '#itm_TR_BCS125')
    br2 = new Element.Select(this.page, '#itm_TR_BCS1402')
    br3 = new Element.Textbox(this.page, '#textarea_TR_BCS1403')
    br4 = new Element.Textbox(this.page, '#textarea_TR_BCS1404')
    br5 = new Element.Select(this.page, '#itm_TR_BCS127')
    br6 = new Element.Textbox(this.page, '#textarea_TR_BCS128')
    br7 = new Element.Select(this.page, '#itm_TR_BCS129')
    br8 = new Element.Select(this.page, '#itm_TR_BCS130')
    br9 = new Element.Select(this.page, '#itm_TR_BCS131')
    br9t = new Element.Text(this.page, '#itm_TR_BCS231')
    br10 = new Element.Select(this.page, '#itm_TR_BCS132')
    br11 = new Element.Select(this.page, '#itm_TR_BCS133')
    br12 = new Element.Select(this.page, '#itm_TR_BCS134')
    br12t = new Element.Text(this.page, '#itm_TR_BCS232')
    br13 = new Element.Select(this.page, '#itm_TR_BCS135')
    br14 = new Element.Textbox(this.page, '#textarea_TR_BCS136')
}
