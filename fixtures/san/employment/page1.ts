import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page1 extends BaseSanEditPage {

    employmentStatus = new Element.Radiogroup<EmploymentStatus>(this.page, '#[sanMode]_employment_status', ['employed', 'retired', 'unavailable', 'unemployed'])
    unavailableEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_has_been_employed_unavailable_for_work', sanYesNoOptions)
    unemployedEmployedBefore = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_has_been_employed_unemployed', sanYesNoOptions)


    async populateMinimal() {

        await this.employmentStatus.setValue('employed')
    }
}
