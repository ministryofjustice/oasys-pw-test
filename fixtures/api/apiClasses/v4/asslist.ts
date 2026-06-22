import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const relevantAssessments = offenderData.assessments.filter(v4Common.timelineAssessmentWithRsrFilter)
    if (relevantAssessments.length == 0) {
        return env.restErrorResults.noAssessments
    } else {
        const result = new V4AsslistEndpointResponse(offenderData, parameters)

        delete result.assessments

        return result
    }
}


export class V4AsslistEndpointResponse extends v4Common.V4EndpointResponse {

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

}