import { assignValues, buildQuery } from 'lib/queryBuilder'




export class RescoreOffender {

    oldRescore: RescoreDetails
    newRescore: RescoreDetails
    assessments: RescoreAssessment[] = []

    constructor(readonly offenderPk: number, readonly probationCrn: string) { }

}

const assessmentColumns: Columns = {

    assessmentPk: { name: 'oasys_set_pk', type: 'integer' },
    assessmentType: { name: 'ref_ass_version_code', type: 'string' },
    assessmentVersion: { name: 'version_number', type: 'integer' },
    status: { name: 'assessment_status_elm', type: 'string' },
    initiationDate: { name: 'initiation_date', type: 'date' },
    completedDate: { name: 'date_completed', type: 'date' },
    lastUpdatedDate: { table: 'oasys_set_change', name: 'lastupd_date', type: 'date' },
}

export class RescoreAssessment {

    assessmentPk: number
    assessmentType: string
    assessmentVersion: number
    status: string
    initiationDate: string
    completedDate: string
    lastUpdatedDate: string

    constructor(assessmentData: string[]) {

        assignValues(this, assessmentColumns, assessmentData, 0)
    }

    static query(offenderPk: number, probationCrn: string): string {

        return buildQuery(
            assessmentColumns,
            ['oasys_set', 'oasys_assessment_group', 'oasys_set_change'],
            `oasys_assessment_group.offender_pk = ${offenderPk} 
                and oasys_set.cms_prob_number = '${probationCrn}'
                and oasys_assessment_group.oasys_assessment_group_pk = oasys_set.oasys_assessment_group_pk 
                and oasys_set_change.oasys_set_pk = oasys_set.oasys_set_pk 
                and oasys_set.deleted_date is null
                and oasys_set.ref_ass_version_code in ('LAYER1','LAYER3')
                and oasys_set.assessment_status_elm in ('COMPLETE','LOCKED_INCOMPLETE')`,
            'oasys_set.date_completed desc'
        )
    }
}


const rescoreColumns: Columns = {

    assessmentPk: { name: 'oasys_set_pk', type: 'integer' },
    assessmentType: { name: 'ref_ass_version_code', type: 'string' },
    assessmentVersion: { name: 'version_number', type: 'integer' },
    status: { name: 'assessment_status_elm', type: 'string' },
    initiationDate: { name: 'initiation_date', type: 'date' },
    completedDate: { name: 'date_completed', type: 'date' },
    lastUpdatedDate: { table: 'oasys_set_change', name: 'lastupd_date', type: 'date' },
}

export class RescoreDetails {

    assessmentPk: number
    assessmentType: string
    assessmentVersion: number
    status: string
    initiationDate: string
    completedDate: string
    lastUpdatedDate: string

    constructor(assessmentData: string[]) {

        assignValues(this, assessmentColumns, assessmentData, 0)
    }

    static query(probationCrn: string, table: 'df453_new_prediction' | 'df453_new_prediction_lic'): string {

        return buildQuery(assessmentColumns, [table], `cms_prob_number = ${probationCrn}`, null)
    }
}
