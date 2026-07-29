/**
 * @hidden
 * @module
 */

import { test as base, TestInfo } from '@playwright/test'

import { OasysDb } from './oasysDb/oasysDb'
import { testEnvironment } from 'localSettings'
import { Oasys } from './oasys/oasys'
import { User } from './user/user'
import { Cms } from './cms/cms'
import { Offender } from './offender/offender'
import { Assessment } from './assessment/assessment'
import { Sections } from './sections/sections'
import { San } from './san/san'
import { Sns } from './sns/sns'
import { Tasks } from './tasks/tasks'
import { Risk } from './risk/risk'
import { SentencePlan } from './sentencePlan/sentencePlan'
import { Signing } from './signing/signing'
import { Sara } from './sara/sara'
import { Api } from './api/api'
import { Ogrs } from './ogrs/ogrs'
import { Pni } from './pni/pni'
import { Maintenance } from './maintenance/maintenance'
import { Logs } from 'lib/logs'
import { initialiseGlobals } from 'lib/lib'

export { OasysDb } from './oasysDb/oasysDb'
export { Oasys } from './oasys/oasys'
export { User } from './user/user'
export { Cms } from './cms/cms'
export { Offender } from './offender/offender'
export { Assessment } from './assessment/assessment'
export { Sections } from './sections/sections'
export { San } from './san/san'
export { Sns } from './sns/sns'
export { Tasks } from './tasks/tasks'
export { Risk } from './risk/risk'
export { SentencePlan } from './sentencePlan/sentencePlan'
export { Signing } from './signing/signing'
export { Sara } from './sara/sara'
export { Api } from './api/api'
export { Ogrs } from './ogrs/ogrs'
export { Pni } from './pni/pni'
export { Maintenance } from './maintenance/maintenance'


type OasysFixtures = {
    oasysDb: OasysDb,
    oasys: Oasys,
    user: User,
    cms: Cms,
    offender: Offender,
    assessment: Assessment,
    tasks: Tasks,
    sections: Sections,
    san: San, risk: Risk,
    sentencePlan: SentencePlan,
    signing: Signing,
    sara: Sara,
    sns: Sns,
    api: Api,
    ogrs: Ogrs,
    pni: Pni,
    maintenance: Maintenance,
    logs: Logs,
}


export const test = base.extend<OasysFixtures>({

    oasysDb: async ({ }, use: Function) => {

        const oasysDb = new OasysDb()
        appConfig = await oasysDb.getAppConfig()
        await oasysDb.getLatestElogAndUnprocEventTime('store')
        log(`OASys ${appConfig.currentVersion} (${testEnvironment.name})`, 'Environment')

        await use(oasysDb)

        await oasysDb.getLatestElogAndUnprocEventTime('check')
    },

    oasys: async ({ page }, use, testInfo) => {

        const oasys = new Oasys(page, testInfo)
        await page.goto(testEnvironment.url)

        await use(oasys)
    },

    user: async ({ page, oasys }, use) => {

        const user = new User(page, oasys)
        await page.goto(testEnvironment.url)

        await use(user)
    },

    cms: async ({ page, oasys }, use: Function, testInfo: TestInfo) => {
        const cms = new Cms(page, testInfo, oasys)
        await use(cms)
    },

    tasks: async ({ page, oasys }, use: Function) => {
        const tasks = new Tasks(page, oasys)
        await use(tasks)
    },

    offender: async ({ page, oasys, cms, oasysDb }, use: Function, testInfo: TestInfo) => {
        const offender = new Offender(page, testInfo, oasys, cms, oasysDb)
        await use(offender)
    },

    sections: async ({ page }, use: Function) => {
        const sections = new Sections(page)
        await use(sections)
    },

    san: async ({ page, oasys, user, oasysDb }, use: Function) => {
        const san = new San(page, oasys, oasysDb)
        await use(san)
    },

    risk: async ({ page, oasys, user, sara }, use: Function) => {
        const risk = new Risk(page, oasys, sara)
        await use(risk)
    },

    sentencePlan: async ({ page, oasys }, use: Function) => {
        const sentencePlan = new SentencePlan(page, oasys)
        await use(sentencePlan)
    },

    signing: async ({ page, oasys, tasks }, use: Function) => {
        const signing = new Signing(page, oasys, tasks)
        await use(signing)
    },

    assessment: async ({ page, oasys, cms, offender, oasysDb, sections, san, risk, sentencePlan }, use: Function) => {
        const assessment = new Assessment(page, oasys, cms, offender, oasysDb, sections, san, risk, sentencePlan)
        await use(assessment)
    },

    sns: async ({ page, oasys, user, oasysDb }, use: Function) => {
        const sns = new Sns(page, oasys, oasysDb)
        await use(sns)
    },

    sara: async ({ page, oasysDb }, use: Function) => {
        const sara = new Sara(page, oasysDb)
        await use(sara)
    },

    api: async ({ oasysDb, request, ogrs }, use: Function) => {
        const api = new Api(oasysDb, request, ogrs)
        await use(api)
    },

    ogrs: async ({ oasysDb, offender, sections, risk }, use: Function) => {
        const ogrs = new Ogrs(oasysDb, offender, sections, risk)
        await use(ogrs)
    },

    pni: async ({ oasysDb, assessment }, use: Function) => {
        const pni = new Pni(oasysDb, assessment)
        await use(pni)
    },

    maintenance: async ({ page }, use: Function) => {
        const maintenance = new Maintenance(page)
        await use(maintenance)
    },

    logs: [async ({ }, use: Function, testInfo: TestInfo) => {

        initialiseGlobals()
        const logs = new Logs(testInfo)
        await logs.initialise()

        await use(logs)

        await logs.finalise()
    }, { auto: true }],
})
