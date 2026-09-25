import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { PractitionerAnalysis } from '../pages'
import { sanIdPrefixLookup } from '../sanIds'


export class Finance extends BaseSanSection {

    override readonly section: SanSection = 'Finances'

    readonly page1 = new Page1(this.page)
    readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.section, sanIdPrefixLookup[this.section])

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }

    async populateForLst() {

        await this.goto()
        await this.page1.incomeSource.setValue(['family'])
        await this.page1.overReliant.setValue('yes')
    }
}