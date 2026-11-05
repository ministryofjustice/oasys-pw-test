import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { Page4 } from './page4'
import { Page5 } from './page5'
import { Page6 } from './page6'
import { Page7 } from './page7'
import { Page8 } from './page8'
import { PractitionerAnalysis } from '../pages'


export class Relationships extends BaseSanSection {

    override readonly sectionName: SanSectionTitle = 'Personal relationships and community'
    override readonly paPrefix = 'personal_relationships_community'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    readonly page4 = new Page4(this.page)
    readonly page5 = new Page5(this.page)
    readonly page6 = new Page6(this.page)
    readonly page7 = new Page7(this.page)
    readonly page8 = new Page8(this.page)
    override readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.paPrefix)

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.page3.populateMinimal()
        await this.saveAndContinue()
        await this.page4.populateMinimal()
        await this.saveAndContinue()
        await this.page7.populateMinimal()
        await this.saveAndContinue()
        await this.wantChanges.setValue('madeChanges')
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
        await this.page3.currentFamilyRelationship.setValue('mixed')
        await this.page3.childhoodExperience.setValue('mixed')
        await this.page3.behaviouralProblems.setValue('yes')
        await this.page3.partOfGroups.setValue('Some groups')
        await this.page3.inARelationship.setValue('no')
        await this.page3.happyWithStatus.setValue('unhappy')
        await this.page3.history.setValue('mixed')
        await this.saveAndContinue()
        await this.page4.domesticAbusePerpetrator.setValue('no')
        await this.saveAndContinue()
        await this.page7.domesticAbuseVictim.setValue('no')
        await this.saveAndContinue()
        await this.wantChanges.setValue('wantToChange')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateWithRiskOfHarm()
        await this.markAsComplete()
    }

    async populateForSara() {

        await this.goto()

        await this.page1.anyChildren.setValue(['no'])
        await this.saveAndContinue()
        await this.page3.currentFamilyRelationship.setValue('mixed')
        await this.page3.childhoodExperience.setValue('mixed')
        await this.page3.behaviouralProblems.setValue('yes')
        await this.page3.partOfGroups.setValue('Some groups')
        await this.page3.inARelationship.setValue('no')
        await this.page3.happyWithStatus.setValue('someConcerns')
        await this.page3.history.setValue('unstable')
        await this.saveAndContinue()
        await this.page4.domesticAbusePerpetrator.setValue('yes')
        await this.saveAndContinue()
        await this.page5.domesticAbusePerpetratorType.setValue(['partner'])
        await this.page5.partnerPerpetratorDetails.setValue('Some details about domestic abuse')
        await this.page5.controlling.setValue('no')
        await this.saveAndContinue()
        await this.page6.strangulation.setValue('no')
        await this.saveAndContinue()
        await this.page7.domesticAbuseVictim.setValue('no')
        await this.saveAndContinue()
        await this.wantChanges.setValue('wantToChange')
        await this.saveAndContinue()
        await this.openPractitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.markAsComplete()

    }
}