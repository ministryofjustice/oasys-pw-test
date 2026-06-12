import { userSuffixes, testEnvironment } from 'localSettings'
import { User } from 'fixtures'


export class TestUser {

    username: string
    forename1: string
    surname: string
    lovLookup: string
    surnameForename: string
    forenameSurname: string
    profile?: { provider: string; frameworkRole: FrameworkRole; defaultCountersigner: TestUser; roles: string[]; psrSigningLevel?: PsrSigningLevel }

    constructor(
        private readonly user: User,
        userDetails: { username: string; forename1?: string; surname?: string },
        profile?: { provider: string; frameworkRole: FrameworkRole; defaultCountersigner: TestUser; roles: string[]; psrSigningLevel?: PsrSigningLevel }
    ) {

        const testProcess = Number.parseInt(process.env.TEST_PARALLEL_INDEX)
        const suffix = userSuffixes[testProcess]

        this.username = `${userDetails.username}${suffix}`
        this.forename1 = userDetails.forename1
        this.surname = `${userDetails.surname}${suffix}`
        this.lovLookup = `[${this.username}]`
        this.surnameForename = `${this.surname} ${this.forename1}`
        this.forenameSurname = `${this.forename1} ${this.surname}`
        this.profile = profile
    }

    async login(provider?: string) {

        await this.user.loginPage.username.setValue(this.username)
        await this.user.loginPage.password.setValue(testEnvironment.standardUserPassword)
        await this.user.loginPage.login.click()

        if (provider) {
            await this.user.selectProviderPage.chooseProviderEstablishment.setValue(provider)
            await this.user.selectProviderPage.setProviderEstablishment.click()
        }

        log(`Logged in as ${this.surnameForename} (${this.username}) in ${provider ?? this.profile.provider}`, 'User')
    }

}


/**
 * Probation non-admin users
 */
export class TestUsersProb {

    constructor(readonly user: User) { }

    ///////////// PROBATION NON-SAN /////////////

    /**
     * AUTOHEADPDU-xx
     *   - Forename/surname: Autotest HEADPDU-xx
     *   - Framework role: Head of PDU - No Countersigning required
     *   - Provider: Probation non-SAN
     *   - Default countersigner: none
     *   - Roles: NPS Assessor, Trainer, SARA
     */
    probHeadPdu: TestUser = new TestUser(this.user,
        { username: 'AUTOHEADPDU', forename1: 'Autotest', surname: 'HEADPDU' },
        { provider: providers.prob.nonSan, frameworkRole: 'Legacy - Head of PDU', defaultCountersigner: null, roles: ['NPS Assessor', 'Trainer', 'SARA'] }
    )

    /**
     * AUTOPSO-xx
     *   - Forename/surname: Autotest PSO-xx
     *   - Framework role: Approved PSO, approved PQiP, NQO or unapproved PO
     *   - Provider: Probation non-SAN
     *   - Default countersigner: none
     *   - Roles: NPS Assessor, Trainer
     */
    probPso: TestUser = new TestUser(this.user,
        { username: 'AUTOPSO', forename1: 'Autotest', surname: 'PSO' },
        { provider: providers.prob.nonSan, frameworkRole: 'Legacy - Approved PSO, approved PQiP, NQO or unapproved PO', defaultCountersigner: null, roles: ['NPS Assessor', 'Trainer'] }
    )

    ///////////// PROBATION NON-SAN WITH SP SERVICE /////////////

    /**
     * AUTOSPHEADPDU-xx
     *   - Forename/surname: Autotest SPHEADPDU-xx
     *   - Framework role: Head of PDU - No Countersigning required
     *   - Provider: Probation non-SAN
     *   - Default countersigner: none
     *   - Roles: NPS Assessor, Trainer, SARA
     */
    probSpHeadPdu: TestUser = new TestUser(this.user,
        { username: 'AUTOSPHEADPDU', forename1: 'Autotest', surname: 'HEADSPPDU' },
        { provider: providers.prob.nonSan, frameworkRole: 'Legacy - Head of PDU', defaultCountersigner: null, roles: ['NPS Assessor', 'Trainer', 'SARA', 'SP Service'], psrSigningLevel: 'Very High' }
    )

    /**
     * AUTOSPPSO-xx
     *   - Forename/surname: Autotest SPPSO-xx
     *   - Framework role: Approved PSO, approved PQiP, NQO or unapproved PO
     *   - Provider: Probation non-SAN
     *   - Default countersigner: none
     *   - Roles: NPS Assessor, Trainer
     */
    probSpPso: TestUser = new TestUser(this.user,
        { username: 'AUTOSPPSO', forename1: 'Autotest', surname: 'SPPSO' },
        { provider: providers.prob.nonSan, frameworkRole: 'Legacy - Approved PSO, approved PQiP, NQO or unapproved PO', defaultCountersigner: null, roles: ['NPS Assessor', 'Trainer', 'SP Service'] }
    )

    ///////////// PROBATION SAN /////////////

    /**
     * AUTOSANHEADPDU-xx
     *   - Forename/surname: Autotest SanUserTwo-xx
     *   - Framework role: Head of PDU
     *   - Provider: Probation SAN
     *   - Default countersigner: none
     *   - Roles: NPS Assessor, SAN Service, Trainer
     */
    probSanHeadPdu: TestUser = new TestUser(this.user,
        { username: 'AUTOSANHEADPDU', forename1: 'Autotest', surname: 'SANHEADPDU' },
        { provider: providers.prob.san, frameworkRole: 'Legacy - Head of PDU', defaultCountersigner: null, roles: ['NPS Assessor', 'San Service', 'Trainer', 'SP Service'] })

    /**
     * AUTOSANPO-xx
     *   - Forename/surname: Autotest SanUserFour-xx
     *   - Framework role: Approved PO
     *   - Provider: Probation SAN
     *   - Default countersigner: none
     *   - Roles: NPS Assessor, SAN Service, SARA, Trainer
     */
    probSanPo: TestUser = new TestUser(this.user,
        { username: 'AUTOSANPO', forename1: 'Autotest', surname: 'SANPO' },
        { provider: providers.prob.san, frameworkRole: 'Legacy - Approved PO', defaultCountersigner: null, roles: ['NPS Assessor', 'San Service', 'SARA', 'Trainer', 'SP Service'] }
    )

    /**
     * AUTOSANPSO-xx
     *   - Forename/surname: Autotest SANPSO-xx
     *   - Framework role: Approved PSO, approved PQiP, NQO or unapproved PO
     *   - Provider: Probation SAN
     *   - Default countersigner: sanPo (AUTOSANPO-xx)
     *   - Roles: NPS Assessor, SAN Service, Trainer
     */
    probSanPso: TestUser = new TestUser(this.user,
        { username: 'AUTOSANPSO', forename1: 'Autotest', surname: 'SANPSO' },
        { provider: providers.prob.san, frameworkRole: 'Legacy - Approved PSO, approved PQiP, NQO or unapproved PO', defaultCountersigner: this.probSanPo, roles: ['NPS Assessor', 'San Service', 'Trainer', 'SP Service'] }
    )

    /**
     * AUTOSANUNAPPR-xx
     *   - Forename/surname: Autotest SANUNAPPR-xx
     *   - Framework role: Unapproved PSO & unapproved PQiP
     *   - Provider: Probation SAN
     *   - Default countersigner: none
     *   - Roles: NPS Assessor, SAN Service, Trainer
     */
    probSanUnappr: TestUser = new TestUser(this.user,
        { username: 'AUTOSANUNAPPR', forename1: 'Autotest', surname: 'SANUNAPPR' },
        { provider: providers.prob.san, frameworkRole: 'Legacy - Unapproved PSO & unapproved PQiP', defaultCountersigner: null, roles: ['NPS Assessor', 'San Service', 'Trainer', 'SP Service'] })

}


export class TestUsersPris {

    constructor(readonly user: User) { }

    ///////////// PRISON NON-SAN /////////////

    /**
     * AUTOHOMDS-xx
     *   - Forename/surname: Autotest HOMDS-xx
     *   - Framework role: HOMDs
     *   - Provider: Prison non-SAN
     *   - Default countersigner: none
     *   - Roles: HMPS Assessor, Trainer
     */
    prisHomds: TestUser = new TestUser(this.user,
        { username: 'AUTOHOMDS', forename1: 'Autotest', surname: 'HOMDS' },
        { provider: providers.pris.nonSan, frameworkRole: 'HOMDs', defaultCountersigner: null, roles: ['HMPS Assessor', 'Trainer'] }
    )

    ///////////// PRISON NON-SAN WITH SP SERVICE /////////////

    /**
     * AUTOSPHOMDS-xx
     *   - Forename/surname: Autotest SPHOMDS-xx
     *   - Framework role: HOMDs
     *   - Provider: Prison non-SAN
     *   - Default countersigner: none
     *   - Roles: HMPS Assessor, Trainer
     */
    prisSpHomds: TestUser = new TestUser(this.user,
        { username: 'AUTOSPHOMDS', forename1: 'Autotest', surname: 'SPHOMDS' },
        { provider: providers.pris.nonSan, frameworkRole: 'HOMDs', defaultCountersigner: null, roles: ['HMPS Assessor', 'Trainer', 'SP Service'] }
    )



    ///////////// PRISON SAN /////////////

    /**
     * AUTOSANPRISHOMDS-xx
     *   - Forename/surname: Autotest AutoPrisonSanThree-xx
     *   - Framework role: HOMDs
     *   - Provider: Prison SAN
     *   - Default countersigner: none
     *   - Roles: HMPS Assessor, SAN Service, Trainer
     */
    prisSanHomds: TestUser = new TestUser(this.user,
        { username: 'AUTOSANPRISHOMDS', forename1: 'Autotest', surname: 'SANPRISHOMDS' },
        { provider: providers.pris.san, frameworkRole: 'HOMDs', defaultCountersigner: null, roles: ['HMPS Assessor', 'San Service', 'Trainer', 'SP Service'] }
    )

    /**
     * AUTOSANPRISPOM-xx
     *   - Forename/surname: Autotest AutoPrisonSanTwo-xx
     *   - Framework role: Approved Prison POM, approved PQiP, NQO or unapproved Probation POM
     *   - Provider: Prison SAN
     *   - Default countersigner: sanPrisHomds (AUTOSANPRISHOMDS-xx)
     *   - Roles: HMPS Assessor, SAN Service, Trainer
     */
    prisSanPom: TestUser = new TestUser(this.user,
        { username: 'AUTOSANPRISPOM', forename1: 'Autotest', surname: 'SANPRISPOM' },
        {
            provider: providers.pris.san, frameworkRole: 'Approved Prison POM, approved PQiP, NQO or unapproved Probation POM',
            defaultCountersigner: this.prisSanHomds, roles: ['HMPS Assessor', 'San Service', 'Trainer', 'SP Service']
        }
    )

    /**
     * AUTOSANPRISUNAPPR-xx
     *   - Forename/surname: Autotest SANPRISUNAPPR-xx
     *   - Framework role: Unapproved Prison POM & unapproved PQiP
     *   - Provider: Prison SAN
     *   - Default countersigner: sanPrisPom (AUTOSANPRISPOM-xx)
     *   - Roles: HMPS Assessor, SAN Service, Trainer
     */
    prisSanUnappr: TestUser = new TestUser(this.user,
        { username: 'AUTOSANPRISUNAPPR', forename1: 'Autotest', surname: 'SANPRISUNAPPR' },
        { provider: providers.pris.san, frameworkRole: 'Unapproved Prison POM & unapproved PQiP', defaultCountersigner: this.prisSanPom, roles: ['HMPS Assessor', 'San Service', 'Trainer', 'SP Service'] }
    )

    /**
     * AUTOSANPRISCADM-xx
     *   - Forename/surname: Autotest SANCADM-xx
     *   - Framework role: Not Allocated
     *   - Provider: Prison SAN
     *   - Default countersigner: none
     *   - Roles: Case Admin Prison, Trainer
     */
    prisSanCAdm: TestUser = new TestUser(this.user,
        { username: 'AUTOSANPRISCADM', forename1: 'Autotest', surname: 'SANPRISCADM' },
        { provider: providers.pris.san, frameworkRole: null, defaultCountersigner: null, roles: ['Case Admin Prison Autotest', 'Trainer', 'SP Service'] }
    )
}


