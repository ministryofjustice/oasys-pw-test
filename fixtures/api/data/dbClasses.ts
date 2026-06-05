/**
 * Classes used to extract data from the OASys database for use in API regression testing.
 * These objects are created by the RestDb functions in cypress/support/restApidb.ts using the queries defined here.
 */
import { QaData } from './qaData'
import { assignValues, buildQuery } from 'lib/queryBuilder'


/**
 * Single offender with all relevant assessment data
 */

const offenderColumns: Columns = {
    offenderPk: { name: 'offender_pk', type: 'integer' },
    probationCrn: { name: 'cms_prob_number', type: 'string' },
    nomisId: { name: 'cms_pris_number', type: 'string' },
    riskToOthers: { name: 'risk_to_others_elm', type: 'string' },
    limitedAccessOffender: { name: 'limited_access_offender ', type: 'ynToBool' },
    pnc: { name: 'pnc', type: 'string' },
    forename1: { name: 'forename_1', type: 'string' },
    surname: { name: 'family_name', type: 'string' },
    gender: { name: 'gender_elm', type: 'integer' },
    custodyInd: { name: 'custody_ind', type: 'string' },
}

export class DbOffenderWithAssessments {

    offenderPk: number
    probationCrn: string
    nomisId: string
    riskToOthers: string
    limitedAccessOffender: boolean
    pnc: string
    forename1: string
    surname: string
    gender: number
    custodyInd: string

    assessments: DbAssessmentOrRsr[] = []
    dbElapsedTime: number

    static query(crnSource: Provider, crn: string): string {

        return buildQuery(offenderColumns, ['offender'], `deleted_date is null and ${crnSource == 'prob' ? 'cms_prob_number' : 'cms_pris_number'} = '${crn}'`, null)
    }

    constructor(offenderData: string[]) {

        assignValues(this, offenderColumns, offenderData, 0)
    }

}

/**
 * Base class for assessments and standalone RSRs
 */
export class DbAssessmentOrRsr {

    assessmentPk: number
    assessmentType: string
    assessmentVersion: number
    status: string
    initiationDate: string
    signedDate: string
    completedDate: string
    lastUpdatedDate: string
    riskDetails: DbRiskDetails
    cmsEventNumber: number
    appVersion: string

}

/**
 * OASys assessment including sections, questions and answers, offences, victims and objectives
 */
const assessmentColumns: Columns = {

    assessmentPk: { name: 'oasys_set_pk', type: 'integer' },
    assessmentType: { name: 'ref_ass_version_code', type: 'string' },
    assessmentVersion: { name: 'version_number', type: 'integer' },
    status: { name: 'assessment_status_elm', type: 'string' },
    initiationDate: { name: 'initiation_date', type: 'date' },
    completedDate: { name: 'date_completed', type: 'date' },
    lastUpdatedDate: { table: 'oasys_set_change', name: 'lastupd_date', type: 'date' },
    cmsEventNumber: { name: 'cms_event_number', type: 'integer' },

    dateOfBirth: { name: 'date_of_birth', type: 'date' },
    assessorName: { name: 'assessor_name', type: 'string' },
    countersignerName: { name: 'countersigner_name', type: 'string' },
    pOAssessment: { name: 'purpose_assessment_elm', type: 'string' },
    pOAssessmentDesc: { name: 'purpose_assmt_other_ftxt', type: 'string' },
    parentAssessmentPk: { name: 'parent_oasys_set_pk', type: 'integer' },
    noSaraDate: { name: 'no_sara_date', type: 'string' },
    signedDate: { name: 'assessor_signed_date', type: 'date' },
    sanIndicator: { name: 'san_assessment_linked_ind', type: 'string' },
    lastUpdateFromSan: { name: 'lastupd_from_san', type: 'date' },
    spIndicator: { name: 'arns_sp_only_linked_ind', type: 'string' },
    roshLevel: { name: 'rosh_level_elm', type: 'string' },
    learningToolScore: { name: 'learning_tool_score', type: 'integer' },
    ldcSubTotal: { name: 'ldc_sub_total', type: 'integer' },
    ldcFuncProc: { name: 'ldc_func_proc', type: 'string' },
}

export class DbAssessment extends DbAssessmentOrRsr {

    signedDate: string
    roshLevel: string
    pOAssessment: string
    pOAssessmentDesc: string
    assessorName: string
    countersignerName: string
    courtCode: string
    courtType: string
    courtName: string
    parentAssessmentPk: number
    noSaraDate: string
    sanIndicator: string
    lastUpdateFromSan: string
    spIndicator: string
    dateOfBirth: string
    learningToolScore: number
    ldcSubTotal: number
    ldcFuncProc: string

    offences: DbOffence[] = []
    victims: DbVictim[] = []
    basicSentencePlan: DbBspObjective[] = []
    objectives: DbObjective[] = []
    sections: DbSection[] = []
    qaData: QaData

    constructor(assessmentData: string[]) {

        super()

        assignValues(this, assessmentColumns, assessmentData, 0)
        this.riskDetails = new DbRiskDetails(assessmentData, Object.keys(assessmentColumns).length, 'assessment')
        this.appVersion = oasysDateTime.dateToVersion(this.initiationDate)
    }

    static query(offenderPk: number): string {

        return buildQuery(
            { ...assessmentColumns, ...riskColumns, ...riskColumnsAssessmentOnly },
            ['oasys_set', 'oasys_assessment_group', 'oasys_set_change'],
            `oasys_assessment_group.offender_pk = ${offenderPk} 
                and oasys_assessment_group.oasys_assessment_group_pk = oasys_set.oasys_assessment_group_pk 
                and oasys_set_change.oasys_set_pk = oasys_set.oasys_set_pk 
                and oasys_set.deleted_date is null`,
            'oasys_set.initiation_date'
        )
    }

    static courtQuery(assessmentPk: number): string {

        return `select c.court_code, c.court_name, c.court_type_elm 
                        from eor.court c, eor.offence_block o 
                        where o.oasys_set_pk = ${assessmentPk} and o.offence_block_type_elm = 'CURRENT' 
                        and c.court_pk = o.court_pk`
    }

    addCourtDetails(courtData: string[]) {

        this.courtCode = courtData[0]
        this.courtName = courtData[1]
        this.courtType = courtData[2]
    }

    static qaQuery(assessmentPk: number): string {

        return `select oq.ref_question_code, replace(oq.free_format_answer, chr(2),''), replace(oq.additional_note, chr(2),''), ra.ref_section_answer, osec.ref_section_code
                        from eor.oasys_set os
                        left outer join eor.oasys_section osec
                        on osec.oasys_set_pk = os.oasys_set_pk
                        left outer join eor.oasys_question oq
                        on oq.oasys_section_pk = osec.oasys_section_pk
                        left outer join eor.oasys_answer oa
                        on oa.oasys_question_pk = oq.oasys_question_pk
                        left outer join eor.ref_answer ra
                        on (ra.ref_ass_version_code = oa.ref_ass_version_code
                        and ra.version_number = oa.version_number
                        and ra.ref_section_code = oa.ref_section_code
                        and ra.ref_question_code = oa.ref_question_code
                        and ra.ref_answer_code = oa.ref_answer_code )
                        where os.oasys_set_pk =  ${assessmentPk}
                        and oq.currently_hidden_ind = 'N'
                        and osec.currently_hidden_ind = 'N'`
    }
}

/**
 * Standalone RSR assessments
 */
const rsrColumns: Columns = {

    assessmentPk: { name: 'offender_rsr_scores_pk', type: 'integer' },
    status: { name: 'rsr_status', type: 'string' },
    initiationDate: { name: 'initiation_date', type: 'date' },
    completedDate: { name: 'date_completed', type: 'date' },
    lastUpdatedDate: { name: 'lastupd_date', type: 'date' },
}

export class DbRsr extends DbAssessmentOrRsr {

    constructor(assessmentData: string[]) {

        super()

        assignValues(this, rsrColumns, assessmentData, 0)
        this.riskDetails = new DbRiskDetails(assessmentData, Object.keys(rsrColumns).length, 'rsr')
        this.appVersion = oasysDateTime.dateToVersion(this.initiationDate)

        this.cmsEventNumber = null
        this.assessmentType = 'STANDALONE'
        this.assessmentVersion = null
    }

    static query(offenderPk: number): string {

        return buildQuery({ ...rsrColumns, ...riskColumns }, ['offender_rsr_scores'], `offender_pk = ${offenderPk} and deleted_date is null`, 'initiation_date')
    }
}

/**
 * Risk data from the oasys_set or standalone_rsr record
 */
const riskColumns: Columns = {

    ogrs31Year: { name: 'ogrs3_1year', type: 'integer' },
    ogrs32Year: { name: 'ogrs3_2year', type: 'integer' },
    ogrs3RiskRecon: { name: 'ogrs3_risk_recon_elm', type: 'string' },

    ospImagePercentageScore: { name: 'osp_i_percentage_score', type: 'float' },
    ospIRisk: { name: 'osp_i_risk_recon_elm', type: 'string' },
    ospContactPercentageScore: { name: 'osp_c_percentage_score', type: 'float' },
    ospCRisk: { name: 'osp_c_risk_recon_elm', type: 'string' },

    ospIicPercentageScore: { name: 'osp_iic_percentage_score', type: 'float' },
    ospIicRisk: { name: 'osp_iic_risk_recon_elm', type: 'string' },
    ospDcPercentageScore: { name: 'osp_dc_percentage_score', type: 'float' },
    ospDcRisk: { name: 'osp_dc_risk_recon_elm', type: 'string' },
    ospCRiskReduction: { name: 'osp_c_risk_reduction', type: 'string' },

    ogrs4gPercentageScore: { name: 'ogrs4g_percentage_2yr', type: 'float' },
    ogrs4gRisk: { name: 'ogrs4g_band_risk_recon_elm', type: 'string' },
    ogrs4gCalculated: { name: 'ogrs4g_calculated', type: 'string' },
    ogp2PercentageScore: { name: 'ogp2_percentage_2yr', type: 'float' },
    ogp2Risk: { name: 'ogp2_band_risk_recon_elm', type: 'string' },
    ogp2Calculated: { name: 'ogp2_calculated', type: 'string' },

    ogrs4vPercentageScore: { name: 'ogrs4v_percentage_2yr', type: 'float' },
    ogrs4vRisk: { name: 'ogrs4v_band_risk_recon_elm', type: 'string' },
    ogrs4vCalculated: { name: 'ogrs4v_calculated', type: 'string' },
    ovp2PercentageScore: { name: 'ovp2_percentage_2yr', type: 'float' },
    ovp2Risk: { name: 'ovp2_band_risk_recon_elm', type: 'string' },
    ovp2Calculated: { name: 'ovp2_calculated', type: 'string' },

    snsvStaticCalculated: { name: 'snsv_calculated_static', type: 'string' },
    snsvStaticPercentageScore: { name: 'snsv_percentage_2yr_static', type: 'float' },
    snsvStaticRisk: { name: 'snsv_stat_band_risk_recon_elm', type: 'string' },
    snsvDynamicCalculated: { name: 'snsv_calculated_dynamic', type: 'string' },
    snsvDynamicPercentageScore: { name: 'snsv_percentage_2yr_dynamic', type: 'float' },
    snsvDynamicRisk: { name: 'snsv_dyn_band_risk_recon_elm', type: 'string' },

    rsrStaticOrDynamic: { name: 'rsr_static_or_dynamic', type: 'string' },
    rsrExceptionError: { name: 'rsr_exception_error', type: 'string' },
    rsrAlgorithmVersion: { name: 'rsr_algorithm_version', type: 'integer' },
    rsrPercentageScore: { name: 'rsr_percentage_score', type: 'float' },
    rsrRisk: { name: 'rsr_risk_recon_elm', type: 'string' },
}

const riskColumnsAssessmentOnly: Columns = {

    ogpStWesc: { name: 'ogp_st_wesc', type: 'integer' },
    ogpDyWesc: { name: 'ogp_dy_wesc', type: 'integer' },
    ogpTotWesc: { name: 'ogp_tot_wesc', type: 'integer' },
    ogp1Year: { name: 'ogp_1year', type: 'integer' },
    ogp2Year: { name: 'ogp_2year', type: 'integer' },
    ogpRisk: { name: 'ogp_risk_recon_elm', type: 'string' },

    ovpStWesc: { name: 'ovp_st_wesc', type: 'integer' },
    ovpDyWesc: { name: 'ovp_dy_wesc', type: 'integer' },
    ovpTotWesc: { name: 'ovp_tot_wesc', type: 'integer' },
    ovp1Year: { name: 'ovp_1year', type: 'integer' },
    ovp2Year: { name: 'ovp_2year', type: 'integer' },
    ovpRisk: { name: 'ovp_risk_recon_elm', type: 'string' },
    ovpPrevWesc: { name: 'ovp_prev_wesc', type: 'integer' },
    ovpNonVioWesc: { name: 'ovp_non_vio_wesc', type: 'integer' },
    ovpAgeWesc: { name: 'ovp_age_wesc', type: 'integer' },
    ovpVioWesc: { name: 'ovp_vio_wesc', type: 'integer' },
    ovpSexWesc: { name: 'ovp_sex_wesc', type: 'integer' },
}
export class DbRiskDetails {

    ogrs31Year: number
    ogrs32Year: number
    ogrs3RiskRecon: string

    ospImagePercentageScore: number = 0
    ospContactPercentageScore: number = 0
    ospIRisk: string = 'NA'
    ospCRisk: string = 'NA'

    ospIicRisk: string
    ospIicPercentageScore: number
    ospDcRisk: string
    ospDcPercentageScore: number
    ospCRiskReduction: string

    ogpStWesc: number = null
    ogpDyWesc: number = null
    ogpTotWesc: number = null
    ogp1Year: number
    ogp2Year: number = null
    ogpRisk: string = null

    ovpStWesc: number = null
    ovpDyWesc: number = null
    ovpTotWesc: number = null
    ovp1Year: number = null
    ovp2Year: number = null
    ovpRisk: string = null
    ovpPrevWesc: number = null
    ovpNonVioWesc: number = null
    ovpAgeWesc: number = null
    ovpVioWesc: number = null
    ovpSexWesc: number = null

    ogrs4gPercentageScore: number
    ogrs4gRisk: string
    ogrs4gCalculated: string
    ogp2PercentageScore: number
    ogp2Risk: string
    ogp2Calculated: string

    ogrs4vPercentageScore: number
    ogrs4vRisk: string
    ogrs4vCalculated: string
    ovp2PercentageScore: number
    ovp2Risk: string
    ovp2Calculated: string

    snsvStaticPercentageScore: number
    snsvStaticRisk: string
    snsvStaticCalculated: string
    snsvDynamicPercentageScore: number
    snsvDynamicRisk: string
    snsvDynamicCalculated: string

    rsrStaticOrDynamic: string
    rsrExceptionError: string
    rsrAlgorithmVersion: number
    rsrPercentageScore: number
    rsrRisk: string

    constructor(riskData: string[], start: number, type: 'assessment' | 'rsr') {

        assignValues(this, riskColumns, riskData, start)
        if (type == 'assessment') {
            assignValues(this, riskColumnsAssessmentOnly, riskData, start + Object.keys(riskColumns).length)
        }
    }
}

export class DbOffence {

    type: string
    offenceDate?: string
    offenceCode: string
    offenceSubCode: string
    offence: string
    subOffence: string
    additionalOffence: string

    constructor(offenceData: string[], offencePivotData: string[]) {

        this.type = offenceData[1]
        if (offenceData[2] != undefined && offenceData[2] != null) this.offenceDate = offenceData[2]

        if (offencePivotData == null) {
            this.offenceCode = null
            this.offenceSubCode = null
            this.offence = null
            this.subOffence = null
            this.additionalOffence = null//'N'
        } else {
            this.offenceCode = offencePivotData[0]
            this.offenceSubCode = offencePivotData[1]
            this.offence = offencePivotData[2]
            this.subOffence = offencePivotData[3]
            this.additionalOffence = offencePivotData[4]
        }
    }

    static query(assessmentPk: number): string {

        return `select offence_block_pk, offence_block_type_elm, to_char(offence_date, 'YYYY-MM-DD\"T\"HH24:MI:SS') 
                    from eor.offence_block 
                    where oasys_set_pk = ${assessmentPk} and offence_block_type_elm in ('CURRENT', 'CONCURRENT', 'PRINCIPAL_PROPOSAL')`
    }

    static pivotQuery(offenceBlockPk: string): string {
        return `select p.offence_group_code, p.sub_code, o.offence_group_desc, o.sub_offence_desc, p.additional_offence_ind 
                    from eor.ct_offence_pivot p, eor.ct_offence o
                    where o.offence_group_code = p.offence_group_code and o.sub_code = p.sub_code
                    and p.offence_block_pk = ${offenceBlockPk}`
    }
}


export class DbVictim {

    displaySort: number
    age: string
    gender: string
    ethnicCategory: string
    victimRelation: string

    constructor(victimData: string[]) {

        if (victimData[0] != null) this.displaySort = Number.parseInt(victimData[0])
        if (victimData[1] != null) this.age = victimData[1]
        if (victimData[2] != null) this.gender = victimData[2]
        if (victimData[3] != null) this.ethnicCategory = victimData[3]
        if (victimData[4] != null) this.victimRelation = victimData[4]
    }

    static query(assessmentPk: number): string {
        return `select v.display_sort, ar.ref_element_desc, gr.ref_element_desc, er.ref_element_desc, rr.ref_element_desc from eor.victim v
                        left outer join eor.ref_element ar on v.age_of_victim_elm = ar.ref_element_code and ar.ref_category_code = 'AGE_OF_VICTIM'
                        left outer join eor.ref_element gr on v.gender_elm = gr.ref_element_code and gr.ref_category_code = 'GENDER'
                        left outer join eor.ref_element er on v.ethnic_category_elm = er.ref_element_code and er.ref_category_code = 'ETHNIC_CATEGORY'
                        left outer join eor.ref_element rr on v.victim_relation_elm = rr.ref_element_code and rr.ref_category_code = 'VICTIM_PERPETRATOR_RELATIONSHIP'
                        where v.oasys_set_pk = ${assessmentPk}`
    }

}

export class DbSection {

    sectionCode: string
    sectionPk: number
    otherWeightedScore: number
    lowScoreNeedsAttn: string
    crimNeedScoreThreshold: number
    sanCrimNeedScore: number

    constructor(sectionData: string[], assessmentType: string, assessmentVersion: number) {

        const l31 = assessmentType == 'LAYER3' && assessmentVersion == 1
        const san = assessmentType == 'LAYER3' && assessmentVersion == 2

        this.sectionCode = sectionData[0]
        this.sectionPk = Number.parseInt(sectionData[1])
        this.otherWeightedScore = l31 ? utils.stringToInt(sectionData[2]) : null
        this.lowScoreNeedsAttn = sectionData[3]
        this.crimNeedScoreThreshold = utils.stringToInt(sectionData[4])
        this.sanCrimNeedScore = san ? utils.stringToInt(sectionData[5]) : null
    }

    static query(assessmentPk: number): string {

        return `select s.ref_section_code, s.oasys_section_pk, s.sect_other_weighted_score, s.low_score_need_attn_ind, r.crim_need_score_threshold, s.san_crim_need_score
                    from eor.oasys_section s, eor.ref_section r 
                    where s.oasys_set_pk = ${assessmentPk}
                    and r.ref_section_code = s.ref_section_code
                    and r.ref_ass_version_code = s.ref_ass_version_code
                    and r.version_number = s.version_number
                    and currently_hidden_ind <> 'Y'`
    }
}

export class DbBspObjective {

    bspAreaLinked: string
    bspAreaLinkedDesc: string


    constructor(objectiveData: string[]) {

        this.bspAreaLinked = objectiveData[0]
        this.bspAreaLinkedDesc = objectiveData[1]
    }

    static query(assessmentPk: number): string {

        return `select offence_behav_link_elm, r.ref_element_desc 
                    from eor.basic_sentence_plan_obj o, eor.ref_element r
                    where o.oasys_set_pk = ${assessmentPk}
                    and r.ref_category_code = o.offence_behav_link_cat
                    and r.ref_element_code = o.offence_behav_link_elm`
    }
}

export class DbObjective {

    objectivePk: string
    objectiveCode: string
    objectiveCodeDesc: string
    objectiveDesc: string
    objectiveStatus: string
    objectiveStatusDesc: string
    objectiveSequence: number

    criminogenicNeeds: DbNeed[] = []
    actions: DbAction[] = []


    constructor(objectiveData: string[]) {

        this.objectivePk = objectiveData[0]
        this.objectiveCode = objectiveData[4]
        this.objectiveCodeDesc = objectiveData[1]
        this.objectiveDesc = utils.jsonString(objectiveData[5], { removeCrLf: true })
        this.objectiveStatus = objectiveData[2]
        this.objectiveStatusDesc = objectiveData[6]
        this.objectiveSequence = Number.parseInt(objectiveData[3])
    }

    static query(assessmentPk: number): string {

        return `select ois.ssp_objectives_in_set_pk, o.objective_desc, m.objective_status_elm, ois.display_sort, so.objective_code, 
                    so.objective_desc, r.ref_element_desc  
                    from eor.ssp_objectives_in_set ois, eor.ssp_objective so, eor.objective o, eor.ssp_objective_measure m, eor.ref_element r 
                    where so.ssp_objectives_in_set_pk = ois.ssp_objectives_in_set_pk
                    and m.ssp_objectives_in_set_pk = ois.ssp_objectives_in_set_pk
                    and o.objective_code = so.objective_code
                    and ois.oasys_set_pk = ${assessmentPk}
                    and r.ref_category_code = m.objective_status_cat and r.ref_element_code = m.objective_status_elm 
                    and ois.objective_type_elm = 'CURRENT'
                    order by ois.display_sort`
    }

}

export class DbNeed {

    criminogenicNeed: string
    criminogenicNeedDesc: string


    constructor(needsData: string[]) {
        this.criminogenicNeed = needsData[0]
        this.criminogenicNeedDesc = needsData[1]
    }

    static query(objectivePk: string): string {

        return `select c.criminogenic_need_elm, r.ref_element_desc
                    from eor.ssp_crim_need_obj_pivot c, eor.ref_element r
                    where c.ssp_objectives_in_set_pk = ${objectivePk}
                    and r.ref_category_code = c.criminogenic_need_cat and r.ref_element_code = c.criminogenic_need_elm`
    }
}

const actionColumns: Columns = {

    action: { name: 'intervention_elm', type: 'string' },
    actionDesc: { table: 'ref_element', name: 'ref_element_desc', type: 'string' },
    actionComment: { name: 'intervention_comment', type: 'string' },
}

export class DbAction {

    action: string
    actionDesc: string
    actionComment: string

    static query(objectivePk: string): string {

        return buildQuery(actionColumns, ['ssp_intervention_in_set', 'ssp_obj_intervene_pivot', 'ref_element', 'ssp_intervention_measure'],
            `ssp_obj_intervene_pivot.ssp_intervention_in_set_pk = ssp_intervention_in_set.ssp_intervention_in_set_pk
                        and ssp_obj_intervene_pivot.ssp_objectives_in_set_pk = ${objectivePk}
                        and ref_element.ref_category_code = ssp_intervention_in_set.intervention_cat 
                        and ref_element.ref_element_code = ssp_intervention_in_set.intervention_elm
                        and ssp_obj_intervene_pivot.deleted_ind <> 'Y'
                        and ssp_intervention_measure.ssp_intervention_in_set_pk = ssp_obj_intervene_pivot.ssp_intervention_in_set_pk
                        and ssp_intervention_measure.intervene_meas_code_elm in ('R', 'RII')`
            , null)
    }

    constructor(actionData: string[]) {

        assignValues(this, actionColumns, actionData, 0)
    }
}
