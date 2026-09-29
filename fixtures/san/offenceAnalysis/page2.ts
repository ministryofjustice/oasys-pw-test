import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page2 extends BaseSanEditPage {

    name = 'OffenceAnalysisPage2'
    title = 'Offence analysis - Strengths and Needs'

    howManyOthers = new Element.Radiogroup<HowManyOthers>(this.page, '#offence_analysis_how_many_involved', ['0', '1', '2', '3', '4', '5', '6to10', '11to15', 'more'])


    async populateMinimal() {

        await this.howManyOthers.setValue('0')
    }
}
