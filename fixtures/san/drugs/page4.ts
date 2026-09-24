import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'

export class Page4 extends BaseSanEditPage {

    name = 'DrugsPage4'
    title = 'Drug usage - Strengths and Needs'

    whyStarted = new Element.CheckboxGroup<'cultural' | 'curiosity' | 'performance' | 'escapism' | 'stress' | 'peerPressure' | 'recreation' | 'selfMedication' | 'other'>(this.page, '#drugs_reasons_for_use', ['cultural', 'curiosity', 'performance', 'escapism', 'stress', 'peerPressure', 'recreation', 'selfMedication', 'other'])
    impactDrugs = new Element.CheckboxGroup<'behavioural' | 'community' | 'finances' | 'offending' | 'health' | 'relationships' | 'other'>(this.page, '#drugs_affected_their_life', ['behavioural', 'community', 'finances', 'offending', 'health', 'relationships', 'other'])
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#drug_use_changes', ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'])
}
