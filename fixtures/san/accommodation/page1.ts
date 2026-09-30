import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page1 extends BaseSanEditPage {

    name = 'AccommodationPage11'
    title = 'Accommodation - Strengths and Needs'

    currentAccommodation = new Element.Radiogroup<CurrentAccommodation>(this.page, '#current_accommodation', ['settled', 'temporary', 'noAccommodation'])
    // temporaryAccommodationType = new Element.Radiogroup<TemporaryAccommodation>(this.page, '#type_of_temporary_accommodation', ['approvedPremises', 'cas2', 'cas3', 'immigration', 'shortTerm'])  // TODO add back for custody

    async populateMinimal() {

        await this.currentAccommodation.setValue('settled')
    }

}

