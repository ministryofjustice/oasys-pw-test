import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanYesNoOptions } from '../sanSection'

export class Page2 extends BaseSanEditPage {

    drugType = new Element.CheckboxGroup<DrugType>(this.page, '#select_misused_drugs', ['amphetamines', 'benzodiazepines', 'cannabis', 'cocaine', 'crack', 'ecstasy', 'hallucinogenics', 'heroin', 'ketamine', 'mephedrone', 'methadone', 'prescribed', 'opiates', 'solvents', 'steroids', 'spice', 'other'])

    amphetaminesLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_amphetamines', sanYesNoOptions)
    benzodiazepinesLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_benzodiazepines', sanYesNoOptions)
    cannabisLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_cannabis', sanYesNoOptions)
    cocaineLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_cocaine', sanYesNoOptions)
    crackLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_crack', sanYesNoOptions)
    ecstasyLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_ecstasy', sanYesNoOptions)
    hallucinogenicsLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_hallucinogenics', sanYesNoOptions)
    heroinLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_heroin', sanYesNoOptions)
    ketamineLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_ketamine', sanYesNoOptions)
    mephedroneLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_mephedrone', sanYesNoOptions)
    methadoneLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_methadone_not_prescribed', sanYesNoOptions)
    prescribedLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_misused_prescribed_drugs', sanYesNoOptions)
    opiatesLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_other_opiates', sanYesNoOptions)
    solventsLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_solvents', sanYesNoOptions)
    spiceLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_spice', sanYesNoOptions)
    steroidsLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_steroids', sanYesNoOptions)
    drugTypeOther = new Element.Textbox(this.page, '#[sanMode]_other_drug_name')
    otherLastSixMonths = new Element.Radiogroup<SanYesNo>(this.page, '#[sanMode]_drug_last_used_other_drug', sanYesNoOptions)
}
