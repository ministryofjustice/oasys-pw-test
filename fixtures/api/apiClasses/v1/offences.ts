import * as v1Common from './v1Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const relevantAssessments = offenderData.assessments.filter((ass) => !(['SARA', 'RM2000', 'BCS', 'TR_BCS', 'STANDALONE'].includes(ass.assessmentType)))

    if (relevantAssessments.filter((ass) => ass.status == 'COMPLETE').length == 0) {
        return env.restErrorResults.noAssessments
    } else {
        const result = new OffencesEndpointResponse(offenderData, parameters)

        result.addTimeline(relevantAssessments)
        result.addLatestAssessment(relevantAssessments)

        return result
    }
}


export class OffencesEndpointResponse extends v1Common.V1EndpointResponse {

    assessments: OffencesAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addLatestAssessment(dbAssessments: dbClasses.DbAssessmentOrRsr[]): number {

        const lastCompleteIndex = super.addLatestAssessment(dbAssessments, OffencesAssessment, true)

        if (lastCompleteIndex >= 0) {

            const assessment = dbAssessments[lastCompleteIndex] as dbClasses.DbAssessment
            this.assessments[0].addOffencesDetails(assessment)

            const filteredOffences = assessment.offences.filter((o) => o.type != null && o.offenceCode != null && o.offenceSubCode != null)
            if (filteredOffences.length > 0) {
                this.assessments[0].offenceDetails = []
                filteredOffences.forEach((offence) => {
                    if (offence.type != null && offence.offenceCode != null && offence.offenceSubCode != null) {
                        this.assessments[0].offenceDetails.push(new OffenceDetails(offence))
                    }
                })
            }
            if (assessment.victims.length > 0) {
                this.assessments[0].victimDetails = []
                assessment.victims.forEach((victim) => this.assessments[0].victimDetails.push(new VictimDetails(victim)))
            }
        }

        return lastCompleteIndex
    }
}

class OffencesAssessment extends v1Common.V1AssessmentCommon {

    offence: string = null
    disinhibitors: string[] = null
    patternOfOffending: string = null
    offenceInvolved: string[] = null
    specificWeapon: string = null
    evidencedMotivations: string[]
    otherMotivation: string = null
    victimPerpetratorRelationship: string = null
    victimOtherInfo: string = null
    offenceDetails: OffenceDetails[] = null
    victimDetails: VictimDetails[] = null


    addOffencesDetails(assessment: dbClasses.DbAssessment) {

        this.offence = assessment.qaData.getString('2.1')
        this.disinhibitors = assessment.qaData.getStringArray('2.10')
        this.patternOfOffending = assessment.qaData.getString('2.12')

        this.offenceInvolved = assessment.qaData.getMultipleAsArray(
            ['2.2_V2_WEAPON', '2.2_V2_ANYVIOL', '2.2_V2_EXCESSIVE', '2.2_V2_ARSON', '2.2_V2_PHYSICALDAM', '2.2_V2_SEXUAL', '2.2_V2_DOM_ABUSE'], dictionary)
        if (this.offenceInvolved == null) {  // Check for pre-6.35 style answers
            this.offenceInvolved = assessment.qaData.getStringArray('2.2')
        }
        this.specificWeapon = assessment.qaData.getString('2.2.t_V2')
        if (this.specificWeapon == null) {
            this.specificWeapon = assessment.qaData.getString('2.2.t')
        }
        this.victimPerpetratorRelationship = assessment.qaData.getString('2.4.2')
        this.victimOtherInfo = assessment.qaData.getString('2.4.1')

        this.evidencedMotivations = assessment.qaData.getMultipleAsArray(
            ['2.9_V2_SEXUAL', '2.9_V2_FINANCIAL', '2.9_V2_ADDICTION', '2.9_V2_EMOTIONAL', '2.9_V2_RACIAL', '2.9_V2_THRILL', '2.9_V2_OTHER'], dictionary)
        this.otherMotivation = assessment.qaData.getString('2.9.t_V2')
        if (this.evidencedMotivations == null) {  // Check for pre-6.35 style answers
            this.evidencedMotivations = assessment.qaData.getStringArray('2.9')
            this.otherMotivation = assessment.qaData.getString('2.9.t')

        }
    }
}


const dictionary = {
    'ALCHO': 'Alcohol',
    'DRUGS': 'Drugs',
    'EMOT': 'Emotional state',
    'NONMED': 'Non-compliance with medication',
    'PORNOG': 'Pornography',
    'PSYCH': 'Psychiatric problems',
    'TRAUM': 'Traumatic life event (divorce, redundancy)',
    '2.2_V2_WEAPON': 'Carrying or using a weapon',
    '2.2_V2_ANYVIOL': 'Any violence or threat of violence / coercion',
    '2.2_V2_EXCESSIVE': 'Excessive use of violence / sadistic violence',
    '2.2_V2_ARSON': 'Arson',
    '2.2_V2_PHYSICALDAM': 'Physical damage to property',
    '2.2_V2_SEXUAL': 'Sexual element',
    '2.2_V2_DOM_ABUSE': 'Domestic abuse',
    '2.9_V2_SEXUAL': 'Sexual motivation',
    '2.9_V2_FINANCIAL': 'Financial motivation',
    '2.9_V2_ADDICTION': 'Addiction / perceived needs',
    '2.9_V2_EMOTIONAL': 'Emotional state of offender',
    '2.9_V2_RACIAL': 'Racial motivation or hatred of other identifiable group',
    '2.9_V2_THRILL': 'Thrill seeking',
    '2.9_V2_OTHER': 'Other',
    'ANYVIOL': 'Any violence or threat of violence / coercion',
    'ARSON': 'Arson',
    'DOM_ABUSE': 'Domestic abuse',
    'EXCESSIVE': 'Excessive use of violence / sadistic violence',
    'PHYSICALDAM': 'Physical damage to property',
    'SEXUAL': 'Sexual element',
    'WEAPON': 'Carrying or using a weapon',
}

const dictionary2_9 = {

    'ADDICTION': 'Addiction / perceived needs',
    'EMOTIONAL': 'Emotional state of offender',
    'FINANCIAL': 'Financial motivation',
    'OTHER': 'Other',
    'RACIAL': 'Racial motivation or hatred of other identifiable group',
    'SEXUAL': 'Sexual motivation',
    'THRILL': 'Thrill seeking',
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
        if (dbOffence.offenceDate == undefined) {
            delete this.offenceDate
        } else {
            this.offenceDate = dbOffence.offenceDate
        }
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

        if (dbVictim.age) {
            this.age = dbVictim.age
        } else {
            delete this.age
        }
        if (dbVictim.gender) {
            this.gender = dbVictim.gender
        } else {
            delete this.gender
        }
        if (dbVictim.ethnicCategory) {
            this.ethnicCategory = dbVictim.ethnicCategory
        } else {
            delete this.ethnicCategory
        }
        if (dbVictim.victimRelation) {
            this.victimRelation = dbVictim.victimRelation
        } else {
            delete this.victimRelation
        }
    }
}