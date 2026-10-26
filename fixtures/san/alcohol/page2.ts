import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page2 extends BaseSanEditPage {

    bingeDrinking = new Element.Radiogroup<BingeDrinking>(this.page, '#[sanMode]_alcohol_evidence_of_excess_drinking', ['noEvidence', 'someEvidence', 'evidence'])
    pastIssues = new Element.Radiogroup<SanYesNo>(this.page, '#alcohol_past_issues', ['yes', 'no'])

    async populateMinimal() {

        await this.bingeDrinking.setValue('noEvidence')
        await this.pastIssues.setValue('no')
    }
}
