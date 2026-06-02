import { OasysPage, Element } from 'classes'

export class OffencesLov extends OasysPage {

    name = 'OffencesLOV'

    close = new Element.Button(this.page, 'Close')
    findOffence = new Element.Link(this.page, 'Find Offence')
    selectionType = new Element.Select(this.page, '#P2_SELECTION_TYPE')
    selection = new Element.Select(this.page, '#P2_OFFENCE_ELM')
    search = new Element.Button(this.page, 'Search')
    reset = new Element.Button(this.page, 'Reset')
    offenceColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Offence')
    codeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Code')
    subcodeColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Subcode')
}
