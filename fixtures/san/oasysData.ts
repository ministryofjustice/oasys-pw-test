import { OasysDb } from 'fixtures/oasysDb/oasysDb'

type q012 = '0' | '1' | '2'
type q012M = '0' | '1' | '2' | 'M'
type yn = 'YES' | 'NO'

export class OasysData {

    'o1-30': yn
    'o2-1': string
    'o2-6': yn
    'o2-7': yn
    'o2-7-1': '100' | '110' | '120' | '130' | '140' | '150' | '160' | '170' | '180'
    'o2-8': string
    'o2-11': yn
    'o2-12': string
    'o2-99': yn
    'o3-4': q012M
    'o4-3': q012M
    'o4-8': q012M
    'o4-9': '0' | '2' | 'M'
    'o6-1': q012M
    'o6-3': q012M
    'o6-4': q012M
    'o6-8': '1' | '2' | '3'
    'o6-9': yn
    'o8-1': yn
    'o8-8': q012M
    'o9-2': q012M
    'o10-1': q012
    'o10-4': q012
    'o10-7_V2_CHILDHOOD': yn
    'o11-2': q012
    'o11-4': q012
    'o11-6': q012
    'o11-7': q012
    'o11-9': q012
    'o12-1': q012
    'o12-4': q012
    'o12-9': q012


    async getOasysData(assessmentPk: number, oasysDb: OasysDb) {

        const query = `SELECT REF_QUESTION_CODE, ANSWER
                        FROM (
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
                            AND OQ.REF_QUESTION_CODE IN (
                                '1.30','2.1','2.6','2.7','2.7.1','2.8','2.11','2.12','2.99',
                                '3.4','4.3','4.8','4.9',
                                '6.1','6.3','6.4','6.8','6.9',
                                '8.1','8.8','9.2',
                                '10.1','10.4','10.7_V2_CHILDHOOD',
                                '11.2','11.4','11.6','11.7','11.9',
                                '12.1','12.4','12.9'
                            )
                        ) `

        const qaData: string[][] = await oasysDb.getData(query)

        qaData.forEach((q) => {
            switch (q[0]) {
                case '1.30':
                    this['o1-30'] = q[1] as yn
                    break
                case '2.1':
                    this['o2-1'] = q[1]
                    break
                case '2.6':
                    this['o2-6'] = q[1] as yn
                    break
                case '2.7':
                    this['o2-7'] = q[1] as yn
                    break
                case '2.7.1':
                    this['o2-7-1'] = q[1] as '100' | '110' | '120' | '130' | '140' | '150' | '160' | '170' | '180'
                    break
                case '2.8':
                    this['o2-8'] = q[1]
                    break
                case '2.11':
                    this['o2-11'] = q[1] as yn
                    break
                case '2.12':
                    this['o2-12'] = q[1]
                    break
                case '2.99':
                    this['o2-99'] = q[1] as yn
                    break
                case '3.4':
                    this['o3-4'] = q[1] as q012M
                    break
                case '4.3':
                    this['o4-3'] = q[1] as q012M
                    break
                case '4.8':
                    this['o4-8'] = q[1] as q012M
                    break
                case '4.9':
                    this['o4-9'] = q[1] as '0' | '2' | 'M'
                    break
                case '6.1':
                    this['o6-1'] = q[1] as q012
                    break
                case '6.3':
                    this['o6-3'] = q[1] as q012
                    break
                case '6.4':
                    this['o6-4'] = q[1] as q012
                    break
                case '6.8':
                    this['o6-8'] = q[1] as '1' | '2' | '3'
                    break
                case '6.9':
                    this['o6-9'] = q[1] as yn
                    break
                case '8.1':
                    this['o8-1'] = q[1] as yn
                    break
                case '8.8':
                    this['o8-8'] = q[1] as q012
                    break
                case '9.2':
                    this['o9-2'] = q[1] as q012
                    break
                case '10.1':
                    this['o10-1'] = q[1] as q012
                    break
                case '10.4':
                    this['o10-4'] = q[1] as q012
                    break
                case '10.7_V2_CHILDHOOD':
                    this['o10-7_V2_CHILDHOOD'] = q[1] as yn
                    break
                case '11.2':
                    this['o11-2'] = q[1] as q012
                    break
                case '11.4':
                    this['o11-4'] = q[1] as q012
                    break
                case '11.6':
                    this['o11-6'] = q[1] as q012
                    break
                case '11.7':
                    this['o11-7'] = q[1] as q012
                    break
                case '11.9':
                    this['o11-9'] = q[1] as q012
                    break
                case '12.1':
                    this['o12-1'] = q[1] as q012
                    break
                case '12.4':
                    this['o12-4'] = q[1] as q012
                    break
                case '12.9':
                    this['o12-9'] = q[1] as q012
                    break
            }
        })

    }

}
