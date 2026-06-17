import { OasysPage, Element } from 'classes'

export class LandingPage extends OasysPage {

    confirmCheck = new Element.Checkbox(this.page, '#confirm_privacy')
    confirm = new Element.Button(this.page, 'confirm')
}