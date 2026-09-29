import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page1 extends BaseSanEditPage {

    name = 'EmploymentPage1'
    title = 'Employment and education - Strengths and Needs'

    employmentStatus = new Element.Radiogroup<EmploymentStatus>(this.page, '#employment_status', ['employed', 'selfEmployed', 'retired', 'unavailable', 'unemployedLooking', 'unemployedNotLooking'])
    employmentType = new Element.Radiogroup<EmploymentType>(this.page, '#employment_type', ['fullTime', 'partTime', 'temporary', 'apprenticeship'])
    unavailableEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#has_been_employed_unavailable_for_work', sanYesNoOptions)
    lookingEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#has_been_employed_actively_seeking', sanYesNoOptions)
    notLookingEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#has_been_employed_not_actively_seeking', sanYesNoOptions)


    async populateMinimal() {

        await this.employmentStatus.setValue('selfEmployed')
    }
}
