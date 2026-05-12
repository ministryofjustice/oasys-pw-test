import { OasysPage, Element } from 'classes'

export class PsrRollback extends OasysPage {

    name = 'PSRRollback'
    title = 'Administration Functions - PSR Court Report Rollback'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Rollback Court Report' }

    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
}
