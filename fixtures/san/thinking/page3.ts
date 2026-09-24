import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesSometimesNoUnknownOptions } from '../sanIds'

export class Page3 extends BaseSanEditPage {

    name = 'ThinkingPage3'
    title = 'Thinking, behaviours and attitudes - Strengths and Needs'

    sexualPreoccupation = new Element.Radiogroup<SanYesSometimesNoUnknown>(this.page, '#thinking_behaviours_attitudes_sexual_preoccupation', sanYesSometimesNoUnknownOptions)
    sexualInterests = new Element.Radiogroup<SanYesSometimesNoUnknown>(this.page, '#thinking_behaviours_attitudes_offence_related_sexual_interest', sanYesSometimesNoUnknownOptions)
    emotionalIntimacy = new Element.Radiogroup<SanYesSometimesNoUnknown>(this.page, '#thinking_behaviours_attitudes_emotional_intimacy', sanYesSometimesNoUnknownOptions)
}

