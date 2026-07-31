import { Ogrs } from 'fixtures'
import * as v4Common from './v4Common'
import * as dbClasses from 'fixtures/api/data/dbClasses'
import * as env from '../../endpointUrls'
import { OgrsInputParams, OgrsOutputParams } from 'fixtures/ogrs/types'
import { createAssessmentInputParams } from 'fixtures/ogrs/data/createAssessmentTestCase'
import { createCsrpInputParams } from 'fixtures/ogrs/data/createCsrpTestCase'
import { Decimal } from 'decimal.js'

export async function getExpectedResponse(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams, ogrs: Ogrs) {

    const assessment = offenderData.assessments[offenderData.assessments.map((ass) => ass.assessmentPk).indexOf(parameters.assessmentPk)]

    if (assessment == null) {
        return env.restErrorResults.noAssessments

    } else {
        const result = new TierPredictorsEndpointResponse(offenderData, parameters)
        result.addAssessment(assessment)
        await result.addPredictors(assessment, ogrs)
        delete result.timeline
        delete result.prisNumber

        return result
    }
}

export class TierPredictorsEndpointResponse extends v4Common.V4EndpointResponse {

    assessments: TierPredictorsAssessment[] = []
    tierPredictors: TierPredictorGroup

    constructor(offenderData: dbClasses.DbOffenderWithAssessments, parameters: EndpointParams) {

        super(offenderData, parameters)
    }

    addAssessment(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        super.addAssessment(dbAssessment, TierPredictorsAssessment)
        if (this.assessments.length > 0) {
            this.assessments[0].addDetails(dbAssessment)
        }
    }

    async addPredictors(dbAssessment: dbClasses.DbAssessmentOrRsr, ogrs: Ogrs) {

        this.tierPredictors = new TierPredictorGroup()
        await this.tierPredictors.addPredictorDetails(dbAssessment, ogrs)
    }

}

export class TierPredictorsAssessment extends v4Common.V4AssessmentCommon {

    everCommittedSexualOffence: string
    addDetails(dbAssessment: dbClasses.DbAssessmentOrRsr) {

        // Remove standard stuff not included in this endpoint
        delete this.assessor

        if (dbAssessment.assessmentType == 'STANDALONE') {
            this.everCommittedSexualOffence = (dbAssessment as dbClasses.DbRsr).everCommittedSexualOffence // TODO convert to Yes/No?
        } else {
            this.everCommittedSexualOffence = (dbAssessment as dbClasses.DbAssessment).qaData.getString('1.30')
        }
    }
}

class TierPredictorGroup {

    newActuarialPredictors: RecalculatedNewActuarialPredictors
    rsr: Rsr
    osp: Osp

    async addPredictorDetails(dbAssessment: dbClasses.DbAssessmentOrRsr, ogrs: Ogrs) {

        let calculatorParams: OgrsInputParams
        if (dbAssessment.assessmentType == 'STANDALONE') {
            const csrp = await ogrs.data.getOneCsrp(dbAssessment.assessmentPk)
            calculatorParams = createCsrpInputParams(csrp)
        } else {
            const assessment = await ogrs.data.getOneAssessment(dbAssessment.assessmentPk)
            calculatorParams = createAssessmentInputParams(assessment)
        }

        const recalculatedOgrs = ogrs.calculate(calculatorParams)

        this.newActuarialPredictors = new RecalculatedNewActuarialPredictors(recalculatedOgrs)
        this.rsr = new Rsr(recalculatedOgrs)
        this.osp = new Osp(recalculatedOgrs)
    }

}

class RecalculatedNewActuarialPredictors {

    ogrs4gYr2: number
    ogrs4gBand: string
    ogrs4gCalculated: string
    ogp2Yr2: number
    ogp2Band: string
    ogp2Calculated: string

    constructor(ogrs: OgrsOutputParams) {

        this.ogrs4gYr2 = formatDecimal(ogrs.OGRS4G_PERCENTAGE)
        this.ogrs4gBand = ogrs.OGRS4G_BAND ? ogrs.OGRS4G_BAND[0] : null
        this.ogrs4gCalculated = ogrs.OGRS4G_CALCULATED
        this.ogp2Yr2 = formatDecimal(ogrs.OGP2_PERCENTAGE)
        this.ogp2Band = ogrs.OGP2_BAND ? ogrs.OGP2_BAND[0] : null
        this.ogp2Calculated = ogrs.OGP2_CALCULATED
    }
}

class Rsr {

    rsrStaticOrDynamic: string
    rsrPercentageScore: number
    rsrScoreLevel: string
    // rsrExceptionError: string[]   // TODO

    constructor(ogrs: OgrsOutputParams) {

        this.rsrStaticOrDynamic = ogrs.RSR_CALCULATED == 'Y' ? (ogrs.RSR_DYNAMIC == 'Y' ? 'DYNAMIC' : 'STATIC') : null
        this.rsrPercentageScore = formatDecimal(ogrs.RSR_PERCENTAGE)
        this.rsrScoreLevel = ogrs.RSR_BAND ? ogrs.RSR_BAND[0] : null
        // if (ogrs.RSR_MISSING_COUNT == 0) {  // TODO
        //     this.rsrExceptionError = null
        // } else {
        //     this.rsrExceptionError = []
        //     for (const missing of ogrs.RSR_MISSING_QUESTIONS.replaceAll(`'`,'').split('\n')) {
        //         this.rsrExceptionError.push(missing)
        //     }
        // }
    }
}

class Osp {

    ospDirectContactPercentageScore: number
    ospDirectContactScoreLevel: string
    ospDirectContactRiskReduction: string

    constructor(ogrs: OgrsOutputParams) {

        this.ospDirectContactPercentageScore = formatDecimal(ogrs.OSP_DC_PERCENTAGE)
        this.ospDirectContactScoreLevel = ogrs.OSP_DC_CALCULATED == 'A' ? 'NA' : ogrs.OSP_DC_BAND ? ogrs.OSP_DC_BAND[0] : null
        this.ospDirectContactRiskReduction = ogrs.OSP_DC_RISK_REDUCTION
    }
}

function formatDecimal(dec: Decimal): number {

    return dec == null ? null : Number.parseFloat(dec.toFixed(2))
}