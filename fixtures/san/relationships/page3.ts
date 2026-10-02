import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanPositiveMixedNegativeUnknownOptions, sanWantChangesOptions, sanYesNoOptions } from '../sanSection'

const familyPartnerBothOptions: FamilyPartnerBoth[] = ['family', 'partner', 'both']

export class Page3 extends BaseSanEditPage {

    currentFamilyRelationship = new Element.Radiogroup<CurrentFamilyRelationship>(this.page, '#personal_relationships_community_family_relationship', ['stable', 'mixed', 'unstable', 'unknown'])
    childhoodExperience = new Element.Radiogroup<SanPositiveMixedNegativeUnknown>(this.page, '#personal_relationships_community_childhood', sanPositiveMixedNegativeUnknownOptions)
    behaviouralProblems = new Element.Radiogroup<SanYesNo>(this.page, '#personal_relationships_community_childhood_behaviour', sanYesNoOptions)
    communities = new Element.Radiogroup<SanYesNo>(this.page, '#personal_relationships_community_belonging', sanYesNoOptions)
    inARelationship = new Element.Radiogroup<InARelationship>(this.page, '#personal_relationships_community_relationship_status', ['livingTogether', 'notLivingTogether', 'no'])
    happyWithStatus = new Element.Radiogroup<HappyWithStatus>(this.page, '#personal_relationships_community_current_relationship', ['happy', 'someConcerns', 'unhappy'])
    history = new Element.Radiogroup<RelationshipHistory>(this.page, '#personal_relationships_community_intimate_relationship', ['stable', 'mixed', 'unstable'])

    domesticAbusePerpetrator = new Element.Radiogroup<SanYesNo>(this.page, '#offence_analysis_perpetrator_of_domestic_abuse', sanYesNoOptions)
    domesticAbusePerpetratorType = new Element.Radiogroup<FamilyPartnerBoth>(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type', familyPartnerBothOptions)
    familyPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type_family_member_details')
    partnerPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type_intimate_partner_details')
    bothPerpetratorDetails = new Element.Textbox(this.page, '#offence_analysis_perpetrator_of_domestic_abuse_type_family_member_and_intimate_partner_details')
    controlling = new Element.Radiogroup<SanYesNo>(this.page, '#controlling_coercive_behaviour', sanYesNoOptions)
    strangulation = new Element.Radiogroup<SanYesNo>(this.page, '#evidence_of_strangulation', sanYesNoOptions)

    domesticAbuseVictim = new Element.Radiogroup<SanYesNo>(this.page, '#offence_analysis_victim_of_domestic_abuse', sanYesNoOptions)
    domesticAbuseVictimType = new Element.Radiogroup<FamilyPartnerBoth>(this.page, '#offence_analysis_victim_of_domestic_abuse_type', familyPartnerBothOptions)
    familyVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_type_family_member_details')
    partnerVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_type_intimate_partner_details')
    bothVictimDetails = new Element.Textbox(this.page, '#offence_analysis_victim_of_domestic_abuse_type_family_member_and_intimate_partner_details')

    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#personal_relationships_community_changes', sanWantChangesOptions)



    async populateMinimal() {

        await this.happyWithStatus.setValue('happy')
        await this.history.setValue('mixed')
        await this.currentFamilyRelationship.setValue('stable')
        await this.childhoodExperience.setValue('positive')
        await this.behaviouralProblems.setValue('no')
        await this.domesticAbusePerpetrator.setValue('no')
        await this.domesticAbuseVictim.setValue('no')
        await this.wantChanges.setValue('wantToChange')
    }
}
