import * as v1Common from './v1Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const relevantAssessments = offenderData.assessments.filter((ass) => !(['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType)))

    if (relevantAssessments.length == 0) {
        return env.restErrorResults.noAssessments
    } else {
        const result = new RmpEndpointResponse(offenderData, parameters)

        result.addTimeline(relevantAssessments)
        result.addRmpTimeline(relevantAssessments)
        result.addLatestAssessment(relevantAssessments)

        return result
    }
}


export class RmpEndpointResponse extends v1Common.V1EndpointResponse {

    rmpTimeline: v1Common.TimelineAssessment[] = []
    assessments: RMPAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addRmpTimeline(dbAssessments: dbClasses.DbAssessmentOrRsr[]) {

        for (let i = 0; i < dbAssessments.length; i++) {
            const assessment = dbAssessments[i] as dbClasses.DbAssessment
            if (['M', 'H', 'V'].includes(assessment.roshLevel)) {

                if (assessment.qaData.getString('RM28') || assessment.qaData.getString('RM28.1') || assessment.qaData.getString('RM30') || assessment.qaData.getString('RM31')
                    || assessment.qaData.getString('RM32') || assessment.qaData.getString('RM33') || assessment.qaData.getString('RM34')) {
                    if (this.rmpTimeline == undefined) {
                        this.rmpTimeline = []
                    }
                    this.rmpTimeline.push(new v1Common.TimelineAssessment(dbAssessments[i]))

                }
            }
        }
        if (this.rmpTimeline.length == 0) {
            delete this.rmpTimeline
        }
    }

    addLatestAssessment(dbAssessments: dbClasses.DbAssessmentOrRsr[]): number {

        const assessmentIndex = super.addLatestAssessment(dbAssessments, RMPAssessment, false)

        if (assessmentIndex >= 0) {
            this.assessments[0].addRmpDetails(dbAssessments[assessmentIndex] as dbClasses.DbAssessment)
        }

        return assessmentIndex
    }
}

class RMPAssessment extends v1Common.V1AssessmentCommon {

    keyInformationCurrentSituation: string = null
    furtherConsiderationsCurrentSituation: string = null
    supervision: string = null
    monitoringAndControl: string = null
    interventionsAndTreatment: string = null
    victimSafetyPlanning: string = null
    contingencyPlans: string = null


    addRmpDetails(assessment: dbClasses.DbAssessment) {

        if (['M', 'H', 'V'].includes(assessment.roshLevel)) {
            this.keyInformationCurrentSituation = assessment.qaData.getString('RM28.1')
            this.furtherConsiderationsCurrentSituation = assessment.qaData.getString('RM28')
            this.supervision = assessment.qaData.getString('RM30')
            this.monitoringAndControl = assessment.qaData.getString('RM31')
            this.interventionsAndTreatment = assessment.qaData.getString('RM32')
            this.victimSafetyPlanning = assessment.qaData.getString('RM33')
            this.contingencyPlans = assessment.qaData.getString('RM34')
        }
    }
}


export class OffenceDetails {

    type: string
    offenceDate?: string
    offenceCode: string
    offenceSubCode: string
    offence: string
    subOffence: string

    constructor(dbOffence: dbClasses.DbOffence) {

        this.type = dbOffence.type
        if (dbOffence.offenceDate != undefined) this.offenceDate = dbOffence.offenceDate
        this.offenceCode = dbOffence.offenceCode
        this.offenceSubCode = dbOffence.offenceSubCode
        this.offence = dbOffence.offence
        this.subOffence = dbOffence.subOffence
    }
}

export class VictimDetails {

    age: string
    gender: string
    ethnicCategory: string
    victimRelation: string

    constructor(dbVictim: dbClasses.DbVictim) {

        this.age = dbVictim.age
        this.gender = dbVictim.gender
        this.ethnicCategory = dbVictim.ethnicCategory
        this.victimRelation = dbVictim.victimRelation
    }
}