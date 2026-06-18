import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section12EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section12EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section12Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section12Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section12Assessment extends v4Common.V4AssessmentCommon {

    proCriminalAttitudes: string
    attitudesTowardsStaff: string
    attitudesTowardsSupervision: string
    attitudesTowardsCommunitySociety: string
    understandsMotivationForOffending: string
    motivationToAddressBehaviour: string
    hostileOrientation: string
    attIssuesDetails: string
    attLinkedToHarm: string
    attLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.proCriminalAttitudes = dbAssessment.qaData.getString('12.1')
        this.attitudesTowardsStaff = dbAssessment.qaData.getString('12.3')
        this.attitudesTowardsSupervision = dbAssessment.qaData.getString('12.4')
        this.attitudesTowardsCommunitySociety = dbAssessment.qaData.getString('12.5')
        this.understandsMotivationForOffending = dbAssessment.qaData.getString('12.6')
        this.motivationToAddressBehaviour = dbAssessment.qaData.getString('12.8')
        this.hostileOrientation = dbAssessment.qaData.getString('12.9')
        this.attIssuesDetails = dbAssessment.qaData.getString('12.97')
        this.attLinkedToHarm = dbAssessment.qaData.getString('12.98')
        this.attLinkedToReoffending = dbAssessment.qaData.getString('12.99')
    }
}
