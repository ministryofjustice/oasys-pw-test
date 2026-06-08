import { OasysDb } from 'fixtures'
import { RescoreAssessment, RescoreOffender } from './dbClasses'


export class RescoringLic {

    constructor(private readonly oasysDb: OasysDb) { }

    async getRescoreOffender(offenderPk: number, probationCrn: string): Promise<RescoreOffender> {

        let rescoreOffender = new RescoreOffender(offenderPk, probationCrn)

        // Get OASYS_SET data, then loop through assessments
        const assessments = await this.oasysDb.getData(RescoreAssessment.query(offenderPk, probationCrn))

        for (let a = 0; a < assessments.length; a++) {
            // Add OASYS_SET data to the return object
            let assessment = new RescoreAssessment(assessments[a])

            // Add the assessment to the offender
            rescoreOffender.assessments.push(assessment)
        }

        return rescoreOffender
    }
}