import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanWantChangesOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    bingeDrinking = new Element.Radiogroup<BingeDrinking>(this.page, '#alcohol_evidence_of_excess_drinking', ['noEvidence', 'someEvidence', 'evidence'])
    pastIssues = new Element.Radiogroup<SanYesNo>(this.page, '#alcohol_past_issues', ['yes', 'no'])
    anythingHelpedAlcohol = new Element.Radiogroup<SanYesNo>(this.page, '#alcohol_stopped_or_reduced', ['yes', 'no'])
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#alcohol_use_changes', sanWantChangesOptions)
}
