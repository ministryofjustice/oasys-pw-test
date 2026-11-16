import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page1 extends BaseSanEditPage {

    anyChildren = new Element.CheckboxGroup<AnyChildren>(this.page, '#[sanMode]_personal_relationships_community_children_details', ['yesLiveWith', 'yesLiveElsewhere', '-', 'no'])
    childrenLiveWithDetails = new Element.Textbox(this.page, '#[sanMode]_personal_relationships_community_children_details_yes_children_living_with_pop_details')
    childrenLiveElsewhereDetails = new Element.Textbox(this.page, '#[sanMode]_personal_relationships_community_children_details_yes_children_not_living_with_pop_details')


    async populateMinimal() {

        await this.anyChildren.setValue(['no'])
    }
}

