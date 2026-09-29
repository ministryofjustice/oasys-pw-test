import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page2 extends BaseSanEditPage {

    riskOfSexualHarm = new Element.Radiogroup<SanYesNo>(this.page, '#thinking_behaviours_attitudes_risk_sexual_harm', sanYesNoOptions)


    async populateMinimal() {

        await this.riskOfSexualHarm.setValue('no')
    }
}

