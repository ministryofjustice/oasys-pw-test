import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'


export class Page4 extends BaseSanEditPage {

    domesticAbusePerpetrator = new Element.Radiogroup<SanYesNo>(this.page, '#offence_analysis_perpetrator_of_domestic_abuse', sanYesNoOptions)


    async populateMinimal() {

        await this.domesticAbusePerpetrator.setValue('no')
    }
}
