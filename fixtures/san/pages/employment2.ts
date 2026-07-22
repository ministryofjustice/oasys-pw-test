import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'

export class Employment2 extends BaseSanEditPage {

    name = 'Employment2'
    title = 'Employment and Education - Strengths and Needs'

    employmentHistory = new Element.Radiogroup<'continuous' | 'generallyEmployed' | 'unstable' | 'unknown'>(this.page, '#employment_history', ['continuous', 'generallyEmployed', 'unstable', 'unknown'])
    additionalCommitments = new Element.CheckboxGroup<'caring' | 'child' | 'studying' | 'volunteering' | 'other' | 'unknown' | 'none'>(this.page, '#employment_other_responsibilities', ['caring', 'child', 'studying', 'volunteering', 'other', 'unknown', '-', 'none'])
    highestQual = new Element.Radiogroup<'entryLevel' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6' | 'level7' | 'level8' | 'none' | 'unknown'>(this.page, '#education_highest_level_completed', ['entryLevel', 'level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', '-', 'none', 'unknown'])
    professionalQual = new Element.Radiogroup<'yes' | 'no' | 'unknown'>(this.page, '#education_professional_or_vocational_qualifications', ['yes', 'no', '-', 'unknown'])
    professionalQualDetails = new Element.Textbox(this.page, '#education_professional_or_vocational_qualifications_yes_details')
    skills = new Element.Radiogroup<'yes' | 'some' | 'no'>(this.page, '#education_transferable_skills', ['yes', 'some', 'no'])
    difficulties = new Element.CheckboxGroup<'reading' | 'writing' | 'numeracy' | 'none'>(this.page, '#education_difficulties', ['reading', 'writing', 'numeracy', '-', 'none'])
    readingLevel = new Element.Radiogroup<'significant' | 'some'>(this.page, '#education_difficulties_reading_severity', ['significant', 'some'])
    writingLevel = new Element.Radiogroup<'significant' | 'some'>(this.page, '#education_difficulties_writing_severity', ['significant', 'some'])
    numeracyLevel = new Element.Radiogroup<'significant' | 'some'>(this.page, '#education_difficulties_numeracy_severity', ['significant', 'some'])
    employmentExperience = new Element.Radiogroup<'positive' | 'mostlyPositive' | 'positiveNegative' | 'mostlyNegative' | 'negative' | 'unknown'>(this.page, '#employment_experience', ['positive', 'mostlyPositive', 'positiveNegative', 'mostlyNegative', 'negative', 'unknown'])
    educationExperience = new Element.Radiogroup<'positive' | 'mostlyPositive' | 'positiveNegative' | 'mostlyNegative' | 'negative' | 'unknown'>(this.page, '#education_experience', ['positive', 'mostlyPositive', 'positiveNegative', 'mostlyNegative', 'negative', 'unknown'])
    wantChangesEmployment = new Element.Radiogroup<SanWantChanges>(this.page, '#employment_education_changes', ['madeChanges', 'makingChanges', 'wantToChange', 'needHelp', 'thinking', 'notWanted', 'notAnswering', '-', 'notPresent', 'notApplicable'])
}
