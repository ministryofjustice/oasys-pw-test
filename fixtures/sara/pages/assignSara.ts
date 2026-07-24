import { OasysPage, Element } from 'classes'

export class AssignSara extends OasysPage {

    name = 'AssignSARA'

    lau = new Element.Select(this.page, '#P4_DIVISION')
    team = new Element.Select(this.page, '#P4_TEAM')
    assessor = new Element.Lov(this.page, '#P4_USER_LABEL')
    ok = new Element.Button(this.page, 'OK')
    cancel = new Element.Button(this.page, 'Cancel')
}
