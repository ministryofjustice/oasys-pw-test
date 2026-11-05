import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'


export class Page5 extends BaseSanEditPage {

    domesticAbusePerpetratorType = new Element.CheckboxGroup<FamilyPartner>(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_victim', ['family', 'partner'])
    familyPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_victim_family_member_details')
    partnerPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_victim_intimate_partner_details')
    controlling = new Element.Radiogroup<SanYesNo>(this.page, '#controlling_coercive_behaviour', sanYesNoOptions)
    controllingYesDetails = new Element.Textbox(this.page, '#controlling_coercive_behaviour_yes_details')
    controllingNoDetails = new Element.Textbox(this.page, '#controlling_coercive_behaviour_no_details')

}
