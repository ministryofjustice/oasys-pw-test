import { Temporal } from '@js-temporal/polyfill'

import { assignValues, buildQuery } from 'lib/queryBuilder'
import { OasysDb } from 'fixtures'


export class Data {

    constructor(private readonly oasysDb: OasysDb) { }

    async getPniTestParameters(probationCrn: string, pk: number): Promise<PniParams> {

        // Offender data
        const offenderData = await this.oasysDb.getData(`select custody_ind, remand_ind from eor.offender where cms_prob_number = '${probationCrn}'`)
        const community = offenderData[0][0] != 'Y' && offenderData[0][1] != 'Y'

        // oasys_Set
        const oasysSetData = await this.oasysDb.getData(oasysSetQuery(pk))

        const oasysSetValues = {
            ogrs3RiskRecon: '',
            ovpRisk: '',
            ospDc: '',
            ospIic: '',
            rsrPercentageScore: 0,
            dateOfBirth: '',
            initiationDate: '',
            noSaraDate: '',
        }
        assignValues(oasysSetValues, oasysSetColumns, oasysSetData[0], 0)

        // Q & A
        const qa = await this.oasysDb.getData(qaQuery(pk))
        const qaValues: { [key: string]: string } = {}
        for (const q of qa) {
            qaValues[q[0]] = q[1]
        }

        const age = oasysDateTime.dateDiffString(oasysSetValues.dateOfBirth, oasysSetValues.initiationDate, 'year')

        const sara = await getSaraParameters(probationCrn, pk, age, oasysSetValues.noSaraDate, qaValues, this.oasysDb)

        return {
            s1_30: yn(qaValues['1.30']),
            s6_1: getOasysScore(qaValues['6.1']),
            s6_6: getOasysScore(qaValues['6.6']),
            s6_11: yn(qaValues['6.11']),
            s6_12: getOasysScore(qaValues['6.12']),
            s7_3: getOasysScore(qaValues['7.3']),
            s10_1: getOasysScore(qaValues['10.1']),
            s11_11: getOasysScore(qaValues['11.11']),
            s11_12: getOasysScore(qaValues['11.12']),
            s11_3: getOasysScore(qaValues['11.3']),
            s11_2: getOasysScore(qaValues['11.2']),
            s11_4: getOasysScore(qaValues['11.4']),
            s11_6: getOasysScore(qaValues['11.6']),
            s12_1: getOasysScore(qaValues['12.1']),
            s12_9: getOasysScore(qaValues['12.9']),
            ogrs3RiskRecon: oasysSetValues.ogrs3RiskRecon,
            ovpRisk: oasysSetValues.ovpRisk,
            ospDc: oasysSetValues.ospDc,
            ospIic: oasysSetValues.ospIic,
            rsrPercentageScore: oasysSetValues.rsrPercentageScore,
            community: community,
            saraRiskPartner: sara.saraRiskLevelToPartner,
            saraRiskOther: sara.saraRiskLevelToOther,
        }
    }

}

function getOasysScore(param: string): number {

    if (!param) {
        return null
    }

    const c = (param as string).substring(0, 1)
    return Number.isNaN(Number.parseInt(c)) ? null : Number.parseInt(c)
}

function yn(param: string): string {

    return param == 'YES' ? 'Yes' : param == 'NO' ? 'No' : null
}

const oasysSetColumns: Columns = {

    ogrs3RiskRecon: { name: 'ogrs3_risk_recon_elm', type: 'string' },
    ovpRisk: { name: 'ovp_risk_recon_elm', type: 'string' },
    ospDc: { name: 'osp_dc_risk_recon_elm', type: 'string' },
    ospIic: { name: 'osp_iic_risk_recon_elm', type: 'string' },
    rsrPercentageScore: { name: 'rsr_percentage_score', type: 'float' },
    dateOfBirth: { name: 'date_of_birth', type: 'date' },
    initiationDate: { name: 'initiation_date', type: 'date' },
    noSaraDate: { name: 'no_sara_date', type: 'date' }
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
    : Promise<{ saraRiskLevelToPartner: number, saraRiskLevelToOther: number }> {

    // Rule 1
    if (age < 18) {
        return { saraRiskLevelToPartner: 1, saraRiskLevelToOther: 1 }
    }

    const saraPk = await oasysDb.getSingleNumericValue(`select oasys_set_pk from eor.oasys_set where parent_oasys_set_pk = ${assessmentPk} order by initiation_date desc`)

    // Rule 2 - SARA has been created on this assessment and has not been rejected
    if (saraPk && !noSaraDate) { // latest SARA is assocated with the assessment  // TODO Workaround for defect 1265 (fails the tests for 1201 and 1225).  Remove the !noSaraDate
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
    return { saraRiskLevelToPartner: utils.getInteger(saraData[0][1]), saraRiskLevelToOther: utils.getInteger(saraData[1][1]) }
}