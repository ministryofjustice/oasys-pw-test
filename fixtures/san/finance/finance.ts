import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { PractitionerAnalysis } from '../pages'


export class Finance extends BaseSanSection {

    override readonly sectionName: SanSection = 'Finances'
    override readonly paPrefix = 'finance'

    readonly page1 = new Page1(this.page)
    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

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