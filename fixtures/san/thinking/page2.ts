import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanIds'

export class Page2 extends BaseSanEditPage {

    name = 'ThinkingPage2'
    title = 'Thinking, behaviours and attitudes - Strengths and Needs'

    riskOfSexualHarm = new Element.Radiogroup<SanYesNo>(this.page, '#thinking_behaviours_attitudes_risk_sexual_harm', sanYesNoOptions)


    async populateMinimal() {

        await this.riskOfSexualHarm.setValue('no')
    }
}

