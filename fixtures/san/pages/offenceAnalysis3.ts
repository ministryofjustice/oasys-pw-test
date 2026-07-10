import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'

export class OffenceAnalysis3 extends BaseSanEditPage {

    name = 'OffenceAnalysis3'
    title = 'Offence analysis - Strengths and Needs'

    leader = new Element.Radiogroup<'yes' | 'no'>(this.page, '#offence_analysis_leader', ['yes', 'no'])
    leaderYesDetails = new Element.Textbox(this.page, '#offence_analysis_leader_yes_details')
    leaderNoDetails = new Element.Textbox(this.page, '#offence_analysis_leader_no_details')
    impact = new Element.Radiogroup<'yes' | 'no'>(this.page, '#offence_analysis_impact_on_victims', ['yes', 'no'])
    responsibility = new Element.Radiogroup<'yes' | 'no'>(this.page, '#offence_analysis_accept_responsibility', ['yes', 'no'])
    responsibilityYesDetails = new Element.Textbox(this.page, '#offence_analysis_accept_responsibility_yes_details')
    responsibilityNoDetails = new Element.Textbox(this.page, '#offence_analysis_accept_responsibility_no_details')
    patterns = new Element.Textbox(this.page, '#offence_analysis_patterns_of_offending')
    escalation = new Element.Radiogroup<'yes' | 'no' | 'na'>(this.page, '#offence_analysis_escalation', ['yes', 'no', 'na'])
    domesticAbusePerpertrator = new Element.Radiogroup<'yes' | 'no'>(this.page, '#offence_analysis_perpetrator_of_domestic_abuse', ['yes', 'no'])
    domesticAbusePerpertratorType = new Element.Radiogroup<'family' | 'partner' | 'both'>(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type', ['family', 'partner', 'both'])
    familyPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type_family_member_details')
    partnerPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type_intimate_partner_details')
    bothPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type_family_member_and_intimate_partner_details')
    domesticAbuseVictim = new Element.Radiogroup<'yes' | 'no'>(this.page, '#offence_analysis_victim_of_domestic_abuse', ['yes', 'no'])
    domesticAbuseVictimType = new Element.Radiogroup<'family' | 'partner' | 'both'>(this.page, '#offence_analysis_victim_of_domestic_abuse_type', ['family', 'partner', 'both'])
    familyVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_type_family_member_details')
    partnerVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_type_intimate_partner_details')
    bothVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_type_family_member_and_intimate_partner_details')
    riskSeriousHarm = new Element.Radiogroup<'yes' | 'no'>(this.page, '#offence_analysis_risk', ['yes', 'no'])
    riskSeriousHarmYesDetails = new Element.Textbox(this.page, '#offence_analysis_risk_yes_details')
    riskSeriousHarmNoDetails = new Element.Textbox(this.page, '#offence_analysis_risk_no_details')
}