import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { victimAgeOptions, victimRelationshipOptions, victimSexOptions } from '../sanIds'

export class Victims extends BaseSanEditPage {

    name = 'Victims'
    title = 'Offence analysis - Strengths and Needs'

    victimRelationship = new Element.Radiogroup<VictimRelationship>(this.page, '#offence_analysis_victim_relationship', victimRelationshipOptions)
    victimRelationshipOtherDetails = new Element.Textbox(this.page, '#offence_analysis_victim_relationship_other_details')
    victimAge = new Element.Radiogroup<VictimAge>(this.page, '#offence_analysis_victim_age', victimAgeOptions)
    victimSex = new Element.Radiogroup<VictimSex>(this.page, '#offence_analysis_victim_sex', victimSexOptions)
    victimRace = new Element.Select<VictimRace>(this.page, '#offence_analysis_victim_race')
    addAnotherVictim = new Element.Button(this.page, 'Add another victim')
}

