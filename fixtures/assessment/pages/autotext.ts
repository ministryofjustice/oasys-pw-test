import { OasysPage, Element } from 'classes'

export class Autotext extends OasysPage {

    name = 'Autotext'

    close = new Element.Button(this.page, 'Close')
    personal = new Element.Link(this.page, 'Personal')
    global = new Element.Link(this.page, 'Global')
    item = new Element.Text(this.page, '#P200_ITEM_NAME')
}
