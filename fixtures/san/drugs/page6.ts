import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page6 extends BaseSanEditPage {
    
    treatment = new Element.Radiogroup<SanYesNo>(this.page, '#drugs_is_receiving_treatment', sanYesNoOptions)
    treatmentYesDetails = new Element.Textbox(this.page, '#drugs_is_receiving_treatment_yes_details')
    pastTreatment = new Element.Radiogroup<SanYesNo>(this.page, '#drugs_past_treatment', sanYesNoOptions)
    pastTreatmentYesDetails = new Element.Textbox(this.page, '#drugs_past_treatment_yes_details')
    motivatedToStop = new Element.Radiogroup<DrugsMotivation>(this.page, '#drugs_practitioner_analysis_motivated_to_stop', ['noMotivation', 'someMotivation', 'motivated', 'unknown'])
}
