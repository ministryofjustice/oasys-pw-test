import { Page } from '@playwright/test'

import { San } from 'fixtures'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { PractitionerAnalysis } from '../pages'
import { sanIdPrefixLookup } from '../sanIds'

const section: SanSection = 'Health and wellbeing'

export class Health {

    constructor(private readonly page: Page, private readonly san: San) { }

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly practitionerAnalysis = new PractitionerAnalysis(this.page, section, sanIdPrefixLookup[section])

    async populateMinimal() {

        await this.san.goto(section, true)
        await this.page1.populateMinimal()
        await this.san.saveAndContinue()
        await this.page2.populateMinimal()
        await this.san.saveAndContinue()
        await this.san.practitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.san.markAsComplete()
    }
}