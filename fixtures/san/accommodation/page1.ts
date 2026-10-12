import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page1 extends BaseSanEditPage {

    currentAccommodation = new Element.Radiogroup<CurrentAccommodation>(this.page, '#[sanMode]_current_accommodation', ['settled', 'temporary', 'noAccommodation'])
    temporaryAccommodationType = new Element.Radiogroup<TemporaryAccommodation>(this.page, '#custody_type_of_temporary_accommodation', ['approvedPremises', 'cas2', 'cas3', 'immigration', 'shortTerm'])

    async populateMinimal() {

        await this.currentAccommodation.setValue('settled')
    }

}

