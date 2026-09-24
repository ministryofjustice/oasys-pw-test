import { Page } from '@playwright/test'
import { PractitionerAnalysis } from '../pages/practitionerAnalysis'
import { Element } from 'classes'
import { sanIdPrefixLookup } from '../sanIds'

export class DrugsPractitionerAnalysis extends PractitionerAnalysis {

    motivatedToStop = new Element.Radiogroup<'noMotivation' | 'someMotivation' | 'motivated' | 'unknown'>(this.page, '#drugs_practitioner_analysis_motivated_to_stop', ['noMotivation', 'someMotivation', 'motivated', 'unknown'])

    constructor(page: Page) {

        super(page, 'Drug use', sanIdPrefixLookup['Drug use'])
    }

    async populateMinimal() {
        
        await this.motivatedToStop.setValue('motivated')
        await super.populateMinimal()
    }
}
