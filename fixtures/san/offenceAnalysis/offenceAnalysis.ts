import { Page } from '@playwright/test'

import { San } from 'fixtures'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { PractitionerAnalysis } from '../pages'
import { sanIdPrefixLookup } from '../sanIds'
import { Victims } from './victims'

const section: SanSection = 'Offence analysis'

export class OffenceAnalysis {

    constructor(private readonly page: Page, private readonly san: San) { }

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    readonly practitionerAnalysis = new PractitionerAnalysis(this.page, section, sanIdPrefixLookup[section])
    readonly victims = new Victims(this.page)

    async populateMinimal() {

        await this.san.goto(section, true)
        await this.page1.populateMinimal()
        await this.san.saveAndContinue()
        await this.page2.populateMinimal()
        await this.san.saveAndContinue()
        await this.page3.populateMinimal()
        await this.san.markAsComplete()
    }
}