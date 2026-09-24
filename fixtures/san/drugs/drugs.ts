import { Page } from '@playwright/test'

import { San } from 'fixtures'
import { Page1 } from './page1'
import { Page2 } from './page2'
import { Page3 } from './page3'
import { Page4 } from './page4'
import { DrugsPractitionerAnalysis } from './drugsPractitionerAnalysis'
import { sanIdPrefixLookup } from '../sanIds'

const section: SanSection = 'Drug use'

export class Drugs {

    constructor(private readonly page: Page, private readonly san: San) { }

    readonly page1 = new Page1(this.page)
    readonly page2 = new Page2(this.page)
    readonly page3 = new Page3(this.page)
    readonly page4 = new Page4(this.page)
    readonly practitionerAnalysis = new DrugsPractitionerAnalysis(this.page)

    async populateMinimal() {

        await this.san.goto(section, true)
        await this.page1.populateMinimal()
        await this.san.saveAndContinue()
        await this.san.practitionerAnalysis()
        await this.practitionerAnalysis.populateMinimal()
        await this.san.markAsComplete()
    }
}