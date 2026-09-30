import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'

export class Page4 extends BaseSanEditPage {

    motivatedToStop = new Element.Radiogroup<'noMotivation' | 'someMotivation' | 'motivated' | 'unknown'>(this.page, '#drugs_practitioner_analysis_motivated_to_stop', ['noMotivation', 'someMotivation', 'motivated', 'unknown'])
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#drug_use_changes', ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'])
}
