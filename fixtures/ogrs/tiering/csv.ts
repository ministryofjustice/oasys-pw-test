import { TieringCase } from './dbClasses'

export function getPiCaseFromCsv(testCaseData: string): TieringCase {

    const data = testCaseData.replaceAll('\r', '').split(',')
    // 00 crn
    // 01 tier
    // 02 provisional
    // 03 tier_calculation_id
    // 04 tier_calculated_at
    // 05 assessment_completed_at
    // 06 arp_score
    // 07 arp_band
    // 08 arp_static_or_dynamic
    // 09 csrp_score
    // 10 csrp_band
    // 11 csrp_static_or_dynamic
    // 12 dcsrp_score
    // 13 dcsrp_band
    // 14 iicsrp_score
    // 15 iicsrp_band
    // 16 ever_committed_sexual_offence
    // 17 has_active_event
    // 18 rosh
    // 19 mappa_level
    // 20 mappa_category
    // 21 lifer_ipp
    // 22 latest_release_date
    // 23 stalking
    // 24 domestic_abuse
    // 25 child_protection

    if (data[1] == 'NOT_SUPERVISED' || data[5] == '') {
        return null
    }
    if (data[4] < '29/06/2026 15:55') {
        return null
    }
    // if (data[0] != 'D522605') return null


    const result: TieringCase = {

        probationCrn: data[0],
        assessmentPk: null,
        offenderPk: null,

        arpStatic: data[8] != 'DYNAMIC',
        csrpStatic: data[11] != 'DYNAMIC',
        arp: utils.stringToFloat(data[6]),
        csrp: utils.stringToFloat(data[9]),

        oscDcBand: data[13]?.charAt(0),
        ospDcScore: utils.stringToFloat(data[12]),

        rosh: data[18]?.charAt(0),
        mappa: data[20] != '',
        lifer: data[21]?.toUpperCase() == 'TRUE',
        inCustody: null,
        releaseDate: oasysDateTime.stringToDate(data[22]),
        runDate: oasysDateTime.stringToDate(data[4]),

        o1_30: data[16]?.toUpperCase() == 'TRUE',
        da: data[24]?.toUpperCase() == 'TRUE',
        stalking: data[23]?.toUpperCase() == 'TRUE',
        cp: data[25]?.toUpperCase() == 'TRUE',

        csvOrOracleResults: {
            finalTier: data[1]?.charAt(0),
            provisional: trueFalseToYN(data[2]),
        },
    }

    return result
}

function trueFalseToYN(data: string): 'Y' | 'N' {

    return data?.toUpperCase() == 'TRUE' ? 'Y' : 'N'
}
