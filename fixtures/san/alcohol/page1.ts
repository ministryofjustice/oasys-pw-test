import { Element, OasysPage } from 'classes'


export class Page1 extends OasysPage {

    evidenceCurrentIssues = new Element.Radiogroup<EvidenceCurrentIssues>(this.page, '#[sanMode]_alcohol_current_issues', ['significant', 'someProblems', 'noCurrentProblems', 'neverDrank'])

    async populateMinimal() {

        await this.evidenceCurrentIssues.setValue('neverDrank')
    }
}

