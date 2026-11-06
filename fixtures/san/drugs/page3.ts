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
}
