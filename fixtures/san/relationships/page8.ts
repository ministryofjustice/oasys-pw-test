import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page8 extends BaseSanEditPage {

    domesticAbuseVictimType = new Element.CheckboxGroup<FamilyPartner>(this.page, '#offence_analysis_victim_of_domestic_abuse_who_committed_abuse', ['family', 'partner'])
    familyVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_family_member_details')
    partnerVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_intimate_partner_details')

}
