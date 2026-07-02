import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'

export class Employment1 extends BaseSanEditPage {

    name = 'Employment1'
    title = 'Employment and Education - Strengths and Needs'

    employmentStatus = new Element.Radiogroup<'employed' | 'selfEmployed' | 'retired' | 'unavailable' | 'unemployedLooking' | 'unemployedNotLooking'>(this.page, '#employment_status', ['employed', 'selfEmployed', 'retired', 'unavailable', 'unemployedLooking', 'unemployedNotLooking'])
    employmentType = new Element.Radiogroup<'fullTime' | 'partTime' | 'temporary' | 'apprenticeship'>(this.page, '#employment_type', ['fullTime', 'partTime', 'temporary', 'apprenticeship'])
    unavailableEmployedBefore = new Element.Radiogroup<'yes' | 'no'>(this.page, '#has_been_employed_unavailable_for_work', ['yes', 'no'])
    lookingEmployedBefore = new Element.Radiogroup<'yes' | 'no'>(this.page, '#has_been_employed_actively_seeking', ['yes', 'no'])
    notLookingEmployedBefore = new Element.Radiogroup<'yes' | 'no'>(this.page, '#has_been_employed_not_actively_seeking', ['yes', 'no'])
}
