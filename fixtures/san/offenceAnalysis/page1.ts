import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { motivationsOptions, offenceElementsOptions } from '../sanIds'

export class Page1 extends BaseSanEditPage {

    name = 'OffenceAnalysisPage1'
    title = 'Offence analysis - Strengths and Needs'

    offenceDescription = new Element.Textbox(this.page, '#offence_analysis_description_of_offence')
    offenceElements = new Element.CheckboxGroup<OffenceElements>(this.page, '#offence_analysis_elements', offenceElementsOptions)
    victimTargetedDetails = new Element.Textbox(this.page, '#offence_analysis_elements_victim_targeted_details')
    reason = new Element.Textbox(this.page, '#offence_analysis_reason')
    motivations = new Element.CheckboxGroup<Motivations>(this.page, '#offence_analysis_motivations', motivationsOptions)
    motivationOther = new Element.Textbox(this.page, '#offence_analysis_motivations_other_details')
    victimType = new Element.CheckboxGroup<VictimType>(this.page, '#offence_analysis_who_was_the_victim', ['people', 'other'])
    victimTypeDetails = new Element.Textbox(this.page, '#offence_analysis_who_was_the_victim_other_details')


    async populateMinimal() {

        await this.offenceDescription.setValue('Offence description')
        await this.offenceElements.setValue(['none'])
        await this.reason.setValue('Why it happened')
        await this.motivations.setValue(['other'])
        await this.motivationOther.setValue('Some reason')
        await this.victimType.setValue(['other'])
        await this.victimTypeDetails.setValue('Victim details')
    }
}
