import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { drugsWhenUsedOptions } from './drugs'

export class Page5 extends BaseSanEditPage {

    injected = new Element.ConditionalCheckboxGroup<InjectableDrugType | 'none'>(this.page, checkboxValuesLookup)

    amphetaminesWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_amphetamines', drugsWhenUsedOptions)
    benzodiazepinesWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_benzodiazepines', drugsWhenUsedOptions)
    cocaineWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_cocaine', drugsWhenUsedOptions)
    crackWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_crack', drugsWhenUsedOptions)
    heroinWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_heroin', drugsWhenUsedOptions)
    ketamineWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_ketamine', drugsWhenUsedOptions)
    mephedroneWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_mephedrone', drugsWhenUsedOptions)
    methadoneWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_methadone_not_prescribed', drugsWhenUsedOptions)
    prescribedWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_misused_prescribed_drugs', drugsWhenUsedOptions)
    opiatesWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_other_opiates', drugsWhenUsedOptions)
    steroidsWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_steroids', drugsWhenUsedOptions)
    otherWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#drugs_injected_in_the_last_six_months_other_drug', drugsWhenUsedOptions)
    
    injectedBeforeCustody = new Element.ConditionalCheckboxGroup<InjectableDrugType | 'none'>(this.page, checkboxValuesLookup)

    amphetaminesWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_amphetamines', drugsWhenUsedOptions)
    benzodiazepinesWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_benzodiazepines', drugsWhenUsedOptions)
    cocaineWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_cocaine', drugsWhenUsedOptions)
    crackWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_crack', drugsWhenUsedOptions)
    heroinWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_heroin', drugsWhenUsedOptions)
    ketamineWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_ketamine', drugsWhenUsedOptions)
    mephedroneWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_mephedrone', drugsWhenUsedOptions)
    methadoneWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_methadone_not_prescribed', drugsWhenUsedOptions)
    prescribedWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_misused_prescribed_drugs', drugsWhenUsedOptions)
    opiatesWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_other_opiates', drugsWhenUsedOptions)
    steroidsWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_steroids', drugsWhenUsedOptions)
    otherWhenInjectedBeforeCustody = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#custody_drug_injected_in_the_six_months_before_custody_other_drug', drugsWhenUsedOptions)

}

const checkboxValuesLookup: { [key in (InjectableDrugType | 'none')]: string } = {
    'amphetamines': 'AMPHETAMINES',
    'benzodiazepines': 'BENZODIAZEPINES',
    'cocaine': 'COCAINE',
    'crack': 'CRACK',
    'heroin': 'HEROIN',
    'ketamine': 'KETAMINE',
    'mephedrone': 'MEPHEDRONE',
    'methadone': 'METHADONE_NOT_PRESCRIBED',
    'prescribed': 'MISUSED_PRESCRIBED_DRUGS',
    'opiates': 'OTHER_OPIATES',
    'steroids': 'STEROIDS',
    'other': 'OTHER_DRUG',
    'none': 'NONE',
}