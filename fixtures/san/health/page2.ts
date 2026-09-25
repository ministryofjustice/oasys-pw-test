import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { psychTreatmentOptions, sanPositiveMixedNegativeOptions, sanWantChangesOptions, sanYesNoOptions, sanYesNoSomeOptions, sanYesNoUnknownOptions } from '../sanIds'

export class Page2 extends BaseSanEditPage {

    name = 'HealthPage2'
    title = 'Health and wellbeing - Strengths and Needs'


    psychTreatment = new Element.Radiogroup<PsychTreatment>(this.page, '#health_wellbeing_psychiatric_treatment', psychTreatmentOptions)
    headInjury = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#health_wellbeing_head_injury_or_illness', sanYesNoUnknownOptions)
    neurodiverse = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#health_wellbeing_neurodiverse_conditions', sanYesNoUnknownOptions)
    learningDifficulties = new Element.Radiogroup<SanYesNoSome>(this.page, '#health_wellbeing_learning_difficulties', sanYesNoSomeOptions)
    coping = new Element.Radiogroup<SanYesNoSome>(this.page, '#health_wellbeing_coping_day_to_day_life', sanYesNoSomeOptions)
    attitude = new Element.Radiogroup<SanPositiveMixedNegative>(this.page, '#health_wellbeing_attitude_towards_self', sanPositiveMixedNegativeOptions)
    selfHarmed = new Element.Radiogroup<SanYesNo>(this.page, '#health_wellbeing_self_harmed', sanYesNoOptions)
    selfHarmedDetails = new Element.Textbox(this.page, '#health_wellbeing_self_harmed_yes_details')
    suicide = new Element.Radiogroup<SanYesNo>(this.page, '#health_wellbeing_attempted_suicide_or_suicidal_thoughts', sanYesNoOptions)
    suicideDetails = new Element.Textbox(this.page, '#health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details')
    optimistic = new Element.Radiogroup<'optimistic' | 'notSure' | 'notOptimistic' | 'notAnswering' | 'notPresent'>(this.page, '#health_wellbeing_outlook', ['optimistic', 'notSure', 'notOptimistic', '-', 'notAnswering', 'notPresent'])
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#health_wellbeing_changes', sanWantChangesOptions)


    async populateMinimal() {

        await this.headInjury.setValue('no')
        await this.neurodiverse.setValue('no')
        await this.coping.setValue('yes')
        await this.attitude.setValue('positive')
        await this.selfHarmed.setValue('no')
        await this.suicide.setValue('no')
        await this.optimistic.setValue('optimistic')
        await this.wantChanges.setValue('madeChanges')
    }

}