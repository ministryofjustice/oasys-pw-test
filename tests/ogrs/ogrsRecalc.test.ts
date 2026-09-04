import { test, Ogrs } from 'fixtures'
import { OgrsAssessment } from 'fixtures/ogrs/data/dbClasses'

const count = 1000


test(`OGRS recalculation test`, async ({ ogrs }) => {

    const whereClause = `deleted_date is null and ref_ass_version_code in ('LAYER3', 'LAYER1') and assessment_status_elm = 'COMPLETE'`
    await ogrsRecalcTest('assessment', count, whereClause, ogrs)
})



export async function ogrsRecalcTest(type: AssessmentOrCsrp, count: number, whereClause: string, ogrs: Ogrs) {

    let failures = 0
    let cases = 0

    const oasysData = await ogrs.getOasysData(type, count, whereClause)

    for (const assessmentOrRsr of oasysData) {

        const testCaseResult = await ogrs.checkOgrsInOasysSetReturnStatus(assessmentOrRsr.pk, (assessmentOrRsr as OgrsAssessment).signedDate)
        if (testCaseResult) {
            failures++
        }
        cases++

    }

    log(' ')
    log(' ')
    log(`Cases: ${cases}, failures: ${failures}.`, 'Summary')
    expect(failures).toBe(0)
}