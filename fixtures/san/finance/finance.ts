import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { Page4 } from './page4'
import { Page5 } from './page5'
import { PractitionerAnalysis } from '../pages'


export class Finance extends BaseSanSection {

    override readonly sectionName: SanSectionTitle = 'Finances'
    override readonly paPrefix = 'finance'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    readonly page4 = new Page4(this.page)
    readonly page5 = new Page5(this.page)
    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.page3.populateMinimal()
        await this.markAsComplete()
    }

    async populateForLst() {

        await this.goto()
        await this.page1.incomeSource.setValue(['family'])
        await this.saveAndContinue()
        await this.page2.overReliant.setValue('yes')
        await this.page2.overReliantDetails.setValue('Some details')
        await this.saveAndContinue()
    }
}