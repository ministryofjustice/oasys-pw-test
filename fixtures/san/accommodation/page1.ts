import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page1 extends BaseSanEditPage {

    name = 'AccommodationPage11'
    title = 'Accommodation - Strengths and Needs'

    currentAccommodation = new Element.Radiogroup<CurrentAccommodation>(this.page, '#current_accommodation', ['settled', 'temporary', 'noAccommodation'])
    noAccommodationType = new Element.Radiogroup<'awaitingAssessment' | 'campsite' | 'hostel' | 'homeless' | 'roughSleeping' | 'shelter'>(this.page, '#type_of_no_accommodation', ['awaitingAssessment', 'campsite', 'hostel', 'homeless', 'roughSleeping', 'shelter'])
    settledAccommodationType = new Element.Radiogroup<'homeowner' | 'friends' | 'privateRenting' | 'socialRent' | 'healthcare' | 'supported'>(this.page, '#type_of_settled_accommodation', ['homeowner', 'friends', 'privateRenting', 'socialRent', 'healthcare', 'supported'])
    temporaryAccommodationType = new Element.Radiogroup<TemporaryAccommodation>(this.page, '#type_of_temporary_accommodation', ['approvedPremises', 'cas2', 'cas3', 'immigration', 'shortTerm'])


    async populateMinimal() {

        await this.currentAccommodation.setValue('settled')
        await this.settledAccommodationType.setValue('friends')
    }

}

