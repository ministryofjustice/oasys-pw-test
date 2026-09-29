import { Page } from '@playwright/test'
import { PractitionerAnalysis } from '../pages/practitionerAnalysis'
import { Element } from 'classes'


export class DrugsPractitionerAnalysis extends PractitionerAnalysis {

    motivatedToStop = new Element.Radiogroup<'noMotivation' | 'someMotivation' | 'motivated' | 'unknown'>(this.page, '#drugs_practitioner_analysis_motivated_to_stop', ['noMotivation', 'someMotivation', 'motivated', 'unknown'])

    async populateMinimal() {

        await super.populateMinimal()
    }

    async populateMinimalWithMotivation() {

        await this.motivatedToStop.setValue('motivated')
        await super.populateMinimal()
    }
}
