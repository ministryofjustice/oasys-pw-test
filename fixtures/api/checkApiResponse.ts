import { flatten } from 'flat'
import { EndpointResponse } from './apiClasses/common'
import { restErrorResults } from './endpointUrls'

/**
 * Checks an endpoint response value against the expected return values.
 * Parameters are:
 *
 *      1) an object containing the expected values, in the expected structure.
 *      2) an object containing the actual response values.
 *
 * Returns a CheckAPIResult object with two properties: failed (boolean) and output (string[] with the log details).
 */


export async function checkApiResponse(expectedValues: EndpointResponse | RestErrorResult, response: ApiResponse, reportPasses: boolean): Promise<boolean> {

    let failed = false
    const logText: string[] = []

    logText.push('', `Checking ${response.url}`)

    // If an error is expected, check the error message
    if ((expectedValues as RestErrorResult).statusCode != undefined) {
        const expectedResult = expectedValues as RestErrorResult

        if (response.statusCode == 'ok') {
            logText.push(`Error checking API ${response.url}: expected ${expectedResult.statusCode}, got ${response.statusCode}`)
            failed = true
        } else {
            if (response.statusCode != expectedResult.statusCode) {
                logText.push(`Error checking API ${response.url}: expected status ${expectedResult.statusCode}, got ${response.statusCode}`)
                failed = true
            }
            if (response.message != expectedResult.message && // Accept mismatch if it's no assessments vs no matching assessments - rules for this are unclear
                !(expectedResult.message == restErrorResults.noAssessments.message && response.message == restErrorResults.noMatchingAssessments.message)) {
                logText.push(`Error checking API ${response.url}: expected '${expectedResult.message}', got '${response.message}'`)
                failed = true
            }
        }

        // Fail if an error is returned but was not expected
    } else if (response.statusCode != 'ok') {

        logText.push(`Error checking API ${response.url}: got ${response.statusCode}, ${response.message}`)
        failed = true

        // otherwise check the contents of the response
    } else {
        let data = JSON.stringify(response.result)
        if (data.charCodeAt(0) == 34) {
            data = data.substring(1, data.length - 1)
        }
        try {
            response.result = JSON.parse(data)
        } catch (e) {
            logText.push(`************ FAILED ****************** Error parsing JSON for ${response.url}: ${JSON.stringify(e)}`)
            logText.push(data)
            logText.push('')
            return true
        }


        // Sort any arrays as the order can be variable, easier to compare them in the same order
        sortArrays(expectedValues)
        sortArrays(response.result)

        // Flatten out to a single object using the library linked above.
        // Each property of this object has a multi-level key (e.g. assessments[0].offenceDetails[1].offenceType) plus the value
        const expectedElements: { [key: string]: any } = flatten(expectedValues)
        const actualElements: { [key: string]: any } = flatten(response.result)

        // Check that all expected elements have been received and are correct
        Object.keys(expectedElements).forEach((key) => {
            if (Object.keys(actualElements).includes(key)) {
                let expectedValue: any = null
                let receivedValue: any = null

                if (typeof expectedElements[key] == 'string') {
                    expectedValue = expectedElements[key]?.substring(0, 3500)
                    const receivedString = actualElements[key]?.toString()
                    receivedValue = receivedString ? receivedString.replaceAll('\x02', '').substring(0, 3500) : receivedString
                } else if (typeof expectedElements[key] == 'object') {
                    expectedValue = JSON.stringify(expectedElements[key])
                    receivedValue = JSON.stringify(actualElements[key])
                } else {
                    expectedValue = expectedElements[key]
                    receivedValue = actualElements[key]
                }

                if (expectedValue != receivedValue) {
                    const newline = expectedValue?.length > 100 ? '\n                ' : ''
                    logText.push(`Incorrect value for ${key}: ${newline}expected '${expectedValue}', ${newline}received '${receivedValue}'`)
                    failed = true
                }
            }
            else {
                logText.push(`Expected element not received: ${key} with value '${expectedElements[key]}'`)
                failed = true
            }
        })

        // Check that there are no extra elements received
        Object.keys(actualElements).forEach((key) => {
            if (!Object.keys(expectedElements).includes(key)) {
                logText.push(`Received element not expected: ${key} with value '${actualElements[key]}'`)
                failed = true
            }
        })
    }

    if (failed) {
        fileLog('************* FAILED *************')
        fileLog(`    expect: ${JSON.stringify(expectedValues)}`)
        fileLog(`    response: ${JSON.stringify(response)}`)
        fileLog('**********************************')
        fileLog('')
        logText.push('*** Failed ***')
    } else {
        if (reportPasses) {
            fileLog(`    response: ${JSON.stringify(response)}`)
        }
    }
    logText.push('')

    if (failed || reportPasses) {
        for (const text of logText) {
            log(text)
        }
    }
    return failed

}
// Sort all arrays in the expected and received objects recursively, to simplify matching
function sortArrays(obj: any) {

    if (!obj) return

    const isArray = obj instanceof Array
    if (isArray) {
        if (obj.length > 0) {
            obj.forEach((item) => { sortArrays(item) })
            if (obj[0]['objectiveSequence'] == undefined) { // Don't attempt to sort objectives, the sequence no is used in the query
                obj.sort(arraySort)
            }
        }
    } else if (typeof obj == 'object') {
        Object.keys(obj).forEach((key) => {
            sortArrays(obj[key])
        })
    }
}
function arraySort(a: object, b: object): number {

    const aString = JSON.stringify(a)
    const bString = JSON.stringify(b)

    return aString > bString ? 1 : aString < bString ? -1 : 0
}
