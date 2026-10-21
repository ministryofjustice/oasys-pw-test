import { Decimal } from 'decimal.js'

import { coefficients } from './coefficients'
import { OgrsInputParams, OgrsOutputParams, OgrsOffenceCat, OgrsFeatures } from '../types'
import { addOutputParameter, reportScores } from './createOutput'
import { checkMissingQuestions } from './missingQuestions'

export function calculatePredictor(scoreType: ScoreType, params: OgrsInputParams, outputParams: OgrsOutputParams, skipCalculation: boolean = false) {

    // Calculate any of the scores other than OSP and RSR.  The selected coefficient set (depending on scoreType) determines which components make up the score.

    // Brief versions skipped if the extended version has been calculated
    if (skipCalculation) {
        reportScores(outputParams, scoreType, null, null, null, 'N', 0, `''`)
        return
    }

    // Extended versions skipped if STATIC_CALC flag set
    if (params.STATIC_CALC == 'Y' && ['serious_violence_extended', 'general_extended', 'violence_extended'].includes(scoreType)) {
        reportScores(outputParams, scoreType, null, null, null, 'N', 0, `''`)
        return
    }

    // Check for missing parameters or invalid gender
    const missing = checkMissingQuestions(scoreType, params)
    if (missing.status != 'Y') {
        reportScores(outputParams, scoreType, null, null, null, missing.status, missing.count, missing.errorText)
        return
    }

    // zScore holds a running total
    let zScore = new Decimal(0)
    const coefs = coefficients[scoreType]

    // Two-year constant
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'in_year_two_constant', true, outputParams))

    // Age and gender
    zScore = zScore.add(calculatePolynomial(scoreType, coefs, 'aai', params.age, outputParams, params.GENDER))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'female', params.female, outputParams))

    // Offence
    zScore = zScore.add(calculateOffence(scoreType, coefs, params.offenceCat, outputParams))

    // Sanctions
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'firstsanction', params.firstSanction, outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'secondsanction', params.secondSanction, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'ogrs3_sanctionoccasions', params.TOTAL_SANCTIONS_COUNT, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, `yrs_between_first_and_second_sanction_${params.male ? 'male' : 'female'}`, params.yearsBetweenFirstTwoSanctions, outputParams))

    // OFM
    zScore = zScore.add(calculatePolynomial(scoreType, coefs, 'ofm', params.ofm, outputParams))

    // Copas general
    zScore = zScore.add(calculateCopas(scoreType, coefs, 'g', params, outputParams))
    zScore = zScore.add(calculateCopas(scoreType, coefs, 'squared', params, outputParams))
    zScore = zScore.add(calculateCopas(scoreType, coefs, 'v', params, outputParams))

    // Violent offences
    zScore = zScore.add(calculateConditional(scoreType, coefs, `never_sanctioned_violent_${params.male ? 'male' : 'female'}`, params.neverSanctionedViolence, outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'onceviolent', params.onceViolent, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'ogrs3_ovp_sanct', params.TOTAL_VIOLENT_SANCTIONS, outputParams))
    zScore = zScore.add(calculateCopas(scoreType, coefs, 'violent', params, outputParams))

    // Sections 2, 3, 4
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's2q2a_carry_use_weapon', params.TWO_POINT_TWO, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's3q4_suitability', params.THREE_POINT_FOUR, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's4q2_unemployed', params.FOUR_POINT_TWO, outputParams))

    // Section 6
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's6q4_partner_relationship', params.SIX_POINT_FOUR, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's6q7_perpetrator', params.SIX_POINT_SEVEN, outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'livein_relationship', params.SIX_POINT_EIGHT == 1, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'quality_of_livein_relationship', params.SIX_POINT_EIGHT == 1 ? params.SIX_POINT_FOUR : 0, outputParams))

    // Section 7, 9, 11, 12
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's7q2_activities_encourage', params.SEVEN_POINT_TWO, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's9q1_current_use', params.NINE_POINT_ONE, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's9q2_binge_drinking', params.NINE_POINT_TWO, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's11q2_impulsivity', params.ELEVEN_POINT_TWO, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's11q4_temper_control', params.ELEVEN_POINT_FOUR, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's12q1_procriminal_attitudes', params.TWELVE_POINT_ONE, outputParams))

    // Drugs
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 's8q8_motivation_tackle_misuse', params.EIGHT_POINT_EIGHT, outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'dailydrug', params.DAILY_DRUG_USER == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_heroin', params.HEROIN == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_methadone', params.METHADONE == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_otheropiate', params.OTHER_OPIATE == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_crack', params.CRACK_COCAINE == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_cokepowder', params.POWDER_COCAINE == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_prescribed', params.MISUSED_PRESCRIBED == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_benzo', params.BENZODIAZIPINES == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_amphetamine', params.AMPHETAMINES == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_ecstasy', params.ECSTASY == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_cannabis', params.CANNABIS == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_steroid', params.STEROIDS == 'Y', outputParams))
    zScore = zScore.add(calculateConditional(scoreType, coefs, 'drug_use_flag_v411_anyotherdrug',
        params.HALLUCINOGENS == 'Y' || params.KETAMINE == 'Y' || params.OTHER_DRUGS == 'Y' || params.SOLVENTS == 'Y' || params.SPICE == 'Y' || params.MEPHEDRONE == 'Y',
        outputParams))

    // Previous convictions
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'r1q2_murder_prev', params.HOMICIDE, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'r1q2_wounding_prev', params.GBH, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'r1q2_kidnapping_prev', params.KIDNAP, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'r1q2_firearm_prev', params.FIREARMS, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'r1q2_robbery_prev', params.ROBBERY, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'r1q2_agg_burglary_prev', params.AGGRAVATED_BURGLARY, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'r1q2_weapons_prev', params.WEAPONS_NOT_FIREARMS, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'r1q2_damage_with_intent_prev', params.CRIMINAL_DAMAGE_LIFE, outputParams))
    zScore = addDecimalsWithNull(zScore, calculateMultiplier(scoreType, coefs, 'r1q2_arson_prev', params.ARSON, outputParams))

    // Calculate probability and band, output the results
    const probability = calculateProbability(zScore)
    const percentage = probabilityToPercentage(probability)
    const band = calculateBand(scoreType, percentage)

    reportScores(outputParams, scoreType, zScore, percentage, band, 'Y', 0, `''`)
}

function addDecimalsWithNull(runningTotal: Decimal, addition: Decimal): Decimal {

    return addition == null ? runningTotal : runningTotal.add(addition)
}

function calculatePolynomial(scoreType: ScoreType, coefs: { [key: string]: Decimal }, type: 'aai' | 'ofm', input: number, outputParams: OgrsOutputParams, gender?: string): Decimal {

    // Calculate a 2 or 4 level polynomial depending on which coefficients are available

    let result = new Decimal(0)
    const value = new Decimal(input)
    const genderSuffix = type == 'ofm' ? '' : gender == 'M' ? '_male' : '_female'

    const coef1 = coefs[`${type}${genderSuffix}`]
    if (coef1 == null) return null

    const coef2 = coefs[`${type}_quadratic${genderSuffix}`]

    result = result.add(value.times(coef1))
    result = result.add(value.pow(2).times(coef2))

    const coef3 = coefs[`${type}_cubic${genderSuffix}`]
    const coef4 = coefs[`${type}_quartic${genderSuffix}`]
    if (coef3 != null && coef4 != null) {
        result = result.add(value.pow(3).times(coef3))
        result = result.add(value.pow(4).times(coef4))
    }

    addOutputParameter(outputParams, scoreType, type, result)
    return result
}

function calculateCopas(scoreType: ScoreType, coefs: { [key: string]: Decimal }, type: 'g' | 'v' | 'violent' | 'squared', params: OgrsInputParams, outputParams: OgrsOutputParams): Decimal {

    const boost = type == 'v' ? 12 : type == 'violent' ? 30 : 26
    const count = type == 'violent' ? params.TOTAL_VIOLENT_SANCTIONS : params.TOTAL_SANCTIONS_COUNT
    let result = Decimal(0)

    if (count > 2 || (type == 'violent' && count > 0)) {

        const genderSuffix = params.male ? '_male' : '_female'
        const coefName = type == 'violent' ? 'ogrs4v_rate_violent' : `three_plus_sanction_copas_${type}${genderSuffix}`
        const coef = coefs[coefName]

        if (coef != null) {
            result = new Decimal(count).div(boost + params.ageAtLastSanction - params.AGE_AT_FIRST_SANCTION)
            result = result.ln()
            if (type == 'squared') {
                result = result.pow(2)
            }
            result = result.times(coef)
        }
    }

    addOutputParameter(outputParams, scoreType, type, result)
    return result
}

function calculateConditional(scoreType: ScoreType, coefs: { [key: string]: Decimal }, item: OgrsFeatures, condition: boolean, outputParams: OgrsOutputParams): Decimal {

    const coef = coefs[item]
    const result = (coef == null || coef == undefined || !condition) ? new Decimal(0) : coef

    addOutputParameter(outputParams, scoreType, item, result)
    return result
}

function calculateMultiplier(scoreType: ScoreType, coefs: { [key: string]: Decimal }, item: OgrsFeatures, value: number, outputParams: OgrsOutputParams): Decimal {

    const coef = coefs[item]
    const result = coef == null || coef == undefined ? null : value == 0 || value == null ? new Decimal(0) : coef.times(value)

    addOutputParameter(outputParams, scoreType, item, result)
    return result
}

function calculateOffence(scoreType: ScoreType, coefs: { [key: string]: Decimal }, offenceCat: OgrsOffenceCat, outputParams: OgrsOutputParams): Decimal {

    let coef = coefs[offenceCat.cat]
    let result = coef == null ? new Decimal(0) : coef
    if (offenceCat.addVatpFlag) {
        result = result.add(coefs['vatp_flag'])
    }

    addOutputParameter(outputParams, scoreType, 'offence', result)
    return result
}

export function calculateProbability(zScore: Decimal): Decimal {

    const expZ = zScore.exp()
    return expZ.div(expZ.add(1))
}

export function probabilityToPercentage(probability: Decimal): Decimal {

    return probability?.times(10000).round().div(100) ?? null
}

export function calculateBand(scoreType: ScoreType, probability: Decimal): ScoreBand {

    if (probability == null) return null

    switch (scoreType) {
        case 'rsr':
        case 'serious_violence_brief':
        case 'serious_violence_extended':
            return probability.greaterThanOrEqualTo(6.9) ? 'Very High' : probability.greaterThanOrEqualTo(3) ? 'High' : probability.greaterThanOrEqualTo(1) ? 'Medium' : 'Low'
        case 'general_brief':
        case 'general_extended':
            return probability.greaterThanOrEqualTo(90) ? 'Very High' : probability.greaterThanOrEqualTo(75) ? 'High' : probability.greaterThanOrEqualTo(50) ? 'Medium' : 'Low'
        case 'violence_brief':
        case 'violence_extended':
            return probability.greaterThanOrEqualTo(80) ? 'Very High' : probability.greaterThanOrEqualTo(60) ? 'High' : probability.greaterThanOrEqualTo(30) ? 'Medium' : 'Low'
    }
    return null
}
