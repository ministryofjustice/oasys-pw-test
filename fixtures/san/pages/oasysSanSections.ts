import { BaseAssessmentPage, Element } from 'classes'

export class OasysSanSections extends BaseAssessmentPage {

    name = 'SanSections'
    title = 'Strengths and Needs'
    menu: Menu = { type: 'Floating', level1: 'Strengths and Needs' }

    openSanLabel = new Element.Text(this.page, `:nth-match(div:has-text('To exit OASys and launch into the Strengths and Needs Service please click on the button below'),1)`)
    openSan = new Element.Button(this.page, 'Open Strengths and Needs')
}


