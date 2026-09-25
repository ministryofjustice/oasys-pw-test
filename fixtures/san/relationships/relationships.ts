import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { PractitionerAnalysis } from '../pages'
import { sanIdPrefixLookup } from '../sanIds'


export class Relationships extends BaseSanSection {

    override readonly section: SanSection = 'Personal relationships and community'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.section, sanIdPrefixLookup[this.section])

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.page2.populateMinimal()
        await this.saveAndContinue()
        await this.page3.populateMinimal()
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()
    }

    async populateForLst() {

        await this.goto()
        await this.page1.anyChildren.setValue(['no'])
        await this.saveAndContinue()
        await this.page2.importantPeople.setValue(['partner'])
        await this.saveAndContinue()
        await this.page3.behaviouralProblems.setValue('yes')
    }

    async populateForOpd() {

        await this.goto()
        await this.page1.anyChildren.setValue(['no'])
        await this.saveAndContinue()
        await this.page2.importantPeople.setValue(['partner', 'otherChildren', 'family', 'friends', 'other'])
        await this.page2.importantOtherDetails.setValue('Other person details')
        await this.saveAndContinue()
        await this.page3.happyWithStatus.setValue('unhappy')
        await this.page3.history.setValue('mixed')
        await this.page3.resolveChallenges.setValue('Challenges text')
        await this.page3.currentFamilyRelationship.setValue('mixed')
        await this.page3.childhoodExperience.setValue('mixed')
        await this.page3.behaviouralProblems.setValue('yes')
        await this.page3.wantChangesRelationships.setValue('wantToChange')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateWithRiskOfHarm()
        await this.markAsComplete()
    }
}