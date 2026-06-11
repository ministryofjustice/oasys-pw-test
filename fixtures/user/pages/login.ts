import { OasysPage, Element } from 'classes'

export class Login extends OasysPage {
    name = 'Login'
    title = 'Login'

    username = new Element.Textbox(this.page, '#P101_USERNAME')
    password = new Element.Textbox(this.page, '#P101_PASSWORD')
    login = new Element.Button(this.page, '#P101_LOGIN_BTN')
}
