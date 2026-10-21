import { OgrsInputParams } from '../types'

export function ogrsFunctionCall(params: OgrsInputParams): string {

    let result: string[] = []

    result.push(`eor.new_gen_predictors_pkg.get_ogrs4(${oasysDateTime.dateParameterToString(params.ASSESSMENT_DATE)}`)
    result.push(utils.stringParameterToString(params.STATIC_CALC))
    result.push(oasysDateTime.dateParameterToString(params.DOB))
    result.push(utils.stringParameterToString(params.GENDER))
    result.push(utils.stringParameterToString(params.OFFENCE_CODE))
    result.push(utils.numericParameterToString(params.TOTAL_SANCTIONS_COUNT))
    result.push(utils.numericParameterToString(params.TOTAL_VIOLENT_SANCTIONS))
    result.push(utils.numericParameterToString(params.CONTACT_ADULT_SANCTIONS))
    result.push(utils.numericParameterToString(params.CONTACT_CHILD_SANCTIONS))
    result.push(utils.numericParameterToString(params.INDECENT_IMAGE_SANCTIONS))
    result.push(utils.numericParameterToString(params.PARAPHILIA_SANCTIONS))
    result.push(utils.stringParameterToString(params.STRANGER_VICTIM))
    result.push(utils.numericParameterToString(params.AGE_AT_FIRST_SANCTION))
    result.push(oasysDateTime.dateParameterToString(params.LAST_SANCTION_DATE))
    result.push(oasysDateTime.dateParameterToString(params.DATE_RECENT_SEXUAL_OFFENCE))
    result.push(utils.stringParameterToString(params.CURR_SEX_OFF_MOTIVATION))
    result.push(oasysDateTime.dateParameterToString(params.MOST_RECENT_OFFENCE))
    result.push(oasysDateTime.dateParameterToString(params.COMMUNITY_DATE))
    result.push(utils.stringParameterToString(params.ONE_POINT_THIRTY))
    result.push(utils.numericParameterToString(params.TWO_POINT_TWO))
    result.push(utils.numericParameterToString(params.THREE_POINT_FOUR))
    result.push(utils.numericParameterToString(params.FOUR_POINT_TWO))
    result.push(utils.numericParameterToString(params.SIX_POINT_FOUR))
    result.push(utils.numericParameterToString(params.SIX_POINT_SEVEN))
    result.push(utils.numericParameterToString(params.SIX_POINT_EIGHT))
    result.push(utils.numericParameterToString(params.SEVEN_POINT_TWO))
    result.push(utils.stringParameterToString(params.DAILY_DRUG_USER))
    result.push(utils.stringParameterToString(params.AMPHETAMINES))
    result.push(utils.stringParameterToString(params.BENZODIAZIPINES))
    result.push(utils.stringParameterToString(params.CANNABIS))
    result.push(utils.stringParameterToString(params.CRACK_COCAINE))
    result.push(utils.stringParameterToString(params.ECSTASY))
    result.push(utils.stringParameterToString(params.HALLUCINOGENS))
    result.push(utils.stringParameterToString(params.HEROIN))
    result.push(utils.stringParameterToString(params.KETAMINE))
    result.push(utils.stringParameterToString(params.MEPHEDRONE))
    result.push(utils.stringParameterToString(params.METHADONE))
    result.push(utils.stringParameterToString(params.MISUSED_PRESCRIBED))
    result.push(utils.stringParameterToString(params.OTHER_DRUGS))
    result.push(utils.stringParameterToString(params.OTHER_OPIATE))
    result.push(utils.stringParameterToString(params.POWDER_COCAINE))
    result.push(utils.stringParameterToString(params.SOLVENTS))
    result.push(utils.stringParameterToString(params.SPICE))
    result.push(utils.stringParameterToString(params.STEROIDS))
    result.push(utils.numericParameterToString(params.EIGHT_POINT_EIGHT))
    result.push(utils.numericParameterToString(params.NINE_POINT_ONE))
    result.push(utils.numericParameterToString(params.NINE_POINT_TWO))
    result.push(utils.numericParameterToString(params.ELEVEN_POINT_TWO))
    result.push(utils.numericParameterToString(params.ELEVEN_POINT_FOUR))
    result.push(utils.numericParameterToString(params.TWELVE_POINT_ONE))
    result.push(utils.numericParameterToString(params.OGRS4G_ALGO_VERSION))
    result.push(utils.numericParameterToString(params.OGRS4V_ALGO_VERSION))
    result.push(utils.numericParameterToString(params.OGP2_ALGO_VERSION))
    result.push(utils.numericParameterToString(params.OVP2_ALGO_VERSION))
    result.push(utils.numericParameterToString(params.OSP_ALGO_VERSION))
    result.push(utils.numericParameterToString(params.SNSV_ALGO_VERSION))
    result.push(utils.numericParameterToString(params.AGGRAVATED_BURGLARY))
    result.push(utils.numericParameterToString(params.ARSON))
    result.push(utils.numericParameterToString(params.CRIMINAL_DAMAGE_LIFE))
    result.push(utils.numericParameterToString(params.FIREARMS))
    result.push(utils.numericParameterToString(params.GBH))
    result.push(utils.numericParameterToString(params.HOMICIDE))
    result.push(utils.numericParameterToString(params.KIDNAP))
    result.push(utils.numericParameterToString(params.ROBBERY))
    result.push(utils.numericParameterToString(params.WEAPONS_NOT_FIREARMS))
    result.push(`${utils.stringParameterToString(params.CUSTODY_IND)})`)

    return createCallString(result.join(','))
}

function createCallString(query: string): string {

    return `
            DECLARE result eor.ogrs4_output_typ;
            BEGIN
                result := ${query};
                :ret := 
                    '''' || result.ASSESSMENT_DATE || '''|' ||
                    result.OGRS4G_CALCULATED || '|' ||
                    result.OGRS4G_YEAR_TWO || '|' ||
                    result.OGRS4G_AAEAD || '|' ||
                    result.OGRS4G_FEMALE || '|' ||
                    result.OGRS4G_OFFENCE || '|' ||
                    result.OGRS4G_FIRST_SANCTION || '|' ||
                    result.OGRS4G_SECOND_SANCTION || '|' ||
                    result.OGRS4G_TOTAL_SANCTIONS || '|' ||
                    result.OGRS4G_SECOND_SANCTION_GAP || '|' ||
                    result.OGRS4G_OFM || '|' ||
                    result.OGRS4G_COPASG || '|' ||
                    result.OGRS4G_COPASG_SQUARED || '|' ||
                    result.OGRS4G_SCORE || '|' ||
                    result.OGRS4G_PERCENTAGE || '|' ||
                    result.OGRS4G_BAND || '|' ||
                    '''' || result.OGRS4G_MISSING_QUESTIONS || '''|' ||
                    result.OGRS4G_MISSING_COUNT || '|' ||
                    result.OGRS4V_CALCULATED || '|' ||
                    result.OGRS4V_YEAR_TWO || '|' ||
                    result.OGRS4V_AAEAD || '|' ||
                    result.OGRS4V_FEMALE || '|' ||
                    result.OGRS4V_OFFENCE || '|' ||
                    result.OGRS4V_FIRST_SANCTION || '|' ||
                    result.OGRS4V_SECOND_SANCTION || '|' ||
                    result.OGRS4V_TOTAL_SANCTIONS || '|' ||
                    result.OGRS4V_SECOND_SANCTION_GAP || '|' ||
                    result.OGRS4V_OFM || '|' ||
                    result.OGRS4V_COPASV || '|' ||
                    result.OGRS4V_NEVER_VIOLENT || '|' ||
                    result.OGRS4V_ONCE_VIOLENT || '|' ||
                    result.OGRS4V_TOT_VIOLENT_SANCTIONS || '|' ||
                    result.OGRS4V_COPAS_VIOLENT || '|' ||
                    result.OGRS4V_SCORE || '|' ||
                    result.OGRS4V_PERCENTAGE || '|' ||
                    result.OGRS4V_BAND || '|' ||
                    '''' || result.OGRS4V_MISSING_QUESTIONS || '''|' ||
                    result.OGRS4V_MISSING_COUNT || '|' ||
                    result.SNSV_CALCULATED_STATIC || '|' ||
                    result.SNSV_YEAR_TWO_STATIC || '|' ||
                    result.SNSV_AAEAD_STATIC || '|' ||
                    result.SNSV_FEMALE_STATIC || '|' ||
                    result.SNSV_OFFENCE_STATIC || '|' ||
                    result.SNSV_FIRST_SANCTION_STATIC || '|' ||
                    result.SNSV_SECOND_SANCTION_STATIC || '|' ||
                    result.SNSV_TOTAL_SANCTIONS_STATIC || '|' ||
                    result.SNSV_SECOND_SANC_GAP_STATIC || '|' ||
                    result.SNSV_OFM_STATIC || '|' ||
                    result.SNSV_COPASV_STATIC || '|' ||
                    result.SNSV_NEVER_VIOLENT_STATIC || '|' ||
                    result.SNSV_ONCE_VIOLENT_STATIC || '|' ||
                    result.SNSV_TOT_VIOLENT_SANC_STATIC || '|' ||
                    result.SNSV_COPAS_VIOLENT_STATIC || '|' ||
                    result.SNSV_SCORE_STATIC || '|' ||
                    result.SNSV_PERCENTAGE_STATIC || '|' ||
                    result.SNSV_BAND_STATIC || '|' ||
                    '''' || result.SNSV_MISSING_QUESTIONS_STATIC || '''|' ||
                    result.SNSV_MISSING_COUNT_STATIC || '|' ||
                    result.OGP2_CALCULATED || '|' ||
                    result.OGP2_YEAR_TWO || '|' ||
                    result.OGP2_AAEAD || '|' ||
                    result.OGP2_FEMALE || '|' ||
                    result.OGP2_OFFENCE || '|' ||
                    result.OGP2_FIRST_SANCTION || '|' ||
                    result.OGP2_SECOND_SANCTION || '|' ||
                    result.OGP2_TOTAL_SANCTIONS || '|' ||
                    result.OGP2_SECOND_SANCTION_GAP || '|' ||
                    result.OGP2_OFM || '|' ||
                    result.OGP2_COPASG || '|' ||
                    result.OGP2_COPASG_SQUARED || '|' ||
                    result.OGP2_SUITABLE_ACC || '|' ||
                    result.OGP2_UNEMPLOYED || '|' ||
                    result.OGP2_LIVE_IN_RELATIONSHIP || '|' ||
                    result.OGP2_RELATIONSHIP || '|' ||
                    result.OGP2_MULTIPLIC_RELATIONSHIP || '|' ||
                    result.OGP2_DV || '|' ||
                    result.OGP2_REGULAR_ACTIVITIES || '|' ||
                    result.OGP2_DAILY_DRUG_USER || '|' ||
                    result.OGP2_DRUG_MOTIVATION || '|' ||
                    result.OGP2_CHRONIC_DRINKER || '|' ||
                    result.OGP2_BINGE_DRINKER || '|' ||
                    result.OGP2_IMPULSIVE || '|' ||
                    result.OGP2_CRIMINAL_ATTITUDE || '|' ||
                    result.OGP2_HEROIN || '|' ||
                    result.OGP2_METHADONE || '|' ||
                    result.OGP2_OTHER_OPIATE || '|' ||
                    result.OGP2_CRACK || '|' ||
                    result.OGP2_COCAINE || '|' ||
                    result.OGP2_MISUSE_PRESCRIBED || '|' ||
                    result.OGP2_BENZODIAZEPINES || '|' ||
                    result.OGP2_AMPHETAMINES || '|' ||
                    result.OGP2_ECSTASY || '|' ||
                    result.OGP2_CANNABIS || '|' ||
                    result.OGP2_STEROIDS || '|' ||
                    result.OGP2_OTHER_DRUGS || '|' ||
                    result.OGP2_TOTAL_SCORE || '|' ||
                    result.OGP2_PERCENTAGE || '|' ||
                    result.OGP2_BAND || '|' ||
                    '''' || result.OGP2_MISSING_QUESTIONS || '''|' ||
                    result.OGP2_MISSING_COUNT || '|' ||
                    result.OVP2_CALCULATED || '|' ||
                    result.OVP2_YEAR_TWO || '|' ||
                    result.OVP2_AAEAD || '|' ||
                    result.OVP2_FEMALE || '|' ||
                    result.OVP2_OFFENCE || '|' ||
                    result.OVP2_FIRST_SANCTION || '|' ||
                    result.OVP2_SECOND_SANCTION || '|' ||
                    result.OVP2_TOTAL_SANCTIONS || '|' ||
                    result.OVP2_SECOND_SANCTION_GAP || '|' ||
                    result.OVP2_OFM || '|' ||
                    result.OVP2_COPASV || '|' ||
                    result.OVP2_NEVER_VIOLENT || '|' ||
                    result.OVP2_ONCE_VIOLENT || '|' ||
                    result.OVP2_TOTAL_VIOLENT_SANCTIONS || '|' ||
                    result.OVP2_COPAS_VIOLENT || '|' ||
                    result.OVP2_SUITABLE_ACC || '|' ||
                    result.OVP2_UNEMPLOYED || '|' ||
                    result.OVP2_RELATIONSHIP || '|' ||
                    result.OVP2_LIVE_IN_RELATIONSHIP || '|' ||
                    result.OVP2_MULTIPLIC_RELATIONSHIP || '|' ||
                    result.OVP2_DV || '|' ||
                    result.OVP2_REGULAR_ACTIVITIES || '|' ||
                    result.OVP2_DRUG_MOTIVATION || '|' ||
                    result.OVP2_CHRONIC_DRINKER || '|' ||
                    result.OVP2_BINGE_DRINKER || '|' ||
                    result.OVP2_IMPULSIVE || '|' ||
                    result.OVP2_TEMPER || '|' ||
                    result.OVP2_CRIMINAL_ATTITUDE || '|' ||
                    result.OVP2_HEROIN || '|' ||
                    result.OVP2_CRACK || '|' ||
                    result.OVP2_COCAINE || '|' ||
                    result.OVP2_MISUSE_PRESCRIBED || '|' ||
                    result.OVP2_BENZODIAZEPINES || '|' ||
                    result.OVP2_AMPHETAMINES || '|' ||
                    result.OVP2_ECSTASY || '|' ||
                    result.OVP2_CANNABIS || '|' ||
                    result.OVP2_OTHER_OPIATE || '|' ||
                    result.OVP2_OTHER_DRUG || '|' ||
                    result.OVP2_METHADONE || '|' ||
                    result.OVP2_STEROIDS || '|' ||
                    result.OVP2_TOTAL_SCORE || '|' ||
                    result.OVP2_PERCENTAGE || '|' ||
                    result.OVP2_BAND || '|' ||
                    '''' || result.OVP2_MISSING_QUESTIONS || '''|' ||
                    result.OVP2_MISSING_COUNT || '|' ||
                    result.SNSV_CALCULATED_DYNAMIC || '|' ||
                    result.SNSV_YEAR_TWO_DYNAMIC || '|' ||
                    result.SNSV_AAEAD_DYNAMIC || '|' ||
                    result.SNSV_FEMALE_DYNAMIC || '|' ||
                    result.SNSV_OFFENCE_DYNAMIC || '|' ||
                    result.SNSV_FIRST_SANCTION_DYNAMIC || '|' ||
                    result.SNSV_SECOND_SANCTION_DYNAMIC || '|' ||
                    result.SNSV_TOTAL_SANCTIONS_DYNAMIC || '|' ||
                    result.SNSV_SECOND_SANC_GAP_DYNAMIC || '|' ||
                    result.SNSV_OFM_DYNAMIC || '|' ||
                    result.SNSV_COPASV_DYNAMIC || '|' ||
                    result.SNSV_NEVER_VIOLENT_DYNAMIC || '|' ||
                    result.SNSV_ONCE_VIOLENT_DYNAMIC || '|' ||
                    result.SNSV_TOT_VIOLENT_SANC_DYNAMIC || '|' ||
                    result.SNSV_COPAS_VIOLENT_DYNAMIC || '|' ||
                    result.SNSV_WEAPON_DYNAMIC || '|' ||
                    result.SNSV_SUITABLE_ACC_DYNAMIC || '|' ||
                    result.SNSV_UNEMPLOYED_DYNAMIC || '|' ||
                    result.SNSV_RELATION_QUALITY_DYNAMIC || '|' ||
                    result.SNSV_DV_DYNAMIC || '|' ||
                    result.SNSV_CHRONIC_DRINKER_DYNAMIC || '|' ||
                    result.SNSV_BINGE_DRINKER_DYNAMIC || '|' ||
                    result.SNSV_IMPULSIVE_DYNAMIC || '|' ||
                    result.SNSV_TEMPER_DYNAMIC || '|' ||
                    result.SNSV_CRIM_ATTITUDE_DYNAMIC || '|' ||
                    result.SNSV_HOMICIDE_DYNAMIC || '|' ||
                    result.SNSV_GBH_DYNAMIC || '|' ||
                    result.SNSV_KIDNAP_DYNAMIC || '|' ||
                    result.SNSV_FIREARMS_DYNAMIC || '|' ||
                    result.SNSV_ROBBERY_DYNAMIC || '|' ||
                    result.SNSV_AGG_BURGLARY_DYNAMIC || '|' ||
                    result.SNSV_WEAPONS_NOT_GUNS_DYNAMIC || '|' ||
                    result.SNSV_CRIM_DAMAGE_LIFE_DYNAMIC || '|' ||
                    result.SNSV_ARSON_DYNAMIC || '|' ||
                    result.SNSV_SCORE_DYNAMIC || '|' ||
                    result.SNSV_PERCENTAGE_DYNAMIC || '|' ||
                    result.SNSV_BAND_DYNAMIC || '|' ||
                    '''' || result.SNSV_MISSING_QUESTIONS_DYNAMIC || '''|' ||
                    result.SNSV_MISSING_COUNT_DYNAMIC || '|' ||
                    result.OSP_DC_CALCULATED || '|' ||
                    result.OSP_DC_SCORE || '|' ||
                    result.OSP_DC_PERCENTAGE || '|' ||
                    result.OSP_DC_BAND || '|' ||
                    result.OSP_DC_RISK_REDUCTION || '|' ||
                    '''' || result.OSP_DC_MISSING_QUESTIONS || '''|' ||
                    result.OSP_DC_MISSING_COUNT || '|' ||
                    result.OSP_IIC_CALCULATED || '|' ||
                    result.OSP_IIC_PERCENTAGE || '|' ||
                    result.OSP_IIC_BAND || '|' ||
                    '''' || result.OSP_IIC_MISSING_QUESTIONS || '''|' ||
                    result.OSP_IIC_MISSING_COUNT || '|' ||
                    result.RSR_CALCULATED || '|' ||
                    result.RSR_DYNAMIC || '|' ||
                    result.RSR_PERCENTAGE || '|' ||
                    result.RSR_BAND || '|' ||
                    '''' || result.RSR_MISSING_QUESTIONS || '''|' ||
                    result.RSR_MISSING_COUNT
                    ;
                END;`
}
