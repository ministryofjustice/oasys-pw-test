import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { PractitionerAnalysis } from '../pages'


export class Employment extends BaseSanSection {

    override readonly sectionName: SanSection = 'Employment and education'
    override readonly paPrefix = 'employment_education'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.page2.populateMinimal()
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }

    async populateForLst() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.page2.anyQual.setValue('no')
        await this.page2.skills.setValue('no')
        await this.page2.difficulties.setValue(['reading', 'numeracy'])
        await this.page2.readingLevel.setValue('some')
        await this.page2.numeracyLevel.setValue('some')
    }

    async populateForSara() {

        await this.goto()

        await this.page1.employmentStatus.setValue('unemployed')
        await this.page1.unemployedEmployedBefore.setValue('yes')
        await this.saveAndContinue()
        await this.page2.employmentHistory.setValue('unstable')
        await this.page2.additionalCommitments.setValue(['none'])
        await this.page2.anyQual.setValue('yes')
        await this.page2.qualDetails.setValue('some qualifications')
        await this.page2.skills.setValue('yes')
        await this.page2.difficulties.setValue(['none'])
        await this.page2.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }
}