import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { sanYesNoOptions } from '../sanIds'

export class Thinking2 extends BaseSanEditPage {

    name = 'Thinking2'
    title = 'Thinking, behaviours and attitudes - Strengths and Needs'

    riskOfSexualHarm = new Element.Radiogroup<SanYesNo>(this.page, '#thinking_behaviours_attitudes_risk_sexual_harm', sanYesNoOptions)
}

