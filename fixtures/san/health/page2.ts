import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanPositiveMixedNegativeOptions, sanYesNoUnknownOptions, sanYesNoOptions, sanYesSomeNoOptions, sanSignificantSomeNoUnknownOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    describeMentalHealthCondition = new Element.Radiogroup<MentalHealthCondition>(this.page, '#health_wellbeing_mental_health_condition_description', ['diagnosedEvidenceOfImpact', 'diagnosedNoEvidence', 'past', 'undiagnosed'])
    psychTreatment = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#health_wellbeing_psychiatric_treatment', sanYesNoUnknownOptions)
    learningDifficulties = new Element.Radiogroup<SanSignificantSomeNoUnknown>(this.page, '#health_wellbeing_learning_difficulties',sanSignificantSomeNoUnknownOptions )
    coping = new Element.Radiogroup<SanYesSomeNo>(this.page, '#health_wellbeing_coping_day_to_day_life', sanYesSomeNoOptions)
    gambling = new Element.CheckboxGroup<Gambling>(this.page, '#health_wellbeing_gambling', ['own', 'someoneElse', '-', 'no', 'unknown'])
    attitude = new Element.Radiogroup<SanPositiveMixedNegative>(this.page, '#health_wellbeing_attitude_towards_self', sanPositiveMixedNegativeOptions)
    selfHarmed = new Element.Radiogroup<SanYesNo>(this.page, '#health_wellbeing_self_harmed', sanYesNoOptions)
    selfHarmedDetails = new Element.Textbox(this.page, '#health_wellbeing_self_harmed_yes_details')
    suicide = new Element.Radiogroup<SanYesNo>(this.page, '#health_wellbeing_attempted_suicide_or_suicidal_thoughts', sanYesNoOptions)
    suicideDetails = new Element.Textbox(this.page, '#health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details')


    async populateMinimal() {

        await this.coping.setValue('yes')
        await this.gambling.setValue(['no'])
        await this.attitude.setValue('positive')
        await this.selfHarmed.setValue('no')
        await this.suicide.setValue('no')
    }

}