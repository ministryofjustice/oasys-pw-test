import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page1 extends BaseSanEditPage {

    anyChildren = new Element.CheckboxGroup<AnyChildren>(this.page, '#personal_relationships_community_children_details', ['yesLiveWith', 'yesLiveElsewhere', '-', 'no'])
    childrenLiveWithDetails = new Element.Textbox(this.page, '#personal_relationships_community_children_details_yes_children_living')
    childrenLiveElsewhereDetails = new Element.Textbox(this.page, '#personal_relationships_community_children_details_yes_children_not_living')
    noChildrenDetails = new Element.Textbox(this.page, '#personal_relationships_community_children_details_no_children')


    async populateMinimal() {

        await this.anyChildren.setValue(['no'])
    }
}

