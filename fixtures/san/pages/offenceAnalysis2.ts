import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { howManyOthersOptions } from '../sanIds'

export class OffenceAnalysis2 extends BaseSanEditPage {

    name = 'OffenceAnalysis2'
    title = 'Offence analysis - Strengths and Needs'

    howManyOthers = new Element.Radiogroup<HowManyOthers>(this.page, '#offence_analysis_how_many_involved', howManyOthersOptions)
}
