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
    #lastWipDate: string = null
    #lastPartCompSignedDate: string = null
    #lastPartCompUnsignedDate: string = null
    #lastSignedDate: string = null
    #lastCompleteDate: string = null

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
        delete this['crn-deprecated']
        delete this['crn']
        delete this.inputs['expectedStatus']

        // Timeline calcs include standalone CSRPs for some endpoints
        let includeRsr = ['v4AssList', 'v4RiskScoresRsr', 'tierPredictors'].includes(parameters.endpoint)
        this.processTimeline(offenderData.assessments.filter(includeRsr ? timelineAssessmentWithRsrFilter : timelineAssessmentFilter))
    }

    processTimeline(dbAssessments: dbClasses.DbAssessmentOrRsr[], allAssessments: dbClasses.DbAssessmentOrRsr[] = []) {

        for (let i = 0; i < dbAssessments.length; i++) {

            const initiationDate = dbAssessments[i].initiationDate
            const signedDate = dbAssessments[i].signedDate
            const completedDate = dbAssessments[i].completedDate

            this.timeline.push(new V4TimelineAssessment(dbAssessments[i]))

            switch (dbAssessments[i].status) {
                case 'COMPLETE':
                    if (!this.#lastCompleteDate || completedDate > this.#lastCompleteDate) {
                        this.#lastCompleteDate = completedDate
                    }
                    break
                case 'OPEN':
                case 'AWAITING_PSR':
                case 'AWAITING_SBC':
                    if (!this.#lastWipDate || initiationDate > this.#lastWipDate) {
                        this.#lastWipDate = initiationDate
                    }
                    break
                case 'SIGNED':
                case 'AWAITING_PSR':
                case 'AWAITING_SBC':
                    if (!this.#lastSignedDate || signedDate > this.#lastSignedDate) {
                        this.#lastSignedDate = signedDate
                    }
                    break
                case 'LOCKED_INCOMPLETE':
                    if (signedDate && (!this.#lastPartCompSignedDate || initiationDate > this.#lastPartCompSignedDate)) {
                        this.#lastPartCompSignedDate = initiationDate
                    }
                    if (!signedDate && (!this.#lastPartCompUnsignedDate || initiationDate > this.#lastPartCompUnsignedDate)) {
                        this.#lastPartCompUnsignedDate = initiationDate
                    }
                    break
            }
        }

        // // If lastCompleteDate is null, check for an earlier complete assessment that was excluded from the 6-month list.
        // if (!this.#lastCompleteDate == null) {
        //     const completedAssessments = allAssessments.filter((ass) => ass.status == 'COMPLETE' && ass.assessmentType == 'LAYER3')
        //     if (completedAssessments.length > 0) {
        //         this.#lastCompleteDate = completedAssessments[completedAssessments.length - 1].completedDate
        //     }
        // }

        return
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr, assessmentType: any): any {

        const assessmentIndex = this.timeline.map((ass) => ass.assessmentPk).indexOf(dbAssessment.assessmentPk)
        if (assessmentIndex >= 0) {
            // can't pass private properties as parameters so have to copy them first
            const lastWipDate = this.#lastWipDate
            const lastSignedDate = this.#lastSignedDate
            const lastPartCompSignedDate = this.#lastPartCompSignedDate
            const lastPartCompUnsignedDate = this.#lastPartCompUnsignedDate
            const lastCompleteDate = this.#lastCompleteDate

            this.assessments.push(
                new assessmentType(
                    dbAssessment,
                    this.timeline,
                    lastWipDate,
                    lastSignedDate,
                    lastPartCompSignedDate,
                    lastPartCompUnsignedDate,
                    lastCompleteDate
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
        lastWipDate: string,
        lastSignedDate: string,
        lastPartCompSignedDate: string,
        lastPartCompUnsignedDate: string,
        lastCompleteDate: string,
    ) {

        this.assessmentPk = assessment.assessmentPk
        this.assessmentType = assessment.assessmentType
        this.assessmentVersion = assessment.assessmentVersion
        this.dateCompleted = assessment.completedDate
        this.assessorSignedDate = assessment.signedDate
        this.initiationDate = assessment.initiationDate
        this.assessmentStatus = assessment.status
        this.superStatus = common.getSuperStatus(assessment.status)
        if (this.superStatus == 'PARTCOMP') {
            this.superStatus = this.assessorSignedDate == null ? 'PARTCOMP_UNSIGNED' : 'PARTCOMP_SIGNED'
        }
        this.laterWIPAssessmentExists = lastWipDate ? lastWipDate > this.initiationDate : false
        this.latestWIPDate = lastWipDate
        this.laterSignLockAssessmentExists = lastSignedDate ? lastSignedDate > (this.assessorSignedDate ?? this.initiationDate) : false
        this.latestSignLockDate = lastSignedDate
        this.laterPartCompSignedAssessmentExists = lastPartCompSignedDate ? lastPartCompSignedDate > this.initiationDate : false
        this.latestPartCompSignedDate = lastPartCompSignedDate
        this.laterPartCompUnsignedAssessmentExists = lastPartCompUnsignedDate ? lastPartCompUnsignedDate > this.initiationDate : false
        this.latestPartCompUnsignedDate = lastPartCompUnsignedDate
        this.laterCompleteAssessmentExists = lastCompleteDate ? lastCompleteDate > (this.dateCompleted ?? this.initiationDate) : false
        this.latestCompleteDate = lastCompleteDate

        // // Handle sequencing of overlapping assessment/CSRP
        // if (this.latestCompleteDate && this.dateCompleted && (this.dateCompleted > this.latestCompleteDate)) {
        //     this.laterCompleteAssessmentExists = false
        // }

        this.assessor.name = (assessment as dbClasses.DbAssessment).assessorName
    }
}

