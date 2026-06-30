import { TieringCase } from "./dbClasses";

export function getOracleCaseFromCSV(testCaseData: string): TieringCase {

    const data = testCaseData.replaceAll('\r', '').split(',')

    const ogrs = utils.stringToFloat(data[3])
    const ogp = utils.stringToFloat(data[4])

    const result: TieringCase = {
        probationCrn: data[0],
        assessmentPk: data[1],
        offenderPk: data[2],

        arpStatic: ogp == null,
        csrpStatic: data[5] != 'DYNAMIC',
        arp: ogp == null ? ogrs : ogp,
        csrp: utils.stringToFloat(data[6]),

        oscDcBand: data[7],
        ospDcScore: utils.stringToFloat(data[8]),

        rosh: data[9],
        mappa: data[10] == 'Y',
        lifer: data[11] == 'Y',
        inCustody: data[12] == 'Y',
        releaseDate: oasysDateTime.stringToDate(data[13]),
        runDate: oasysDateTime.testStartDate,

        o1_30: data[14] == 'Y',
        da: data[15] == 'Y',
        stalking: data[16] == 'Y',
        cp: data[17] == 'Y',

        csvOrOracleResults: {
            finalTier: data[18],
            provisional: data[19],
        },
    }

    return result
}