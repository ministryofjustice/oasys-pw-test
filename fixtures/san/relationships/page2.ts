import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { importantPeopleOptions } from '../sanIds'

export class Page2 extends BaseSanEditPage {

    name = 'RelationshipsPage2'
    title = 'Personal relationships and community - Strengths and Needs'

    importantPeople = new Element.CheckboxGroup<ImportantPeople>(this.page, '#personal_relationships_community_important_people', importantPeopleOptions)
    importantOtherDetails = new Element.Textbox(this.page, '#personal_relationships_community_important_people_other_details')

    
    async populateMinimal() {

        await this.importantPeople.setValue(['friends'])
    }
}
