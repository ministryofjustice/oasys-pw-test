import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { PractitionerAnalysis } from '../pages'
import { sanIdPrefixLookup } from '../sanIds'


export class Employment extends BaseSanSection {

    override readonly section: SanSection = 'Employment and education'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.section, sanIdPrefixLookup[this.section])

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
        await this.page2.highestQual.setValue('entryLevel')
        await this.page2.skills.setValue('no')
        await this.page2.difficulties.setValue(['reading', 'numeracy'])
        await this.page2.readingLevel.setValue('some')
        await this.page2.numeracyLevel.setValue('some')
    }

    async populateForSara() {

        await this.goto()

        await this.page1.employmentStatus.setValue('unemployedLooking')
        await this.page1.lookingEmployedBefore.setValue('yes')
        await this.saveAndContinue()
        await this.page2.employmentHistory.setValue('unstable')
        await this.page2.additionalCommitments.setValue(['none'])
        await this.page2.highestQual.setValue('entryLevel')
        await this.page2.professionalQual.setValue('yes')
        await this.page2.professionalQualDetails.setValue('some qualifications')
        await this.page2.skills.setValue('yes')
        await this.page2.difficulties.setValue(['none'])
        await this.page2.employmentExperience.setValue('positiveNegative')
        await this.page2.educationExperience.setValue('positive')
        await this.page2.wantChanges.setValue('madeChanges')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }
}