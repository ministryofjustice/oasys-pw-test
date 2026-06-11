import { Temporal } from '@js-temporal/polyfill'

import { TestUser } from 'fixtures/user/testUsers'
import { OasysDb } from 'fixtures'
import { Queries as AssessmentQueries } from 'fixtures/assessment/queries'

type OasysSetSanData = {
    sanIndicator: string,
    spIndicator: string,
    lastUpdateFromSan: string,
    sanVersion: number,
    spVersion: number,
}

export class Queries {

    constructor(private readonly oasysDb: OasysDb) { }


    async getOasysSetSanData(pk: number): Promise<OasysSetSanData> {

        const query = `select san_assessment_linked_ind, arns_sp_only_linked_ind,
                            to_char(lastupd_from_san, '${oasysDateTime.oracleTimestampFormat}'),
                            san_assessment_version_no, ssp_plan_version_no
                            from eor.oasys_set where oasys_set_pk = ${pk}`

        const oasysSetData = await this.oasysDb.getData(query)
        return {
            sanIndicator: oasysSetData[0][0],
            spIndicator: oasysSetData[0][1],
            lastUpdateFromSan: oasysSetData[0][2],
            sanVersion: utils.getInteger(oasysSetData[0][3]),
            spVersion: utils.getInteger(oasysSetData[0][4]),
        }
    }

    async checkNoSanSections(pk: number) {

        const query = `select count(*) from eor.oasys_section where oasys_set_pk = ${pk} and ref_section_code = 'SAN'`
        const count = await this.oasysDb.selectCount(query)
        expect(count).toBe(0)
    }

    async checkNoSanSectionScores(pk: number) {

        const query = `select count(*) from eor.oasys_section where san_crim_need_score is not null and oasys_set_pk = ${pk}`
        const count = await this.oasysDb.selectCount(query)
        expect(count).toBe(0)
    }

    /**
     * Checks that the last update time in oasys_set matches the current system time (with a 10 second tolerance) for a given assessment PK.
     * 
     * Returns a boolean result (true if failed).
    */
    async checkLastUpdateTime(pk: number): Promise<boolean> {

        const query = `select to_char(lastupd_from_san, '${oasysDateTime.oracleTimestampFormat}'), to_char(sysdate, '${oasysDateTime.oracleTimestampFormat}') 
                            from eor.oasys_set where oasys_set_pk = ${pk}`

        const updateTimes = await this.oasysDb.getData(query)
        const diff = oasysDateTime.timestampDiffString(updateTimes[0][0], updateTimes[0][1])  // ms

        if (diff > 10000) {  // 10 seconds - allows time from updating SAN, returning to OASys and updating the db.
            log(`FAILED - SAN update time mismatch in oasys_set- expected: ${updateTimes[0][0]}, updated: ${updateTimes[0][1]}`)
            return true
        }
        return false
    }

    /**
     * Checks cLog for a getAssessment call for the given PK, including the expected version number in the respose.
     */
    async checkSanGetAssessmentCall(pk: number, expectedVersion: number, suppressLog = false): Promise<boolean> {

        if (!suppressLog) {
            log(`Checking GetAssessment call for ${pk}`)
        }
        const query = `select log_text from eor.clog where log_source like '%${pk}%SAN_GET_ASS%' order by time_stamp desc fetch first 2 rows only`
        const clogData = await this.oasysDb.getData(query)
        let failed = false

        if (clogData.length != 2) {
            log(`GetAssessment call FAILED - Expected 2 rows in CLog, found ${clogData.length}`)
            failed = true
        } else {
            if (clogData[1][0].search(pk.toString()) < 0) {
                log(`GetAssessment call FAILED - ${pk} not found in GetAssessment call`)
                failed = true
            }
            const sanVersionNumber = findSanVersion(clogData[0][0])
            if (sanVersionNumber != expectedVersion) {
                log(`GetAssessment call FAILED - Expected version: ${expectedVersion}, found ${sanVersionNumber}`)
                failed = true
            }
        }
        return failed
    }



    /**
     * Gets the time for the last API call of the specified type for a given PK, returned as a Temporal date/time object including milliseconds
     */
    async getSanApiTime(pk: number, type: 'SAN_GET_ASSESSMENT' | 'SAN_CREATE_ASSESSMENT' | 'SAN_LOCK_INCOMPLETE'): Promise<Temporal.PlainDateTime> {

        const query = `select to_char(time_stamp, '${oasysDateTime.oracleTimestampFormatMs}') from eor.clog where log_source like '%${pk}%${type}%' order by time_stamp desc`
        const clogData = await this.oasysDb.getData(query)
        let result: Temporal.PlainDateTime = null
        if (clogData.length > 0) {
            result = oasysDateTime.stringToTimestamp(clogData[0][0])
        }
        return result
    }

    /**
     * Checks cLog for expected entries following a createAssessment call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
     * (including the 201 status). The test will fail if anything is not as expected. Parameters are:
     *  - pk
     *  - previousPk: should be included for cloning, otherwise null
     *  - expectedUser: OASys User Id for the user creating the assessment
     *  - expected Provider: code for the area/establishment
     *  - expectedPlanType: 'INITIAL' or 'REVIEW'
     *  - expectedVersion: version number that should be returned by SAN
     *  - expectedSpVersion: version number that should be returned by SAN for the Sentence Plan
     */
    async checkSanCreateAssessmentCall(pk: number, previousSanPk: number, previousSpPk: number,
        expectedUser: TestUser, expectedProvider: string, expectedPlanType: 'INITIAL' | 'REVIEW' | 'UPW' | 'PSR_OUTLINE', spOnly = false, newPeriodOfSupervision: 'Y' | 'N' = null) {

        log('', `Check CreateAssessment API call for ${pk}, previous SAN: ${previousSanPk}, previous SP: ${previousSpPk}`)
        const query = `select log_text from eor.clog where log_source like '%${pk}%SAN_CREATE%' order by time_stamp desc`
        const clogData = await this.oasysDb.getData(query)
        let failed = false
        const type = spOnly ? 'SP' : 'SAN_SP'

        if (clogData.length != 2) {
            log(`Expected 2 rows in CLog, found ${clogData.length}`)
            failed = true
        } else {
            const call = clogData[1][0].split('\n')
            if (call[1].substring(call[1].length - 12) != 'oasys/create') {
                log(`Expected call url to include 'oasys/create', found ${call[1]}`)
                failed = true
            }
            const callData = JSON.parse(call[3].substring(16))
            if (callData['previousOasysSanPk'] != previousSanPk) {
                log(`Expected previous SAN PK: ${previousSanPk}, found ${callData['previousOasysSanPk']}`)
                failed = true
            }
            if (callData['previousOasysSpPk'] != previousSpPk) {
                log(`Expected previous SP PK: ${previousSpPk}, found ${callData['previousOasysSpPk']}`)
                failed = true
            }
            if (callData['regionPrisonCode'] != expectedProvider) {
                log(`Expected provider: ${expectedProvider}, found ${callData['regionPrisonCode']}`)
                failed = true
            }
            if (callData['userDetails']['id'] != expectedUser.username) {
                log(`Expected user ID: ${expectedUser.username}, found ${callData['userDetails']['id']}`)
                failed = true
            }
            if (callData['userDetails']['name'] != expectedUser.forenameSurname) {
                log(`Expected user name: ${expectedUser.forenameSurname}, found ${callData['userDetails']['name']}`)
                failed = true
            }
            if (callData['planType'] != expectedPlanType) {
                log(`Expected sentence plan type: ${expectedPlanType}, found ${callData['planType']}`)
                failed = true
            }
            if (callData['assessmentType'] != type) {
                log(`Expected assessment type: ${expectedPlanType}, found ${callData['assessmentType']}`)
                failed = true
            }
            if (newPeriodOfSupervision && callData['newPeriodOfSupervision'] != newPeriodOfSupervision) {
                log(`Expected new period of supervision: ${newPeriodOfSupervision}, found ${callData['newPeriodOfSupervision']}`)
                failed = true
            }

            const response = clogData[0][0].split('\n')
            if (response[2].substring(response[2].length - 3) != '201') {
                log(`Expected 201 response, found ${response[2]} `)
                failed = true
            }
        }

        expect(failed).toBeFalsy()
    }

    /**
     * Checks cLog for expected entries following a countersigning call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
     * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
     *  - pk
     *  - expectedUser: OASys User Id for the user countersigning the assessment
     *  - outcome: countersigning action expected - 'COUNTERSIGNED', 'AWAITING_DOUBLE_COUNTERSIGN', 'DOUBLE_COUNTERSIGNED' or 'REJECTED'
     *  - expectedVersion: version number that should be returned by SAN
     *  - expectedSpVersion: version number for the sentence plan that should be returned by SAN
     */
    async checkSanCountersigningCall(pk: number, expectedUser: TestUser, outcome: 'COUNTERSIGNED' | 'AWAITING_DOUBLE_COUNTERSIGN' | 'DOUBLE_COUNTERSIGNED' | 'REJECTED') {

        await this.checkSanCall('Countersigning', 'COUNTERSIGN', 'counter-sign', pk, expectedUser, { outcome: outcome })
    }

    /**
     * Checks cLog for expected entries following a signing call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
     * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
     *  - pk
     *  - expectedUser: OASys User Id for the user signing the assessment
     *  - signingType: signing action expected - 'SELF' or 'COUNTERSIGN'
     *  - expectedVersion: version number that should be returned by SAN
     *  - expectedSpVersion: version number for the sentence plan that should be returned by SAN
     */
    async checkSanSigningCall(pk: number, expectedUser: TestUser, signingType: 'SELF' | 'COUNTERSIGN') {

        await this.checkSanCall('Signing', 'SIGN', 'sign', pk, expectedUser, { signingType: signingType })
    }

    /**
     * Checks cLog for expected entries following a lockIncomplete call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
     * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
     *  - pk
     *  - expectedUser: OASys User Id for the user locking the assessment
     *  - expectedVersion: version number that should be returned by SAN
     *  - expectedSpVersion: version number for the sentence plan that should be returned by SAN
     */
    async checkSanLockIncompleteCall(pk: number, expectedUser: TestUser) {

        await this.checkSanCall('Lock Incomplete', 'LOCK_INCOMPLETE', 'lock', pk, expectedUser)
    }

    /**
     * Checks cLog for expected entries following a delete call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
     * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
     *  - pk
     *  - expectedUser: OASys User Id for the user deleting the assessment
     */
    async checkSanDeleteCall(pk: number, expectedUser: TestUser) {

        await this.checkSanCall('Delete', 'SOFT_DELETE', 'soft-delete', pk, expectedUser)
    }

    /**
     * Checks cLog for expected entries following an undelete call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
     * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
     *  - pk
     *  - expectedUser: OASys User Id for the user undeleting the assessment
     */
    async checkSanUndeleteCall(pk: number, expectedUser: TestUser) {

        await this.checkSanCall('Undelete', 'UNDELETE', 'undelete', pk, expectedUser)
    }

    /**
     * Checks cLog for expected entries following a rollback call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
     * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
     *  - pk
     *  - expectedUser: OASys User Id for the user rolling back the assessment
     *  - expectedVersion: version number that should be returned by SAN
     *  - expectedSpVersion: version number for the sentence plan that should be returned by SAN
     */
    async checkSanRollbackCall(pk: number, expectedUser: TestUser) {

        await this.checkSanCall('Rollback', 'ROLLBACK', 'rollback', pk, expectedUser)
    }

    /**
     * Checks cLog for expected entries following an OTL call to SAN, to confirm that the correct values are passed to SAN and the status 200 response is received.
     * The test will fail if anything is not as expected.
     * 
     * Expected details for the Subject, User and Needs are provided as objects with properties such as the examples shown below; any properties listed will be checked against
     * the parameters generated by OASys and recorded in cLog.
     * 
     *  Parameters are:
     *  - pk
     *  - expectedSubjectDetails: can include crn, pnc, nomisId, givenName, familyName, dateOfBirth, gender, location, sexuallyMotivatedOffenceHistory
     *  - expectedUserDetails: can include displayName, accessMode (READ_ONLY or READ_WRITE)
     *  - callType: 'san' or 'sp'
     *  - version: version number for either SAN or SP as appropriate (can be null)
     *  - expectedNeedsDetails: can include any of the relevant needs data, section by section
     */
    async checkSanOtlCall(pk: number, expectedSubjectDetails: { [keys: string]: string | OasysDate }, expectedUserDetails: { [keys: string]: string },
        callType: 'san' | 'sp', from: 'assessment' | 'offender', expectedNeedsDetails?: { [keys: string]: { [keys: string]: string } }) {

        log('', `Checking OTL call for ${pk}`)
        if (expectedSubjectDetails['dateOfBirth']) {  // reformat the date
            expectedSubjectDetails['dateOfBirth'] = oasysDateTime.oasysDateAsDbString(expectedSubjectDetails['dateOfBirth'])
        }

        const query = `select log_text from eor.clog where log_source like '%${pk}%onetime%' order by time_stamp desc fetch first 2 rows only`
        const clogData = await this.oasysDb.getData(query)

        const oasysSetSanData = await this.getOasysSetSanData(pk)

        let failed = false
        if (clogData.length != 2) {
            log(`Expected 2 rows in CLog, found ${clogData.length}`)
            failed = true
        } else {
            const call = clogData[1][0].split('\n')
            if (call[1].substring(call[1].length - 8) != 'handover') {
                log(`Expected call url to include 'handover', found ${call[1]}`)
                failed = true
            }
            const callData = JSON.parse(call[3].substring(16))

            Object.keys(expectedSubjectDetails).forEach((key) => {
                if (callData['subjectDetails'][key] != expectedSubjectDetails[key]) {
                    log(`Expected value for ${key}: ${expectedSubjectDetails[key]}, found ${callData['subjectDetails'][key]}`)
                    failed = true
                }
            })
            Object.keys(expectedUserDetails).forEach((key) => {
                if (callData['user'][key] != expectedUserDetails[key]) {
                    log(`Expected value for ${key}: ${expectedUserDetails[key]}, found ${callData['user'][key]}`)
                    failed = true
                }
            })
            if (expectedNeedsDetails) {
                Object.keys(expectedNeedsDetails).forEach((section) => {
                    Object.keys(expectedNeedsDetails[section]).forEach((key) => {
                        if (callData['criminogenicNeedsData'][section][key] != expectedNeedsDetails[section][key]) {
                            log(`Expected value for ${section}/${key}: ${expectedNeedsDetails[section][key]}, found ${callData['criminogenicNeedsData'][section][key]}`)
                            failed = true
                        }
                    })
                })
            }
            const assessmentVersion = callType == 'sp' ? undefined : from == 'offender' ? null : oasysSetSanData.sanVersion
            const spVersion = callType == 'san' ? undefined : from == 'offender' ? null : oasysSetSanData.spVersion
            if (callData['assessmentVersion'] != assessmentVersion) {
                log(`Expected assessment version: ${assessmentVersion}, found ${callData['assessmentVersion']}`)
                failed = true
            }
            if (callData['sentencePlanVersion'] != spVersion) {
                log(`Expected sentence plan version: ${spVersion}, found ${callData['sentencePlanVersion']}`)
                failed = true
            }

            const response = clogData[0][0].split('\n')
            if (response[2].substring(response[2].length - 3) != '200') {
                log(`Expected 200 response, found ${response[2]} `)
                failed = true
            }
        }

        expect(failed).toBeFalsy()
    }

    /**
     * Checks cLog for expected entries following a merge call to SAN, to confirm that the correct values are passed to SAN, and the appropriate response is received
     * (including the 200 status). The test will fail if anything is not as expected. Parameters are:
     *  - expectedUser: OASys User Id for the user merging the offenders
     *  - pkPairs: an array of \{ old: number, new: number \}, each pair contains expected values for the old and new assessment PKs.
     */
    async checkSanMergeCall(expectedUser: TestUser, pkPairs: number) {  // TODO fix/finish this

        log(`Checking Merge call for ${JSON.stringify(pkPairs)}`)
        const query = `select log_text from eor.clog where log_source like '%${expectedUser.username}%SAN_MERGE_DEMERGE_URL%' order by time_stamp desc fetch first 2 rows only`
        const clogData = await this.oasysDb.getData(query)
        let failed = false

        if (clogData.length != 2) {
            log(`Expected 2 rows in CLog, found ${clogData.length}`)
            failed = true
        } else {
            const call = clogData[1][0].split('\n')
            if (call[1].substring(call[1].length - 11) != `oasys/merge`) {
                log(`Expected call url to include 'oasys/merge', found ${call[1].substring(call[1].length - 11)}`)
                failed = true
            }

            const jsonStart = clogData[1][0].search('p_json') + 16
            const jsonEnd = clogData[1][0].search('p_token') - 1
            const callData = JSON.parse(clogData[1][0].substring(jsonStart, jsonEnd))

            const mergeData = callData['merge']
            mergeData.sort(arraySort)

            if (mergeData.length != pkPairs) {
                log(`Expected ${pkPairs} pairs, found ${mergeData.length}`)
                failed = true
            }

            if (callData['userDetails']['id'] != expectedUser.username) {
                log(`Expected user ID: ${expectedUser.username}, found ${callData['userDetails']['id']}`)
                failed = true
            }
            if (callData['userDetails']['name'] != expectedUser.forenameSurname) {
                log(`Expected user name: ${expectedUser.forenameSurname}, found ${callData['userDetails']['name']}`)
                failed = true
            }

            const response = clogData[0][0].split('\n')
            if (response[2].substring(response[2].length - 3) != '200') {
                log(`Expected 200 response, found ${response[2]} `)
                failed = true
            }
        }

        expect(failed).toBeFalsy()
    }



    /**
     * Confirms that there is nothing in cLog relating to any SAN API calls for the given PK
     */
    async checkNoSanCall(pk: number) {

        const query = `select log_text from eor.clog where log_source like '%${pk}%' and log_text <> 'lv_previous_layer [LAYER3_1] || lv_current_layer [LAYER3_1]'`
        const clogData = await this.oasysDb.getData(query)
        expect(clogData.length).toBe(0)
    }

    /**
     * Gets the SAN update tiem from clog, then checks the SAN update details in oasys_set
     */
    async getSanApiTimeAndCheckDbValues(pk: number, linkedInd: 'Y' | 'N', clonedPk: number) {

        const sanDataTime = await this.getSanApiTime(pk, 'SAN_GET_ASSESSMENT')
        await new AssessmentQueries(this.oasysDb).checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
            san_assessment_linked_ind: linkedInd,
            cloned_from_prev_oasys_san_pk: clonedPk?.toString() ?? null,
            lastupd_from_san: sanDataTime
        })
    }

    // /**
    //  * 
    //  */
    // async checkSanLockIncompleteTimestamp(pk: number) {

    //     oasys.San.getSanApiTime(pk, 'SAN_GET_ASSESSMENT', 'getSanDataTime')
    //     oasys.San.getSanApiTime(pk, 'SAN_LOCK_INCOMPLETE', 'lockIncompleteTime')
    //     cy.get<Temporal.PlainDateTime>('@getSanDataTime').then((getSanDataTime) => {
    //         cy.get<Temporal.PlainDateTime>('@lockIncompleteTime').then((lockIncompleteTime) => {
    //             expect(oasysDateTime.timestampDiff(getSanDataTime, lockIncompleteTime)).gt(0)
    //         })
    //     })
    // }

    async checkSanCall(name: string, sourceFilter: string, url: string, pk: number, expectedUser: TestUser,
        otherChecks?: { signingType?: 'SELF' | 'COUNTERSIGN', outcome?: string }) {

        log(`Checking ${name} call for ${pk}`)

        const query = `select log_text from eor.clog where log_source like '%${pk}%SAN_${sourceFilter}%' order by time_stamp desc`
        const clogData = await this.oasysDb.getData(query)
        const oasysSetSanData = await this.getOasysSetSanData(pk)

        let failed = false

        if (clogData.length < 2) {
            log(`Expected 2 rows in CLog per event, found ${clogData.length}`)
            failed = true
        } else {
            const call = clogData[1][0].split('\n')
            const start = 7 + url.length
            if (call[1].substring(call[1].length - (start + pk.toString().length)) != `oasys/${pk}/${url}`) {
                log(`Expected call url to include 'oasys/${pk}/${url}', found ${call[1].substring(call[1].length - (start + pk.toString().length))}`)
                failed = true
            }
            const callData = JSON.parse(call[3].substring(16))
            if (callData['userDetails']['id'] != expectedUser.username) {
                log(`Expected user ID: ${expectedUser.username}, found ${callData['userDetails']['id']}`)
                failed = true
            }
            if (callData['userDetails']['name'] != expectedUser.forenameSurname) {
                log(`Expected user name: ${expectedUser.forenameSurname}, found ${callData['userDetails']['name']}`)
                failed = true
            }
            if (otherChecks?.signingType) {
                if (callData['signType'] != otherChecks.signingType) {
                    log(`Expected signing type: ${otherChecks.signingType}, found ${callData['signType']}`)
                    failed = true
                }
            }
            if (otherChecks?.outcome) {
                if (callData['outcome'] != otherChecks.outcome) {
                    log(`Expected outcome: ${otherChecks.outcome}, found ${callData['outcome']}`)
                    failed = true
                }
            }
            const response = clogData[0][0].split('\n')
            if (response[2].substring(response[2].length - 3) != '200') {
                log(`Expected 200 response, found ${response[2]} `)
                failed = true
            }

            if (oasysSetSanData.spVersion && name != 'Delete' && name != 'Undelete') {

                if (oasysSetSanData.sanVersion) {
                    const sanVersionNumber = findSanVersion(clogData[0][0])
                    if (sanVersionNumber != oasysSetSanData.sanVersion) {
                        log(`Expected version: ${oasysSetSanData.sanVersion}, found ${sanVersionNumber}`)
                        failed = true
                    }
                }

                const spVersionNumber = findSpVersion(clogData[0][0])
                if (spVersionNumber != oasysSetSanData.spVersion) {
                    log(`Expected SP version: ${oasysSetSanData.spVersion}, found ${spVersionNumber}`)
                    failed = true
                }
            }
        }

        expect(failed).toBeFalsy()
    }

    /**
     * Check that no questions have been created in sections 2 to 13 and SAQ in the database for the given PK.
     * Three questions (8.4, 8.5, 8.6) are expected, any more will result in the test failing.
     */
    async checkNoQuestionsCreated(pk: number) {

        const query = `select count(*) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q, eor.oasys_answer a
                    where st.oasys_set_pk = s.oasys_set_pk
                    and s.oasys_section_pk = q.oasys_section_pk
                    and q.oasys_question_pk = a.oasys_question_pk(+)
                    and s.ref_section_code in ('2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', 'SAQ')
                    and (a.ref_answer_code is not null or q.free_format_answer is not null or q.additional_note is not null)
                    and st.oasys_set_pk = ${pk}`

        const count = await this.oasysDb.selectCount(query)
        expect(count).toBeLessThanOrEqual(3)   // Expect 3 questions to be populated by getAssessment (8.4, 8.5 and 8.6)
    }

    /**
     * Check that IP.1 and IP.2 have not been created in the database.
     */
    async checkNoIspQuestions1Or2(pk: number) {

        const query = `select count(*) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q
                        where st.oasys_set_pk = s.oasys_set_pk
                        and s.oasys_section_pk = q.oasys_section_pk
                        and s.ref_section_code = 'ISP'
                        and q.ref_question_code in ('IP.1', 'IP.2')
                        and st.oasys_set_pk = ${pk}`

        const count = await this.oasysDb.selectCount(query)
        expect(count).toBe(0)
    }

    async getOasysSetUpdateTimes(pk: number): Promise<string[]> {

        const query = `select to_char(lastupd_from_san, '${oasysDateTime.oracleTimestampFormat}'), to_char(lastupd_date, '${oasysDateTime.oracleTimestampFormat}')
                from eor.oasys_set where oasys_set_pk = ${pk}`
        const data = await this.oasysDb.getData(query)
        return data[0]
    }

    async getLatestQuestionUpdateTime(pk: number): Promise<string> {

        // TODO added workaround for NOD-1xxx, ignore R2.2.2 as it might get created
        const query = `select max(to_char(q.lastupd_date, '${oasysDateTime.oracleTimestampFormat}')) from eor.oasys_set st, eor.oasys_section s, eor.oasys_question q
                where st.oasys_set_pk = s.oasys_set_pk and s.oasys_section_pk = q.oasys_section_pk
                and q.ref_question_code <> 'R2.2.2'
                and st.oasys_set_pk = ${pk}`
        const data = await this.oasysDb.getData(query)
        return data[0][0]
    }

    async getSanSectionsCount(pk: number): Promise<number> {

        const query = `select count(*) from eor.oasys_section where oasys_set_pk = ${pk} 
                and section_status_elm = 'COMPLETE_LOCKED' and ref_section_code in ('SAN', 'SSP')`
        return await this.oasysDb.selectCount(query)
    }
}



function findSanVersion(data: string): number {

    const vStart = data.search('sanAssessmentVersion') + 22
    let sanVersionNumber = data.substring(vStart, vStart + 4)
    const vEnd = sanVersionNumber.search(',')

    const number = parseInt(sanVersionNumber.substring(0, vEnd))
    return number
}

function findSpVersion(data: string): number {

    const vStart = data.search('sentencePlanVersion') + 21
    let spVersionNumber = data.substring(vStart, data.length - 1)
    const vEnd = spVersionNumber.search('}')
    const number = parseInt(spVersionNumber.substring(0, vEnd))
    return number
}

function arraySort(a: { [key: string]: string }, b: { [key: string]: string }): number {

    const aString = concatObject(a)
    const bString = concatObject(b)

    return aString > bString ? 1 : aString < bString ? -1 : 0
}

function concatObject(obj: { [key: string]: string }): string {

    // Concatenate all properties in an object to create a sort order
    let result = ''
    Object.keys(obj).sort().forEach((key) => {
        result += obj[key]
    })
    return result
}