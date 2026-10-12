import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanWantChangesOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    bingeDrinking = new Element.Radiogroup<BingeDrinking>(this.page, '#[sanMode]_alcohol_evidence_of_excess_drinking', ['noEvidence', 'someEvidence', 'evidence'])
    pastIssues = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_alcohol_past_issues', ['yes', 'no'])
    anythingHelpedAlcohol = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_alcohol_stopped_or_reduced', ['yes', 'no'])
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#[sanMode]_alcohol_use_changes', sanWantChangesOptions)
}
