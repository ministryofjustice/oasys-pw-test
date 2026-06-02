import { OasysPage, Element } from 'classes'

export class BcsOutstandingQuestions extends OasysPage {

    name = 'BCSOutstandingQuestions'

    confirmSignAndLock = new Element.Button(this.page, 'Confirm Sign & Lock')
    returnToAssessment = new Element.Button(this.page, 'Return to Assessment')
    cancel = new Element.Button(this.page, 'Cancel')
}
