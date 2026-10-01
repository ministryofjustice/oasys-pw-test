import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanPositiveMixedNegativeOptions, sanWantChangesOptions, sanYesNoOptions, sanYesNoSomeOptions, sanYesNoUnknownOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    psychTreatment = new Element.Radiogroup<PsychTreatment>(this.page, '#health_wellbeing_psychiatric_treatment', ['yes', 'pending', 'no', 'unknown'])
    learningDifficulties = new Element.Radiogroup<SanYesNoSome>(this.page, '#health_wellbeing_learning_difficulties', sanYesNoSomeOptions)
    coping = new Element.Radiogroup<SanYesNoSome>(this.page, '#health_wellbeing_coping_day_to_day_life', sanYesNoSomeOptions)
    gambling = new Element.CheckboxGroup<Gambling>(this.page, '#finance_gambling', ['own', 'someoneElse', '-', 'no', 'unknown'])
    attitude = new Element.Radiogroup<SanPositiveMixedNegative>(this.page, '#health_wellbeing_attitude_towards_self', sanPositiveMixedNegativeOptions)
    selfHarmed = new Element.Radiogroup<SanYesNo>(this.page, '#health_wellbeing_self_harmed', sanYesNoOptions)
    selfHarmedDetails = new Element.Textbox(this.page, '#health_wellbeing_self_harmed_yes_details')
    suicide = new Element.Radiogroup<SanYesNo>(this.page, '#health_wellbeing_attempted_suicide_or_suicidal_thoughts', sanYesNoOptions)
    suicideDetails = new Element.Textbox(this.page, '#health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details')
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#health_wellbeing_changes', sanWantChangesOptions)
    

    async populateMinimal() {

        await this.coping.setValue('yes')
        await this.gambling.setValue(['no'])
        await this.attitude.setValue('positive')
        await this.selfHarmed.setValue('no')
        await this.suicide.setValue('no')
        await this.wantChanges.setValue('madeChanges')
    }

}