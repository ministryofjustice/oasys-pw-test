import { test } from 'fixtures'


test.describe('NOD-980: Test for RA cloning', () => {

    test('RoSHA with 1.39 = NO -> RoSHA', async ({ oasys, user, offender, assessment, sns, signing }) => {

        await user.prob.probHeadPdu.login()
        const offender1 = await offender.createProbFromStandardOffender()


        // First RoSHA
        const pk1 = await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

        let failed = await assessment.queries.checkAnswers(pk1, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], true)
        expect(failed).toBeFalsy()

        await assessment.populateMinimal({ layer: 'Layer 1V2' })
        await signing.signAndLock({ page: 'riskScreening', expectCsrpScore: true })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR', 'TierRiskFlag'])

        // Second RoSHA
        await oasys.history(offender1)
        const pk2 = await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
        failed = await assessment.queries.checkAnswers(pk2, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], true)
        expect(failed).toBeFalsy()
        await signing.signAndLock({ page: 'riskScreening', expectCsrpScore: true })

        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])
        failed = await assessment.queries.checkAnswers(pk2, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], true)
        expect(failed).toBeFalsy()

    })

    test('RoSHA with 1.39 = YES -> RoSHA', async ({ oasys, user, offender, assessment, sns, signing }) => {

        await user.prob.probHeadPdu.login()
        const offender1 = await offender.createProbFromStandardOffender()


        // First RoSHA
        const pk1 = await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

        let failed = await assessment.queries.checkAnswers(pk1, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], true)
        expect(failed).toBeFalsy()

        await assessment.populateFull({ layer: 'Layer 1V2' })
        failed = await assessment.queries.checkAnswers(pk1, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'YES' }], true)
        expect(failed).toBeFalsy()
        await signing.signAndLock({ page: 'rmp', expectCsrpScore: true })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

        // Second RoSHA
        await oasys.history(offender1)
        const pk2 = await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })
        failed = await assessment.queries.checkAnswers(pk2, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], true)
        expect(failed).toBeFalsy()
        await signing.signAndLock({ page: 'rmp', expectCsrpScore: true })
        await sns.testSnsMessageData(offender1.probationCrn, 'assessment', ['AssSumm', 'OGRS', 'RSR'])

        failed = await assessment.queries.checkAnswers(pk2, [{ section: 'RSR', q: 'RA', a: 'YES' }, { section: 'RSR', q: '1.39', a: 'NO' }], true)
        expect(failed).toBeFalsy()
    })
})