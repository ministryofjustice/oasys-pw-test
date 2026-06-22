import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new Section2EndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class Section2EndpointResponse extends v4Common.V4EndpointResponse {

    assessments: Section2Assessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, Section2Assessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class Section2Assessment extends v4Common.V4AssessmentCommon {

    victimPerpetratorRel: string
    offenceAnalysis: string
    involveCarryingWeapon: string
    victimInfo: string
    sexual: string
    whichWeapon: string
    acceptsResponsibility: string
    whatWasInvolved: string[] = null  //////////////// should be removed?
    typeOfWeapon: string = null  //////////////// should be removed?
    involveViolenceOrThreat: string
    otherMotivationText: string
    financial: string
    involveExcessiveViolence: string
    whatOccurred: string[]
    addictions: string
    involveArson: string
    emotional: string
    involvePhysicalDamage: string
    victimImpact: string
    racial: string
    involveSexualElement: string
    recognisesImpact: string
    thrillSeeking: string
    involveDomesticAbuse: string
    otherInvolved: string
    other: string
    numberOfOthersInvolved: string
    peerGroupInfluences: string
    othersInvolved: string
    offenceMotivation: string
    disinhibitors: string[]
    acceptsResponsibilityYesNo: string
    patternOffending: string
    escalationOfSeriousness: string
    partOfEstablishedPattern: string
    offenceLinkedToReoffending: string
    offenceLinkedToHarm: string


    addDetails(dbAssessment: dbClasses.DbAssessment) {

        this.victimPerpetratorRel = dbAssessment.qaData.getString('2.4.2')
        this.offenceAnalysis = utils.jsonString(dbAssessment.qaData.getString('2.1'), { remove002: true })
        this.victimInfo = dbAssessment.qaData.getString('2.4.1')
        this.acceptsResponsibility = dbAssessment.qaData.getString('2.11.t')
        this.whatOccurred = dbAssessment.qaData.getStringArray('2.3')
        this.victimImpact = dbAssessment.qaData.getString('2.5')
        this.recognisesImpact = dbAssessment.qaData.getString('2.6')
        this.otherInvolved = dbAssessment.qaData.getString('2.7')
        this.numberOfOthersInvolved = dbAssessment.qaData.getString('2.7.1')
        this.peerGroupInfluences = dbAssessment.qaData.getString('2.7.2')
        this.othersInvolved = dbAssessment.qaData.getString('2.7.3')
        this.offenceMotivation = utils.jsonString(dbAssessment.qaData.getString('2.8'), { remove002: true })
        this.disinhibitors = dbAssessment.qaData.getStringArray('2.10')
        this.acceptsResponsibilityYesNo = dbAssessment.qaData.getString('2.11')
        this.patternOffending = dbAssessment.qaData.getString('2.12')
        this.escalationOfSeriousness = dbAssessment.qaData.getString('2.13')
        this.partOfEstablishedPattern = dbAssessment.qaData.getString('2.14')
        this.offenceLinkedToReoffending = dbAssessment.qaData.getString('2.98')
        this.offenceLinkedToHarm = dbAssessment.qaData.getString('2.99')

        if (oasysDateTime.checkIfAfterReleaseNode('6.35', dbAssessment.initiationDate)) {
            this.involveCarryingWeapon = dbAssessment.qaData.getString('2.2_V2_WEAPON')
            this.involveViolenceOrThreat = dbAssessment.qaData.getString('2.2_V2_ANYVIOL')
            this.involveExcessiveViolence = dbAssessment.qaData.getString('2.2_V2_EXCESSIVE')
            this.involveArson = dbAssessment.qaData.getString('2.2_V2_ARSON')
            this.involvePhysicalDamage = dbAssessment.qaData.getString('2.2_V2_PHYSICALDAM')
            this.involveSexualElement = dbAssessment.qaData.getString('2.2_V2_SEXUAL')
            this.involveDomesticAbuse = dbAssessment.qaData.getString('2.2_V2_DOM_ABUSE')
            this.whichWeapon = dbAssessment.qaData.getString('2.2.t_V2')
        } else {
            const whatWasInvolved = dbAssessment.qaData.getStringArray('2.2')
            if (whatWasInvolved != null && whatWasInvolved != undefined) {
                this.involveCarryingWeapon = whatWasInvolved.includes('Carrying or using a weapon') ? 'Yes' : null
                this.involveViolenceOrThreat = whatWasInvolved.includes('Any violence or threat of violence / coercion') ? 'Yes' : null
                this.involveExcessiveViolence = whatWasInvolved.includes('Excessive use of violence / sadistic violence') ? 'Yes' : null
                this.involveArson = whatWasInvolved.includes('Arson') ? 'Yes' : null
                this.involvePhysicalDamage = whatWasInvolved.includes('Physical damage to property') ? 'Yes' : null
                this.involveSexualElement = whatWasInvolved.includes('Sexual element') ? 'Yes' : null
                this.involveDomesticAbuse = whatWasInvolved.includes('Domestic abuse') ? 'Yes' : null
            } else {
                this.involveCarryingWeapon = null
                this.involveViolenceOrThreat = null
                this.involveExcessiveViolence = null
                this.involveArson = null
                this.involvePhysicalDamage = null
                this.involveSexualElement = null
                this.involveDomesticAbuse = null
            }
            this.whichWeapon = dbAssessment.qaData.getString('2.2.t')
        }

        if (oasysDateTime.checkIfAfterReleaseNode('6.35', dbAssessment.initiationDate)) {
            this.sexual = dbAssessment.qaData.getString('2.9_V2_SEXUAL')
            this.financial = dbAssessment.qaData.getString('2.9_V2_FINANCIAL')
            this.addictions = dbAssessment.qaData.getString('2.9_V2_ADDICTION')
            this.emotional = dbAssessment.qaData.getString('2.9_V2_EMOTIONAL')
            this.racial = dbAssessment.qaData.getString('2.9_V2_RACIAL')
            this.thrillSeeking = dbAssessment.qaData.getString('2.9_V2_THRILL')
            this.other = dbAssessment.qaData.getString('2.9_V2_OTHER')
            this.otherMotivationText = dbAssessment.qaData.getString('2.9.t_V2')
        } else {
            const offenceInvolved = dbAssessment.qaData.getString('2.9')
            if (offenceInvolved != null && offenceInvolved != undefined) {
                this.sexual = offenceInvolved.includes('Sexual motivation') ? 'Yes' : null
                this.financial = offenceInvolved.includes('Financial motivation') ? 'Yes' : null
                this.addictions = offenceInvolved.includes('Addiction / perceived needs') ? 'Yes' : null
                this.emotional = offenceInvolved.includes('Emotional state of offender') ? 'Yes' : null
                this.racial = offenceInvolved.includes('Racial motivation or hatred of other identifiable group') ? 'Yes' : null
                this.thrillSeeking = offenceInvolved.includes('Thrill seeking') ? 'Yes' : null
                this.other = offenceInvolved.includes('Other') ? 'Yes' : null
            } else {
                this.sexual = null
                this.financial = null
                this.addictions = null
                this.emotional = null
                this.racial = null
                this.thrillSeeking = null
                this.other = null
            }
            this.otherMotivationText = dbAssessment.qaData.getString('2.9.t')
        }
    }
}
