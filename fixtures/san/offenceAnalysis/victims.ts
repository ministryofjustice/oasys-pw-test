import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Victims extends BaseSanEditPage {

    name = 'Victims'
    title = 'Offence analysis - Strengths and Needs'

    victimRelationship = new Element.Radiogroup<VictimRelationship>(this.page, '#offence_analysis_victim_relationship', ['stranger', 'staff', 'parent', 'partner', 'exPartner', 'child', 'otherFamily', 'friend', 'other'])
    victimRelationshipOtherDetails = new Element.Textbox(this.page, '#offence_analysis_victim_relationship_other_details')
    victimAge = new Element.Radiogroup<VictimAge>(this.page, '#offence_analysis_victim_age', ['0to4', '5to11', '12to15', '16to17', '18to20', '21to25', '26to49', '50to64', '65plus'])
    victimSex = new Element.Radiogroup<VictimSex>(this.page, '#offence_analysis_victim_sex', ['male', 'female', 'intersex', 'unknown'])
    victimRace = new Element.Select<VictimRace>(this.page, '#offence_analysis_victim_race')
    addAnotherVictim = new Element.Button(this.page, 'Add another victim')
}
