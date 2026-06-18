import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section5EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section5EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section5Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section5Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section5Assessment extends v4Common.V4AssessmentCommon {

    financialSituation: string
    financialManagement: string
    illegalEarnings: string
    overReliance: string
    budgeting: string
    financeIssuesDetails: string
    financeLinkedToHarm: string
    financeLinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.financialSituation = dbAssessment.qaData.getString('5.2')
        this.financialManagement = dbAssessment.qaData.getString('5.3')
        this.illegalEarnings = dbAssessment.qaData.getString('5.4')
        this.overReliance = dbAssessment.qaData.getString('5.5')
        this.budgeting = dbAssessment.qaData.getString('5.6')
        this.financeIssuesDetails = dbAssessment.qaData.getString('5.97')
        this.financeLinkedToHarm = dbAssessment.qaData.getString('5.98')
        this.financeLinkedToReoffending = dbAssessment.qaData.getString('5.99')
    }
}
