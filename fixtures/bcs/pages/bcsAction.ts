import { OasysPage, Element } from 'classes'

export class BcsAction extends OasysPage {

    name = 'BCSAction'

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    resettlementPathwayItem = new Element.Select(this.page, '#P4_PATHWAY_ITEM')
    actionRequired = new Element.Textbox(this.page, '#P4_OBJECTIVE_TEXT')
    serviceLevel = new Element.Select(this.page, '#P4_SERVICE_LEVEL')
    personResponsible = new Element.Textbox(this.page, '#P4_WHO_WILL_DO_WORK_TEXT')
    dateOpened = new Element.Textbox<OasysDate>(this.page, '#P4_DATE_OPENED', true)
    completionDate = new Element.Textbox<OasysDate>(this.page, '#P4_DATE_COMPLETED', true)
    complete = new Element.Select(this.page, '#P4_PROBLEM_AREA_COMP_IND')
    delete = new Element.Button(this.page, 'Delete')
    addAnotherAction = new Element.Button(this.page, 'Add Another Action')
}
