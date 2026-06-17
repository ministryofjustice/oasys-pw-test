import { Element, BaseAssessmentPage } from 'classes'

export class SentencePlanService extends BaseAssessmentPage {

    name = 'SentencePlanService'
    title = 'Sentence Plan Service'
    menu: Menu = { type: 'Floating', level1: 'Sentence Plan Service' }
    
    signAndLock = new Element.Button(this.page, 'Sign & Lock')
    countersign = new Element.Button(this.page, 'Countersign')
    countersignOverview = new Element.Button(this.page, 'Countersign Overview')
    openSpLabel = new Element.Text(this.page, `div:contains('To exit OASys and launch into the Sentence Plan Service please click on the button below')`)
    openSp = new Element.Button(this.page, 'Open Sentence Plan Service')
}


