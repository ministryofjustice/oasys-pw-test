import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanNoSometimesYesOptions, sanNoSomeYesOptions, sanYesSomeNoOptions, sanYesSometimesNoOptions, sanYesUnsureNoOptions } from '../sanSection'

export class Page1 extends BaseSanEditPage {

    awareConsequences = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_consequences', sanYesSometimesNoOptions)
    stableBehaviour = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_stable_behaviour', sanYesSometimesNoOptions)
    activitiesLinkedOffending = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_offending_activities', sanNoSometimesYesOptions)
    influenced = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_peer_pressure', sanNoSometimesYesOptions)
    ableSolveProblems = new Element.Radiogroup<SanYesSomeNo>(this.page, '#thinking_behaviours_attitudes_problem_solving', sanYesSomeNoOptions)
    understandOthers = new Element.Radiogroup<SanYesSomeNo>(this.page, '#thinking_behaviours_attitudes_peoples_views', sanYesSomeNoOptions)
    manipulativeBehaviour = new Element.Radiogroup<SanYesSomeNo>(this.page, '#thinking_behaviours_attitudes_manipulative_predatory_behaviour', sanNoSomeYesOptions)
    manageTemper = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_temper_management', sanYesSometimesNoOptions)
    violence = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_violence_controlling_behaviour', sanNoSometimesYesOptions)
    impulse = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_impulsive_behaviour', sanNoSometimesYesOptions)
    hostileOrientation = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_hostile_orientation', sanNoSometimesYesOptions)
    acceptSupervision = new Element.Radiogroup<SanYesUnsureNo>(this.page, '#[sanMode]_thinking_behaviours_attitudes_supervision', sanYesUnsureNoOptions)
    supportCriminalBehaviour = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_criminal_behaviour', sanNoSometimesYesOptions)


    async populateMinimal() {

        await this.awareConsequences.setValue('yes')
        await this.stableBehaviour.setValue('yes')
        await this.activitiesLinkedOffending.setValue('no')
        await this.influenced.setValue('yes')
        await this.ableSolveProblems.setValue('yes')
        await this.understandOthers.setValue('yes')
        await this.manipulativeBehaviour.setValue('some')
        await this.manageTemper.setValue('yes')
        await this.violence.setValue('no')
        await this.impulse.setValue('no')
        await this.hostileOrientation.setValue('no')
        await this.acceptSupervision.setValue('yes')
        await this.supportCriminalBehaviour.setValue('no')
    }
}

