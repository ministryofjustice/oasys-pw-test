import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { drugsWhenUsedOptions } from './drugs'

export class Page5 extends BaseSanEditPage {

    injected = new Element.ConditionalCheckboxGroup<InjectableDrugType | 'none'>(this.page, checkboxValuesLookup)

    amphetaminesWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_amphetamines', drugsWhenUsedOptions)
    benzodiazepinesWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_benzodiazepines', drugsWhenUsedOptions)
    cocaineWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_cocaine', drugsWhenUsedOptions)
    crackWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_crack', drugsWhenUsedOptions)
    heroinWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_heroin', drugsWhenUsedOptions)
    ketamineWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_ketamine', drugsWhenUsedOptions)
    mephedroneWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_mephedrone', drugsWhenUsedOptions)
    methadoneWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_methadone_not_prescribed', drugsWhenUsedOptions)
    prescribedWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_misused_prescribed_drugs', drugsWhenUsedOptions)
    opiatesWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_other_opiates', drugsWhenUsedOptions)
    steroidsWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_steroids', drugsWhenUsedOptions)
    otherWhenInjected = new Element.CheckboxGroup<DrugsWhenUsed>(this.page, '#[sanMode]_drugs_injected_other_drug', drugsWhenUsedOptions)

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