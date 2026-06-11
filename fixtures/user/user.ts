import { Page } from '@playwright/test'

import { Oasys } from 'fixtures/oasys/oasys'
import * as pages from './pages'
import { TestUsersProb, TestUsersPris, TestUser } from './testUsers'


export class User {

    constructor(private readonly page: Page, private readonly oasys: Oasys) { }

    readonly loginPage = new pages.Login(this.page)
    readonly selectProviderPage = new pages.SelectProvider(this.page)

    readonly prob = new TestUsersProb(this)
    readonly pris = new TestUsersPris(this)

    /**
     * AUTOADMIN-xx
     *   - Forename/surname: Autotest Testing-xx
     *   - Roles: Sys Admin (Central)
     */
    readonly admin = new TestUser(this, { username: 'AUTOADMIN', forename1: 'Autotest', surname: 'ADMIN' })
    readonly adminProfiles: { provider: string, frameworkRole: FrameworkRole, defaultCountersigner: TestUser, roles: string[] }[] = [
        { provider: providers.prob.nonSan, frameworkRole: null, defaultCountersigner: null, roles: ['Sys Admin (Central)'] },
        { provider: providers.prob.san, frameworkRole: null, defaultCountersigner: null, roles: ['Sys Admin (Central)'] },
        { provider: providers.pris.nonSan, frameworkRole: null, defaultCountersigner: null, roles: ['Sys Admin (Central)'] },
        { provider: providers.pris.san, frameworkRole: null, defaultCountersigner: null, roles: ['Sys Admin (Central)'] },
    ]

    async adhocLogin(username: string, password: string, provider?: string) {

        await this.loginPage.username.setValue(username)
        await this.loginPage.password.setValue(password)
        await this.loginPage.login.click()

        if (provider) {
            await this.selectProviderPage.chooseProviderEstablishment.setValue(provider)
            await this.selectProviderPage.setProviderEstablishment.click()
        }

        log(`Logged in as ${username}  ${provider ?? ''}`, 'User')
    }

    /**
     * Goes to the Provider/Establishment page and selects a provider or establishment
     */
    async selectProvider(provider: string) {

        await this.selectProviderPage.goto()
        await this.selectProviderPage.chooseProviderEstablishment.setValue(provider)
        await this.selectProviderPage.setProviderEstablishment.click()
    }

    /**
     * Click the logout button on any page
     */
    async logout() {

        await this.oasys.clickButton('Logout', true)
        await new pages.Login(this.page).checkCurrent(true)
        log('Logged out', 'User')
    }

}




