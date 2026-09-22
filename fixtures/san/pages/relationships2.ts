import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { importantPeopleOptions } from '../sanIds'

export class Relationships2 extends BaseSanEditPage {

    name = 'Relationships2'
    title = 'Personal relationships and community - Strengths and Needs'

    importantPeople = new Element.CheckboxGroup<ImportantPeople>(this.page, '#personal_relationships_community_important_people', importantPeopleOptions)
    importantOtherDetails = new Element.Textbox(this.page, '#personal_relationships_community_important_people_other_details')
}
