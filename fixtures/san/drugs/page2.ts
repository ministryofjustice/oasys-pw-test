import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'

export class Page2 extends BaseSanEditPage {

    name = 'DrugsPage2'
    title = 'Drug usage - Strengths and Needs'
    drugType = new Element.CheckboxGroup<DrugType>(this.page, '#select_misused_drugs', ['amphetamines', 'benzodiazepines', 'cannabis', 'cocaine', 'crack', 'ecstasy', 'hallucinogenics', 'heroin', 'methadone', 'prescribed', 'opiates', 'solvents', 'steroids', 'spice', 'other'])

    amphetaminesLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_amphetamines', ['yes', 'no'])
    benzodiazepinesLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_benzodiazepines', ['yes', 'no'])
    cannabisLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_cannabis', ['yes', 'no'])
    cocaineLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_cocaine', ['yes', 'no'])
    crackLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_crack', ['yes', 'no'])
    ecstasyLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_ecstasy', ['yes', 'no'])
    hallucinogenicsLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_hallucinogenics', ['yes', 'no'])
    heroinLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_heroin', ['yes', 'no'])
    methadoneLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_methadone_not_prescribed', ['yes', 'no'])
    prescribedLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_misused_prescribed_drugs', ['yes', 'no'])
    opiatesLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_other_opiates', ['yes', 'no'])
    solventsLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_solvents', ['yes', 'no'])
    spiceLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_spice', ['yes', 'no'])
    steroidsLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_steroids', ['yes', 'no'])
    drugTypeOther = new Element.Textbox(this.page, '#other_drug_name')
    otherLastSixMonths = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drug_last_used_other_drug', ['yes', 'no'])
}
