import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page1 extends BaseSanEditPage {

    name = 'RelationshipsPage1'
    title = 'Personal relationships and community - Strengths and Needs'

    anyChildren = new Element.CheckboxGroup<AnyChildren>(this.page, '#personal_relationships_community_children_details', ['yesLiveWith', 'yesLiveElsewhere', 'yesVisitRegularly', '-', 'no'])


    async populateMinimal() {

        await this.anyChildren.setValue(['no'])
    }
}

