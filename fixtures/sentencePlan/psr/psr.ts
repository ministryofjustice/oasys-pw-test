import { Page } from 'node_modules/@playwright/test'

import * as pages from './pages'

export class Psr {

    constructor(private readonly page: Page) { }

    readonly createPsr = new pages.CreatePsr(this.page)

}