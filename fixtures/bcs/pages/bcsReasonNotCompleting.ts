import { OasysPage, Element } from 'classes'

export class BcsReasonNotCompleting extends OasysPage {

    name = 'BCSReasonNotCompleting'

    ok = new Element.Button(this.page, 'Ok')
    cancel = new Element.Button(this.page, 'Cancel')
    reason = new Element.Select(this.page, '#P2_REASON_ELM')
    otherReason = new Element.Textbox(this.page, '#P2_OTHER_REASON')
}
