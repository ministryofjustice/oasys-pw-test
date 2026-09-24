import { Page } from '@playwright/test'
import { OasysPage, Element } from 'classes'

export class PractitionerAnalysis extends OasysPage {

    name = 'PractitionerAnalysis'
    title = 'Strengths and needs'

    constructor(page: Page, section: SanSection, readonly idPrefix: string) {
        super(page)
        this.title = `${section} - Strengths and needs`
    }

    change = new Element.Link(this.page, 'a[href*="summary#practitioner-analysis"]')

    strengths = new Element.Radiogroup<'yes' | 'no'>(this.page, `#${this.idPrefix}_practitioner_analysis_strengths_or_protective_factors`, ['yes', 'no'])
    strengthsYesDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_strengths_or_protective_factors_yes_details`)
    strengthsNoDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_strengths_or_protective_factors_no_details`)

    riskOfHarm = new Element.Radiogroup<'yes' | 'no'>(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_serious_harm`, ['yes', 'no'])
    riskOfHarmYesDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_serious_harm_yes_details`)
    riskOfHarmNoDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_serious_harm_no_details`)

    riskOfReoffending = new Element.Radiogroup<'yes' | 'no'>(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_reoffending`, ['yes', 'no'])
    riskOfReoffendingYesDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_reoffending_yes_details`)
    riskOfReoffendingNoDetails = new Element.Textbox(this.page, `#${this.idPrefix}_practitioner_analysis_risk_of_reoffending_no_details`)

    saveAndContinue = new Element.Button(this.page, `button[value='YES']`)
    markAsComplete = new Element.Button(this.page, `button[value='YES']`)
    returnToOASys = new Element.Link(this.page, 'Return to OASys')


    async populateMinimal() {

        await this.strengths.setValue('no')
        await this.riskOfHarm.setValue('no')
        await this.riskOfReoffending.setValue('no')
    }
}
