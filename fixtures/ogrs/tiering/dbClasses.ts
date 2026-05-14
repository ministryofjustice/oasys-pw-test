export const dateFormat = 'DD-MM-YYYY'

export class TieringCase {

    probationCrn: string
    prisonCrn: string
    assessmentPk: number
    offenderPk: number
    dateCompleted: string
    o1_30: string
    arpCsrp: {
        ncRsrPercentageScore: number
        rsrStaticOrDynamic: string
        snsvStaticPercentage: number
        snsvDynamicPercentage: number
        ogrs4gPercentage2yr: number
        ogp2Percentage2yr: number
    }
    srp: {
        ncOspDcRiskReconElm: string
        ncOspDcPercentageScore: number
        ncOspIicRiskReconElm: string
        ncOspIicPercentageScore: number
        dcSrpRiskReduction: string
    }
    oldOsp: {
        ospCRiskReconElm: string
        ospCPercentageScore: number
        ospIRiskReconElm: string
        ospIPercentageScore: number
    }
    rosh: string
    roshLevelElm: string
    mappa: string
    lifer: string
    custodyInd: string
    communityDate: string
    daStalking: {
        da: string
        daHistory: string
        stalking: string
    }
    cp: {
        cpRegistered: string
        barredChildren: string
        childSexExploitHist: string
        altBarredChildren: string
        childCrimExploit: string
        childSexExploit: string
        childConcerns: string
        riskToChildren: string
        childProtection: string
    }
    oracleResults: {
        finalTier: string
        iicTrump: string
    }

    constructor(tieringData: string[]) {

        let i = 0
        this.probationCrn = tieringData[i++]
        this.prisonCrn = tieringData[i++]
        this.assessmentPk = Number.parseInt(tieringData[i++])
        this.offenderPk = Number.parseInt(tieringData[i++])
        this.dateCompleted = tieringData[i++]
        this.o1_30 = tieringData[i++]
        this.arpCsrp = {
            ncRsrPercentageScore: utils.stringToFloat(tieringData[i++]),
            rsrStaticOrDynamic: tieringData[i++],
            snsvStaticPercentage: utils.stringToFloat(tieringData[i++]),
            snsvDynamicPercentage: utils.stringToFloat(tieringData[i++]),
            ogrs4gPercentage2yr: utils.stringToFloat(tieringData[i++]),
            ogp2Percentage2yr: utils.stringToFloat(tieringData[i++]),
        }
        this.srp = {
            ncOspDcRiskReconElm: tieringData[i++],
            ncOspDcPercentageScore: utils.stringToFloat(tieringData[i++]),
            ncOspIicRiskReconElm: tieringData[i++],
            ncOspIicPercentageScore: utils.stringToFloat(tieringData[i++]),
            dcSrpRiskReduction: tieringData[i++],
        }
        this.oldOsp = {
            ospCRiskReconElm: tieringData[i++],
            ospCPercentageScore: utils.stringToFloat(tieringData[i++]),
            ospIRiskReconElm: tieringData[i++],
            ospIPercentageScore: utils.stringToFloat(tieringData[i++]),
        }
        this.rosh = tieringData[i++]
        this.roshLevelElm = tieringData[i++]
        this.mappa = tieringData[i++]
        this.lifer = tieringData[i++]
        this.custodyInd = tieringData[i++]
        this.communityDate = tieringData[i++]
        this.daStalking = {
            da: tieringData[i++],
            daHistory: tieringData[i++],
            stalking: tieringData[i++],
        }
        this.cp = {
            cpRegistered: tieringData[i++],
            barredChildren: tieringData[i++],
            childSexExploitHist: tieringData[i++],
            altBarredChildren: tieringData[i++],
            childCrimExploit: tieringData[i++],
            childSexExploit: tieringData[i++],
            childConcerns: tieringData[i++],
            riskToChildren: tieringData[i++],
            childProtection: tieringData[i++],
        }
        this.oracleResults = {
            finalTier: tieringData[i++],
            iicTrump: tieringData[i++],
        }
    }

    static query(rows: number, whereClause: string): string {

        const where = whereClause == null ? '' : `where ${whereClause}`
        return `select 
                    cms_prob_number, cms_pris_number, oasys_set_pk, offender_pk,
                    to_char(date_completed, '${dateFormat}'),
                    one_point_thirty,
                    nc_rsr_percentage_score, nc_rsr_static_or_dynamic,
                    snsv_percentage_2yr_static, snsv_percentage_2yr_dynamic,
                    ogrs4g_percentage_2yr, ogp2_percentage_2yr, 
                    nc_osp_dc_risk_recon_elm, nc_osp_dc_percentage_score, nc_osp_iic_risk_recon_elm, nc_osp_iic_percentage_score, dc_srp_risk_reduction, 
                    osp_c_risk_recon_elm, osp_c_percentage_score, osp_i_risk_recon_elm, osp_i_percentage_score,
                    rosh, rosh_level_elm, mappa, lifer, custody_ind, to_char(community_date, '${dateFormat}'),
                    da, da_history, stalking,
                    cp_registered,  
                    barred_children, child_sex_exploit_hist, alt_barred_children, child_crim_exploit, 
                    child_sex_exploit, child_concerns, risk_to_children, child_protection,
                    final_tier, iic_trump
                    from eor.df453_new_prediction 
                    ${where}
                    fetch first ${rows} rows only`
    }
}
