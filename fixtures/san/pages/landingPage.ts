import { OasysPage, Element } from 'classes'

export class LandingPage extends OasysPage {

    name = 'LandingPage'
    title = 'Remember to close any other applications'

    confirmCheck = new Element.Checkbox(this.page, '#confirm_privacy')
    confirm = new Element.Button(this.page, 'confirm')
    returnToOASys = new Element.Link(this.page, 'Return to OASys')
}
