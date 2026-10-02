import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { PractitionerAnalysis } from '../pages'


export class Relationships extends BaseSanSection {

    override readonly sectionName: SanSection = 'Personal relationships and community'
    override readonly paPrefix = 'personal_relationships_community'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

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
        await this.page3.behaviouralProblems.setValue('yes')
    }

    async populateForOpd() {

        await this.goto()
        await this.page1.anyChildren.setValue(['no'])
        await this.saveAndContinue()
        await this.page3.happyWithStatus.setValue('unhappy')
        await this.page3.history.setValue('mixed')
        await this.page3.currentFamilyRelationship.setValue('mixed')
        await this.page3.childhoodExperience.setValue('mixed')
        await this.page3.behaviouralProblems.setValue('yes')
        await this.page3.domesticAbusePerpetrator.setValue('no')
        await this.page3.domesticAbuseVictim.setValue('no')
        await this.page3.wantChanges.setValue('wantToChange')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateWithRiskOfHarm()
        await this.markAsComplete()
    }

    async populateForSara() {

        await this.goto()

        await this.page1.anyChildren.setValue(['no'])
        await this.saveAndContinue()
        await this.page3.happyWithStatus.setValue('someConcerns')
        await this.page3.history.setValue('unstable')
        await this.page3.currentFamilyRelationship.setValue('mixed')
        await this.page3.childhoodExperience.setValue('mixed')
        await this.page3.behaviouralProblems.setValue('yes')
        await this.page3.domesticAbusePerpetrator.setValue('yes')
        await this.page3.domesticAbusePerpetratorType.setValue('partner')
        await this.page3.partnerPerpetratorDetails.setValue('Some details about domestic abuse')
        await this.page3.controlling.setValue('no')
        await this.page3.strangulation.setValue('no')
        await this.page3.domesticAbuseVictim.setValue('no')
        await this.page3.wantChanges.setValue('wantToChange')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()

    }
}