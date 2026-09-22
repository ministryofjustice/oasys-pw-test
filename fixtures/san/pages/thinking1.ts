import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { sanNoSometimesYesOptions, sanWantChangesOptions, sanYesHasBeenNoOptions, sanYesLimitedNoOptions, sanYesNoSomeOptions, sanYesPartlyNoOptions, sanYesSometimesNoOptions, sanYesUnsureNoOptions } from '../sanIds'

export class Thinking1 extends BaseSanEditPage {

    name = 'Thinking1'
    title = 'Thinking, behaviours and attitudes - Strengths and Needs'

    awareConsequences = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_consequences', sanYesSometimesNoOptions)
    stableBehaviour = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_stable_behaviour', sanYesSometimesNoOptions)
    activitiesLinkedOffending = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_offending_activities', sanNoSometimesYesOptions)
    resilient = new Element.Radiogroup<SanYesHasBeenNo>(this.page, '#thinking_behaviours_attitudes_peer_pressure', sanYesHasBeenNoOptions)
    ableSolveProblems = new Element.Radiogroup<SanYesLimitedNo>(this.page, '#thinking_behaviours_attitudes_problem_solving', sanYesLimitedNoOptions)
    understandOthers = new Element.Radiogroup<SanYesNoSome>(this.page, '#thinking_behaviours_attitudes_peoples_views', sanYesNoSomeOptions)
    manipulativeBehaviour = new Element.Radiogroup<SanYesNoSome>(this.page, '#thinking_behaviours_attitudes_manipulative_predatory_behaviour', ['no', 'some', 'yes'])
    manageTemper = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_temper_management', sanYesSometimesNoOptions)
    violence = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_violence_controlling_behaviour', sanNoSometimesYesOptions)
    impulse = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_impulsive_behaviour', sanNoSometimesYesOptions)
    positiveAttitude = new Element.Radiogroup<SanYesPartlyNo>(this.page, '#thinking_behaviours_attitudes_positive_attitude', sanYesPartlyNoOptions)
    hostileOrientation = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_hostile_orientation', sanNoSometimesYesOptions)
    acceptSupervision = new Element.Radiogroup<SanYesUnsureNo>(this.page, '#thinking_behaviours_attitudes_supervision', sanYesUnsureNoOptions)
    supportCriminalBehaviour = new Element.Radiogroup<SanYesSometimesNo>(this.page, '#thinking_behaviours_attitudes_criminal_behaviour', sanNoSometimesYesOptions)
    wantChangesThinking = new Element.Radiogroup<SanWantChanges>(this.page, '#thinking_behaviours_attitudes_changes', sanWantChangesOptions)
}

