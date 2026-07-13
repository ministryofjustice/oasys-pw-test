import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'

export class OffenceAnalysis2 extends BaseSanEditPage {

    name = 'OffenceAnalysis2'
    title = 'Offence analysis - Strengths and Needs'
    howManyOthers = new Element.Radiogroup<'0' | '1' | '2' | '3' | '4' | '5' | '6to10' | '11to15' | 'more'>(this.page, '#offence_analysis_how_many_involved', ['0', '1', '2', '3', '4', '5', '6to10', '11to15', 'more'])
}
