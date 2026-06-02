import { OasysPage, Element } from 'classes'

export class BcsWorkInProgress extends OasysPage {

    name = 'BCSWorkInProgress'
    title = 'ASS050 - WIP BCP'

    errorMessage = new Element.Text(this.page, '#P10_TEXT_WIP')
    cancel = new Element.Button(this.page, 'Cancel')
}
