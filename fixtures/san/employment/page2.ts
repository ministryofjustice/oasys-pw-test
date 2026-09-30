import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanSignificantSomeOptions, sanWantChangesOptions, sanYesNoOptions, sanYesNoSomeOptions } from '../sanSection'


export class Page2 extends BaseSanEditPage {

    employmentHistory = new Element.Radiogroup<EmploymentHistory>(this.page, '#employment_history', ['continuous', 'generallyEmployed', 'unstable', 'unknown'])
    additionalCommitments = new Element.CheckboxGroup<'caring' | 'child' | 'studying' | 'volunteering' | 'other' | 'unknown' | 'none'>(this.page, '#employment_other_responsibilities', ['caring', 'child', 'studying', 'volunteering', 'other', 'unknown', '-', 'none'])
    anyQual = new Element.Radiogroup<SanYesNo>(this.page, '#education_academic_professional_vocational_qualifications', sanYesNoOptions)
    qualDetails = new Element.Textbox(this.page, '#education_academic_professional_vocational_qualifications_yes_details')
    skills = new Element.Radiogroup<SanYesNoSome>(this.page, '#education_transferable_skills', sanYesNoSomeOptions)
    difficulties = new Element.CheckboxGroup<SanDifficulties>(this.page, '#education_difficulties', ['reading', 'writing', 'numeracy', '-', 'none'])
    readingLevel = new Element.Radiogroup<SanSignificantSome>(this.page, '#education_difficulties_reading_severity', sanSignificantSomeOptions)
    writingLevel = new Element.Radiogroup<SanSignificantSome>(this.page, '#education_difficulties_writing_severity', sanSignificantSomeOptions)
    numeracyLevel = new Element.Radiogroup<SanSignificantSome>(this.page, '#education_difficulties_numeracy_severity', sanSignificantSomeOptions)
    wantChanges = new Element.Radiogroup<SanWantChanges>(this.page, '#employment_education_changes', sanWantChangesOptions)


    async populateMinimal() {

        await this.employmentHistory.setValue('continuous')
        await this.additionalCommitments.setValue(['none'])
        await this.anyQual.setValue('no')
        await this.skills.setValue('yes')
        await this.difficulties.setValue(['none'])
        await this.wantChanges.setValue('madeChanges')
    }
}
