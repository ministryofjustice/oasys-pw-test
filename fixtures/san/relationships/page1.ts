import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { anyChildrenOptions } from '../sanIds'

export class Page1 extends BaseSanEditPage {

    name = 'RelationshipsPage1'
    title = 'Personal relationships and community - Strengths and Needs'

    anyChildren = new Element.CheckboxGroup<AnyChildren>(this.page, '#personal_relationships_community_children_details', anyChildrenOptions)

    
    async populateMinimal() {

        await this.anyChildren.setValue(['no'])
    }
}

