import { Temporal } from '@js-temporal/polyfill'
import { Decimal } from 'decimal.js'

import { OasysDb } from 'fixtures'
import { OgrsAssessment } from './dbClasses'
import { OgrsRsr } from './dbClasses'
import { OgrsInputParams, OgrsOutputParams } from '../types'
import { createAssessmentInputParams } from './createAssessmentTestCase'
import { createCsrpInputParams } from './createCsrpTestCase'
import { createOutputObject } from '../calculator/createOutput'


export class Data {

    constructor(private readonly oasysDb: OasysDb) { }

    async getOneAssessment(assessmentPk: number): Promise<OgrsAssessment> {

        const assessments = await this.getAssessmentTestData(1, `oasys_set_pk = '${assessmentPk}'`)
        if (assessments.length == 0) {
            throw new Error(`Assessment not found: ${assessmentPk}`)
        }
        return assessments[0]
    }

    async getAssessmentTestData(rows: number, whereClause: string): Promise<OgrsAssessment[]> {

        const assessments = await this.oasysDb.getData(OgrsAssessment.query(rows, whereClause))

        const result: OgrsAssessment[] = []
        for (let a = 0; a < assessments.length; a++) {
            // Add OASYS_SET data to the return object
            const assessment = new OgrsAssessment(assessments[a])

            // Questions and answers
            const qaData = await this.oasysDb.getData(OgrsAssessment.qaQuery(assessment.pk))

            assessment.qaData = {}
            const qa = qaData as string[][]
            qa.forEach((q) => {
                if (assessment.qaData[q[0]] == undefined) {
                    assessment.qaData[q[0]] = q[1]
                } else {
                    assessment.qaData[q[0]] += `,${q[1]}`  // Questions with multiple answers go into a single comma-separated string
                }
            })

            // Offence
            const offences = await this.oasysDb.getData(OgrsAssessment.offenceQuery(assessment.pk))
            if (offences.length > 0) {
                for (let i = 0; i < offences.length; i++) {
                    if (offences[i].length == 2) {
                        if (offences[i][1] == 'CURRENT') {
                            assessment.offence = offences[i][0]
                        } else {
                            assessment.additionalOffences.push(offences[i][0])
                        }
                    }
                }
            }

            result.push(assessment)
        }
        return result
    }

    async getOneCsrp(csrpPk: number): Promise<OgrsRsr> {

        const csrps = await this.getCsrpTestData(1, `offender_rsr_scores_pk = '${csrpPk}'`)
        if (csrps.length == 0) {
            throw new Error(`Standalone CSRP not found: ${csrpPk}`)
        }
        return csrps[0]
    }

    async getCsrpTestData(rows: number, whereClause: string): Promise<OgrsRsr[]> {

        const rsrs = await this.oasysDb.getData(OgrsRsr.query(rows, whereClause))

        const result: OgrsRsr[] = []
        for (let a = 0; a < rsrs.length; a++) {
            const rsr = new OgrsRsr(rsrs[a])
            result.push(rsr)
        }

        return result
    }

    getAssessmentInputParams(assessment: OgrsAssessment, dateParam: string | Temporal.PlainDate = null): OgrsInputParams {

        return createAssessmentInputParams(assessment, dateParam)
    }

    getRsrInputParams(assessment: OgrsRsr): OgrsInputParams {

        return createCsrpInputParams(assessment)
    }

    loadOracleOutputValues(values: string[]): OgrsOutputParams {

        const result = createOutputObject()

        let i = 0
        Object.keys(result).forEach((param) => {
            const stringValue = values[i++]
            const isNumeric = !Number.isNaN(Number.parseFloat(stringValue))
            // @ts-expect-error
            result[param] = isNumeric ? new Decimal(stringValue) : stringValue == '' ? null : stringValue
        })

        return result
    }

}