import { test } from 'fixtures'


export function testRef12(offender1: OffenderDef, pks: number[]) {

    test('SAN integration - test ref 12 - Another 3.1 assessment in non-pilot area', async ({ offender, sara, user, assessment, sections, san, risk, signing }) => {

        log(`Log in as an Assessor from a Non-Pilot probation area
            Find the offender used in Test Ref 11 - last assessment is a fully completed 3.1 OASys 
            Create a new 3.1 OASys 'Review' assessment.`, 'Test step')

        await user.prob.probHeadPdu.login()

        await offender.searchAndSelect(offender1)
        const pk = await assessment.createProb({ purposeOfAssessment: 'Review' })
        pks.push(pk)
        const prevSanPk = pks[2]

        log(`It does NOT call for any SAN data.
            Check the OASYS_SET record; field CLONED_FROM_PREV_OASYS_SAN_PK has been set to the PK of of the last OASys-SAN assessment,
            fields SAN_ASSESSMENT_LINKED_IND, LASTUPD_FROM_SAN and SAN_ASSESSMENT_VERSION_NO are all NULL.
            NOTE: the field CLONED_FROM_PREV_OASYS_SAN_PK is kept in the 3.1 assessment so that during the period of supervision continuity is kept with the living SAN assessment,
            just in case the next assessment they carry out is a 3.2. 
            Change some of the data and fully complete the 3.1 assessment.`, 'Test step')

        await san.queries.checkNoSanCall(pk)

        await assessment.queries.checkDbValues('oasys_set', `oasys_set_pk = ${pk}`, {
            SAN_ASSESSMENT_LINKED_IND: null,
            CLONED_FROM_PREV_OASYS_SAN_PK: prevSanPk.toString(),
            SAN_ASSESSMENT_VERSION_NO: null,
            LASTUPD_FROM_SAN: null,
        })

        await sections.section2.goto(true)
        await sections.section2.o2_2Weapon.setValue('Yes')
        await sections.section2.o2_2SpecifyWeapon.setValue('A big knife')
        await sections.section2.o2_2Violence.setValue('Yes')
        await sections.section2.o2_2ExcessiveViolence.setValue('Yes')
        await sections.section2.o2_2Sexual.setValue('Yes')
        await sections.section2.o2_2DomesticAbuse.setValue('Yes')
        await sections.section2.o2_3Direct.setValue(true)
        await sections.section2.o2_3Hate.setValue(true)

        await sections.section3.goto(true)
        await sections.section3.o3_3.setValue('Yes')
        await sections.section3.o3_4.setValue('2-Significant problems')
        await sections.section3.o3_5.setValue('2-Significant problems')
        await sections.section3.o3_6.setValue('2-Significant problems')
        await sections.section3.save.click()

        await sections.section4.goto(true)
        await sections.section4.o4_2.setValue('2 - Yes')
        await sections.section4.o4_3.setValue('2-Significant problems')
        await sections.section4.o4_4.setValue('2-Significant problems')
        await sections.section4.o4_5.setValue('2-Significant problems')
        await sections.section4.o4_6.setValue('2-Significant problems')
        await sections.section4.o4_7.setValue('2-Significant problems')

        await sections.section5.goto(true)
        await sections.section5.o5_2.setValue('2-Significant problems')
        await sections.section5.o5_3.setValue('2-Significant problems')
        await sections.section5.o5_4.setValue('2-Significant problems')
        await sections.section5.o5_5.setValue('2-Significant problems')
        await sections.section5.o5_6.setValue('2-Significant problems')

        await sections.section6.goto(true)
        await sections.section6.o6_1.setValue('2-Significant problems')
        await sections.section6.o6_3.setValue('2-Significant problems')
        await sections.section6.o6_7VictimPartner.setValue('Yes')
        await sections.section6.o6_7VictimFamily.setValue('Yes')
        await sections.section6.o6_7PerpetratorPartner.setValue('Yes')
        await sections.section6.o6_7PerpetratorFamily.setValue('Yes')
        await sections.section6.o6_8.setValue('Not in a relationship')
        await sections.section6.o6_4.setValue('2-Significant problems')
        await sections.section6.o6_6.setValue('2-Significant problems')

        await sections.section7.goto(true)
        await sections.section7.o7_1.setValue('2-Significant problems')
        await sections.section7.o7_2.setValue('2-Significant problems')
        await sections.section7.o7_3.setValue('2-Significant problems')
        await sections.section7.o7_4.setValue('2-Significant problems')
        await sections.section7.o7_5.setValue('2-Significant problems')

        await sections.section9.goto(true)
        await sections.section9.o9_1.setValue('2-Significant problems')
        await sections.section9.o9_1Details.setValue('9.1 Details')
        await sections.section9.o9_2.setValue('2-Significant problems')
        await sections.section9.o9_3.setValue('2-Significant problems')
        await sections.section9.o9_4.setValue('Yes')
        await sections.section9.o9_5.setValue('2-Significant problems')

        await sections.section10.goto(true)
        await sections.section10.o10_1.setValue('2-Significant problems')
        await sections.section10.o10_2.setValue('2-Significant problems')
        await sections.section10.o10_3.setValue('2-Significant problems')
        await sections.section10.o10_4.setValue('2-Significant problems')
        await sections.section10.o10_5.setValue('Yes - 2')
        await sections.section10.o10_6.setValue('2-Significant problems')
        await sections.section10.o10_7Childhood.setValue('Yes')
        await sections.section10.o10_7HeadInjuries.setValue('Yes')
        await sections.section10.o10_7Psychiatric.setValue('Yes')

        await sections.section11.goto(true)
        await sections.section11.o11_1.setValue('2-Significant problems')
        await sections.section11.o11_2.setValue('2-Significant problems')
        await sections.section11.o11_3.setValue('2-Significant problems')
        await sections.section11.o11_4.setValue('2-Significant problems')
        await sections.section11.o11_5.setValue('2-Significant problems')
        await sections.section11.o11_6.setValue('2-Significant problems')
        await sections.section11.o11_7.setValue('2-Significant problems')
        await sections.section11.o11_8.setValue('2-Significant problems')
        await sections.section11.o11_9.setValue('2-Significant problems')
        await sections.section11.o11_10.setValue('2-Significant problems')
        await sections.section11.o11_11.setValue('2-Significant problems')
        await sections.section11.o11_12.setValue('2-Significant problems')

        await sections.section12.goto(true)
        await sections.section12.o12_1.setValue('2-Significant problems')
        await sections.section12.o12_3.setValue('2-Significant problems')
        await sections.section12.o12_4.setValue('2-Significant problems')
        await sections.section12.o12_5.setValue('2-Significant problems')
        await sections.section12.o12_6.setValue('2-Significant problems')
        await sections.section12.o12_8.setValue('2-Not at all')
        await sections.section12.o12_9.setValue('2-Significant problems')

        await risk.screeningSection2to4.goto(true)
        await risk.screeningSection2to4.r2_3.setValue('No')
        await risk.screeningSection2to4.rationale.setValue('Some reason')
        await risk.screeningSection2to4.save.click()

        await sara.cancelSara()

        await signing.signAndLock({ page: 'rsp' })
        await user.logout()
    })

}