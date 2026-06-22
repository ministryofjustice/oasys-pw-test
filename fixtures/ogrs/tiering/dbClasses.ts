import { Temporal } from '@js-temporal/polyfill'

export const dateFormat = 'DD-MM-YYYY'

export class TieringCase {

    probationCrn: string
    arpStatic: boolean
    csrpStatic: boolean
    arp: number
    csrp: number
    oscDcBand: string
    ospDcScore: number

    rosh: string
    mappa: boolean

    lifer: boolean
    inCustody: boolean
    communityDate: Temporal.PlainDate
    communityDateFuture: boolean

    o1_30: boolean
    da: boolean
    stalking: boolean
    cp: boolean

    csvOrOracleResults: {
        finalTier: string
        provisional: string
    }

    constructor(tieringData: string[]) {

        let i = 0
        this.probationCrn = tieringData[i++]

        const ogrs = utils.stringToFloat(tieringData[i++])
        const ogp = utils.stringToFloat(tieringData[i++])

        this.arpStatic = ogp == null
        this.arp = this.arpStatic ? ogrs : ogp

        this.csrpStatic = tieringData[i++] != 'DYNAMIC'
        this.csrp = utils.stringToFloat(tieringData[i++])

        this.oscDcBand = tieringData[i++]
        this.ospDcScore = utils.stringToFloat(tieringData[i++])

        this.rosh = tieringData[i++]
        this.mappa = tieringData[i++] == 'Y'
        this.lifer = tieringData[i++] == 'Y'
        this.inCustody = tieringData[i++] == 'Y'
        this.communityDate = oasysDateTime.stringToDate(tieringData[i++])
        this.communityDateFuture = oasysDateTime.dateDiff(oasysDateTime.testStartDate, this.communityDate, 'day') > 0

        this.o1_30 = tieringData[i++] == 'Y'
        this.da = tieringData[i++] == 'Y'
        this.stalking = tieringData[i++] == 'Y'
        this.cp = tieringData[i++] == 'Y'

        this.csvOrOracleResults = {
            finalTier: tieringData[i++],
            provisional: tieringData[i++],
        }
    }

    static query(rows: number, whereClause: string): string {

        const where = whereClause == null ? '' : `where ${whereClause}`
        return `select 
                    cms_prob_number,
                    ogrs4g_percentage_2yr, ogp2_percentage_2yr, 
                    nc_rsr_static_or_dynamic, nc_rsr_percentage_score, 
                    nc_osp_dc_risk_recon_elm, nc_osp_dc_percentage_score,  
                    rosh, mappa, lifer, custody_ind, to_char(community_date, '${dateFormat}'),
                    one_point_thirty,
                    da, stalking, child_protection,
                    final_tier, provisional
                    from eor.df453_new_prediction 
                    ${where}
                    fetch first ${rows} rows only`
    }
}
