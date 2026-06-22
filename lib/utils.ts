export class Utils {

    getString(param: string): string {
        return param == '' || param == 'null' || param == null ? null : param
    }

    getInteger(param: string): number {
        return param == '' || param == null || param == undefined || param.toLowerCase() == 'null' ? null : Number.parseInt(param)
    }

    lookupString(value: string, lookup: { [keys: string]: string }, translation: { [keys: string]: string } = null): string {

        const result = lookup[value]
        if (result == null || result == undefined) {
            return null
        }

        return translation == null ? result : this.lookupString(result, translation)
    }

    lookupInteger(value: string, lookup: { [keys: string]: string | number }, translation: { [keys: string]: number } = null): number {

        const result = lookup[value]
        if (result == null || result == undefined) {
            return null
        }
        if (translation == null) {
            return typeof result == 'string' ? this.stringToInt(result) : result
        } else {
            return this.lookupInteger(result as string, translation)
        }
    }

    lookupFloat(value: string, lookup: { [keys: string]: string | number }): number {

        const result = lookup[value]
        if (result == null || result == undefined) {
            return null
        }
        return typeof result == 'string' ? this.stringToFloat(result) : result
    }

    stringToInt(param: string): number {

        const result = Number.parseInt(param)
        return Number.isInteger(result) ? result : null
    }

    stringToFloat(param: string): number {

        const result = Number.parseFloat(param)
        return Number.isNaN(result) ? null : result
    }

    stringParameterToString(param: string): string {

        return param == null ? 'null' : `'${param}'`
    }

    numericParameterToString(param: number): string {

        return param == null ? 'null' : param.toString()
    }

    stringParameterToCsvOutputString(param: string): string {

        return param == null ? '' : param
    }

    numericParameterToCsvOutputString(param: number): string {

        return param == null ? '' : param.toString()
    }

    problemsAnswerToNumeric(param: ProblemsAnswer | ProblemsMissingAnswer): number {

        switch (param) {
            case '0-No problems':
                return 0
            case '1-Some problems':
                return 1
            case '2-Significant problems':
                return 2
        }
        return null  // includes 'Missing'
    }

    jsonString(param: string, options?: { removeCrLf?: boolean, remove002?: boolean, removeFf?: boolean }): string {

        if (param == null) {
            return null
        }
        let result = options?.removeCrLf ? JSON.stringify(param.replaceAll('"', '\"')).slice(1, -1) : param.replaceAll('"', '\"')

        result = options?.remove002 ? result.replaceAll('\u0002', '') : result
        result = options?.removeFf ? result.replaceAll('\u000C', '') : result
        return result.substring(0, 4000)
    }

    genderNumberLookup = {
        '0': 'N',
        '1': 'M',
        '2': 'F',
        '3': 'O',
        '9': 'U',
    }

    yesNoToYNLookup = {
        YES: 'Y',
        NO: 'N',
        Yes: 'Y',
        No: 'N',
    }

    /** 
     * Returns a string with x characters.  The string includes some spaces and carriage returns, and a counter at regular intervals.
     */
    oasysString(length: number): string {

        let result = ''
        let i = 0
        let letters = 'ABCD efg'
        let lineLength = 0

        while (i < length - 12) {
            // Add 10 characters at a time, including a counter, until nearly at the end
            i += 10
            lineLength += 10
            let counter = i.toString()
            result += `${letters.substring(0, 10 - counter.length)}${counter}`

            if (lineLength == 400) {
                result += '\n'  // newline counts 2 characters
                i += 2
                lineLength = 0
            }
        }

        return `${result}${'.'.repeat(length - i)}`
    }

    // Filter used to deduplicate a list
    onlyUnique(value: any, index: number, array: any[]) {
        return array.indexOf(value) === index
    }

    testProcessNumber(): number {
        
        return Number.parseInt(process.env.TEST_PARALLEL_INDEX)
    }
}