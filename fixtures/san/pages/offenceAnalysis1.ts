import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'

export class OffenceAnalysis1 extends BaseSanEditPage {

    name = 'OffenceAnalysis1'
    title = 'Offence analysis - Strengths and Needs'
    offenceDescription = new Element.Textbox(this.page, '#offence_analysis_description_of_offence')
    offenceElements = new Element.CheckboxGroup<'arson' | 'domesticAbuse' | 'excessiveViolence' | 'hatred' | 'physicalDamage' | 'sexualElement' | 'victimTargeted' | 'violence' | 'weapon' | 'none'>(this.page, '#offence_analysis_elements', ['arson', 'domesticAbuse', 'excessiveViolence', 'hatred', 'physicalDamage', 'sexualElement', 'victimTargeted', 'violence', 'weapon', '-', 'none'])
    reason = new Element.Textbox(this.page, '#offence_analysis_reason')
    motivations = new Element.CheckboxGroup<'addictions' | 'pressure' | 'emotional' | 'financial' | 'hatred' | 'power' | 'sexual' | 'thrill' | 'other'>(this.page, '#offence_analysis_motivations', ['addictions', 'pressure', 'emotional', 'financial', 'hatred', 'power', 'sexual', 'thrill', 'other'])
    motivationOther = new Element.Textbox(this.page, '#offence_analysis_motivations_other_details')
    victimTargetedDetails = new Element.Textbox(this.page, '#offence_analysis_elements_victim_targeted_details')
    victimType = new Element.CheckboxGroup<'people' | 'other'>(this.page, '#offence_analysis_who_was_the_victim', ['people', 'other'])
    victimTypeDetails = new Element.Textbox(this.page, '#offence_analysis_who_was_the_victim_other_details')
}
