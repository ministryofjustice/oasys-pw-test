import { OasysPage, Element } from 'classes'

export class SignAndLockPsr extends OasysPage {

    name = 'SignAndLockPSR'

    sign = new Element.Button(this.page, 'Sign')
    cancel = new Element.Button(this.page, 'Cancel')
}
