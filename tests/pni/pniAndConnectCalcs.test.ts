import { test } from 'fixtures'

const count = 10
test('PNI and Connect calculator test', async ({ pni }) => {

    const whereClause = `deleted_date is null and ref_ass_version_code = 'LAYER3' and version_number = 1 and assessment_status_elm = 'COMPLETE'`
    await pni.testConnectCalculator(whereClause, count)
})


