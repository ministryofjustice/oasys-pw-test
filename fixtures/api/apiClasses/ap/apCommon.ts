import * as common from '../common'
import * as dbClasses from 'fixtures/api/data/dbClasses'

export function assessmentFilter(dbAssessment: dbClasses.DbAssessmentOrRsr): boolean {

    return dbAssessment.assessmentType == 'LAYER3'
}

export class APEndpointResponse extends common.EndpointResponse {

    assessments: APAssessmentCommon[]
    warnings: string[]

    // # properties are hidden so are ignored when comparing the API response
    #timeline: APTimelineAssessment[] = []
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
        if (parameters.assessmentPk != undefined) this.inputs['assessmentPk'] = parameters.assessmentPk
        if (parameters.expectedStatus != undefined) this.inputs['expectedStatus'] = parameters.expectedStatus
    }

    processTimeline(dbAssessments: dbClasses.DbAssessmentOrRsr[], allAssessments: dbClasses.DbAssessmentOrRsr[] = []): APTimelineAssessment[] {

        for (let i = 0; i < dbAssessments.length; i++) {
            this.#timeline.push(new APTimelineAssessment(dbAssessments[i]))

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
        this.#latestAssessmentIndex = this.#timeline.length - 1

        // If lastCompleteDate is null, check for an earlier complete assessment that was excluded from the 6-month list.
        if (this.#latestCompleteDate == null) {
            const completedAssessments = allAssessments.filter((ass) => ass.status == 'COMPLETE' && ass.assessmentType == 'LAYER3')
            if (completedAssessments.length > 0) {
                this.#latestCompleteDate = completedAssessments[completedAssessments.length - 1].completedDate
            }
        }

        return this.#timeline
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr, assessmentType: any): any {

        const assessmentIndex = this.#timeline.map((ass) => ass.assessmentPk).indexOf(dbAssessment.assessmentPk)
        if (assessmentIndex >= 0) {
            // can't pass private properties as parameters so have to copy them first
            const lastWIPIndex = this.#lastWIPIndex
            const lastSignedIndex = this.#lastSignedIndex
            const lastPartCompSignedIndex = this.#lastPartCompSignedIndex
            const lastPartCompUnsignedIndex = this.#lastPartCompUnsignedIndex
            const latestSignLockDate = this.#latestSignLockDate
            const latestCompleteDate = this.#latestCompleteDate
            const lastCompleteIndex = this.#lastCompleteIndex
            const timeline = this.#timeline

            this.assessments.push(
                new assessmentType(
                    dbAssessment,
                    timeline,
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

        if (assessmentIndex < this.#timeline.length - 1) {
            this.warnings = [' Assessment is no longer the latest assessment for this offender']
        } else {
            delete this.warnings
        }
        return null
    }
}

export class APTimelineAssessment {

    assessmentPk: number
    assessmentType: string
    assessmentVersion: string
    initiationDate: string
    status: string
    partcompStatus?: string
    completedDate: string

    constructor(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        this.assessmentPk = dbAssessment.assessmentPk
        this.assessmentType = dbAssessment.assessmentType
        this.assessmentVersion = dbAssessment.assessmentVersion.toString()
        this.initiationDate = dbAssessment.initiationDate
        this.status = dbAssessment.status
        if (this.status == 'LOCKED_INCOMPLETE') {
            this.partcompStatus = (dbAssessment as dbClasses.DbAssessment).signedDate == null ? 'Unsigned' : 'Signed'
        } else {
            delete this.partcompStatus
        }
        if (this.status != 'OPEN' && this.status != 'SIGNED' && this.status != 'AWAITING_PSR' && this.status != 'AWAITING_SBC') {
            this.completedDate = dbAssessment.completedDate
        } else {
            delete this.completedDate
        }
    }
}

export class APAssessmentCommon {

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
    lastUpdatedDate: string

    constructor(
        assessment: dbClasses.DbAssessmentOrRsr,
        timeline: APTimelineAssessment[],
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
        this.assessmentVersion = assessment.assessmentVersion
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
        this.lastUpdatedDate = assessment.lastUpdatedDate
    }
}

