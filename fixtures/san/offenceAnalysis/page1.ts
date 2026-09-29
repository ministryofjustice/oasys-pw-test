import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page1 extends BaseSanEditPage {

    offenceDescription = new Element.Textbox(this.page, '#offence_analysis_description_of_offence')
    offenceElements = new Element.CheckboxGroup<OffenceElements>(this.page, '#offence_analysis_elements', ['arson', 'domesticAbuse', 'excessiveViolence', 'hatred', 'physicalDamage', 'sexualElement', 'victimTargeted', 'violence', 'weapon', '-', 'none'])
    victimTargetedDetails = new Element.Textbox(this.page, '#offence_analysis_elements_victim_targeted_details')
    reason = new Element.Textbox(this.page, '#offence_analysis_reason')
    motivations = new Element.CheckboxGroup<Motivations>(this.page, '#offence_analysis_motivations',  ['addictions', 'pressure', 'emotional', 'financial', 'hatred', 'power', 'sexual', 'thrill', 'other'])
    motivationOther = new Element.Textbox(this.page, '#offence_analysis_motivations_other_details')
    victimType = new Element.CheckboxGroup<VictimType>(this.page, '#offence_analysis_who_was_the_victim', ['people', 'other'])
    victimTypeDetails = new Element.Textbox(this.page, '#offence_analysis_who_was_the_victim_other_details')


    async populateMinimal(params?: SanPopulationParams) {

        await this.offenceDescription.setValue(params?.offenceDescription ?? 'Offence description')
        await this.offenceElements.setValue(['none'])
        await this.reason.setValue('Why it happened')
        await this.motivations.setValue(['other'])
        await this.motivationOther.setValue('Some reason')
        await this.victimType.setValue(['other'])
        await this.victimTypeDetails.setValue('Victim details')
    }
}
