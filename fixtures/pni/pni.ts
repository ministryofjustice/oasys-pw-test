import { Assessment, OasysDb } from 'fixtures'
import { Data } from './data'
import { pniCalc } from './pniCalc'

export class Pni {

    constructor(private readonly oasysDb: OasysDb, private readonly assessment: Assessment) { }

    private readonly data = new Data(this.oasysDb)

    async checkAssessmentCalc(probationCrn: string, pk: number) {

        const pniParams = await this.data.getPniTestParameters(probationCrn, pk)
        const pniResult = pniCalc(pniParams)

        log(JSON.stringify(pniParams))
        log(JSON.stringify(pniResult))

        await this.assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
            pni_func_proc: 'Y',
            pni_calculation: pniResult.pniCalculation,
            pni_missing_fields_txt: pniResult.missingFields ? `\n${pniResult.missingFields.join('\n')}` : null,
        })
    }
}