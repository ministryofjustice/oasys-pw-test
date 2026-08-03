import { Temporal } from '@js-temporal/polyfill'
import { OgrsAssessment } from './dbClasses'
import { addCalculatedInputParameters, da, dailyDrugUser, getDrugsUsage, getDrugUsed, q141, q22, q4_2Lookup, q88, yesNo1_0Lookup } from './common'
import { OgrsInputParams } from '../types'

export function createAssessmentInputParams(assessment: OgrsAssessment, dateParam: string | Temporal.PlainDate = null): OgrsInputParams {

    const after6_30 = oasysDateTime.checkIfAfter('6.30', assessment.initiationDate)
    const after6_35 = oasysDateTime.checkIfAfter('6.35', assessment.initiationDate)

    const drugs = getDrugsUsage(assessment.qaData)
    const q81 = utils.lookupString('8.1', assessment.qaData)

    let staticCalc = 'N'
    if (assessment.type == 'LAYER_1' && assessment.version == 2) {  // RoSHA - set static flag according to 1.39 (offender interview)
        if (utils.lookupString('1.39', assessment.qaData) != 'YES') {
            staticCalc = 'Y'
        }
    }

    let assessmentDate = oasysDateTime.testStartDate
    if (dateParam != null) {
        assessmentDate = typeof dateParam == 'string' ? oasysDateTime.stringToDate(dateParam) : dateParam
    }

    const result = {

        ASSESSMENT_DATE: assessmentDate,
        STATIC_CALC: staticCalc,
        DOB: assessment.dob,
        GENDER: utils.lookupString(assessment.gender, utils.genderNumberLookup),
        OFFENCE_CODE: assessment.offence,
        TOTAL_SANCTIONS_COUNT: utils.lookupInteger('1.32', assessment.qaData),
        TOTAL_VIOLENT_SANCTIONS: utils.lookupInteger('1.40', assessment.qaData),
        CONTACT_ADULT_SANCTIONS: utils.lookupInteger('1.34', assessment.qaData),
        CONTACT_CHILD_SANCTIONS: utils.lookupInteger('1.45', assessment.qaData),
        INDECENT_IMAGE_SANCTIONS: utils.lookupInteger('1.46', assessment.qaData),
        PARAPHILIA_SANCTIONS: utils.lookupInteger('1.37', assessment.qaData),
        STRANGER_VICTIM: utils.lookupString('1.44', assessment.qaData, utils.yesNoToYNLookup),
        AGE_AT_FIRST_SANCTION: utils.lookupInteger('1.8', assessment.qaData),
        LAST_SANCTION_DATE: oasysDateTime.stringToDate(utils.lookupString('1.29', assessment.qaData)),
        DATE_RECENT_SEXUAL_OFFENCE: oasysDateTime.stringToDate(utils.lookupString('1.33', assessment.qaData)),
        CURR_SEX_OFF_MOTIVATION: q141(utils.lookupString('1.30', assessment.qaData), utils.lookupString('1.41', assessment.qaData), assessment.offence),
        MOST_RECENT_OFFENCE: oasysDateTime.stringToDate(utils.lookupString('1.43', assessment.qaData)),
        COMMUNITY_DATE: assessment.prisonInd == 'C'
            ? oasysDateTime.testStartDate
            : oasysDateTime.stringToDate(utils.lookupString('1.38', assessment.qaData)),
        ONE_POINT_THIRTY: utils.lookupString('1.30', assessment.qaData, utils.yesNoToYNLookup),
        TWO_POINT_TWO: q22(utils.lookupString('2.2_V2_WEAPON', assessment.qaData), utils.lookupString('2.2', assessment.qaData), after6_35),
        THREE_POINT_FOUR: utils.lookupInteger('3.4', assessment.qaData),
        FOUR_POINT_TWO: utils.lookupInteger('4.2', assessment.qaData, q4_2Lookup),
        SIX_POINT_FOUR: utils.lookupInteger('6.4', assessment.qaData),
        SIX_POINT_SEVEN: da(assessment.qaData, after6_30),
        SIX_POINT_EIGHT: utils.lookupInteger('6.8', assessment.qaData),
        SEVEN_POINT_TWO: utils.lookupInteger('7.2', assessment.qaData),
        DAILY_DRUG_USER: dailyDrugUser(q81, drugs),
        AMPHETAMINES: getDrugUsed('AMPHETAMINES', drugs),
        BENZODIAZIPINES: getDrugUsed('BENZODIAZIPINES', drugs),
        CANNABIS: getDrugUsed('CANNABIS', drugs),
        CRACK_COCAINE: getDrugUsed('CRACK_COCAINE', drugs),
        ECSTASY: getDrugUsed('ECSTASY', drugs),
        HALLUCINOGENS: getDrugUsed('HALLUCINOGENS', drugs),
        HEROIN: getDrugUsed('HEROIN', drugs),
        KETAMINE: getDrugUsed('KETAMINE', drugs),
        METHADONE: getDrugUsed('METHADONE', drugs),
        MISUSED_PRESCRIBED: getDrugUsed('MISUSED_PRESCRIBED', drugs),
        OTHER_DRUGS: getDrugUsed('OTHER_DRUGS', drugs),
        OTHER_OPIATE: getDrugUsed('OTHER_OPIATE', drugs),
        POWDER_COCAINE: getDrugUsed('POWDER_COCAINE', drugs),
        SOLVENTS: getDrugUsed('SOLVENTS', drugs),
        SPICE: getDrugUsed('SPICE', drugs),
        STEROIDS: getDrugUsed('STEROIDS', drugs),
        EIGHT_POINT_EIGHT: q88(q81, utils.lookupInteger('8.8', assessment.qaData)),
        NINE_POINT_ONE: utils.lookupInteger('9.1', assessment.qaData),
        NINE_POINT_TWO: utils.lookupInteger('9.2', assessment.qaData),
        ELEVEN_POINT_TWO: utils.lookupInteger('11.2', assessment.qaData),
        ELEVEN_POINT_FOUR: utils.lookupInteger('11.4', assessment.qaData),
        TWELVE_POINT_ONE: utils.lookupInteger('12.1', assessment.qaData),
        OGRS4G_ALGO_VERSION: 1,
        OGRS4V_ALGO_VERSION: 1,
        OGP2_ALGO_VERSION: 1,
        OVP2_ALGO_VERSION: 1,
        OSP_ALGO_VERSION: 6,
        SNSV_ALGO_VERSION: 1,
        AGGRAVATED_BURGLARY: utils.lookupInteger('R1.2.6.2_V2', assessment.qaData, yesNo1_0Lookup),
        ARSON: utils.lookupInteger('R1.2.7.2_V2', assessment.qaData, yesNo1_0Lookup),
        CRIMINAL_DAMAGE_LIFE: utils.lookupInteger('R1.2.8.2_V2', assessment.qaData, yesNo1_0Lookup),
        FIREARMS: utils.lookupInteger('R1.2.10.2_V2', assessment.qaData, yesNo1_0Lookup),
        GBH: utils.lookupInteger('R1.2.2.2_V2', assessment.qaData, yesNo1_0Lookup),
        HOMICIDE: utils.lookupInteger('R1.2.1.2_V2', assessment.qaData, yesNo1_0Lookup),
        KIDNAP: utils.lookupInteger('R1.2.9.2_V2', assessment.qaData, yesNo1_0Lookup),
        ROBBERY: utils.lookupInteger('R1.2.12.2_V2', assessment.qaData, yesNo1_0Lookup),
        WEAPONS_NOT_FIREARMS: utils.lookupInteger('R1.2.13.2_V2', assessment.qaData, yesNo1_0Lookup),
        CUSTODY_IND: assessment.prisonInd == 'C' ? 'Y' : 'N',
    }

    addCalculatedInputParameters(result)
    return result

}
