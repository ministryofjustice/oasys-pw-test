import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'


export class Page7 extends BaseSanEditPage {

    domesticAbuseVictim = new Element.Radiogroup<SanYesNo>(this.page, '#offence_analysis_victim_of_domestic_abuse', sanYesNoOptions)


    async populateMinimal() {

        await this.domesticAbuseVictim.setValue('no')
    }
}
