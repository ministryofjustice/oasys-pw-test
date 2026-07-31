import * as common from '../common'
import * as dbClasses from 'fixtures/api/data/dbClasses'

export function assessmentFilter(dbAssessment: dbClasses.DbAssessmentOrRsr): boolean {

    return ['LAYER1', 'LAYER2', 'LAYER3'].includes(dbAssessment.assessmentType)
}

export function assessmentWithRsrFilter(dbAssessment: dbClasses.DbAssessmentOrRsr): boolean {

    return ['LAYER1', 'LAYER2', 'LAYER3', 'STANDALONE'].includes(dbAssessment.assessmentType)
}

export function timelineAssessmentFilter(dbAssessment: dbClasses.DbAssessmentOrRsr): boolean {

    return ['LAYER1', 'LAYER2', 'LAYER3', 'OASYS2'].includes(dbAssessment.assessmentType)
}

export function timelineAssessmentWithRsrFilter(dbAssessment: dbClasses.DbAssessmentOrRsr): boolean {

    return ['LAYER1', 'LAYER2', 'LAYER3', 'STANDALONE', 'OASYS2'].includes(dbAssessment.assessmentType)
}
export class V4EndpointResponse extends common.EndpointResponse {

    probNumber: string
    prisNumber: string

    timeline: V4TimelineAssessment[] = []
    assessments: V4AssessmentCommon[]

    // # properties are hidden so are ignored when comparing the API response
    #lastCompleteIndex = -1
    #lastWIPIndex = -1
    #lastSignedIndex = -1
    #lastPartCompSignedIndex = -1
    #lastPartCompUnsignedIndex = -1
    #latestSignLockDate: string = null
    #latestAssessmentIndex = -1
    #latestCompleteDate: string = null

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
        if (offenderData.nomisId == null) {
            delete this.prisNumber
        } else {
            this.prisNumber = offenderData.nomisId
        }
        if (offenderData.probationCrn == null) {
            delete this.probNumber
        } else {
            this.probNumber = offenderData.probationCrn
        }
        // Remove standard properties in the v1-3 endpoints that are not used in v4
        if (!['v4AssList', 'pni', 'tierRiskFlag'].includes(parameters.endpoint)) {
            delete this.inputs['crn']
        }
        if (!['tierRiskFlag', 'tierPredictors'].includes(parameters.endpoint)) {
            delete this['crn-deprecated']
            delete this['crn']
        }
        delete this.inputs['expectedStatus']

        // Timeline calcs include standalone CSRPs for some endpoints
        let includeRsr = ['v4AssList', 'v4RiskScoresRsr', 'tierPredictors'].includes(parameters.endpoint)
        this.processTimeline(offenderData.assessments.filter(includeRsr ? timelineAssessmentWithRsrFilter : timelineAssessmentFilter))
    }

    processTimeline(dbAssessments: dbClasses.DbAssessmentOrRsr[], allAssessments: dbClasses.DbAssessmentOrRsr[] = []) {

        for (let i = 0; i < dbAssessments.length; i++) {
            this.timeline.push(new V4TimelineAssessment(dbAssessments[i]))

            if (dbAssessments[i].status == 'COMPLETE') {
                this.#lastCompleteIndex = i
                this.#latestCompleteDate = dbAssessments[i].completedDate
            }
            if (['OPEN', 'AWAITING_PSR', 'AWAITING_SBC'].includes(dbAssessments[i].status)) this.#lastWIPIndex = i
            if (['SIGNED', 'AWAITING_PSR', 'AWAITING_SBC'].includes(dbAssessments[i].status)) {
                this.#lastSignedIndex = i
                this.#latestSignLockDate = dbAssessments[i].signedDate
            }
            if (dbAssessments[i].status == 'LOCKED_INCOMPLETE' && dbAssessments[i].signedDate != null) this.#lastPartCompSignedIndex = i
            if (dbAssessments[i].status == 'LOCKED_INCOMPLETE' && dbAssessments[i].signedDate == null) this.#lastPartCompUnsignedIndex = i
        }
        this.#latestAssessmentIndex = this.timeline.length - 1

        // If lastCompleteDate is null, check for an earlier complete assessment that was excluded from the 6-month list.
        if (this.#latestCompleteDate == null) {
            const completedAssessments = allAssessments.filter((ass) => ass.status == 'COMPLETE' && ass.assessmentType == 'LAYER3')
            if (completedAssessments.length > 0) {
                this.#latestCompleteDate = completedAssessments[completedAssessments.length - 1].completedDate
            }
        }

        return
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr, assessmentType: any): any {

        const assessmentIndex = this.timeline.map((ass) => ass.assessmentPk).indexOf(dbAssessment.assessmentPk)
        if (assessmentIndex >= 0) {
            // can't pass private properties as parameters so have to copy them first
            const lastWIPIndex = this.#lastWIPIndex
            const lastSignedIndex = this.#lastSignedIndex
            const lastPartCompSignedIndex = this.#lastPartCompSignedIndex
            const lastPartCompUnsignedIndex = this.#lastPartCompUnsignedIndex
            const latestSignLockDate = this.#latestSignLockDate
            const latestCompleteDate = this.#latestCompleteDate
            const lastCompleteIndex = this.#lastCompleteIndex

            this.assessments.push(
                new assessmentType(
                    dbAssessment,
                    this.timeline,
                    assessmentIndex,
                    lastWIPIndex,
                    lastSignedIndex,
                    lastPartCompSignedIndex,
                    lastPartCompUnsignedIndex,
                    latestSignLockDate,
                    latestCompleteDate,
                    lastCompleteIndex
                )
            )

        }

        return null
    }
}

export class V4TimelineAssessment {

    assessmentPk: number
    assessmentVersion: number
    assessmentType: string
    initiationDate: string
    status: string
    partcompStatus?: string
    completedDate: string

    constructor(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        this.assessmentPk = dbAssessment.assessmentPk
        this.assessmentType = dbAssessment.assessmentType
        if (this.assessmentType == 'STANDALONE') {
            delete this.assessmentVersion
        } else {
            this.assessmentVersion = dbAssessment.assessmentVersion
        }
        this.initiationDate = dbAssessment.initiationDate
        this.status = dbAssessment.status
        if (this.status == 'LOCKED_INCOMPLETE') {
            this.partcompStatus = (dbAssessment as dbClasses.DbAssessment).signedDate == null ? 'Unsigned' : 'Signed'
        } else {
            delete this.partcompStatus
        }
        if (['LOCKED_INCOMPLETE', 'COMPLETE'].includes(this.status)) {
            this.completedDate = dbAssessment.completedDate
        } else {
            delete this.completedDate
        }
    }
}

export class V4AssessmentCommon {

    assessmentPk: number
    assessmentType: string
    assessmentVersion: number
    dateCompleted: string
    assessorSignedDate: string
    initiationDate: string
    assessmentStatus: string
    superStatus: string
    laterWIPAssessmentExists: boolean
    latestWIPDate: string
    laterSignLockAssessmentExists: boolean
    latestSignLockDate: string
    laterPartCompSignedAssessmentExists: boolean
    latestPartCompSignedDate: string
    laterPartCompUnsignedAssessmentExists: boolean
    latestPartCompUnsignedDate: string
    laterCompleteAssessmentExists: boolean
    latestCompleteDate: string

    assessor: { name: string } = { name: '' }

    constructor(
        assessment: dbClasses.DbAssessmentOrRsr,
        timeline: V4TimelineAssessment[],
        assessmentIndex: number,
        lastWIPIndex: number,
        lastSignedIndex: number,
        lastPartcompSignedIndex: number,
        lastPartcompUnsignedIndex: number,
        latestSignLockDate: string,
        latestCompleteDate: string,
        lastCompleteIndex: number
    ) {

        this.assessmentPk = assessment.assessmentPk
        this.assessmentType = assessment.assessmentType
        if (this.assessmentType == 'STANDALONE') {
            delete this.assessmentVersion
        } else {
            this.assessmentVersion = assessment.assessmentVersion
        }
        this.dateCompleted = assessment.completedDate
        this.assessorSignedDate = assessment.signedDate
        this.initiationDate = assessment.initiationDate
        this.assessmentStatus = assessment.status
        this.superStatus = common.getSuperStatus(assessment.status)
        if (this.superStatus == 'PARTCOMP') {
            this.superStatus = this.assessorSignedDate == null ? 'PARTCOMP_UNSIGNED' : 'PARTCOMP_SIGNED'
        }
        this.laterWIPAssessmentExists = lastWIPIndex > assessmentIndex
        this.latestWIPDate = lastWIPIndex > -1 ? timeline[lastWIPIndex].initiationDate : null
        this.laterSignLockAssessmentExists = lastSignedIndex > assessmentIndex
        this.latestSignLockDate = latestSignLockDate
        this.laterPartCompSignedAssessmentExists = lastPartcompSignedIndex > assessmentIndex
        this.latestPartCompSignedDate = lastPartcompSignedIndex > -1 ? timeline[lastPartcompSignedIndex].initiationDate : null
        this.laterPartCompUnsignedAssessmentExists = lastPartcompUnsignedIndex > assessmentIndex
        this.latestPartCompUnsignedDate = lastPartcompUnsignedIndex > -1 ? timeline[lastPartcompUnsignedIndex].initiationDate : null
        this.laterCompleteAssessmentExists = lastCompleteIndex > assessmentIndex
        this.latestCompleteDate = latestCompleteDate

        this.assessor.name = (assessment as dbClasses.DbAssessment).assessorName
    }
}

