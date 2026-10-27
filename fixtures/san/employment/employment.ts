import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { Page4 } from './page4'
import { PractitionerAnalysis } from '../pages'


export class Employment extends BaseSanSection {

    override readonly sectionName: SanSectionTitle = 'Employment and education'
    override readonly paPrefix = 'employment_education'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    readonly page4 = new Page4(this.page)
    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.page3.populateMinimal()
        await this.saveAndContinue()
        await this.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }

    async populateForLst() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.page3.anyQual.setValue('no')
        await this.page3.skills.setValue('no')
        await this.page3.difficulties.setValue(['reading', 'numeracy'])
        await this.saveAndContinue()
        await this.page4.readingLevel.setValue('some')
        await this.page4.numeracyLevel.setValue('some')
        await this.saveAndContinue()
        await this.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
    }

    async populateForSara() {

        await this.goto()

        await this.page1.employmentStatus.setValue('unemployed')
        await this.saveAndContinue()
        await this.page2.employedBefore.setValue('yes')
        await this.saveAndContinue()
        await this.page3.employmentHistory.setValue('unstable')
        await this.page3.additionalCommitments.setValue(['none'])
        await this.page3.anyQual.setValue('yes')
        await this.page3.qualDetails.setValue('some qualifications')
        await this.page3.skills.setValue('yes')
        await this.page3.difficulties.setValue(['none'])
        await this.saveAndContinue()
        await this.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }
}