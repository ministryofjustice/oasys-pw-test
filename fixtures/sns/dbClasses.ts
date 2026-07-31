
/**
 * This module contains the classes used to extract data from the OASys database.
 * 
 * DbAssessmentOrRsr contains the data used to generate expected message content, mostly from oasys_set and offender_rsr_scores.
 * DbSns contains the actual messages from the sns_message table.
 */
export class DbAssessmentOrRsr {

    type: AssessmentOrCsrp
    pk: number
    status: string
    initiationDate: string
    completedDate: string
    signedDate: string
    countersignedDate: string
    assessmentDate: string

    purposeOfAssessment: string             // These two are used to determine whether there should be an AssSumm message
    roshaRiskAssessmentCompleted = false

    ogrs1yr: number                         // ogrs1yr == null is used to determine whether there should be an OGRS message
    ogrs2yr: number
    ogrs2yrBand: string
    rsrScore: number                        // rsrScore == null is used to determine whether there should be an RSR message
    rsrBand: string
    rsrStaticDynamic: string

    ospIndecentScore: number
    ospIndecentBand: string
    ospContactScore: number
    ospContactBand: string

    ospIicScore: number
    ospIicBand: string
    ospDcScore: number
    ospDcBand: string

    opdResult: string                       // These two are used to determine whether there should be an OPD message
    opdOverride: string

    eventNumber: number
    sanIndicator: string
    spIndicator: string

    ogrs4gYr2: number
    ogrs4gBand: string
    ogrs4vYr2: number
    ogrs4vBand: string
    ogp2Yr2: number
    ogp2Band: string
    ovp2Yr2: number
    ovp2Band: string
    snsvStaticYr2: number
    snsvStaticYr2Band: string
    snsvDynamicYr2: number
    snsvDynamicYr2Band: string
    rsrAlgorithmVersion: number

    roshLevelElm: string
    tierRoshLevel: string

    constructor(assessmentData: string[], type: AssessmentOrCsrp) {

        const tzOffset = oasysDateTime.timeZoneOffset()

        this.type = type
        this.pk = Number.parseInt(assessmentData[0])
        this.status = assessmentData[1]
        this.eventNumber = Number.parseInt(assessmentData[2])

        this.ogrs1yr = assessmentData[5] == null ? null : Number.parseInt(assessmentData[5])
        this.ogrs2yr = Number.parseInt(assessmentData[6])

        this.rsrScore = assessmentData[7] == null ? null : fixDp(assessmentData[7])
        this.rsrBand = assessmentData[8]
        this.rsrStaticDynamic = assessmentData[9]

        this.ospIndecentScore = fixDp(assessmentData[10])
        this.ospContactScore = fixDp(assessmentData[11])
        this.ospIndecentBand = assessmentData[12]
        this.ospContactBand = assessmentData[13]

        this.ospIicScore = fixDp(assessmentData[14])
        this.ospIicBand = assessmentData[15]
        this.ospDcScore = fixDp(assessmentData[16])
        this.ospDcBand = assessmentData[17]

        this.initiationDate = assessmentData[3] + tzOffset
        this.completedDate = assessmentData[4] == null ? null : assessmentData[4] + tzOffset

        if (type == 'assessment') {
            this.opdResult = assessmentData[18]
            this.opdOverride = assessmentData[19] ?? ''
            this.purposeOfAssessment = assessmentData[22]
            this.sanIndicator = assessmentData[24]
            this.spIndicator = assessmentData[39]

            this.signedDate = assessmentData[20] == null ? null : assessmentData[20] + tzOffset
            this.countersignedDate = assessmentData[23] == null ? null : assessmentData[23] + tzOffset
            switch (this.status) {
                case "LOCKED_INCOMPLETE":
                    this.assessmentDate = this.initiationDate
                    break
                case "SIGNED":
                    this.assessmentDate = this.signedDate
                    break
                default:
                    this.assessmentDate = this.signedDate == null ? this.completedDate : this.signedDate
                    break
            }

            this.ogrs4gYr2 = fixDp(assessmentData[25])
            this.ogrs4gBand = assessmentData[26]
            this.ogrs4vYr2 = fixDp(assessmentData[27])
            this.ogrs4vBand = assessmentData[28]
            this.ogp2Yr2 = fixDp(assessmentData[29])
            this.ogp2Band = assessmentData[30]
            this.ovp2Yr2 = fixDp(assessmentData[31])
            this.ovp2Band = assessmentData[32]
            this.snsvStaticYr2 = fixDp(assessmentData[33])
            this.snsvStaticYr2Band = assessmentData[34]
            this.snsvDynamicYr2 = fixDp(assessmentData[35])
            this.snsvDynamicYr2Band = assessmentData[36]
            this.rsrAlgorithmVersion = Number.parseInt(assessmentData[37])
            this.ogrs2yrBand = assessmentData[38]
            this.roshLevelElm = assessmentData[40]
            this.tierRoshLevel = assessmentData[41]
        } else {
            this.assessmentDate = this.completedDate
            this.ogrs4gYr2 = fixDp(assessmentData[18])
            this.ogrs4gBand = assessmentData[19]
            this.ogrs4vYr2 = fixDp(assessmentData[20])
            this.ogrs4vBand = assessmentData[21]
            this.ogp2Yr2 = fixDp(assessmentData[22])
            this.ogp2Band = assessmentData[23]
            this.ovp2Yr2 = fixDp(assessmentData[24])
            this.ovp2Band = assessmentData[25]
            this.snsvStaticYr2 = fixDp(assessmentData[26])
            this.snsvStaticYr2Band = assessmentData[27]
            this.snsvDynamicYr2 = fixDp(assessmentData[28])
            this.snsvDynamicYr2Band = assessmentData[29]
            this.rsrAlgorithmVersion = Number.parseInt(assessmentData[30])
            this.ogrs2yrBand = assessmentData[31]
        }
    }

    static assessmentQuery(crn: string, wip = false): string {

        const statusCondition = wip ? `and s.assessment_status_elm = 'OPEN'` : `and s.assessment_status_elm in ('COMPLETE', 'SIGNED', 'LOCKED_INCOMPLETE')`

        return `select s.oasys_set_pk, s.assessment_status_elm, o.cms_event_number, 
                    to_char(s.initiation_date, '${oasysDateTime.oracleTimestampFormat}'), to_char(s.date_completed, '${oasysDateTime.oracleTimestampFormat}'), 
                    s.ogrs3_1year, s.ogrs3_2year, 
                    s.rsr_percentage_score, s.rsr_risk_recon_elm, s.rsr_static_or_dynamic, 
                    s.osp_i_percentage_score, s.osp_c_percentage_score, s.osp_i_risk_recon_elm, s.osp_c_risk_recon_elm,
                    s.osp_iic_percentage_score, s.osp_iic_risk_recon_elm, s.osp_dc_percentage_score, s.osp_dc_risk_recon_elm , 
                    s.opd_result, s.opd_screen_out_override, 
                    to_char(s.assessor_signed_date, '${oasysDateTime.oracleTimestampFormat}'), s.ref_ass_version_code, r.ref_element_desc,
                    to_char(s.countersigner_signed_date, '${oasysDateTime.oracleTimestampFormat}'), s.san_assessment_linked_ind, 
                    s.ogrs4g_percentage_2yr, s.ogrs4g_band_risk_recon_elm, 
                    s.ogrs4v_percentage_2yr, s.ogrs4v_band_risk_recon_elm,
                    s.ogp2_percentage_2yr, s.ogp2_band_risk_recon_elm, 
                    s.ovp2_percentage_2yr, s.ovp2_band_risk_recon_elm, 
                    s.snsv_percentage_2yr_static, s.snsv_stat_band_risk_recon_elm, 
                    s.snsv_percentage_2yr_dynamic, s.snsv_dyn_band_risk_recon_elm,
                    s.rsr_algorithm_version, s.ogrs3_risk_recon_elm,
                    s.arns_sp_only_linked_ind, s.rosh_level_elm, s.tiering_rosh_level_elm
                    from eor.offender o, eor.oasys_assessment_group g, eor.oasys_set s, eor.ref_element r 
                    where o.cms_prob_number = '${crn}'
                    and o.offender_pk = g.offender_PK and g.oasys_assessment_group_PK = s.oasys_assessment_group_PK 
                    ${statusCondition} 
                    and s.deleted_date is null 
                    and r.ref_element_code = s.purpose_assessment_elm and r.ref_category_code = 'PURPOSE_OF_ASSESSMENT_REASON' 
                    order by s.initiation_date desc`
    }

    static roshaQuestionQuery(pk: number): string {

        return `select a.ref_answer_code from eor.oasys_answer a, eor.oasys_question q, eor.oasys_section s
                    where s.oasys_set_pk = ${pk} and s.ref_section_code = 'RSR'
                    and q.oasys_section_pk = s.oasys_section_pk and a.oasys_question_pk = q.oasys_question_pk and q.ref_question_code = 'RA'`
    }

    static csrpQuery(crn: string): string {

        return `select r.offender_rsr_scores_pk, r.rsr_status, o.cms_event_number, 
                    to_char(r.initiation_date, '${oasysDateTime.oracleTimestampFormat}'), to_char(r.date_completed, '${oasysDateTime.oracleTimestampFormat}'), 
                    r.ogrs3_1year, r.ogrs3_2year,
                    r.rsr_percentage_score, r.rsr_risk_recon_elm, r.rsr_static_or_dynamic, 
                    r.osp_i_percentage_score, r.osp_c_percentage_score, r.osp_i_risk_recon_elm, r.osp_c_risk_recon_elm, 
                    r.osp_iic_percentage_score, r.osp_iic_risk_recon_elm, r.osp_dc_percentage_score, r.osp_dc_risk_recon_elm,
                    r.ogrs4g_percentage_2yr, r.ogrs4g_band_risk_recon_elm, 
                    r.ogrs4v_percentage_2yr, r.ogrs4v_band_risk_recon_elm,
                    r.ogp2_percentage_2yr, r.ogp2_band_risk_recon_elm, 
                    r.ovp2_percentage_2yr, r.ovp2_band_risk_recon_elm, 
                    r.snsv_percentage_2yr_static, r.snsv_stat_band_risk_recon_elm, 
                    r.snsv_percentage_2yr_dynamic, r.snsv_dyn_band_risk_recon_elm,
                    r.rsr_algorithm_version, r.ogrs3_risk_recon_elm
                    from eor.offender_rsr_scores r, eor.offender o 
                    where r.offender_pk = o.offender_pk and o.cms_prob_number = '${crn}' and o.deleted_date is null and r.deleted_date is null 
                    order by r.initiation_date desc`
    }
}

export class DbSns {

    messageType: string
    messageData: object
    messageSubject: string

    constructor(snsData: string[]) {

        this.messageType = snsData[0]
        if (snsData[1] != null && snsData[1].length > 2) {
            this.messageData = JSON.parse(snsData[1].replace(/\\"/g, '"')) // Change \" to "
        }
        this.messageSubject = snsData[2]
    }

    static query(assessmentPk: number, type: AssessmentOrCsrp, maxDelay: number) {

        return `select message_type, translate(message_data, 'x' || CHR(13) || CHR(10), 'x'), message_subject from eor.sns_message 
                    where ${type == 'assessment' ? 'oasys_set_pk' : 'offender_rsr_scores_pk'} = ${assessmentPk}
                    and message_date > sysdate - interval '${maxDelay}' second 
                    order by message_date desc`
    }

}

function fixDp(value: string): number {

    if (value == undefined || value == null) return null
    return Number(Number.parseFloat(value).toFixed(2))
}
