import { BaseSanSection } from '../sanSection'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { PractitionerAnalysis } from '../pages'
import { sanIdPrefixLookup } from '../sanIds'
import { Victims } from './victims'


export class OffenceAnalysis extends BaseSanSection {

    override readonly section: SanSection = 'Offence analysis'

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    readonly practitionerAnalysis = new PractitionerAnalysis(this.page, this.section, sanIdPrefixLookup[this.section])
    readonly victims = new Victims(this.page)

    async populateMinimal() {

        await this.goto()
        await this.page1.populateMinimal()
        await this.saveAndContinue()
        await this.page2.populateMinimal()
        await this.saveAndContinue()
        await this.page3.populateMinimal()
        await this.markAsComplete()
    }

    async populateForLst() {

        await this.goto()
        await this.page1.offenceDescription.setValue('Offence description')
        await this.page1.offenceElements.setValue(['violence', 'excessiveViolence'])
        await this.page1.reason.setValue('Why it happened')
        await this.page1.motivations.setValue(['other'])
        await this.page1.motivationOther.setValue('Some reason')
        await this.page1.victimType.setValue(['other'])
        await this.page1.victimTypeDetails.setValue('Victim details')
        await this.saveAndContinue()
        await this.page2.howManyOthers.setValue('0')
        await this.saveAndContinue()
        await this.page3.impact.setValue('no')
    }

    async populateForOpd() {

        await this.goto()
        await this.page1.offenceDescription.setValue('Offence description')
        await this.page1.offenceElements.setValue(['violence', 'excessiveViolence'])
        await this.page1.reason.setValue('Why it happened')
        await this.page1.motivations.setValue(['other'])
        await this.page1.motivationOther.setValue('Some reason')
        await this.page1.victimType.setValue(['other'])
        await this.page1.victimTypeDetails.setValue('Victim details')
        await this.saveAndContinue()
        await this.page2.howManyOthers.setValue('0')
        await this.saveAndContinue()
        await this.page3.impact.setValue('yes')
        await this.page3.responsibility.setValue('yes')
        await this.page3.patterns.setValue('Patterns')
        await this.page3.escalation.setValue('no')
        await this.page3.riskSeriousHarm.setValue('yes')
        await this.page3.riskSeriousHarmYesDetails.setValue('Risk of serious harm')
        await this.page3.domesticAbusePerpetrator.setValue('no')
        await this.page3.domesticAbuseVictim.setValue('no')
        await this.markAsComplete()
    }

    async populateForSara() {

        await this.goto()

        await this.page1.offenceDescription.setValue('Offence description')
        await this.page1.offenceElements.setValue(['weapon'])
        await this.page1.reason.setValue('Why it happened')
        await this.page1.motivations.setValue(['other'])
        await this.page1.motivationOther.setValue('Some reason')
        await this.page1.victimType.setValue(['other'])
        await this.page1.victimTypeDetails.setValue('Victim details')
        await this.saveAndContinue()
        await this.page2.howManyOthers.setValue('0')
        await this.saveAndContinue()
        await this.page3.impact.setValue('yes')
        await this.page3.responsibility.setValue('yes')
        await this.page3.patterns.setValue('Patterns')
        await this.page3.escalation.setValue('no')
        await this.page3.riskSeriousHarm.setValue('yes')
        await this.page3.riskSeriousHarmYesDetails.setValue('No risk')
        await this.page3.domesticAbusePerpetrator.setValue('yes')
        await this.page3.domesticAbusePerpetratorType.setValue('partner')
        await this.page3.partnerPerpetratorDetails.setValue('Some details about domestic abuse')
        await this.page3.domesticAbuseVictim.setValue('no')
        await this.markAsComplete()
    }
}