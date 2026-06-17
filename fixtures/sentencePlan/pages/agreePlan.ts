import { OasysPage, Element } from 'classes'

export class AgreePlan extends OasysPage {
    
//     name = 'AgreePlan'
//     title = 'Do they agree to this plan?'

//     agree = new SanElement.Radiogroup<'yes' | 'no'>('#plan_agreement_question', ['yes', 'no'])
//     save = new SanElement.Button('save')
    confirmCheck = new Element.Checkbox(this.page, '#confirm_privacy')
    confirm = new Element.Button(this.page, 'confirm')
}