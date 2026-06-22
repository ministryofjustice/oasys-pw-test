import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section3EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section3EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section3Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section3Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section3Assessment extends v4Common.V4AssessmentCommon {

    noFixedAbodeOrTransient: string
    suitabilityOfAccommodation: string
    permanenceOfAccommodation: string
    locationOfAccommodation: string
    accIssuesDetails: string
    accLinkedToHarm: string
    accLinkedToReoffending: string

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.noFixedAbodeOrTransient = dbAssessment.qaData.getString('3.3')
        this.suitabilityOfAccommodation = dbAssessment.qaData.getString('3.4')
        this.permanenceOfAccommodation = dbAssessment.qaData.getString('3.5')
        this.locationOfAccommodation = dbAssessment.qaData.getString('3.6')
        this.accIssuesDetails = dbAssessment.qaData.getString('3.97')
        this.accLinkedToHarm = dbAssessment.qaData.getString('3.98')
        this.accLinkedToReoffending = dbAssessment.qaData.getString('3.99')
    }
}

