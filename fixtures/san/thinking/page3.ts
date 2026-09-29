import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesSometimesNoUnknownOptions } from '../sanSection'


export class Page3 extends BaseSanEditPage {

    sexualPreoccupation = new Element.Radiogroup<SanYesSometimesNoUnknown>(this.page, '#thinking_behaviours_attitudes_sexual_preoccupation', sanYesSometimesNoUnknownOptions)
    sexualInterests = new Element.Radiogroup<SanYesSometimesNoUnknown>(this.page, '#thinking_behaviours_attitudes_offence_related_sexual_interest', sanYesSometimesNoUnknownOptions)
    emotionalIntimacy = new Element.Radiogroup<SanYesSometimesNoUnknown>(this.page, '#thinking_behaviours_attitudes_emotional_intimacy', sanYesSometimesNoUnknownOptions)

    async populateMinimal() {

        await this.sexualInterests.setValue('no')
        await this.emotionalIntimacy.setValue('no')
        await this.sexualPreoccupation.setValue('no')
    }
}

