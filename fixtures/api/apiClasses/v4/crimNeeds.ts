import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'

export function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new CrimNeedsEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        delete result.timeline

        return result
    }
}

export class CrimNeedsEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: CrimNeedsAssessment[] = []

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, CrimNeedsAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment as dbClasses.DbAssessment)
        }
    }

}

export class CrimNeedsAssessment extends v4Common.V4AssessmentCommon {

    acc: {
        accThreshold?: number
        accLinkedToHarm?: string
        accLinkedToReoffending?: string
        accLowScoreNeedsAttention?: string
        accOtherWeightedScore?: number
    } = {}
    eTE: {
        eTEThreshold?: number
        eTELinkedToHarm?: string
        eTELinkedToReoffending?: string
        eTELowScoreNeedsAttention?: string
        eTEOtherWeightedScore?: number
    } = {}
    finance: {
        financeThreshold?: number
        financeLinkedToHarm?: string
        financeLinkedToReoffending?: string
        financeLowScoreNeedsAttention?: string
        financeOtherWeightedScore?: number
    } = {}
    rel: {
        relThreshold?: number
        relLinkedToHarm?: string
        relLinkedToReoffending?: string
        relLowScoreNeedsAttention?: string
        relOtherWeightedScore?: number
    } = {}
    lifestyle: {
        lifestyleThreshold?: number
        lifestyleLinkedToHarm?: string
        lifestyleLinkedToReoffending?: string
        lifestyleLowScoreNeedsAttention?: string
        lifestyleOtherWeightedScore?: number
    } = {}
    drug: {
        drugThreshold?: number
        drugLinkedToHarm?: string
        drugLinkedToReoffending?: string
        drugLowScoreNeedsAttention?: string
        drugOtherWeightedScore?: number
    } = {}
    alcohol: {
        alcoholThreshold?: number
        alcoholLinkedToHarm?: string
        alcoholLinkedToReoffending?: string
        alcoholLowScoreNeedsAttention?: string
        alcoholOtherWeightedScore?: number
    } = {}
    emo: {
        emoThreshold?: number
        emoLinkedToHarm?: string
        emoLinkedToReoffending?: string
        emoLowScoreNeedsAttention?: string
        emoOtherWeightedScore?: number
    } = {}
    think: {
        thinkThreshold?: number
        thinkLinkedToHarm?: string
        thinkLinkedToReoffending?: string
        thinkLowScoreNeedsAttention?: string
        thinkOtherWeightedScore?: number
    } = {}
    att: {
        attThreshold?: number
        attLinkedToHarm?: string
        attLinkedToReoffending?: string
        attLowScoreNeedsAttention?: string
        attOtherWeightedScore?: number
    } = {}
    sanCrimNeedScore: SanCrimNeedScore

    addDetails(dbAssessment: dbClasses.DbAssessment) {

        delete this.assessor

        addSectionDetails(this.acc, dbAssessment, 'acc', '3', '3.98', '3.99')
        addSectionDetails(this.eTE, dbAssessment, 'eTE', '4', '4.96', '4.98')
        addSectionDetails(this.finance, dbAssessment, 'finance', '5', '5.98', '5.99')
        addSectionDetails(this.rel, dbAssessment, 'rel', '6', '6.98', '6.99')
        addSectionDetails(this.lifestyle, dbAssessment, 'lifestyle', '7', '7.98', '7.99')
        addSectionDetails(this.drug, dbAssessment, 'drug', '8', '8.98', '8.99')
        addSectionDetails(this.alcohol, dbAssessment, 'alcohol', '9', '9.98', '9.99')
        addSectionDetails(this.emo, dbAssessment, 'emo', '10', '10.98', '10.99')
        addSectionDetails(this.think, dbAssessment, 'think', '11', '11.98', '11.99')
        addSectionDetails(this.att, dbAssessment, 'att', '12', '12.98', '12.99')

        if (dbAssessment.assessmentType == 'LAYER3' && dbAssessment.assessmentVersion == 2 && dbAssessment.lastUpdateFromSan != null) {
            this.sanCrimNeedScore = new SanCrimNeedScore(dbAssessment)
        } else {
            this.sanCrimNeedScore = null
        }
    }
}

function addSectionDetails(result: { [key: string]: any }, dbAssessment: dbClasses.DbAssessment, prefix: string, sectionCode: string, harm: string, reoffending: string) {

    result[`${prefix}Threshold`] = dbAssessment.sections.find((s) => s.sectionCode == sectionCode)?.crimNeedScoreThreshold
    result[`${prefix}LinkedToHarm`] = dbAssessment.qaData.getString(harm)
    result[`${prefix}LinkedToReoffending`] = dbAssessment.qaData.getString(reoffending)
    result[`${prefix}LowScoreNeedsAttention`] = dbAssessment.sections.find((s) => s.sectionCode == sectionCode)?.lowScoreNeedsAttn
    result[`${prefix}OtherWeightedScore`] = dbAssessment.sections.find((s) => s.sectionCode == sectionCode)?.otherWeightedScore
}

export class SanCrimNeedScore {

    accomSan: {
        accomSanThreshold?: number
        accomSanScore?: number
        accomSanLinkedToHarm?: string
        accomSanLinkedToReoffending?: string
        accomSanStrength?: string
    } = {}

    empAndEduSan: {
        empAndEduSanThreshold?: number
        empAndEduSanScore?: number
        empAndEduSanLinkedToHarm?: string
        empAndEduSanLinkedToReoffending?: string
        empAndEduSanStrength?: string
    } = {}

    persRelAndCommSan: {
        persRelAndCommSanThreshold?: number
        persRelAndCommSanScore?: number
        persRelAndCommSanLinkedToHarm?: string
        persRelAndCommSanLinkedToReoffending?: string
        persRelAndCommSanStrength?: string
    } = {}

    lifeAndAssocSan: {
        lifeAndAssocSanThreshold?: number
        lifeAndAssocSanScore?: number
    } = {}

    drugUseSan: {
        drugUseSanThreshold?: number
        drugUseSanScore?: number
        drugUseSanLinkedToHarm?: string
        drugUseSanLinkedToReoffending?: string
        drugUseSanStrength?: string
    } = {}

    alcoUseSan: {
        alcoUseSanThreshold?: number
        alcoUseSanScore?: number
        alcoUseSanLinkedToHarm?: string
        alcoUseSanLinkedToReoffending?: string
        alcoUseSanStrength?: string
    } = {}

    thinkBehavAndAttiSan: {
        thinkBehavAndAttiSanThreshold?: number
        thinkBehavAndAttiSanScore?: number
        thinkBehavAndAttiSanLinkedToHarm?: string
        thinkBehavAndAttiSanLinkedToReoffending?: string
        thinkBehavAndAttiSanStrength?: string
    } = {}

    financeSan: {
        financeSanThreshold?: number
        financeSanScore?: number
        financeSanLinkedToHarm?: string
        financeSanLinkedToReoffending?: string
        financeSanStrength?: string
    } = {}

    healthAndWellbeingSan: {
        healthAndWellbeingSanThreshold?: number
        healthAndWellbeingSanScore?: number
        healthAndWellbeingSanLinkedToHarm?: string
        healthAndWellbeingSanLinkedToReoffending?: string
        healthAndWellbeingSanStrength?: string
    } = {}

    constructor(dbAssessment: dbClasses.DbAssessment) {

        addSanSectionDetails(this.accomSan, dbAssessment, 'accomSan', '3', '3.98', '3.99')
        addSanSectionDetails(this.empAndEduSan, dbAssessment, 'empAndEduSan', '4', '4.96', '4.98')
        addSanSectionDetails(this.persRelAndCommSan, dbAssessment, 'persRelAndCommSan', '6', '6.98', '6.99')
        addSanSectionDetails(this.lifeAndAssocSan, dbAssessment, 'lifeAndAssocSan', '7', '7.98', '7.99')
        addSanSectionDetails(this.drugUseSan, dbAssessment, 'drugUseSan', '8', '8.98', '8.99')
        addSanSectionDetails(this.alcoUseSan, dbAssessment, 'alcoUseSan', '9', '9.98', '9.99')
        addSanSectionDetails(this.thinkBehavAndAttiSan, dbAssessment, 'thinkBehavAndAttiSan', 'SAN', '11.98', '11.99')
        addSanSectionDetails(this.financeSan, dbAssessment, 'financeSan', '5', '5.98', '5.99')
        addSanSectionDetails(this.healthAndWellbeingSan, dbAssessment, 'healthAndWellbeingSan', '10', '10.98', '10.99')
    }
}

function addSanSectionDetails(result: { [key: string]: any }, dbAssessment: dbClasses.DbAssessment, prefix: string, sectionCode: string, harm: string, reoffending: string) {

    result[`${prefix}Threshold`] = dbAssessment.sections.find((s) => s.sectionCode == sectionCode)?.crimNeedScoreThreshold
    if (dbAssessment.sanIndicator == 'Y') {
        result[`${prefix}Score`] = dbAssessment.sections.find((s) => s.sectionCode == sectionCode)?.sanCrimNeedScore
    } else {
        result[`${prefix}Score`] = null
    }
    if (dbAssessment.sanIndicator != 'Y' && sectionCode == 'SAN') {
        result[`${prefix}LinkedToHarm`] = null
        result[`${prefix}LinkedToReoffending`] = null
        result[`${prefix}Strength`] = null
    } else if (sectionCode != '7') {
        result[`${prefix}LinkedToHarm`] = dbAssessment.qaData.getString(harm)
        result[`${prefix}LinkedToReoffending`] = dbAssessment.qaData.getString(reoffending)
        result[`${prefix}Strength`] = dbAssessment.qaData.getString(`${sectionCode == 'SAN' ? 'TBA' : sectionCode}_SAN_STRENGTH`)
    }
}