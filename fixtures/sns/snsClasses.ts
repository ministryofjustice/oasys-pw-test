import { testEnvironment } from "../../localSettings"
import { DbAssessmentOrRsr } from "./dbClasses"

/**
 * This module contains a top-level class for the SnsMessages, plus a MessageData class for each message type.
 * The MessageData classes extend SnsMessageData, which covers the common message content.
 */
export class SnsMessage {

    messageType: SnsMessageType
    messageData: SnsMessageData
    messageSubject: string

    constructor(assessment: DbAssessmentOrRsr, crn: string, messageType: SnsMessageType) {

        this.messageType = messageType

        switch (messageType) {
            case 'AssSumm':
                this.messageData = new AssSummMessageData(assessment, crn)
                break
            case 'OGRS':
                this.messageData = new OgrsMessageData(assessment, crn)
                break
            case 'OPD':
                this.messageData = new OpdMessageData(assessment, crn)
                break
            case 'RSR':
                this.messageData = new RsrMessageData(assessment, crn)
                break
            case 'TierRiskFlag':
                this.messageData = new TierRiskFlagMessageData(crn)
                break
            case 'TierPredictors':
                this.messageData = new TierPredictorsMessageData(crn)
                break
        }
        this.messageSubject = this.messageData.eventType
    }
}

export class SnsMessageData {

    eventType = ''
    version = 1
    description = ''
    detailUrl = 'https://some-url-where-we-can-get-more-info-this-might-not-exist'
    occurredAt = ''  // Not tested, difficult to predict exact time of this

    additionalInformation: object
    personReference = { identifiers: [{ type: 'CRN', value: '' }] }

    constructor(crn: string) {

        this.personReference.identifiers[0].value = crn
    }
}

export class AssSummMessageData extends SnsMessageData {

    constructor(assessment: DbAssessmentOrRsr, crn: string) {

        const baseUrl = testEnvironment.name.includes('T2') ? 'https://t2-b.oasys.service.justice.gov.uk/eor/oasys/ass' : 'https://ords.justice.gov.uk/ords'

        super(crn)
        this.eventType = 'assessment.summary.produced'
        this.description = 'Assessment Summary has been produced'
        const endPoint = assessment.sanIndicator == 'Y' || assessment.spIndicator == 'Y' ? 'asssummsan' : 'asssumm'
        this.detailUrl = `${baseUrl}/${endPoint}/${crn}/ALLOW/${assessment.pk}/${assessment.status}`
        delete this.additionalInformation
    }
}

export class OgrsMessageData extends SnsMessageData {

    constructor(assessment: DbAssessmentOrRsr, crn: string) {

        super(crn)
        this.eventType = 'risk-assessment.scores.ogrs.determined'
        this.description = 'Risk assessment scores have been determined'

        this.additionalInformation = {
            OGRS3Yr1: assessment.ogrs1yr,
            OGRS3Yr2: assessment.ogrs2yr,
            OGRS3Yr2Band: assessment.ogrs2yrBand,
            OGRS4GYr2: assessment.ogrs4gYr2,
            OGRS4GYr2Band: assessment.ogrs4gBand,
            OGP2Yr2: assessment.ogp2Yr2,
            OGP2Yr2Band: assessment.ogp2Band,
            OGRS4VYr2: assessment.ogrs4vYr2,
            OGRS4VYr2Band: assessment.ogrs4vBand,
            OVP2Yr2: assessment.ovp2Yr2,
            OVP2Yr2Band: assessment.ovp2Band,
            RSRAlgorithmVersion: assessment.rsrAlgorithmVersion,
            EventNumber: assessment.eventNumber,
            AssessmentDate: assessment.assessmentDate
        }
    }
}


export class OpdMessageData extends SnsMessageData {

    constructor(assessment: DbAssessmentOrRsr, crn: string) {

        super(crn)
        this.eventType = 'opd.produced'
        this.description = 'OPD has been produced'
        delete this.detailUrl
        this.personReference.identifiers.push({ 'type': 'nomisId', value: '' })

        this.additionalInformation = {
            dateCompleted: assessment.completedDate,
            opdResult: assessment.opdResult,
            opdScreenOutOverride: assessment.opdOverride
        }
    }
}

export class RsrMessageData extends SnsMessageData {

    constructor(assessment: DbAssessmentOrRsr, crn: string) {

        super(crn)
        this.eventType = 'risk-assessment.scores.rsr.determined'
        this.description = 'Risk assessment scores have been determined'

        this.additionalInformation = {
            RSRScore: assessment.rsrScore,
            RSRBand: assessment.rsrBand,
            RSRStaticOrDynamic: assessment.rsrStaticDynamic,
            OSPIndecentScore: assessment.ospIndecentScore,
            OSPIndecentBand: assessment.ospIndecentBand,
            OSPContactScore: assessment.ospContactScore,
            OSPContactBand: assessment.ospContactBand,
            OSPIndirectIndecentScore: assessment.ospIicScore,
            OSPIndirectIndecentBand: assessment.ospIicBand,
            OSPDirectContactScore: assessment.ospDcScore,
            OSPDirectContactBand: assessment.ospDcBand,
            SNSVStaticYr2: assessment.snsvStaticYr2,
            SNSVStaticYr2Band: assessment.snsvStaticYr2Band,
            SNSVDynamicYr2: assessment.snsvDynamicYr2,
            SNSVDynamicYr2Band: assessment.snsvDynamicYr2Band,
            RSRAlgorithmVersion: assessment.rsrAlgorithmVersion,
            EventNumber: assessment.eventNumber,
            AssessmentDate: assessment.assessmentDate
        }
    }
}


export class TierRiskFlagMessageData extends SnsMessageData {

    constructor(crn: string) {

        // const baseUrl = testEnvironment.name.includes('T2') ? 'https://t2-b.oasys.service.justice.gov.uk/eor/oasys/ass' : 'https://ords.justice.gov.uk/ords'
        const baseUrl = 'https://ords.justice.gov.uk/ords'  // TODO - defect or config?

        super(crn)
        this.eventType = 'risk.flag.tier.change'
        this.description = 'Risk Flag for tiering has changed'
        this.detailUrl = `${baseUrl}/tierriskflag/${crn}/ALLOW`
        delete this.additionalInformation
    }
}

export class TierPredictorsMessageData extends SnsMessageData {

    constructor(crn: string) {

        super(crn)
        this.eventType = 'predictors.tier.change'
        this.description = 'Predictors for tiering have changed'
        this.detailUrl = `https://some-url-where-we-can-get-more-info-this-might-not-exist`
        delete this.additionalInformation
    }
}
