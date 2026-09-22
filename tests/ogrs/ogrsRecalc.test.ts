import { test, Ogrs } from 'fixtures'
import { OgrsAssessment } from 'fixtures/ogrs/data/dbClasses'

const count = 100000

test(`OGRS recalculation test`, async ({ ogrs }) => {

    test.setTimeout(0)
    const whereClause = `deleted_date is null and ref_ass_version_code in ('LAYER3', 'LAYER1') and prison_ind is null
                            and initiation_date > (select release_date from eor.system_config where version_number = '7.7.0.0' and cm_release_type_elm = 'APPLICATION')
                            and date_completed < to_date('10-09-2026', 'DD-MM-YYYY')`
    // const whereClause = 'oasys_set_pk = 2516180782'
    await ogrsRecalcTest('assessment', count, whereClause, ogrs)
})

export async function ogrsRecalcTest(type: AssessmentOrCsrp, count: number, whereClause: string, ogrs: Ogrs) {

    let cases = 0

    let arpScoreErrors = 0
    let arpBandErrors = 0
    let vrpScoreErrors = 0
    let vrpBandErrors = 0
    let svrpScoreErrors = 0
    let svrpBandErrors = 0
    let scoreErrors = 0
    let bandErrors = 0
    let tierErrors = 0

    const oasysData = await ogrs.getOasysData(type, count, whereClause)

    for (const assessmentOrRsr of oasysData) {

        const testCaseResult = await ogrs.checkOgrsInOasysSetReturnStatus(assessmentOrRsr as OgrsAssessment)
        cases++
        if (testCaseResult.arpScore) {
            arpScoreErrors++
        }
        if (testCaseResult.arpBand) {
            arpBandErrors++
        }
        if (testCaseResult.vrpScore) {
            vrpScoreErrors++
        }
        if (testCaseResult.arpScore || testCaseResult.vrpScore || testCaseResult.svrpScore) {
            scoreErrors++
        }
        if (testCaseResult.vrpBand) {
            vrpBandErrors++
        }
        if (testCaseResult.svrpScore) {
            svrpScoreErrors++
        }
        if (testCaseResult.svrpBand) {
            svrpBandErrors++
        }
        if (testCaseResult.arpBand || testCaseResult.vrpBand || testCaseResult.svrpBand) {
            bandErrors++
        }
        if (testCaseResult.tier) {
            tierErrors++
        }
    }

    log(' ', 'Summary')
    log(`Cases: ${cases}`)
    log(`ARP score errors: ${arpScoreErrors}`)
    log(`ARP band errors: ${arpBandErrors}`)
    log(`VRP score errors: ${vrpScoreErrors}`)
    log(`VRP band errors: ${vrpBandErrors}`)
    log(`SVRP score errors: ${svrpScoreErrors}`)
    log(`SVRP band errors: ${svrpBandErrors}`)
    log(' ')
    log(`Score errors: ${scoreErrors}`)
    log(`Band errors: ${bandErrors}`)
    log(`Tier errors: ${tierErrors}`)
}
