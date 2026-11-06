import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'

const drugsFrequencyOptions: DrugsFrequency[] = ['daily', 'weekly', 'monthly', 'occasionally']

export class Page4 extends BaseSanEditPage {

    amphetaminesFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_amphetamines', drugsFrequencyOptions)
    benzodiazepinesFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_benzodiazepines', drugsFrequencyOptions)
    cannabisFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_cannabis', drugsFrequencyOptions)
    cocaineFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_cocaine', drugsFrequencyOptions)
    crackFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_crack', drugsFrequencyOptions)
    ecstasyFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_ecstasy', drugsFrequencyOptions)
    hallucinogenicsFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_hallucinogenics', drugsFrequencyOptions)
    heroinFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_heroin', drugsFrequencyOptions)
    ketamineFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_ketamine', drugsFrequencyOptions)
    mephedroneFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_mephedrone', drugsFrequencyOptions)
    methadoneFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_methadone_not_prescribed', drugsFrequencyOptions)
    prescribedFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_misused_prescribed_drugs', drugsFrequencyOptions)
    opiatesFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_other_opiates', drugsFrequencyOptions)
    solventsFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_solvents', drugsFrequencyOptions)
    steroidsFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_steroids', drugsFrequencyOptions)
    spiceFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_spice', drugsFrequencyOptions)
    otherFrequency = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_used_in_the_last_six_months_other_drug', drugsFrequencyOptions)

    amphetaminesFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_amphetamines', drugsFrequencyOptions)
    benzodiazepinesFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_benzodiazepines', drugsFrequencyOptions)
    cannabisFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_cannabis', drugsFrequencyOptions)
    cocaineFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_cocaine', drugsFrequencyOptions)
    crackFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_crack', drugsFrequencyOptions)
    ecstasyFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_ecstasy', drugsFrequencyOptions)
    hallucinogenicsFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_hallucinogenics', drugsFrequencyOptions)
    heroinFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_heroin', drugsFrequencyOptions)
    ketamineFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_ketamine', drugsFrequencyOptions)
    mephedroneFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_mephedrone', drugsFrequencyOptions)
    methadoneFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_methadone_not_prescribed', drugsFrequencyOptions)
    prescribedFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_misused_prescribed_drugs', drugsFrequencyOptions)
    opiatesFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_other_opiates', drugsFrequencyOptions)
    solventsFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_solvents', drugsFrequencyOptions)
    steroidsFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_steroids', drugsFrequencyOptions)
    spiceFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_spice', drugsFrequencyOptions)
    otherFrequencyPast = new Element.Radiogroup<DrugsFrequency>(this.page, '#how_often_not_used_in_the_last_six_months_other_drug', drugsFrequencyOptions)

}
