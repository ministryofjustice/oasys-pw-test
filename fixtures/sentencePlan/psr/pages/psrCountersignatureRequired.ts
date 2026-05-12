import { OasysPage, Element } from 'classes'

export class PsrCountersignatureRequired extends OasysPage {

    name = 'PSRCountersignatureRequired'

    countersigner = new Element.Select(this.page, '#P450_COUNTERSIGNER')
    oK = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
}
