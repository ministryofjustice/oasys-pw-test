declare type DbResponse = { data: number | string | string[] | string[][], error: string }

declare type SnsMessageType = 'AssSumm' | 'OGRS' | 'OPD' | 'RSR'
declare type AssessmentOrCsrp = 'assessment' | 'csrp'

declare type EndpointStat = { endpoint: Endpoint | 'database', responseTime: number }

declare type EndpointParams = {
    endpoint: Endpoint,
    crnSource?: Provider
    crn?: string,
    additionalParameter?: 'Y' | 'N',
    laoPrivilege: 'ALLOW' | 'LIMIT' | 'rubbish',
    assessmentPk?: number,
    expectedStatus?: string
}

declare type EndpointUrl = { endpoint: Endpoint, url: string }

declare type Endpoint =
    'token' |
    'offences' |
    'riskScores' |
    'allRiskScores' |
    'rmp' |
    'timeline' |
    'apAsslist' |
    'apOffence' |
    'apNeeds' |
    'apRmp' |
    'apRoshSum' |
    'apRiskInd' |
    'apRiskAss' |
    'apHealth' |
    'apRosh' |
    'assSumm' |
    'assSummSan' |
    'v4AssList' |
    'v4section1' |
    'v4section2' |
    'v4section3' |
    'v4section4' |
    'v4section5' |
    'v4section6' |
    'v4section7' |
    'v4section8' |
    'v4section9' |
    'v4section10' |
    'v4section11' |
    'v4section12' |
    'v4section13' |
    'v4Rmp' |
    'v4RoshFull' |
    'v4RoshSumm' |
    'v4Victim' |
    'v4RiskIndividual' |
    'v4RiskScoresAss' |
    'v4RiskScoresRsr' |
    'crimNeeds' |
    'pni'

declare type CheckAPIResult = {
    failed: boolean,
    output: string[]
}

declare type OffenderApisResult = {
    failed: boolean,
    report: string[],
    stats: EndpointStat[],
}

declare type ApiResponse = {
    url: string,
    statusCode: RestStatus,
    result: { [key: string]: any },
    message: string,
    responseTime: number,
}

declare type RestStatus = 'error' | 'ok' | 'badRequest' | 'forbidden' | 'notFound' | 'conflict'
declare type RestErrorResult = { statusCode: RestStatus, message: string }
declare type RestErrorResults = {
    ok: RestErrorResult,
    noOffender: RestErrorResult,
    noMatchingAssessments: RestErrorResult,
    duplicateCRN: RestErrorResult,
    noAssessments: RestErrorResult,
    badParameters: RestErrorResult,
    forbidden: RestErrorResult,
}

declare type OasysAnswer = { section: string, q: string, a: string }
declare type AnswerType = 'refAnswer' | 'freeFormat' | 'additionalNote' | 'multipleRefAnswer'
declare type Victim = { age: string, gender: string, ethnicCat: string, relationship: string }
declare type CheckDbSectionResponse = { failed: boolean, report: string[] }

declare type Table = 'oasys_set' | 'oasys_assessment_group' | 'oasys_set_change' | 'offender' | 'offender_rsr_scores' | 'ref_element' |
    'ssp_intervention_in_set' | 'ssp_obj_intervene_pivot' | 'ssp_intervention_measure' | 'df453_new_prediction' | 'df453_new_prediction_lic'
declare type ColumnType = 'date' | 'integer' | 'float' | 'string' | 'ynToBool'
declare type ColumnDef = { table?: Table; name: string; type: ColumnType }
declare type Columns = { [keys: string]: ColumnDef }