import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'


export class Accommodation1 extends BaseSanEditPage {

    name = 'Accommodation1'
    title = 'Accommodation - Strengths and Needs'

    currentAccommodation = new Element.Radiogroup<CurrentAccommodation>(this.page, '#current_accommodation', ['settled', 'temporary', 'noAccommodation'])
    noAccommodationType = new Element.Radiogroup<'awaitingAssessment' | 'campsite' | 'hostel' | 'homeless' | 'roughSleeping' | 'shelter'>(this.page, '#type_of_no_accommodation', ['awaitingAssessment', 'campsite', 'hostel', 'homeless', 'roughSleeping', 'shelter'])
    settledAccommodationType = new Element.Radiogroup<'homeowner' | 'friends' | 'privateRenting' | 'socialRent' | 'healthcare' | 'supported'>(this.page, '#type_of_settled_accommodation', ['homeowner', 'friends', 'privateRenting', 'socialRent', 'healthcare', 'supported'])
    temporaryAccommodationType = new Element.Radiogroup<TemporaryAccommodation>(this.page, '#type_of_temporary_accommodation', ['approvedPremises', 'cas2', 'cas3', 'immigration', 'shortTerm'])
}
