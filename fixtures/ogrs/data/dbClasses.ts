import { Temporal } from '@js-temporal/polyfill'

import { assignValues, buildQuery } from 'lib/queryBuilder'


/*
ogrs4g_missing_questions
ogp2_missing_count
ogp2_missing_questions
ogrs4v_missing_questions
ovp2_missing_count
ovp2_missing_questions
snsv_missing_questions_static
snsv_missing_count_dynamic
snsv_missing_questions_dynamic
osp_dc_calculated
osp_dc_missing_count
osp_dc_missing_questions
osp_iic_calculated
osp_iic_missing_count
osp_iic_missing_questions
*/

const csrpColumns: Columns = {
    pk: { name: 'offender_rsr_scores_pk', type: 'integer' },
    status: { name: 'rsr_status', type: 'string' },
    dob: { name: 'date_of_birth', type: 'date' },
    gender: { name: 'gender_elm', type: 'string' },
    offence: { name: 'offence_code || offence_subcode', type: 'string' },
    ogrs4gYr2: { name: 'ogrs4g_percentage_2yr', type: 'float' },
    ogrs4gBand: { name: 'ogrs4g_band_risk_recon_elm', type: 'string' },
    ogrs4gCalculated: { name: 'ogrs4g_calculated', type: 'string' },
    ogrs4vYr2: { name: 'ogrs4v_percentage_2yr', type: 'float' },
    ogrs4vBand: { name: 'ogrs4v_band_risk_recon_elm', type: 'string' },
    ogrs4vCalculated: { name: 'ogrs4v_calculated', type: 'string' },
    ogp2Yr2: { name: 'ogp2_percentage_2yr', type: 'float' },
    ogp2Band: { name: 'ogp2_band_risk_recon_elm', type: 'string' },
    ogp2Calculated: { name: 'ogp2_calculated', type: 'string' },
    ovp2Yr2: { name: 'ovp2_percentage_2yr', type: 'float' },
    ovp2Band: { name: 'ovp2_band_risk_recon_elm', type: 'string' },
    ovp2Calculated: { name: 'ovp2_calculated', type: 'string' },
    snsvStaticYr2: { name: 'snsv_percentage_2yr_static', type: 'float' },
    snsvStaticYr2Band: { name: 'snsv_stat_band_risk_recon_elm', type: 'string' },
    snsvStaticCalculated: { name: 'snsv_calculated_static', type: 'string' },
    snsvDynamicYr2: { name: 'snsv_percentage_2yr_dynamic', type: 'float' },
    snsvDynamicYr2Band: { name: 'snsv_dyn_band_risk_recon_elm', type: 'string' },
    snsvDynamicCalculated: { name: 'snsv_calculated_dynamic', type: 'string' },
    s1_32_total_sanctions: { name: 's1_32_total_sanctions', type: 'integer' },
    s1_40_violent_sanctions: { name: 's1_40_violent_sanctions', type: 'integer' },
    s1_34_contact_adult_score: { name: 's1_34_contact_adult_score', type: 'integer' },
    s1_45_dc_child_score: { name: 's1_45_dc_child_score', type: 'integer' },
    s1_46_iic_child_score: { name: 's1_46_iic_child_score', type: 'integer' },
    s1_37_non_contact_score: { name: 's1_37_non_contact_score', type: 'integer' },
    s1_44_dc_stranger_victim: { name: 's1_44_dc_stranger_victim', type: 'string' },
    s1_8_age_at_first_sanction: { name: 's1_8_age_at_first_sanction', type: 'integer' },
    s1_29_date_current_conviction: { name: 's1_29_date_current_conviction', type: 'date' },
    s1_33_date_recent_sex_offence: { name: 's1_33_date_recent_sex_offence', type: 'date' },
    s1_41_current_sexual_mot: { name: 's1_41_current_sexual_mot', type: 'string' },
    s1_43_last_offence_date: { name: 's1_43_last_offence_date', type: 'date' },
    s1_38_community_date: { name: 's1_38_community_date', type: 'date' },
    s1_30_sexual_element: { name: 's1_30_sexual_element', type: 'string' },
    s1_39_offender_interview: { name: 's1_39_offender_interview', type: 'string' },
    s2_2_weapon: { name: 's2_2_weapon', type: 'string' },
    s3_q4_suitable_accom: { name: 's3_q4_suitable_accom', type: 'string' },
    s4_q2_unemployed: { name: 's4_q2_unemployed', type: 'string' },
    s6_q4_partner_relationship: { name: 's6_q4_partner_relationship', type: 'string' },
    s6_q7_dom_abuse: { name: 's6_q7_dom_abuse', type: 'string' },
    s6_q7_perpetrator_partner: { name: 's6_q7_perpetrator_partner', type: 'string' },
    s6_q8_cur_rel_status: { name: 's6_q8_cur_rel_status', type: 'string' },
    s7_q2_reg_activities: { name: 's7_q2_reg_activities', type: 'string' },
    s8_q1_drugs_misused: { name: 's8_q1_drugs_misused', type: 'string' },
    amphetamines_curr_use: { name: 'amphetamines_curr_use', type: 'string' },
    benzodiazepines_curr_use: { name: 'benzodiazepines_curr_use', type: 'string' },
    cannabis_curr_use: { name: 'cannabis_curr_use', type: 'string' },
    crack_cocaine_curr_use: { name: 'crack_cocaine_curr_use', type: 'string' },
    ecstasy_curr_use: { name: 'ecstasy_curr_use', type: 'string' },
    hallucinogens_curr_use: { name: 'hallucinogens_curr_use', type: 'string' },
    heroin_curr_use: { name: 'heroin_curr_use', type: 'string' },
    ketamine_curr_use: { name: 'ketamine_curr_use', type: 'string' },
    methadone_curr_use: { name: 'methadone_curr_use', type: 'string' },
    misused_prescribed_curr_use: { name: 'misused_prescribed_curr_use', type: 'string' },
    other_curr_use: { name: 'other_curr_use', type: 'string' },
    other_opiate_curr_use: { name: 'other_opiate_curr_use', type: 'string' },
    cocaine_hydrochloride_curr_use: { name: 'cocaine_hydrochloride_curr_use', type: 'string' },
    solvents_curr_use: { name: 'solvents_curr_use', type: 'string' },
    spice_curr_use: { name: 'spice_curr_use', type: 'string' },
    steroids_curr_use: { name: 'steroids_curr_use', type: 'string' },
    s8_q8_motiv_drug_misuse: { name: 's8_q8_motiv_drug_misuse', type: 'string' },
    s9_q1_alcohol: { name: 's9_q1_alcohol', type: 'string' },
    s9_q2_binge_drink: { name: 's9_q2_binge_drink', type: 'string' },
    s11_q2_impulsivity: { name: 's11_q2_impulsivity', type: 'string' },
    s11_q4_temper_control: { name: 's11_q4_temper_control', type: 'string' },
    s12_q1_pro_criminal: { name: 's12_q1_pro_criminal', type: 'string' },
    r1_2_past_aggr_burglary: { name: 'r1_2_past_aggr_burglary', type: 'string' },
    r1_2_past_arson: { name: 'r1_2_past_arson', type: 'string' },
    r1_2_past_cd_life: { name: 'r1_2_past_cd_life', type: 'string' },
    r1_2_past_firearm: { name: 'r1_2_past_firearm', type: 'string' },
    r1_2_past_wounding_gbh: { name: 'r1_2_past_wounding_gbh', type: 'string' },
    r1_2_past_murder: { name: 'r1_2_past_murder', type: 'string' },
    r1_2_past_kidnapping: { name: 'r1_2_past_kidnapping', type: 'string' },
    r1_2_past_robbery: { name: 'r1_2_past_robbery', type: 'string' },
    r1_2_past_weapon: { name: 'r1_2_past_weapon', type: 'string' },
    prisonInd: { name: 'prison_ind', type: 'string' },
}

export class OgrsRsr {

    pk: number
    status: string
    dob: Temporal.PlainDate
    gender: string
    offence: string

    ogrs4gYr2: number
    ogrs4gBand: string
    ogrs4gCalculated: string
    ogrs4vYr2: number
    ogrs4vBand: string
    ogrs4vCalculated: string
    ogp2Yr2: number
    ogp2Band: string
    ogp2Calculated: string
    ovp2Yr2: number
    ovp2Band: string
    ovp2Calculated: string
    snsvStaticYr2: number
    snsvStaticYr2Band: string
    snsvStaticCalculated: string
    snsvDynamicYr2: number
    snsvDynamicYr2Band: string
    snsvDynamicCalculated: string

    s1_32_total_sanctions: number
    s1_40_violent_sanctions: number
    s1_34_contact_adult_score: number
    s1_45_dc_child_score: number
    s1_46_iic_child_score: number
    s1_37_non_contact_score: number
    s1_44_dc_stranger_victim: string
    s1_8_age_at_first_sanction: number
    s1_29_date_current_conviction: Temporal.PlainDate
    s1_33_date_recent_sex_offence: Temporal.PlainDate
    s1_41_current_sexual_mot: string
    s1_43_last_offence_date: Temporal.PlainDate
    s1_38_community_date: Temporal.PlainDate
    s1_30_sexual_element: string
    s1_39_offender_interview: string
    s2_2_weapon: string
    s3_q4_suitable_accom: string
    s4_q2_unemployed: string
    s6_q4_partner_relationship: string
    s6_q7_dom_abuse: string
    s6_q7_perpetrator_partner: string
    s6_q8_cur_rel_status: string
    s7_q2_reg_activities: string
    s8_q1_drugs_misused: string
    amphetamines_curr_use: string
    benzodiazepines_curr_use: string
    cannabis_curr_use: string
    crack_cocaine_curr_use: string
    ecstasy_curr_use: string
    hallucinogens_curr_use: string
    heroin_curr_use: string
    ketamine_curr_use: string
    methadone_curr_use: string
    misused_prescribed_curr_use: string
    other_curr_use: string
    other_opiate_curr_use: string
    cocaine_hydrochloride_curr_use: string
    solvents_curr_use: string
    spice_curr_use: string
    steroids_curr_use: string
    s8_q8_motiv_drug_misuse: string
    s9_q1_alcohol: string
    s9_q2_binge_drink: string
    s11_q2_impulsivity: string
    s11_q4_temper_control: string
    s12_q1_pro_criminal: string
    r1_2_past_aggr_burglary: string
    r1_2_past_arson: string
    r1_2_past_cd_life: string
    r1_2_past_firearm: string
    r1_2_past_wounding_gbh: string
    r1_2_past_murder: string
    r1_2_past_kidnapping: string
    r1_2_past_robbery: string
    r1_2_past_weapon: string
    prisonInd: string

    constructor(rsrData: string[]) {

        assignValues(this, csrpColumns, rsrData, 0, true)
    }

    static query(rows: number, whereClause: string): string {

        return buildQuery(csrpColumns, ['offender_rsr_scores'], whereClause, `offender_rsr_scores.initiation_date desc fetch first ${rows} rows only`)
    }
}

export class OgrsAssessment {

    pk: number
    type: string
    version: number
    status: string
    initiationDate: Temporal.PlainDateTime
    signedDate: Temporal.PlainDate
    dob: Temporal.PlainDate
    gender: string
    prisonInd: string

    ogrs4gYr2: number
    ogrs4gBand: string
    ogrs4gCalculated: string
    ogrs4vYr2: number
    ogrs4vBand: string
    ogrs4vCalculated: string
    ogp2Yr2: number
    ogp2Band: string
    ogp2Calculated: string
    ovp2Yr2: number
    ovp2Band: string
    ovp2Calculated: string
    snsvStaticYr2: number
    snsvStaticYr2Band: string
    snsvStaticCalculated: string
    snsvDynamicYr2: number
    snsvDynamicYr2Band: string
    snsvDynamicCalculated: string

    offence: string
    qaData: { [key: string]: any }

    constructor(assessmentData: string[]) {

        let i = 0
        this.pk = utils.stringToInt(assessmentData[i++])
        this.type = assessmentData[i++]
        this.version = utils.stringToInt(assessmentData[i++])
        this.status = assessmentData[i++]
        this.initiationDate = oasysDateTime.stringToTimestamp(assessmentData[i++])
        this.signedDate = oasysDateTime.stringToDate(assessmentData[i++])
        this.dob = oasysDateTime.stringToDate(assessmentData[i++])
        this.gender = assessmentData[i++]
        this.prisonInd = assessmentData[i++]

        this.ogrs4gYr2 = utils.stringToFloat(assessmentData[i++])
        this.ogrs4gBand = assessmentData[i++]
        this.ogrs4gCalculated = assessmentData[i++]
        this.ogrs4vYr2 = utils.stringToFloat(assessmentData[i++])
        this.ogrs4vBand = assessmentData[i++]
        this.ogrs4vCalculated = assessmentData[i++]
        this.ogp2Yr2 = utils.stringToFloat(assessmentData[i++])
        this.ogp2Band = assessmentData[i++]
        this.ogp2Calculated = assessmentData[i++]
        this.ovp2Yr2 = utils.stringToFloat(assessmentData[i++])
        this.ovp2Band = assessmentData[i++]
        this.ovp2Calculated = assessmentData[i++]
        this.snsvStaticYr2 = utils.stringToFloat(assessmentData[i++])
        this.snsvStaticYr2Band = assessmentData[i++]
        this.snsvStaticCalculated = assessmentData[i++]
        this.snsvDynamicYr2 = utils.stringToFloat(assessmentData[i++])
        this.snsvDynamicYr2Band = assessmentData[i++]
        this.snsvDynamicCalculated = assessmentData[i++]
    }

    static query(rows: number, whereClause: string): string {

        return `select oasys_set_pk, assessment_type_elm, version_number, assessment_status_elm, 
                        to_char(initiation_date, '${oasysDateTime.oracleTimestampFormat}'), to_char(assessor_signed_date, '${oasysDateTime.dateFormat}'),
                        to_char(date_of_birth, '${oasysDateTime.dateFormat}'), gender_elm, prison_ind,
                        ogrs4g_percentage_2yr, ogrs4g_band_risk_recon_elm, ogrs4g_calculated, 
                        ogrs4v_percentage_2yr, ogrs4v_band_risk_recon_elm, ogrs4v_calculated, 
                        ogp2_percentage_2yr, ogp2_band_risk_recon_elm, ogp2_calculated, 
                        ovp2_percentage_2yr, ovp2_band_risk_recon_elm, ovp2_calculated, 
                        snsv_percentage_2yr_static, snsv_stat_band_risk_recon_elm, snsv_calculated_static, 
                        snsv_percentage_2yr_dynamic, snsv_dyn_band_risk_recon_elm, snsv_calculated_dynamic
                    from eor.oasys_set 
                    where ${whereClause}
                    order by create_date desc fetch first ${rows} rows only`
    }

    static offenceQuery(assessmentPk: number | string): string {

        return `select p.offence_group_code || p.sub_code 
                    from eor.offence_block o, eor.ct_offence_pivot p
                    where o.oasys_set_pk = ${assessmentPk} and o.offence_block_type_elm = 'CURRENT'
                    and p.offence_block_pk = o.offence_block_pk and p.additional_offence_ind = 'N'`
    }

    static qaQuery(assessmentPk: number | string): string {

        return `SELECT REF_QUESTION_CODE, ANSWER
                    FROM
                    (
                    SELECT OQ.REF_QUESTION_CODE, DECODE(OQ.FREE_FORMAT_ANSWER,null,OA.REF_ANSWER_CODE,OQ.FREE_FORMAT_ANSWER) ANSWER
                    FROM EOR.OASYS_SET OS
                    LEFT OUTER JOIN EOR.OASYS_SECTION OSEC
                    ON OSEC.OASYS_SET_PK = OS.OASYS_SET_PK
                    LEFT OUTER JOIN EOR.OASYS_QUESTION OQ
                    ON OQ.OASYS_SECTION_PK = OSEC.OASYS_SECTION_PK
                    LEFT OUTER JOIN EOR.OASYS_ANSWER OA
                    ON OA.OASYS_QUESTION_PK = OQ.OASYS_QUESTION_PK
                    WHERE OS.OASYS_SET_PK = ${assessmentPk}
                    AND OQ.CURRENTLY_HIDDEN_IND = 'N'
                    AND OQ.REF_QUESTION_CODE IN ('1.39','1.32','1.40','1.34','1.45','1.46','1.37','1.44','1.8','1.29','1.33','1.38','1.41','1.43','1.30',
                                                '2.2_V2_WEAPON', '2.2',
                                                '3.4',
                                                '4.2',
                                                '6.4','6.7da','6.7.2.1da','6.7','6.7.1','6.8',
                                                '7.2',
                                                '8.1','8.2.8.1','8.2.7.1','8.2.11.1','8.2.4.1','8.2.10.1','8.2.9.1','8.2.1.1','8.2.16.1','8.2.2.1',
                                                '8.2.6.1','8.2.3.1','8.2.5.1','8.2.12.1','8.2.15.1','8.2.13.1','8.2.14.1',
                                                '8.8',
                                                '9.1','9.2',
                                                '11.2','11.4',
                                                '12.1',
                                                'R1.2.6.2_V2','R1.2.7.2_V2','R1.2.8.2_V2','R1.2.10.2_V2','R1.2.2.2_V2','R1.2.1.2_V2','R1.2.9.2_V2',
                                                'R1.2.12.2_V2','R1.2.13.2_V2' )
                    ) `
    }
}
