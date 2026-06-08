import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'

export class InformationSummary extends BaseSanEditPage {

    name = 'InformationSummary'
    title = 'Information summary - Strengths and Needs'

    change = new Element.Link(this.page, ':nth-match(.govuk-link:visible:has-text("Change"), 1)')
    analysis = new Element.Link(this.page, '#tab_practitioner-analysis')
}
