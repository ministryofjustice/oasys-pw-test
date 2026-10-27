import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'

export class Page1 extends BaseSanEditPage {

    employmentStatus = new Element.Radiogroup<EmploymentStatus>(this.page, '#[sanMode]_employment_status', ['employed', 'retired', 'unavailable', 'unemployed'])


    async populateMinimal() {

        await this.employmentStatus.setValue('employed')
    }
}
