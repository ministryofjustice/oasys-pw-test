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
    releaseDate: Temporal.PlainDate
    runDate: Temporal.PlainDate

    o1_30: boolean
    da: boolean
    stalking: boolean
    cp: boolean

    csvOrOracleResults: {
        finalTier: string
        provisional: string
    }

    constructor(tieringData: string[], runDate?: Temporal.PlainDate) {

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
        this.releaseDate = oasysDateTime.stringToDate(tieringData[i++])
        this.runDate = runDate ?? oasysDateTime.testStartDate

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

        let andWhere = whereClause == null ? '' : `and ${whereClause}`

        return `select 
                    df.cms_prob_number,
                    df.ogrs4g_percentage_2yr, df.ogp2_percentage_2yr, 
                    df.nc_rsr_static_or_dynamic, df.nc_rsr_percentage_score, 
                    df.nc_osp_dc_risk_recon_elm, df.nc_osp_dc_percentage_score,  
                    df.rosh, df.mappa, df.lifer, df.custody_ind, 
                    to_char(df.delius_release_date, '${dateFormat}'),
                    df.one_point_thirty,
                    df.da, df.stalking, df.child_protection,
                    df.final_tier, df.provisional
                    from eor.df453_new_prediction df, eor.oasys_set os
                    where os.oasys_set_pk = df.oasys_set_pk 
                    ${andWhere}
                    fetch first ${rows} rows only`
    }
}
