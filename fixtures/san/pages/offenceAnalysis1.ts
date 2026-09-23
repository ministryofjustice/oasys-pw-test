import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { motivationsOptions, offenceElementsOptions } from '../sanIds'

export class OffenceAnalysis1 extends BaseSanEditPage {

    name = 'OffenceAnalysis1'
    title = 'Offence analysis - Strengths and Needs'

    offenceDescription = new Element.Textbox(this.page, '#offence_analysis_description_of_offence')
    offenceElements = new Element.CheckboxGroup<OffenceElements>(this.page, '#offence_analysis_elements', offenceElementsOptions)
    victimTargetedDetails = new Element.Textbox(this.page, '#offence_analysis_elements_victim_targeted_details')
    reason = new Element.Textbox(this.page, '#offence_analysis_reason')
    motivations = new Element.CheckboxGroup<Motivations>(this.page, '#offence_analysis_motivations', motivationsOptions)
    motivationOther = new Element.Textbox(this.page, '#offence_analysis_motivations_other_details')
    victimType = new Element.CheckboxGroup<VictimType>(this.page, '#offence_analysis_who_was_the_victim', ['people', 'other'])
    victimTypeDetails = new Element.Textbox(this.page, '#offence_analysis_who_was_the_victim_other_details')
}
