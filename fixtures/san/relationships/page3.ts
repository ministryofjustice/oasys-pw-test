import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanPositiveMixedNegativeUnknownOptions, sanYesNoOptions, sanYesSometimesNoUnknownOptions } from '../sanSection'


export class Page3 extends BaseSanEditPage {

    manageParenting = new Element.Radiogroup<SanYesSometimesNoUnknown>(this.page, '#[sanMode]_personal_relationships_community_manage_parental_responsibilities', sanYesSometimesNoUnknownOptions)

    currentFamilyRelationship = new Element.Radiogroup<CurrentFamilyRelationship>(this.page, '#personal_relationships_community_family_relationship', ['stable', 'mixed', 'unstable', 'unknown'])
    childhoodExperience = new Element.Radiogroup<SanPositiveMixedNegativeUnknown>(this.page, '#personal_relationships_community_childhood', sanPositiveMixedNegativeUnknownOptions)
    behaviouralProblems = new Element.Radiogroup<SanYesNo>(this.page, '#personal_relationships_community_childhood_behaviour', sanYesNoOptions)
    partOfGroups = new Element.Textbox(this.page, '#[sanMode]_personal_relationships_community_belonging')
    inARelationship = new Element.Radiogroup<InARelationship>(this.page, '#personal_relationships_community_relationship_status', ['livingTogether', 'notLivingTogether', 'no'])
    happyWithStatus = new Element.Radiogroup<HappyWithStatus>(this.page, '#personal_relationships_community_current_relationship', ['happy', 'someConcerns', 'unhappy'])
    history = new Element.Radiogroup<RelationshipHistory>(this.page, '#personal_relationships_community_intimate_relationship', ['stable', 'mixed', 'unstable'])


    async populateMinimal() {

        await this.currentFamilyRelationship.setValue('stable')
        await this.childhoodExperience.setValue('positive')
        await this.behaviouralProblems.setValue('no')
        await this.partOfGroups.setValue('Some groups')
        await this.inARelationship.setValue('no')
        await this.happyWithStatus.setValue('happy')
        await this.history.setValue('mixed')
    }
}
