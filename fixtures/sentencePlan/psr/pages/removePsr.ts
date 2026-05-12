import { OasysPage, Element } from 'classes'

export class RemovePsr extends OasysPage {

    name = 'RemovePSR'
    title = 'Administration Functions - Remove/Append PSR'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Remove PSR' }

    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
}
