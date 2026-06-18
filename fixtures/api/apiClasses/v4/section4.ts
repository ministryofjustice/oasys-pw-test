import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section4EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section4EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section4Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section4Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section4Assessment extends v4Common.V4AssessmentCommon {

    unemployed: string
    problemAreas: string[]
    initSkillsCheckerScore: string
    employmentHistory: string
    workRelatedSkills: string
    attitudeToEmployment: string
    schoolAttendance: string
    problemsReadWriteNum: string
    learningDifficulties: string
    qualifications: string
    attitudeToEducationTraining: string
    basicSkillsScore: string
    eTEIssuesDetails: string
    eTELinkedToHarm: string
    eTELinkedToReoffending: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.unemployed = dbAssessment.qaData.getString('4.2')
        this.problemAreas = dbAssessment.qaData.getStringArray('4.7.1')
        this.initSkillsCheckerScore = dbAssessment.qaData.getString('4.92')
        this.employmentHistory = dbAssessment.qaData.getString('4.3')
        this.workRelatedSkills = dbAssessment.qaData.getString('4.4')
        this.attitudeToEmployment = dbAssessment.qaData.getString('4.5')
        this.schoolAttendance = dbAssessment.qaData.getString('4.6')
        this.problemsReadWriteNum = dbAssessment.qaData.getString('4.7')
        this.learningDifficulties = dbAssessment.qaData.getString('4.8')
        this.qualifications = dbAssessment.qaData.getString('4.9')
        this.attitudeToEducationTraining = dbAssessment.qaData.getString('4.10')
        this.basicSkillsScore = dbAssessment.qaData.getString('4.90')
        this.eTEIssuesDetails = dbAssessment.qaData.getString('4.94')
        this.eTELinkedToHarm = dbAssessment.qaData.getString('4.96')
        this.eTELinkedToReoffending = dbAssessment.qaData.getString('4.98')

    }
}
