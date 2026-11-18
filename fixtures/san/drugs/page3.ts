import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { drugsWhenUsedOptions } from './drugs'

export class Page3 extends BaseSanEditPage {

    amphetaminesWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_amphetamines', drugsWhenUsedOptions)
    benzodiazepinesWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_benzodiazepines', drugsWhenUsedOptions)
    cannabisWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_cannabis', drugsWhenUsedOptions)
    cocaineWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_cocaine', drugsWhenUsedOptions)
    crackWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_crack', drugsWhenUsedOptions)
    ecstasyWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_ecstasy', drugsWhenUsedOptions)
    hallucinogenicsWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_hallucinogenics', drugsWhenUsedOptions)
    heroinWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_heroin', drugsWhenUsedOptions)
    ketamineWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_ketamine', drugsWhenUsedOptions)
    mephedroneWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_mephedrone', drugsWhenUsedOptions)
    methadoneWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_methadone_not_prescribed', drugsWhenUsedOptions)
    prescribedWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_misused_prescribed_drugs', drugsWhenUsedOptions)
    opiatesWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_other_opiates', drugsWhenUsedOptions)
    solventsWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_solvents', drugsWhenUsedOptions)
    spiceWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_spice', drugsWhenUsedOptions)
    steroidsWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_steroids', drugsWhenUsedOptions)
    otherWhenUsed = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#drug_last_used_other_drug', drugsWhenUsedOptions)
    otherDrugName = new Element.Textbox(this.page, '#other_drug_name')

    amphetaminesWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_amphetamines', drugsWhenUsedOptions)
    benzodiazepinesWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_benzodiazepines', drugsWhenUsedOptions)
    cannabisWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_cannabis', drugsWhenUsedOptions)
    cocaineWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_cocaine', drugsWhenUsedOptions)
    crackWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_crack', drugsWhenUsedOptions)
    ecstasyWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_ecstasy', drugsWhenUsedOptions)
    hallucinogenicsWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_hallucinogenics', drugsWhenUsedOptions)
    heroinWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_heroin', drugsWhenUsedOptions)
    ketamineWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_ketamine', drugsWhenUsedOptions)
    mephedroneWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_mephedrone', drugsWhenUsedOptions)
    methadoneWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_methadone_not_prescribed', drugsWhenUsedOptions)
    prescribedWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_misused_prescribed_drugs', drugsWhenUsedOptions)
    opiatesWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_other_opiates', drugsWhenUsedOptions)
    solventsWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_solvents', drugsWhenUsedOptions)
    spiceWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_spice', drugsWhenUsedOptions)
    steroidsWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_steroids', drugsWhenUsedOptions)
    otherWhenUsedBeforeCustody = new Element.Radiogroup<DrugsWhenUsed>(this.page, '#custody_drug_last_used_other_drug', drugsWhenUsedOptions)
    otherDrugNameBeforeCustody = new Element.Textbox(this.page, '#custody_other_drug_name')
}
