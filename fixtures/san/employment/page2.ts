import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page2 extends BaseSanEditPage {

    unavailableEverHadAJob = new Element.Radiogroup<SanYesNo>(this.page, '#ever_had_a_job_unavailable', sanYesNoOptions)
    unemployedEverHadAJob = new Element.Radiogroup<SanYesNo>(this.page, '#ever_had_a_job_unemployed', sanYesNoOptions)
}
