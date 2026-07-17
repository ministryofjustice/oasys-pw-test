import { OasysPage, Element } from 'classes'

export class AreaOfNeed extends OasysPage {

    areaOfNeed = new Element.Radiogroup<SanSection>(this.page, '#area_of_need', [
        'Accommodation', 'Employment and education', 'Finances', 'Drug use', 'Alcohol use', 'Health and wellbeing', 'Personal relationships and community', 'Thinking, behaviours and attitudes', 'Offence analysis'
    ])
    continue = new Element.Button(this.page, 'Continue')
}