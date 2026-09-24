import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanPositiveMixedNegativeOptions, sanWantChangesOptions, sanYesNoOptions, sanYesSometimesNoUnknownOptions } from '../sanIds'

export class Page3 extends BaseSanEditPage {

    name = 'RelationshipsPage3'
    title = 'Personal relationships and community - Strengths and Needs'


    happyWithStatus = new Element.Radiogroup<HappyWithStatus>(this.page, '#personal_relationships_community_current_relationship', ['happy', 'someConcerns', 'unhappy'])
    history = new Element.Radiogroup<RelationshipHistory>(this.page, '#personal_relationships_community_intimate_relationship', ['stable', 'mixed', 'unstable'])
    resolveChallenges = new Element.Textbox(this.page, '#personal_relationships_community_challenges_intimate_relationship')
    manageParenting = new Element.Radiogroup<SanYesSometimesNoUnknown>(this.page, '#personal_relationships_community_parental_responsibilities', sanYesSometimesNoUnknownOptions)
    currentFamilyRelationship = new Element.Radiogroup<CurrentFamilyRelationship>(this.page, '#personal_relationships_community_family_relationship', ['stable', 'mixed', 'unstable', 'unknown'])
    childhoodExperience = new Element.Radiogroup<SanPositiveMixedNegative>(this.page, '#personal_relationships_community_childhood', sanPositiveMixedNegativeOptions)
    behaviouralProblems = new Element.Radiogroup<SanYesNo>(this.page, '#personal_relationships_community_childhood_behaviour', sanYesNoOptions)
    wantChangesRelationships = new Element.Radiogroup<SanWantChanges>(this.page, '#personal_relationships_community_changes', sanWantChangesOptions)


    async populateMinimal() {

        await this.happyWithStatus.setValue('happy')
        await this.history.setValue('mixed')
        await this.resolveChallenges.setValue('Challenges text')
        await this.currentFamilyRelationship.setValue('stable')
        await this.childhoodExperience.setValue('positive')
        await this.behaviouralProblems.setValue('no')
        await this.wantChangesRelationships.setValue('wantToChange')
    }
}
