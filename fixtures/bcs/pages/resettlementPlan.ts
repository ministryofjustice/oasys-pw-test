import { BaseAssessmentPage, Element } from 'classes'

export class ResettlementPlan extends BaseAssessmentPage {

    name = 'ResettlementPlan'
    title = 'Resettlement Plan'
    menu: Menu = { type: 'Floating', level1: 'Resettlement Plan' }

    signAndLock = new Element.Button(this.page, 'Sign & Lock')
    addNewAction = new Element.Button(this.page, 'Add New Action')
    actionsOnOffenders = new Element.Textbox(this.page, '#textarea_TR_BCS143')
    preReleaseActivity = new Element.Checkbox(this.page, '#itm_TR_BCS214_PRA_COMPLETE')
    comments = new Element.Textbox(this.page, '#textarea_TR_BCS216')
}
