import { test } from 'fixtures'
import { ogrsOracleTest } from './testLib'

const count = 1000
const reportMode: ReportMode = 'minimal'

test.describe('OGRS calculator tests', () => {

    test(`Layer 3 v1 complete`, async ({ ogrs }) => {
        test.setTimeout(0)

        const whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm = 'COMPLETE'`
        await ogrsOracleTest('assessment', count, whereClause, reportMode, ogrs)
    })

    test(`Layer 3 v1 not complete (any other status)`, async ({ ogrs }) => {
        test.setTimeout(0)

        const whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm <> 'COMPLETE'`
        await ogrsOracleTest('assessment', count, whereClause, reportMode, ogrs)
    })

    test(`Layer 1 v2 complete`, async ({ ogrs }) => {
        test.setTimeout(0)

        const whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 2 and assessment_status_elm = 'COMPLETE'`
        await ogrsOracleTest('assessment', count, whereClause, reportMode, ogrs)
    })

    test(`Layer 1 v2 not complete (any other status)`, async ({ ogrs }) => {
        test.setTimeout(0)

        const whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 2 and assessment_status_elm <> 'COMPLETE'`
        await ogrsOracleTest('assessment', count, whereClause, reportMode, ogrs)
    })

    test(`Layer 1 v1 complete`, async ({ ogrs }) => {
        test.setTimeout(0)

        const whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 1 and assessment_status_elm = 'COMPLETE'`
        await ogrsOracleTest('assessment', count, whereClause, reportMode, ogrs)
    })

    test(`Layer 1 v1 not complete (any other status)`, async ({ ogrs }) => {
        test.setTimeout(0)

        const whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER1' and version_number = 1 and assessment_status_elm <> 'COMPLETE'`
        await ogrsOracleTest('assessment', count, whereClause, reportMode, ogrs)
    })

    test(`Standalone CSRP complete`, async ({ ogrs }) => {
        test.setTimeout(0)

        const whereClause = `deleted_date is null and rsr_status = 'COMPLETE'`
        await ogrsOracleTest('csrp', count, whereClause, reportMode, ogrs)
    })
})