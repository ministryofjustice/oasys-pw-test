import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { anyChildrenOptions } from '../sanIds'

export class Relationships1 extends BaseSanEditPage {

    name = 'Relationships1'
    title = 'Personal relationships and community - Strengths and Needs'

    anyChildren = new Element.CheckboxGroup<AnyChildren>(this.page, '#personal_relationships_community_children_details', anyChildrenOptions)
}

