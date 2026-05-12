import { OasysPage, Element } from 'classes'

export class AppendPsr extends OasysPage {

    name = 'AppendPSR'
    title = 'Administration Functions - Remove/Append PSR'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Append PSR' }

    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
    selectType = new Element.Select(this.page, '#P3_REPORT_TYPE')
}
