import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { employmentStatusOptions, employmentTypeOptions, sanYesNoOptions } from '../sanIds'

export class Employment1 extends BaseSanEditPage {

    name = 'Employment1'
    title = 'Employment and education - Strengths and Needs'

    employmentStatus = new Element.Radiogroup<EmploymentStatus>(this.page, '#employment_status', employmentStatusOptions)
    employmentType = new Element.Radiogroup<EmploymentType>(this.page, '#employment_type', employmentTypeOptions)
    unavailableEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#has_been_employed_unavailable_for_work', sanYesNoOptions)
    lookingEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#has_been_employed_actively_seeking', sanYesNoOptions)
    notLookingEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#has_been_employed_not_actively_seeking',  sanYesNoOptions)
}
