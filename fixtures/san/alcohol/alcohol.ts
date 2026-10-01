import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { PractitionerAnalysis } from '../pages'


export class Alcohol extends BaseSanSection {

    override readonly sectionName: SanSection = 'Alcohol use'
    override readonly paPrefix = 'alcohol_use'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.markAsComplete()
    }

    async populateForSara() {

        await this.goto()

        await this.page1.evidenceCurrentIssues.setValue('someProblems')
        await this.saveAndContinue()
        await this.page2.bingeDrinking.setValue('evidence')
        await this.page2.pastIssues.setValue('no')
        await this.page2.anythingHelpedAlcohol.setValue('no')
        await this.page2.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()

    }
}