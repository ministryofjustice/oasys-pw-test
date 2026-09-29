import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page2 extends BaseSanEditPage {

    importantPeople = new Element.CheckboxGroup<ImportantPeople>(this.page, '#personal_relationships_community_important_people', ['partner', 'ownChildren', 'otherChildren', 'family', 'friends', 'other'])
    importantOtherDetails = new Element.Textbox(this.page, '#personal_relationships_community_important_people_other_details')


    async populateMinimal() {

        await this.importantPeople.setValue(['friends'])
    }
}
