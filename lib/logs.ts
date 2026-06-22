import * as fs from 'fs-extra'
import { TestInfo, test } from '@playwright/test'


const oasysLogs: { [key: number]: Log[] } = {}
const fileLog: { [key: number]: string[] } = {}
export const statsLog: { [key: number]: string[] } = {}


globalThis.log = (logtext: string, type?: string) => {

    oasysLogs[utils.testProcessNumber()].push({ logText: logtext, type: type })
}

globalThis.fileLog = (logtext: string) => {

    fileLog[utils.testProcessNumber()].push(logtext)
}

globalThis.statsLog = (type: string, time: number) => {

    statsLog[utils.testProcessNumber()].push(`${type}\t${time}`)
}

const fileLogFolder = 'logs/'

export class Logs {

    constructor(private readonly testInfo: TestInfo) { }

    async initialise() {

        const testProcesses = this.testInfo.config.workers
        for (let i = 0; i < testProcesses; i++) {
            oasysLogs[i] = []
            fileLog[i] = []
        }
    }

    async finalise() {

        const testProcess = utils.testProcessNumber()
        for (let log of oasysLogs[testProcess]) {
            this.testInfo.annotations.push({ type: (log.type ?? ''), description: `${log.type && log.logText != '' ? '\n' : ''}${log.logText}` })
        }
        if (fileLog[testProcess].length > 0) {
            await fs.writeFile(`${fileLogFolder}${this.testInfo.title.replaceAll('/', '')}.txt`, fileLog[testProcess].join('\n'))
        }
    }

}

/**
 * Additional logging for API test stats - allows multiple parallel tests to write to the same stats file
 */
test.beforeAll(async ({},testInfo: TestInfo) => {

    const testProcesses = testInfo.config.workers
    for (let i = 0; i < testProcesses; i++) {
        statsLog[i] = []
    }
    await fs.emptyDir(fileLogFolder)
})

test.afterAll(async ({},testInfo: TestInfo) => {

    const testProcesses = testInfo.config.workers
    for (let i = 0; i < testProcesses; i++) {
        if (statsLog[i].length > 0) {
            await fs.appendFile(`${fileLogFolder}stats.csv`, statsLog[i].join('\n'))
            await fs.appendFile(`${fileLogFolder}stats.csv`, '\n')
        }
    }
})