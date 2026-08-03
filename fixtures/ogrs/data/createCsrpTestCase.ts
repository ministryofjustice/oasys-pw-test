import { OgrsInputParams } from 'fixtures/ogrs/types'
import { OgrsRsr as OgrsCsrp } from './dbClasses'
import { addCalculatedInputParameters, q88 } from './common'

export function createCsrpInputParams(csrp: OgrsCsrp): OgrsInputParams {

    const p: OgrsInputParams = {
        ASSESSMENT_DATE: oasysDateTime.testStartDate,
        STATIC_CALC: csrp.s1_39_offender_interview == 'YES' ? 'N' : 'Y',
        DOB: csrp.dob,
        GENDER: lookupValue(csrp.gender, utils.genderNumberLookup),
        OFFENCE_CODE: csrp.offence,
        TOTAL_SANCTIONS_COUNT: csrp.s1_32_total_sanctions,
        TOTAL_VIOLENT_SANCTIONS: csrp.s1_40_violent_sanctions,
        CONTACT_ADULT_SANCTIONS: csrp.s1_34_contact_adult_score,
        CONTACT_CHILD_SANCTIONS: csrp.s1_45_dc_child_score,
        INDECENT_IMAGE_SANCTIONS: csrp.s1_46_iic_child_score,
        PARAPHILIA_SANCTIONS: csrp.s1_37_non_contact_score,
        STRANGER_VICTIM: csrp.s1_44_dc_stranger_victim,
        AGE_AT_FIRST_SANCTION: csrp.s1_8_age_at_first_sanction,
        LAST_SANCTION_DATE: csrp.s1_29_date_current_conviction,
        DATE_RECENT_SEXUAL_OFFENCE: csrp.s1_33_date_recent_sex_offence,
        CURR_SEX_OFF_MOTIVATION: csrp.s1_41_current_sexual_mot,
        MOST_RECENT_OFFENCE: csrp.s1_43_last_offence_date,
        COMMUNITY_DATE: csrp.prisonInd == 'C'
            ? oasysDateTime.testStartDate
            : csrp.s1_38_community_date,
        ONE_POINT_THIRTY: lookupValue(csrp.s1_30_sexual_element, utils.yesNoToYNLookup),
        TWO_POINT_TWO: getNumericAnswer(csrp.s2_2_weapon),
        THREE_POINT_FOUR: getNumericAnswer(csrp.s3_q4_suitable_accom),
        FOUR_POINT_TWO: getNumericAnswer(csrp.s4_q2_unemployed),
        SIX_POINT_FOUR: getNumericAnswer(csrp.s6_q4_partner_relationship),
        SIX_POINT_SEVEN: da(csrp),
        SIX_POINT_EIGHT: getNumericAnswer(csrp.s6_q8_cur_rel_status),
        SEVEN_POINT_TWO: getNumericAnswer(csrp.s7_q2_reg_activities),
        DAILY_DRUG_USER: dailyDrugUser(csrp),
        AMPHETAMINES: drugUsed(csrp.amphetamines_curr_use),
        BENZODIAZIPINES: drugUsed(csrp.benzodiazepines_curr_use),
        CANNABIS: drugUsed(csrp.cannabis_curr_use),
        CRACK_COCAINE: drugUsed(csrp.crack_cocaine_curr_use),
        ECSTASY: drugUsed(csrp.ecstasy_curr_use),
        HALLUCINOGENS: drugUsed(csrp.hallucinogens_curr_use),
        HEROIN: drugUsed(csrp.heroin_curr_use),
        KETAMINE: drugUsed(csrp.ketamine_curr_use),
        METHADONE: drugUsed(csrp.methadone_curr_use),
        MISUSED_PRESCRIBED: drugUsed(csrp.misused_prescribed_curr_use),
        OTHER_DRUGS: drugUsed(csrp.other_curr_use),
        OTHER_OPIATE: drugUsed(csrp.other_opiate_curr_use),
        POWDER_COCAINE: drugUsed(csrp.cocaine_hydrochloride_curr_use),
        SOLVENTS: drugUsed(csrp.solvents_curr_use),
        SPICE: drugUsed(csrp.spice_curr_use),
        STEROIDS: drugUsed(csrp.steroids_curr_use),
        EIGHT_POINT_EIGHT: q88(csrp.s8_q1_drugs_misused, getNumericAnswer(csrp.s8_q8_motiv_drug_misuse)),
        NINE_POINT_ONE: getNumericAnswer(csrp.s9_q1_alcohol),
        NINE_POINT_TWO: getNumericAnswer(csrp.s9_q2_binge_drink),
        ELEVEN_POINT_TWO: getNumericAnswer(csrp.s11_q2_impulsivity),
        ELEVEN_POINT_FOUR: getNumericAnswer(csrp.s11_q4_temper_control),
        TWELVE_POINT_ONE: getNumericAnswer(csrp.s12_q1_pro_criminal),
        OGRS4G_ALGO_VERSION: 1,
        OGRS4V_ALGO_VERSION: 1,
        OGP2_ALGO_VERSION: 1,
        OVP2_ALGO_VERSION: 1,
        OSP_ALGO_VERSION: 6,
        SNSV_ALGO_VERSION: 1,
        AGGRAVATED_BURGLARY: getNumericAnswer(csrp.r1_2_past_aggr_burglary),
        ARSON: getNumericAnswer(csrp.r1_2_past_arson),
        CRIMINAL_DAMAGE_LIFE: getNumericAnswer(csrp.r1_2_past_cd_life),
        FIREARMS: getNumericAnswer(csrp.r1_2_past_firearm),
        GBH: getNumericAnswer(csrp.r1_2_past_wounding_gbh),
        HOMICIDE: getNumericAnswer(csrp.r1_2_past_murder),
        KIDNAP: getNumericAnswer(csrp.r1_2_past_kidnapping),
        ROBBERY: getNumericAnswer(csrp.r1_2_past_robbery),
        WEAPONS_NOT_FIREARMS: getNumericAnswer(csrp.r1_2_past_weapon),
        CUSTODY_IND: csrp.prisonInd == 'C' ? 'Y' : 'N',
    }

    addCalculatedInputParameters(p)
    return p
}

function getNumericAnswer(value: string): number {

    return !value ? null : value == 'YES' ? 1 : value == 'NO' || value == 'NA' ? 0 : value == 'M' ? null : Number.parseInt(value)
}

function da(rsr: OgrsCsrp): number {

    const q67 = getNumericAnswer(rsr.s6_q7_dom_abuse)
    return q67 == 1 ? getNumericAnswer(rsr.s6_q7_perpetrator_partner) : q67
}

function lookupValue(value: string, lookup: { [key: string]: string }): string {

    const result = lookup[value]
    return result == undefined ? value : result
}

function drugUsed(drugUse: string) {

    return drugUse == null ? null : 'Y'
}

function dailyDrugUser(csrp: OgrsCsrp) {

    if (csrp.s8_q1_drugs_misused != 'YES') {
        return csrp.s8_q1_drugs_misused == 'NO' ? 'N' : null
    }
    return (
        csrp.amphetamines_curr_use == '100' ||
        csrp.benzodiazepines_curr_use == '100' ||
        csrp.cannabis_curr_use == '100' ||
        csrp.crack_cocaine_curr_use == '100' ||
        csrp.ecstasy_curr_use == '100' ||
        csrp.hallucinogens_curr_use == '100' ||
        csrp.heroin_curr_use == '100' ||
        csrp.ketamine_curr_use == '100' ||
        csrp.methadone_curr_use == '100' ||
        csrp.misused_prescribed_curr_use == '100' ||
        csrp.other_curr_use == '100' ||
        csrp.other_opiate_curr_use == '100' ||
        csrp.cocaine_hydrochloride_curr_use == '100' ||
        csrp.solvents_curr_use == '100' ||
        csrp.spice_curr_use == '100' ||
        csrp.steroids_curr_use == '100'
    ) ? 'Y' : 'N'
}