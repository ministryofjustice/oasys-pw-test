import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page1 extends BaseSanEditPage {

    employmentStatus = new Element.Radiogroup<EmploymentStatus>(this.page, '#employment_status', ['employed', 'selfEmployed', 'retired', 'unavailable', 'unemployedLooking', 'unemployedNotLooking'])
    employmentType = new Element.Radiogroup<EmploymentType>(this.page, '#employment_type', ['fullTime', 'partTime', 'temporary', 'apprenticeship'])
    unavailableEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#has_been_employed_currently_unavailable_for_work', sanYesNoOptions)
    lookingEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#has_been_employed_unemployed_looking_for_work', sanYesNoOptions)
    notLookingEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#has_been_employed_unemployed_not_looking_for_work', sanYesNoOptions)


    async populateMinimal() {

        await this.employmentStatus.setValue('selfEmployed')
    }
}
