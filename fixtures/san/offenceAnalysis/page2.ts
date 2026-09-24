import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { howManyOthersOptions } from '../sanIds'

export class Page2 extends BaseSanEditPage {

    name = 'OffenceAnalysisPage2'
    title = 'Offence analysis - Strengths and Needs'

    howManyOthers = new Element.Radiogroup<HowManyOthers>(this.page, '#offence_analysis_how_many_involved', howManyOthersOptions)


    async populateMinimal() {

        await this.howManyOthers.setValue('0')
    }
}
