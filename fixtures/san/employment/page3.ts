import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoUnknownOptions, sanYesSomeNoOptions } from '../sanSection'


export class Page3 extends BaseSanEditPage {

    employmentHistory = new Element.Radiogroup<EmploymentHistory>(this.page, '#[sanMode]_employment_history', ['continuous', 'generallyEmployed', 'unstable', 'unknown'])
    additionalCommitments = new Element.CheckboxGroup<'caring' | 'child' | 'studying' | 'volunteering' | 'other' | 'unknown' | 'none'>(this.page, '#[sanMode]_employment_other_responsibilities', ['caring', 'child', 'studying', 'volunteering', 'other', 'unknown', '-', 'none'])
    anyQual = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#education_academic_professional_vocational_qualifications', sanYesNoUnknownOptions)
    qualDetails = new Element.Textbox(this.page, '#education_academic_professional_vocational_qualifications_details')
    skills = new Element.Radiogroup<SanYesNoSome>(this.page, '#education_transferable_skills', sanYesSomeNoOptions)
    difficulties = new Element.CheckboxGroup<SanDifficulties>(this.page, '#education_difficulties', ['reading', 'writing', 'numeracy', '-', 'none'])


    async populateMinimal() {

        await this.employmentHistory.setValue('continuous')
        await this.additionalCommitments.setValue(['none'])
        await this.anyQual.setValue('no')
        await this.skills.setValue('yes')
        await this.difficulties.setValue(['none'])
    }
}
