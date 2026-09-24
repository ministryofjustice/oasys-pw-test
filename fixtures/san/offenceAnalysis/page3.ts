import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { familyPartnerBothOptions, sanYesNoNaOptions, sanYesNoOptions } from '../sanIds'

export class Page3 extends BaseSanEditPage {

    name = 'OffenceAnalysisPage3'
    title = 'Offence analysis - Strengths and Needs'

    leader = new Element.Radiogroup<SanYesNo>(this.page, '#offence_analysis_leader', sanYesNoOptions)
    leaderYesDetails = new Element.Textbox(this.page, '#offence_analysis_leader_yes_details')
    leaderNoDetails = new Element.Textbox(this.page, '#offence_analysis_leader_no_details')
    impact = new Element.Radiogroup<SanYesNo>(this.page, '#offence_analysis_impact_on_victims', sanYesNoOptions)
    responsibility = new Element.Radiogroup<SanYesNo>(this.page, '#offence_analysis_accept_responsibility', sanYesNoOptions)
    responsibilityYesDetails = new Element.Textbox(this.page, '#offence_analysis_accept_responsibility_yes_details')
    responsibilityNoDetails = new Element.Textbox(this.page, '#offence_analysis_accept_responsibility_no_details')
    patterns = new Element.Textbox(this.page, '#offence_analysis_patterns_of_offending')
    escalation = new Element.Radiogroup<SanYesNoNa>(this.page, '#offence_analysis_escalation', sanYesNoNaOptions)
    domesticAbusePerpetrator = new Element.Radiogroup<SanYesNo>(this.page, '#offence_analysis_perpetrator_of_domestic_abuse', sanYesNoOptions)
    domesticAbusePerpetratorType = new Element.Radiogroup<FamilyPartnerBoth>(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type', familyPartnerBothOptions)
    familyPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type_family_member_details')
    partnerPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type_intimate_partner_details')
    bothPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type_family_member_and_intimate_partner_details')
    domesticAbuseVictim = new Element.Radiogroup<SanYesNo>(this.page, '#offence_analysis_victim_of_domestic_abuse', sanYesNoOptions)
    domesticAbuseVictimType = new Element.Radiogroup<FamilyPartnerBoth>(this.page, '#offence_analysis_victim_of_domestic_abuse_type', familyPartnerBothOptions)
    familyVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_type_family_member_details')
    partnerVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_type_intimate_partner_details')
    bothVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_type_family_member_and_intimate_partner_details')
    riskSeriousHarm = new Element.Radiogroup<SanYesNo>(this.page, '#offence_analysis_risk', sanYesNoOptions)
    riskSeriousHarmYesDetails = new Element.Textbox(this.page, '#offence_analysis_risk_yes_details')
    riskSeriousHarmNoDetails = new Element.Textbox(this.page, '#offence_analysis_risk_no_details')


    async populateMinimal() {

        await this.impact.setValue('yes')
        await this.responsibility.setValue('yes')
        await this.escalation.setValue('no')
        await this.domesticAbusePerpetrator.setValue('no')
        await this.domesticAbuseVictim.setValue('no')
        await this.patterns.setValue('Patterns')
        await this.riskSeriousHarm.setValue('no')
        await this.riskSeriousHarmNoDetails.setValue('No risk')
    }
}