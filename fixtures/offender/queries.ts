import { Temporal } from '@js-temporal/polyfill'

import { OasysDb } from 'fixtures'
import { noDatabaseConnection } from 'localSettings'


export class Queries {

    constructor(private readonly oasysDb: OasysDb) { }

    async getLatestStandaloneCsrpPk(probationCrn: string): Promise<number> {

        if (noDatabaseConnection) {
            return 0
        }
        const query = `select offender_rsr_scores_pk from eor.offender_rsr_scores where cms_prob_number = '${probationCrn}' and deleted_date is null order by initiation_date desc`

        const data = await this.oasysDb.getData(query)
        return Number.parseInt(data[0][0])
    }

    async checkStandaloneCsrpDbValues(pk: number, values: { [keys: string]: string | Temporal.PlainDateTime }) {

        var query = 'select '
        var firstCol = true
        const columnNames: string[] = []
        const expectedValues: (string | Temporal.PlainDateTime)[] = []
        var failed = false

        Object.keys(values).forEach(name => {
            if (firstCol) {
                firstCol = false
            } else {
                query += ', '
            }
            const stringType = !values[name] || typeof values[name] == 'string'
            query += stringType ? name : `to_char(${name}, '${oasysDateTime.oracleTimestampFormat}')`
            columnNames.push(name)
            expectedValues.push(values[name])
        })

        query += ` from eor.offender_rsr_scores where offender_rsr_scores_pk = ${pk} `

        const data = await this.oasysDb.getData(query)
        log('', `Checking database values for standalone CSRP PK ${pk}`)
        log(`Expected values: ${JSON.stringify(values)} `)

        if (data.length != 1) {
            log(`Error in query - expected 1 row, got ${data.length} `)
            failed = true
        } else if (data[0].length != expectedValues.length) {
            log(`Error in query - expected ${expectedValues.length} columns, got ${data[0].length} `)
            failed = true
        } else {
            for (let col = 0; col < expectedValues.length; col++) {
                if (!expectedValues[col] || typeof expectedValues[col] == 'string') {
                    const actual = data[0][col]
                    const expected = expectedValues[col]
                    if (actual != expected) {
                        log(`Expected ${columnNames[col]} to be '${expected}', got '${actual}'`)
                        failed = true
                    }
                } else {
                    const actual = oasysDateTime.stringToTimestamp(data[0][col])
                    if (Math.abs(oasysDateTime.timestampDiff(actual, expectedValues[col] as Temporal.PlainDateTime)) > 15000) {
                        log(`Expected ${columnNames[col]} to be ${expectedValues[col].toLocaleString()}, got ${actual} `)
                        failed = true
                    }
                }
            }
        }

        expect(failed).toBeFalsy()
    }

}

