import * as apCommon from './apCommon'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const relevantAssessments = offenderData.assessments.filter(apCommon.assessmentFilter)
    if (relevantAssessments.length == 0) {
        return env.restErrorResults.noAssessments
    } else {
        const result = new APAsslistEndpointResponse(offenderData, parameters)
        result.addTimeline(relevantAssessments)
        delete result.assessments
        delete result.warnings

        return result
    }
}


export class APAsslistEndpointResponse extends apCommon.APEndpointResponse {

    timeline: apCommon.APTimelineAssessment[]

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addTimeline(dbAssessments: dbClasses.DbAssessmentOrRsr[]) {

        this.timeline = super.processTimeline(dbAssessments)
    }
}