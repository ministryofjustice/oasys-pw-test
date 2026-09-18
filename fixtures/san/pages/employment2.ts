import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { employmentHistoryOptions, highestQualOptions, sanExperienceOptions, sanSignificantSomeOptions, sanWantChangesOptions, sanYesNoSomeOptions } from '../sanIds'

export class Employment2 extends BaseSanEditPage {

    name = 'Employment2'
    title = 'Employment and Education - Strengths and Needs'

    employmentHistory = new Element.Radiogroup<EmploymentHistory>(this.page, '#employment_history', employmentHistoryOptions)
    additionalCommitments = new Element.CheckboxGroup<'caring' | 'child' | 'studying' | 'volunteering' | 'other' | 'unknown' | 'none'>(this.page, '#employment_other_responsibilities', ['caring', 'child', 'studying', 'volunteering', 'other', 'unknown', '-', 'none'])
    highestQual = new Element.Radiogroup<HighestQual>(this.page, '#education_highest_level_completed', highestQualOptions)
    professionalQual = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#education_professional_or_vocational_qualifications', ['yes', 'no', '-', 'unknown'])
    professionalQualDetails = new Element.Textbox(this.page, '#education_professional_or_vocational_qualifications_yes_details')
    skills = new Element.Radiogroup<SanYesNoSome>(this.page, '#education_transferable_skills', sanYesNoSomeOptions)
    difficulties = new Element.CheckboxGroup<SanDifficulties>(this.page, '#education_difficulties', ['reading', 'writing', 'numeracy', '-', 'none'])
    readingLevel = new Element.Radiogroup<SanSignificantSome>(this.page, '#education_difficulties_reading_severity', sanSignificantSomeOptions)
    writingLevel = new Element.Radiogroup<SanSignificantSome>(this.page, '#education_difficulties_writing_severity', sanSignificantSomeOptions)
    numeracyLevel = new Element.Radiogroup<SanSignificantSome>(this.page, '#education_difficulties_numeracy_severity', sanSignificantSomeOptions)
    employmentExperience = new Element.Radiogroup<SanExperience>(this.page, '#employment_experience', sanExperienceOptions)
    educationExperience = new Element.Radiogroup<SanExperience>(this.page, '#education_experience', sanExperienceOptions)
    wantChangesEmployment = new Element.Radiogroup<SanWantChanges>(this.page, '#employment_education_changes', sanWantChangesOptions)
}
