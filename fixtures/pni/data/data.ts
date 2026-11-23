import { OasysDb } from 'fixtures'
import { assignValues, buildQuery } from 'lib/queryBuilder'
import { ConnectParams } from './connectParams'
import { PniParams } from './pniParams'

export class Data {

    constructor(private readonly oasysDb: OasysDb) { }

    async getPniTestParameters(probationCrn: string, pk: number): Promise<{ pniParams: PniParams, connectParams: ConnectParams, oasysSetValues: OasysSetValues }> {

        // Offender data
        const offenderData = await this.oasysDb.getData(`select custody_ind, remand_ind from eor.offender where cms_prob_number = '${probationCrn}'`)
        const community = offenderData[0][0] != 'Y' && offenderData[0][1] != 'Y'

        // oasys_Set
        const oasysSetData = await this.oasysDb.getData(oasysSetQuery(pk))

        const oasysSetValues = new OasysSetValues()
        assignValues(oasysSetValues, oasysSetColumns, oasysSetData[0], 0)

        // Q & A
        const qa = await this.oasysDb.getData(qaQuery(pk))
        const qaValues: { [key: string]: string } = {}
        for (const q of qa) {
            qaValues[q[0]] = q[1]
        }

        const age = oasysDateTime.dateDiffString(oasysSetValues.dateOfBirth, oasysSetValues.initiationDate, 'year')
        const sara = await getSaraParameters(probationCrn, pk, age, oasysSetValues.noSaraDate, qaValues, this.oasysDb)

        const pniParams = new PniParams()
        pniParams.populateForCalculatorTest(oasysSetValues, qaValues, sara, community)
        
        return {
            pniParams: pniParams,
            connectParams: new ConnectParams(oasysSetValues, qaValues, community),
            oasysSetValues: oasysSetValues,
        }
    }

}

export function getOasysScore(param: string): number {

    if (!param) {
        return null
    }

    const c = (param as string).substring(0, 1)
    return Number.isNaN(Number.parseInt(c)) ? null : Number.parseInt(c)
}

export function yn(param: string): string {

    return param == 'YES' ? 'Yes' : param == 'NO' ? 'No' : null
}

const oasysSetColumns: Columns = {

    assessmentPk: { name: 'oasys_set_pk', type: 'integer' },
    assessmentStatus: { name: 'assessment_status_elm', type: 'string' },
    arpStaticBand: { name: 'ogrs4g_band_risk_recon_elm', type: 'string' },
    arpDynamicBand: { name: 'ogp_risk_recon_elm', type: 'string' },
    vrpStaticBand: { name: 'ogrs4v_band_risk_recon_elm', type: 'string' },
    vrpDynamicBand: { name: 'ovp_risk_recon_elm', type: 'string' },
    ogrs3Band: { name: 'ogrs3_risk_recon_elm', type: 'string' },
    ovpBand: { name: 'ovp_risk_recon_elm', type: 'string' },
    ospDc: { name: 'osp_dc_risk_recon_elm', type: 'string' },
    ospIic: { name: 'osp_iic_risk_recon_elm', type: 'string' },
    ospC: { name: 'osp_c_risk_recon_elm', type: 'string' },
    ospI: { name: 'osp_i_risk_recon_elm', type: 'string' },
    arpPercentageScore: { name: 'ogp2_percentage_2yr', type: 'float' },
    rsrPercentageScore: { name: 'rsr_percentage_score', type: 'float' },
    dateOfBirth: { name: 'date_of_birth', type: 'date' },
    initiationDate: { name: 'initiation_date', type: 'date' },
    noSaraDate: { name: 'no_sara_date', type: 'date' },
    rosh: { name: 'rosh_level_elm', type: 'string' },
    pniFuncProc: { name: 'pni_func_proc', type: 'string' },
    rsrVersion: { name: 'rsr_algorithm_version', type: 'integer' },
}

export class OasysSetValues {
    assessmentPk: number
    assessmentStatus: string
    arpStaticBand: string
    arpDynamicBand: string
    vrpStaticBand: string
    vrpDynamicBand: string
    ogrs3Band: string
    ovpBand: string
    ospDc: string
    ospIic: string
    ospC: string
    ospI: string

    arpPercentageScore: number
    rsrPercentageScore: number
    dateOfBirth: string
    initiationDate: string
    noSaraDate: string
    rosh: string
    pniFuncProc: string
    rsrVersion: number
}

function oasysSetQuery(assessmentPk: number): string {

    return buildQuery(oasysSetColumns, ['oasys_set'], `oasys_set_pk = ${assessmentPk}`, null)
}

function qaQuery(assessmentPk: number): string {

    return `select ref_question_code, answer
                    from
                    (
                    select oq.ref_question_code, decode(oq.free_format_answer,null,oa.ref_answer_code,oq.free_format_answer) answer
                    from eor.oasys_set os
                    left outer join eor.oasys_section osec
                    on osec.oasys_set_pk = os.oasys_set_pk
                    left outer join eor.oasys_question oq
                    on oq.oasys_section_pk = osec.oasys_section_pk
                    left outer join eor.oasys_answer oa
                    on oa.oasys_question_pk = oq.oasys_question_pk
                    where os.oasys_set_pk = ${assessmentPk}
                    and oq.currently_hidden_ind = 'N'
                    and oq.ref_question_code in ('1.30', '2.3', '6.1', '6.6', '6.7.2.1da', '6.11', '6.12', '7.3', '10.1', '11.11', '11.12', '11.3', '11.2', '11.4', '11.6', '12.1', '12.9' )
                    ) `
}

function saraQaQuery(saraPk: number): string {

    return `select ref_question_code, answer
                    from
                    (
                    select oq.ref_question_code, decode(oq.free_format_answer,null,oa.ref_answer_code,oq.free_format_answer) answer
                    from eor.oasys_set os
                    left outer join eor.oasys_section osec
                    on osec.oasys_set_pk = os.oasys_set_pk
                    left outer join eor.oasys_question oq
                    on oq.oasys_section_pk = osec.oasys_section_pk
                    left outer join eor.oasys_answer oa
                    on oa.oasys_question_pk = oq.oasys_question_pk
                    where os.oasys_set_pk = ${saraPk}
                    and oq.currently_hidden_ind = 'N'
                    and oq.ref_question_code in ('SR76.1.1', 'SR77.1.1' )
                    ) `
}

async function getSaraParameters(probationCrn: string, assessmentPk: number, age: number, noSaraDate: string, qaValues: { [key: string]: string | number }, oasysDb: OasysDb)
    : Promise<SaraParams> {

    // Rule 1
    if (age < 18) {
        return { saraRiskLevelToPartner: 1, saraRiskLevelToOther: 1 }
    }

    const saraPk = await oasysDb.getSingleNumericValue(`select oasys_set_pk from eor.oasys_set where parent_oasys_set_pk = ${assessmentPk} order by initiation_date desc`)

    // Rule 2 - SARA has been created on this assessment and has not been rejected
    if (saraPk) { // latest SARA is assocated with the assessment
        return getSaraRiskLevels(saraPk, oasysDb)
    }

    // Rule 3 - SARA declined, 6.7 not Yes, 2.3 not ticked
    if (noSaraDate && qaValues['6.7.2.1da'] != 'YES' && !(qaValues['2.3'] as string)?.includes('PHYSICALVIOL')) {
        return { saraRiskLevelToPartner: 1, saraRiskLevelToOther: 1 }
    }

    // Rule 4 - 6.7 or 2.3 set, no SARA but it hasn't been rejected (yet)
    if (!noSaraDate && !saraPk && (qaValues['6.7.2.1da'] == 'YES' || (qaValues['2.3'] as string)?.includes('PHYSICALVIOL'))) {
        return { saraRiskLevelToPartner: null, saraRiskLevelToOther: null }
    }

    //  Rule 5 - no SARA (and not declined), 6.7 and 2.3 not set
    if (!noSaraDate && !saraPk && qaValues['6.7.2.1da'] != 'YES' && !(qaValues['2.3'] as string)?.includes('PHYSICALVIOL'))
        return { saraRiskLevelToPartner: 1, saraRiskLevelToOther: 1 }

    // Rule 6 (new for NOD-1243) - SARA declined, but 6.7 or 2.3 are set - need to check previous SARAs
    if (noSaraDate && (qaValues['6.7.2.1da'] == 'YES' || (qaValues['2.3'] as string)?.includes('PHYSICALVIOL'))) {

        // loop through previous SARAs, use the values if both set or if one is greater than 1

        const prevSarasQuery = `select os.oasys_set_pk from eor.offender o, eor.oasys_assessment_group oag, eor.oasys_set os
                                    where o.cms_prob_number = '${probationCrn}'
                                    and oag.offender_pk = o.offender_pk
                                    and oag.oasys_assessment_group_pk = os.oasys_assessment_group_pk
                                    and os.assessment_type_elm = 'SARA'
                                    and os.deleted_date is null
                                    and os.assessment_status_elm in ('COMPLETE', 'LOCKED_INCOMPLETE')
                                    and os.parent_oasys_set_pk <> ${assessmentPk}
                                    order by os.initiation_date desc`

        const prevSaras = await oasysDb.getData(prevSarasQuery)

        for (const sara of prevSaras) {
            const risks = await getSaraRiskLevels(Number.parseInt(sara[0]), oasysDb)
            if ((risks.saraRiskLevelToPartner != null && risks.saraRiskLevelToOther != null) || risks.saraRiskLevelToPartner > 1 || risks.saraRiskLevelToOther > 1) {
                return risks
            }
        }
    }

    // Otherwise
    return { saraRiskLevelToPartner: 1, saraRiskLevelToOther: 1 }
}

async function getSaraRiskLevels(saraPk: number, oasysDb: OasysDb): Promise<{ saraRiskLevelToPartner: number, saraRiskLevelToOther: number }> {

    const saraData = await oasysDb.getData(saraQaQuery(saraPk))
    if (saraData.length == 0) {
        return { saraRiskLevelToPartner: null, saraRiskLevelToOther: null }
    }
    return { saraRiskLevelToPartner: utils.getInteger(saraData[0][1]), saraRiskLevelToOther: utils.getInteger(saraData[1][1]) }
}