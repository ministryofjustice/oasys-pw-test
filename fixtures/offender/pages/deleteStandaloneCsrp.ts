import { OasysPage, Element } from 'classes'

export class DeleteStandaloneCsrp extends OasysPage {

    name = 'DeleteStandaloneCsrp'
    title = 'Administration Functions - Delete'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Delete Standalone CSRP' }

    reasonForDeletion = new Element.Textbox(this.page, '#P3_REASON_FOR_DELETION')
    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
}
