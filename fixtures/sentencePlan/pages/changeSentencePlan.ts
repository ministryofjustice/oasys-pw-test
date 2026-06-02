import { OasysPage, Element } from 'classes'

export class ChangeSentencePlan extends OasysPage {

    name = 'ChangeSentencePlan'
    title = 'Administration Functions - Change Sentence Plan'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Change Sentence Plan Type' }

    save = new Element.Button(this.page, 'Save')
    cancel = new Element.Button(this.page, 'Cancel')
    review = new Element.Link(this.page, 'Review')
    initial = new Element.Link(this.page, 'Initial')
    psrOutline = new Element.Link(this.page, 'PSR Outline')
}
