import { BaseAssessmentPage, Element } from 'classes'

export class PreviousHistoric extends BaseAssessmentPage {

    name = 'PreviousHistoric'
    title = 'Create Assessment'

    no = new Element.Button(this.page, 'No')
    yes = new Element.Button(this.page, 'Yes')
}
