import * as apCommon from './apCommon'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const timelineAssessments = offenderData.assessments.filter((ass) => !['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType))
    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new APNeedsEndpointResponse(offenderData, parameters)
        result.processTimeline(timelineAssessments, offenderData.assessments)
        result.addAssessment(assessment)

        return result
    }
}

export class APNeedsEndpointResponse extends apCommon.APEndpointResponse {

    assessments: APNeedsAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, APNeedsAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addOffencesDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class APNeedsAssessment extends apCommon.APAssessmentCommon {

    offenceAnalysisDetails: string
    offenceLinkedToHarm: string
    accIssuesDetails: string
    accLinkedToHarm: string
    accLinkedToReoffending: string
    eTEIssuesDetails: string
    eTELinkedToHarm: string
    eTELinkedToReoffending: string
    financeIssuesDetails: string
    financeLinkedToHarm: string
    financeLinkedToReoffending: string
    relIssuesDetails: string
    relLinkedToHarm: string
    relLinkedToReoffending: string
    lifestyleIssuesDetails: string
    lifestyleLinkedToHarm: string
    lifestyleLinkedToReoffending: string
    drugIssuesDetails: string
    drugLinkedToHarm: string
    drugLinkedToReoffending: string
    alcoholIssuesDetails: string
    alcoholLinkedToHarm: string
    alcoholLinkedToReoffending: string
    emoIssuesDetails: string
    emoLinkedToHarm: string
    emoLinkedToReoffending: string
    thinkIssuesDetails: string
    thinkLinkedToHarm: string
    thinkLinkedToReoffending: string
    attIssuesDetails: string
    attLinkedToHarm: string
    attLinkedToReoffending: string


    addOffencesDetails(assessment: dbClasses.DbAssessment) {

        this.offenceAnalysisDetails = assessment.qaData.getString('2.98')
        this.offenceLinkedToHarm = assessment.qaData.getString('2.99')

        this.accIssuesDetails = assessment.qaData.getString('3.97')
        this.accLinkedToHarm = assessment.qaData.getString('3.98')
        this.accLinkedToReoffending = assessment.qaData.getString('3.99')

        this.eTEIssuesDetails = assessment.qaData.getString('4.94')
        this.eTELinkedToHarm = assessment.qaData.getString('4.96')
        this.eTELinkedToReoffending = assessment.qaData.getString('4.98')

        this.financeIssuesDetails = assessment.qaData.getString('5.97')
        this.financeLinkedToHarm = assessment.qaData.getString('5.98')
        this.financeLinkedToReoffending = assessment.qaData.getString('5.99')

        this.relIssuesDetails = assessment.qaData.getString('6.97')
        this.relLinkedToHarm = assessment.qaData.getString('6.98')
        this.relLinkedToReoffending = assessment.qaData.getString('6.99')

        this.lifestyleIssuesDetails = assessment.qaData.getString('7.97')
        this.lifestyleLinkedToHarm = assessment.qaData.getString('7.98')
        this.lifestyleLinkedToReoffending = assessment.qaData.getString('7.99')

        this.drugIssuesDetails = assessment.qaData.getString('8.97')
        this.drugLinkedToHarm = assessment.qaData.getString('8.98')
        this.drugLinkedToReoffending = assessment.qaData.getString('8.99')

        this.alcoholIssuesDetails = assessment.qaData.getString('9.97')
        this.alcoholLinkedToHarm = assessment.qaData.getString('9.98')
        this.alcoholLinkedToReoffending = assessment.qaData.getString('9.99')

        this.emoIssuesDetails = assessment.qaData.getString('10.97')
        this.emoLinkedToHarm = assessment.qaData.getString('10.98')
        this.emoLinkedToReoffending = assessment.qaData.getString('10.99')

        this.thinkIssuesDetails = assessment.qaData.getString('11.97')
        this.thinkLinkedToHarm = assessment.qaData.getString('11.98')
        this.thinkLinkedToReoffending = assessment.qaData.getString('11.99')

        this.attIssuesDetails = assessment.qaData.getString('12.97')
        this.attLinkedToHarm = assessment.qaData.getString('12.98')
        this.attLinkedToReoffending = assessment.qaData.getString('12.99')
    }
}
