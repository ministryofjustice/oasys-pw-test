import { OasysPage, Element } from 'classes'

export class PsrCountersigning extends OasysPage {

    name = 'PSRCountersigning'

    selectAction = new Element.Select(this.page, '#P450_COUNTERSIGN_ACTION')
    rejectionReason = new Element.Textbox(this.page, '#P450_REJECTION_REASON')
    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
}
