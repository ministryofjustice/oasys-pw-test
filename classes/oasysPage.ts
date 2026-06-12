import { Locator, Page } from '@playwright/test'

/**
 * The Page class is used to define OASys pages, including all the elements on the page (i.e. text boxes, buttons etc), and the menu options used
 * to access it (either main menu or floating menu).  Individual pages are in the `oasys\pages` folder, grouped by functional area into subfolders.
 * Any new pages must be added to the relevant `index.ts` file, they can then be referenced in a test as e.g. `pages.Assessment.Section2`.
 */

export abstract class OasysPage {

    name: string
    title: string
    menu: Menu

    constructor(public readonly page: Page) { }

    floatingMenu = this.page.locator('#leftmenuul')

    /**
     * Sets the value of a multiple element on the pages, each identified by the element name
     * If you provide a PageData type (e.g. setValues<LoginData>(...)), Typescript provides a dropdown for the elements available.
     *      * 
     * Writes to the log, unless suppressLog (optional) is true.
     */
    async setValues(elementValues: PageData, suppressLog: boolean = false) {

        for (let elementName of Object.keys(elementValues)) {

            const element = this[elementName as keyof this]
            if (element == null) {
                throw new Error(`Invalid element name on ${this.name} - ${elementName}`)
            }
            // @ts-expect-error // check above will avoid the type error reported here
            await element.setValue(elementValues[elementName])
        }

        if (!suppressLog) log(`Set values on ${this.name} page: ${JSON.stringify(elementValues)} `)
        return this
    }

    /**
     * Checks the value of a multiple element on the pages, each identified by the element name (not case sensitive)
     * The test will fail if any of the values don't match.
     *      
     * Returns the page object so you can chain other commands.
     * 
     * Writes to the log, unless suppressLog (optional) is true.
     */
    // checkValues(elementValues: PageData, suppressLog: Boolean = false): typeof this {

    //     Object.keys(elementValues).forEach(elementName => {

    //         const element = this[elementName]
    //         if (element == null) {
    //             throw new Error(`Invalid element name on ${this.name} - ${elementName}`)
    //         }
    //         element.checkValue(elementValues[elementName].toString())
    //     })

    //     if (!suppressLog) log(`Checked values on ${this.name} page: ${JSON.stringify(elementValues)} `)
    //     return this
    // }

    /**
     * Writes the value and status of all input and text elements on the page to the log.
     * 
     * Returns the page object so you can chain other commands.
     */
    // logValuesAndStatuses(ignoreHidden: boolean = false): typeof this {

    //     cy.groupedLogStart(`Element values and statuses ${ignoreHidden ? '(visible only) ' : ''}on page: ${this.name} `)
    //     Object.keys(this).forEach((e) => {

    //         let element = this[e]
    //         if (element != null && typeof element.getStatusAndValue === 'function') {  // Check if it's a property that can return a status and value
    //             element.getStatusAndValue('alias')
    //             cy.get<ElementStatusAndValue>('@alias').then((result) => {
    //                 if (!ignoreHidden || result.status != 'notVisible') {
    //                     cy.groupedLog(`${e}: '${result.value}' (${result.status})`)
    //                 }
    //             })
    //         }
    //     })
    //     cy.groupedLogEnd()
    //     return this
    // }

    /**
     * Navigates to the page according to the defined menu details (either OASys main menu, floating navigator or subform (button click))
     * assuming the relevant menu is available.
     * 
     * Waits for a page update to complete.
     *
     * Returns the page object so you can chain other commands.
     * 
     * Writes to the log, unless suppressLog (optional) is true.
     */
    async goto(suppressLog: Boolean = false) {

        if (this.menu == null) {
            throw new Error(`Invalid goto for page ${this.name}`)

        } else {
            switch (this.menu.type) {

                case 'Floating':
                    await this.waitForAnimation(this.floatingMenu)

                    if (this.menu.level2 == undefined) {
                        // first level only, just click
                        await this.floatingMenu.getByText(this.menu.level1).click()

                    } else {
                        // two levels: check if first level is expanded already, if not then click on the first
                        const level1LinkExpanded = this.page.locator('.active.expanded').filter({ hasText: this.menu.level1 })
                        const level1Expanded = await level1LinkExpanded.isVisible()

                        if (!level1Expanded) {
                            await this.floatingMenu.locator('.expandable').filter({ hasText: this.menu.level1 }).click()
                            await this.waitForAnimation(this.floatingMenu)
                        }
                        const level2List = this.floatingMenu.getByRole('listitem').filter({ has: level1LinkExpanded })
                        await level2List.getByRole('listitem').filter({ hasText: this.menu.level2 }).click()
                    }
                    break

                case 'Main':
                    await this.page.locator('#oasysmainmenu').getByText(this.menu.level1).click()
                    if (this.menu.level2 !== undefined) {
                        if (this.menu.level2[0] == '#') {
                            await this.page.locator(this.menu.level2).click()
                        } else {
                            await this.page.getByText(this.menu.level2).click()
                        }
                    }
                    break

                case 'Subform':
                    if (this.menu.level1 != '') {
                        if (this.menu.level1.startsWith('#') || this.menu.level1.includes('[')) {
                            await this.page.locator(this.menu.level1).first().click()
                        } else {
                            await this.page.getByRole('button', { name: this.menu.level1 }).first().click()
                        }
                    }
                    break

                case 'San':
                    await this.page.locator('.moj-side-navigation__item a').filter({ hasText: this.name }).first().click()
                    break

                default:
                    throw new Error(`Invalid menu type for page ${this.name}`)
            }
        }

        await waitForPageUpdate(this.page)
        if (this.menu.type == 'Main' || this.menu.type == 'Floating') {
            await this.checkCurrent(suppressLog)
        }
        if (!suppressLog) log(`Go to page: ${this.name} `)
    }

    /**
     * Check that this page is currently displayed on screen, using the title defined in the page object.
     * 
     * Returns the page object so you can chain other commands.
     */
    async checkCurrent(suppressLog: Boolean = false): Promise<typeof this> {

        await waitForPageUpdate(this.page)
        let title = await this.page.title()

        expect(title).toContain(this.title)
        if (!suppressLog) log(`Check current page: ${this.name} `)
        return this
    }

    async waitForAnimation(locator: Locator) {

        const box = await locator.boundingBox()
        let y1 = box.y
        let y2: number
        let h1 = box.height
        let h2: number

        while (y1 != y2 || h1 != h2) {
            await this.page.waitForTimeout(20)
            y2 = y1
            h2 = h1
            const box = await locator.boundingBox()
            y1 = box.y
            h1 = box.height
        }
    }

    async checkMenuVisibility(expectVisible: boolean) {

        if (this.menu == null) {
            throw new Error(`Invalid menu check for page ${this.name}`)
        }
        else {

            let visible: boolean

            switch (this.menu.type) {
                case 'Floating':
                    await this.waitForAnimation(this.floatingMenu)
                    if (this.menu.level2 == undefined) {
                        visible = await this.floatingMenu.getByText(this.menu.level1).isVisible()
                    } else {
                        // two levels: check if first level is expanded already, if not then click on the first

                        const level1LinkExpanded = this.page.locator('.active.expanded').filter({ hasText: this.menu.level1 })
                        const level1Expanded = await level1LinkExpanded.isVisible()

                        if (!level1Expanded) {
                            const level1Available = await this.floatingMenu.locator('.expandable').filter({ hasText: this.menu.level1 }).isVisible()
                            if (!level1Available) {
                                visible = false
                                break
                            }
                            await this.floatingMenu.locator('.expandable').filter({ hasText: this.menu.level1 }).click()
                            await this.waitForAnimation(this.floatingMenu)
                        }
                        const level2List = this.floatingMenu.getByRole('listitem').filter({ has: level1LinkExpanded })
                        visible = await level2List.getByRole('listitem').filter({ hasText: this.menu.level2 }).isVisible()
                    }
                    break

                case 'Main':
                    if (this.menu.level2 === undefined) {
                        visible = await this.page.locator('#oasysmainmenu').getByText(this.menu.level1).isVisible()
                    }
                    else {
                        await this.page.locator('#oasysmainmenu').getByText(this.menu.level1).click()
                        if (this.menu.level2[0] == '#') {
                            visible = await this.page.locator(this.menu.level2).isVisible()
                        } else {
                            visible = await this.page.getByText(this.menu.level2).isVisible()
                        }
                    }
                    break

                default:
                    throw new Error(`Invalid menu type for page ${this.name}`)
            }
            expect(visible).toBe(expectVisible)
        }
    }

}
