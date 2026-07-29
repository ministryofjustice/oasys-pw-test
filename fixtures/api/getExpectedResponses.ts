import { Ogrs } from 'fixtures'
import * as dbClasses from './data/dbClasses'
import * as v1 from './apiClasses/v1'
import * as ap from './apiClasses/ap'
import * as v3 from './apiClasses/v3'
import * as v4 from './apiClasses/v4'
import { EndpointResponse } from './apiClasses/common'

/**
 * Build the expected API responses for a single offender.
 * 
 * Parameters:
 *      1) DbOffenderWithAssessments object containing all the relevant data from the database
 *      2) EndpointParams array with all the parameters needed to call the APIs
 * 
 * Returns an array of EnpointResponse objects or RestErrorResult objects
 */
export async function getExpectedResponses(
    offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams[], ogrs: Ogrs): Promise<(EndpointResponse | RestErrorResult)[]> {

    const results: (EndpointResponse | RestErrorResult)[] = []

    for (var params of parameters) {
        const result = await getSingleResponse(offenderData, params, ogrs)
        results.push(result)
    }
    return results
}

async function getSingleResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams, ogrs: Ogrs): Promise<EndpointResponse | RestErrorResult> {

    // Select the right function to build an endpoint response for the given endpoint parameter, then call it to get the expected response back in the resultAlias
    const functions: { [key: string]: Function } = {
        offences: v1.Offences.getExpectedResponse,
        rmp: v1.Rmp.getExpectedResponse,
        riskScores: v1.RiskScores.getExpectedResponse,
        allRiskScores: v1.RiskScores.getExpectedResponse,
        apAsslist: ap.Asslist.getExpectedResponse,
        apOffence: ap.Offence.getExpectedResponse,
        apNeeds: ap.Needs.getExpectedResponse,
        apRmp: ap.Rmp.getExpectedResponse,
        apRoshSum: ap.RoshSum.getExpectedResponse,
        apRiskInd: ap.RiskInd.getExpectedResponse,
        apRiskAss: ap.RiskAss.getExpectedResponse,
        apHealth: ap.Health.getExpectedResponse,
        apRosh: ap.Rosh.getExpectedResponse,
        assSumm: v3.AssSumm.getExpectedResponse,
        assSummSan: v3.AssSumm.getExpectedResponse,
        v4AssList: v4.Asslist.getExpectedResponse,
        v4section1: v4.section1.getExpectedResponse,
        v4section2: v4.section2.getExpectedResponse,
        v4section3: v4.section3.getExpectedResponse,
        v4section4: v4.section4.getExpectedResponse,
        v4section5: v4.section5.getExpectedResponse,
        v4section6: v4.section6.getExpectedResponse,
        v4section7: v4.section7.getExpectedResponse,
        v4section8: v4.section8.getExpectedResponse,
        v4section9: v4.section9.getExpectedResponse,
        v4section10: v4.section10.getExpectedResponse,
        v4section11: v4.section11.getExpectedResponse,
        v4section12: v4.section12.getExpectedResponse,
        v4section13: v4.section13.getExpectedResponse,
        v4Rmp: v4.rmp.getExpectedResponse,
        v4RoshFull: v4.roshFull.getExpectedResponse,
        v4RoshSumm: v4.roshSumm.getExpectedResponse,
        v4Victim: v4.victim.getExpectedResponse,
        v4RiskIndividual: v4.riskIndividual.getExpectedResponse,
        v4RiskScoresAss: v4.riskScoresAss.getExpectedResponse,
        v4RiskScoresRsr: v4.riskScoresRsr.getExpectedResponse,
        crimNeeds: v4.crimNeeds.getExpectedResponse,
        pni: v4.pni.getExpectedResponse,
        tierRiskFlag: v4.tierRiskFlag.getExpectedResponse,
    }

    if (parameters.endpoint == 'tierPredictors') {
        const result = await v4.tierPredictors.getExpectedResponse(offenderData, parameters, ogrs)
        return result
    } else {
        const f: Function = functions[parameters.endpoint]
        return f(offenderData, parameters)
    }

}


