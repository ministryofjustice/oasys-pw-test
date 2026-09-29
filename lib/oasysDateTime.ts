import { Temporal } from '@js-temporal/polyfill'

export class OasysDateTime {

    testStartDate = Temporal.Now.plainDateISO()
    dateFormat = 'YYYY-MM-DD'                // RFC 9557 format for Temporal
    timestampFormat = 'YYYY-MM-DDTHH:mm:ss'
    oracleTimestampFormat = 'YYYY-MM-DD\"T\"HH24:MI:SS'
    oracleTimestampFormatMs = 'YYYY-MM-DD\"T\"HH24:MI:SS.FF3'
    timers: { [keys: string]: Temporal.PlainDateTime } = {}

    // Convert date string to Temporal Plain date.  Might be in RFC9557 format, but also need to allow for DD/MM/YYYY in OASys string fields or DD-MM-YYYY from CSV loads
    stringToDate(param: string): Temporal.PlainDate {

        if (param == null || param == '' || param == 'null') {
            return null
        }
        let reformatted = param
        if (['/', '-'].includes(param.substring(2, 3))) {
            reformatted = reformatted.substring(0, 10)
            reformatted = `${reformatted.substring(6)}-${reformatted.substring(3, 5)}-${reformatted.substring(0, 2)}`
        }
        try {
            return Temporal.PlainDate.from(reformatted)
        } catch (e) {
            return null
        }
    }

    stringToTimestamp(param: string): Temporal.PlainDateTime {

        return !param ? null : Temporal.PlainDateTime.from(param)
    }

    dateToOracleFormatString(param: Temporal.PlainDate): string {

        return !param ? null : `'${String(param.day).padStart(2, '0')}-${monthLookup[param.month]}-${param.year.toString().substring(2)}'`
    }

    dateParameterToString(param: Temporal.PlainDate): string {

        return param == null ? 'null' : `to_date('${param?.toLocaleString().replaceAll('/', '-')}','DD-MM-YYYY')`
    }

    dateParameterToCsvOutputString(param: Temporal.PlainDate): string {

        return param == null ? 'null' : `${param.toLocaleString()}`
    }

    // Get difference between two date strings in days/months/years.  -ve result indicates that the first date is later than the second date
    dateDiffString(firstDate: string, secondDate: string, unit: 'day' | 'month' | 'year'): number {

        const date1 = this.stringToDate(firstDate)
        const date2 = this.stringToDate(secondDate)

        return (this.dateDiff(date1, date2, unit))
    }

    // Get difference between two dates (Temporal.PlainDate).  -ve result indicates that the first date is later than the second date
    dateDiff(firstDate: Temporal.PlainDate, secondDate: Temporal.PlainDate, unit: 'year' | 'month' | 'day', ofm: boolean = false): number {

        if (firstDate == null || secondDate == null) {
            return null
        }
        const dateDiff = secondDate.since(firstDate, { smallestUnit: unit, largestUnit: unit })
        let diff = unit == 'day' ? dateDiff.days : unit == 'month' ? dateDiff.months : dateDiff.years

        // Leap-year fix - if dob = 29/2, 28/2 is not a birthday on a non-leap year; the calculation doesn't work like that
        if (unit == 'year' && firstDate.day == 29 && firstDate.month == 1 && secondDate.day == 28 && secondDate.month == 1 && !secondDate.inLeapYear) {
            diff--
        }

        if (ofm) {
            return diff < 0 ? 0 : diff > 36 ? 36 : diff
        } else {
            return diff >= 0 ? diff : null
        }
    }

    timestampDiffString(firstDate: string, secondDate: string): number {

        const date1 = this.stringToTimestamp(firstDate)
        const date2 = this.stringToTimestamp(secondDate)

        return (this.timestampDiff(date1, date2))
    }

    // Get difference between two timestamps (Temporal.PlainDateTime) in milliseconds.  -ve result indicates that the first date is later than the second date
    timestampDiff(firstDate: Temporal.PlainDateTime, secondDate: Temporal.PlainDateTime): number {

        if (firstDate == null || secondDate == null) {
            return null
        }
        const diff = secondDate.since(firstDate, { smallestUnit: 'millisecond', largestUnit: 'millisecond' })
        return diff.abs().milliseconds
    }

    /**
     * Calculate a date based on the test start date (i.e. today unless the test runs over midnight), using an OasysDate object which can contain any of the following (all optional):
     *  - years
     *  - months
     *  - weeks
     *  - days
     * 
     * These should be provided as positive or negative integers which are used as offsets to calculate a date.
     * The return value is a string in the normal OASys date format (dd/mm/yyyy).
     * 
     * If no values are specified (or no parameter at all), returns today's date.  If the parameter is a string, it is returned unchanged.
     */
    oasysDateAsString(offset?: OasysDate): string {

        if (typeof offset == 'string') {
            return offset
        }

        return this.calculateOffsetDate(offset).toLocaleString()
    }

    oasysDateAsPlainDate(offset?: OasysDate): Temporal.PlainDate {

        if (offset == null || typeof offset == 'string') {
            return null
        }
        return this.calculateOffsetDate(offset)
    }

    oasysDateAsDbString(offset?: OasysDate): string {

        if (typeof offset == 'string') {
            return this.stringToDate(offset).toString()     // Assume it's a standard date, reformat it to YYYY-MM-DD
        }

        return this.calculateOffsetDate(offset).toString()
    }

    calculateOffsetDate(offset: OasysDate): Temporal.PlainDate {

        const d = offset as { days?: number, weeks?: number, months?: number, years?: number }
        let result = this.testStartDate

        if (d?.days) result = result.add({ days: d.days })
        if (d?.months) result = result.add({ months: d.months })
        if (d?.years) result = result.add({ years: d.years })

        return result
    }

    timeZoneOffset(): string {
        return Temporal.Now.zonedDateTimeISO().offset
    }

    startTimer(name: string) {

        this.timers[name] = Temporal.Now.plainDateTimeISO()
    }

    // Returns elapsed time in milliseconds
    elapsedTime(name: string): number {

        return this.timestampDiff(this.timers[name], Temporal.Now.plainDateTimeISO())
    }

    dateToVersion(date: string | Temporal.PlainDateTime): string {

        const testDate = typeof date == 'string' ? this.stringToTimestamp(date) : date

        for (let key of Object.keys(appConfig.appVersions)) {
            if (Temporal.PlainDateTime.compare(testDate, appConfig.appVersions[key]) >= 0) {
                return key
            }
        }
        return 'unknown version'
    }

    checkIfAfter(version: SignificantAppVersions, date: Temporal.PlainDateTime | string): boolean {

        const versionDate = appConfig.appVersions[versionLookup[version]]
        const testDate = typeof date == 'string' ? this.stringToTimestamp(date) : date
        return versionDate ? Temporal.PlainDateTime.compare(testDate, versionDate) == 1 : null
    }
}

const versionLookup = {
    '6.20': '6.20.0.0',
    '6.26': '6.26.0.0',
    '6.30': '6.30.0.0',
    '6.35': '6.35.0.0',
    '6.49': '6.49.0.0',
    '7.7': '7.7.0.0',
}


const monthLookup: { [key: number]: string } = {
    1: 'JAN',
    2: 'FEB',
    3: 'MAR',
    4: 'APR',
    5: 'MAY',
    6: 'JUN',
    7: 'JUL',
    8: 'AUG',
    9: 'SEP',
    10: 'OCT',
    11: 'NOV',
    12: 'DEC',
}