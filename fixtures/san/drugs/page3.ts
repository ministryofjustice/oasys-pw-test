import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'

export class Page3 extends BaseSanEditPage {

    name = 'DrugsPage3'
    title = 'Drug usage - Strengths and Needs'

    amphetaminesFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_amphetamines', ['daily', 'weekly', 'monthly', 'occasionally'])
    benzodiazepinesFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_benzodiazepines', ['daily', 'weekly', 'monthly', 'occasionally'])
    cannabisFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_cannabis', ['daily', 'weekly', 'monthly', 'occasionally'])
    cocaineFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_cocaine', ['daily', 'weekly', 'monthly', 'occasionally'])
    crackFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_crack', ['daily', 'weekly', 'monthly', 'occasionally'])
    ecstasyFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_ecstasy', ['daily', 'weekly', 'monthly', 'occasionally'])
    hallucinogenicsFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_hallucinogenics', ['daily', 'weekly', 'monthly', 'occasionally'])
    heroinFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_heroin', ['daily', 'weekly', 'monthly', 'occasionally'])
    methadoneFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_methadone_not_prescribed', ['daily', 'weekly', 'monthly', 'occasionally'])
    prescribedFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_misused_prescribed_drugs', ['daily', 'weekly', 'monthly', 'occasionally'])
    opiatesFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_other_opiates', ['daily', 'weekly', 'monthly', 'occasionally'])
    solventsFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_solvents', ['daily', 'weekly', 'monthly', 'occasionally'])
    steroidsFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_steroids', ['daily', 'weekly', 'monthly', 'occasionally'])
    spiceFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_spice', ['daily', 'weekly', 'monthly', 'occasionally'])
    otherFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_last_six_months_other_drug', ['daily', 'weekly', 'monthly', 'occasionally'])

    detailsNotLastSixMonths = new Element.Textbox(this.page, '#not_used_in_last_six_months_details')
    injected = new Element.CheckboxGroup<InjectableDrugType>(this.page, '#drugs_injected', ['none', '-', 'amphetamines', 'benzodiazepines', 'cocaine', 'crack', 'heroin', 'methadone', 'prescribed', 'opiates', 'steroids', 'other'], true)

    amphetaminesInjectedLastSixMonths = new Element.CheckboxGroup<'lastSix' | 'moreThanSix'>(this.page, '#drugs_injected_amphetamines', ['lastSix', 'moreThanSix'])
    benzodiazepinesInjectedLastSixMonths = new Element.CheckboxGroup<'lastSix' | 'moreThanSix'>(this.page, '#drugs_injected_benzodiazepines', ['lastSix', 'moreThanSix'])
    cocaineInjectedLastSixMonths = new Element.CheckboxGroup<'lastSix' | 'moreThanSix'>(this.page, '#drugs_injected_cocaine', ['lastSix', 'moreThanSix'])
    crackInjectedLastSixMonths = new Element.CheckboxGroup<'lastSix' | 'moreThanSix'>(this.page, '#drugs_injected_crack', ['lastSix', 'moreThanSix'])
    heroinInjectedLastSixMonths = new Element.CheckboxGroup<'lastSix' | 'moreThanSix'>(this.page, '#drugs_injected_heroin', ['lastSix', 'moreThanSix'])
    methadoneInjectedLastSixMonths = new Element.CheckboxGroup<'lastSix' | 'moreThanSix'>(this.page, '#drugs_injected_methadone_not_prescribed', ['lastSix', 'moreThanSix'])
    prescribedInjectedLastSixMonths = new Element.CheckboxGroup<'lastSix' | 'moreThanSix'>(this.page, '#drugs_injected_misused_prescribed_drugs', ['lastSix', 'moreThanSix'])
    opiatesInjectedLastSixMonths = new Element.CheckboxGroup<'lastSix' | 'moreThanSix'>(this.page, '#drugs_injected_other_opiates', ['lastSix', 'moreThanSix'])
    steroidsInjectedLastSixMonths = new Element.CheckboxGroup<'lastSix' | 'moreThanSix'>(this.page, '#drugs_injected_steroids', ['lastSix', 'moreThanSix'])
    otherInjectedLastSixMonths = new Element.CheckboxGroup<'lastSix' | 'moreThanSix'>(this.page, '#drugs_injected_other_drug', ['lastSix', 'moreThanSix'])

    treatment = new Element.Radiogroup<'yes' | 'no'>(this.page, '#drugs_is_receiving_treatment', ['yes', 'no'])
    treatmentYesDetails = new Element.Textbox(this.page, '#drugs_is_receiving_treatment_yes_details')
}
