import { Page, expect } from '@playwright/test'

import { BaseAssessmentPage, Element } from 'classes'

export class ScreeningSection1 extends BaseAssessmentPage {

    name = 'RoshScreeningSection1'
    title = 'Risk of Serious Harm Screening'
    menu: Menu = { type: 'Floating', level1: 'RoSH Screening', level2: 'Section 1' }

    createSARA = new Element.Button(this.page, 'Create SARA')
    cancelSARA = new Element.Button(this.page, 'Cancel')
    goToSARA = new Element.Button(this.page, 'Go to SARA')
    areasOfConcern = new AreasOfConcern(this.page)
    mark1_2AsNo = new Element.Button(this.page, 'input[onclick*="P2_BT_NO"]')
    r1_2_1P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_1_2_V2')        // Murder / attempted murder / threat or conspiracy to murder / manslaughter
    r1_2_2P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_2_2_V2')        // Wounding / GBH(Sections 18 / 20 Offences Against the Person Act 1861)
    r1_2_3P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_3_2_V2')        // Any sexual offence against a child(ren)
    r1_2_4P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_4_2_V2')        // Rape or serious sexual offence against an adult
    r1_2_5P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_5_2_V2')        // Any other offence against a child(see revised Appendix 1)
    r1_2_6P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_6_2_V2')        // Aggravated burglary
    r1_2_7P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_7_2_V2')        // Arson
    r1_2_8P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_8_2_V2')        // Criminal damage with the intent to endanger life
    r1_2_9P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_9_2_V2')        // Kidnapping / false imprisonment
    r1_2_10P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_10_2_V2')      // Possession of a firearm with intent to endanger life or resist arrest
    r1_2_11P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_11_2_V2')      // Racially motivated / racially aggravated offence
    r1_2_12P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_12_2_V2')      // Robbery
    r1_2_13P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_13_2_V2')      // Any offence involving possession and / or use of weapons
    r1_2_14P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_14_2_V2')      // Any other offence which is as serious, eg blackmail, harassment, stalking, indecent images of children, child neglect, abduction etc.
    otherOffence = new Element.Textbox(this.page, '#textarea_R1_2_14_t_V2')    // Indicate offence    
    r1_2_16P = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_2_16_2_V2')      // Any offence commited in a custodial setting
    mark1_3AsNo = new Element.Button(this.page, 'input[onclick*="P3_BT_NO"]')
    r1_3_1 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_1_2_V2')         // Assaulted / threatened staff
    r1_3_2 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_2_2_V2')         // Assaulted / threatened others
    r1_3_20 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_20_2_V2')       // Domestic abuse towards a partner or other member of their family
    r1_3_4 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_4_2_V2')         // Committed a serious offence whilst not complying with medication
    r1_3_6 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_6_2_V2')         // Been involved in any hate-based behaviour
    r1_3_7 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_7_2_V2')         // Been assessed as high risk of serious harm on a Previous occasion
    r1_3_10 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_10_2_V2')       // Been a conditionally discharged patient subject to a restriction order under Section 41 MHA 1983
    r1_3_12 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_12_2_V2')       // Been a stalker
    r1_3_13 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_13_2_V2')       // Displayed obsessive behaviour linked to offending
    r1_3_15 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_15_2_V2')       // Displayed any offence-related behaviour observed in a custodial setting
    r1_3_16 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_16_2_V2')       // Displayed any inappropriate behaviour towards members of staff, visitors or prisoners
    r1_3_17 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_17_2_V2')       // Established links or associations, whilst in custody, which increase risk of serious harm
    r1_3_21 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_3_21_2_V2')       // Have they ever perpetrated behaviours relating to group-based child sexual exploitation
    r1_4 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4')
    r1_4_1 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_1')      //Banning order
    r1_4_19 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_19')    //Child arrangement order
    r1_4_2 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_2')      //Civil injunction
    r1_4_3 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_3')      //Community protection notice
    r1_4_4 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_4')      //Criminal behaviour order
    r1_4_7 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_7')      //Female genital mutilation order
    r1_4_8 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_8')      //Forced marriage order
    r1_4_20 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_20')    //Knife crime prevention order
    r1_4_9 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_9')      //Non-molestation order
    r1_4_21 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_21')    //Occupation order
    r1_4_22 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_22')    //Prohibited steps order
    r1_4_10 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_10')    //Public spaces protection order
    r1_4_11 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_11')    //Restraining orders
    r1_4_12 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_12')    //Serious crime prevention order
    r1_4_13 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_13')    //Serious violence reduction order
    r1_4_14 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_14')    //Sexual harm prevention orders
    r1_4_15 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_15')    //Sexual risk order
    r1_4_16 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_16')    //Slavery and trafficking prevention and risk orders
    r1_4_17 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_17')    //Stalking protection order
    r1_4_18 = new Element.Select<YesNoAnswer>(this.page, '#itm_R1_4_18')    //Violent offender order
    // saveButton = new Element.Button(this.page, '#P2_BT_SAVE_BOTT')


    /**
     * Answer all questions as No
     */
    async populateMinimal() {

        log('RoSH screening section 1 - no risks')
        await this.goto(true)
        await this.mark1_2AsNo.click()
        await this.mark1_3AsNo.click()
        await this.r1_4.setValue('No')
    }


    async populateFull(params?: PopulateAssessmentParams) {

        log('RoSH screening section 1 - fully populated')
        await this.goto(true)
        await this.r1_2_1P.setValue('Yes')
        await this.r1_2_2P.setValue('Yes')
        await this.r1_2_3P.setValue('Yes')
        await this.r1_2_4P.setValue('Yes')
        await this.r1_2_5P.setValue('Yes')
        await this.r1_2_6P.setValue('Yes')
        await this.r1_2_7P.setValue('Yes')
        await this.r1_2_8P.setValue('Yes')
        await this.r1_2_9P.setValue('Yes')
        await this.r1_2_10P.setValue('Yes')
        await this.r1_2_11P.setValue('Yes')
        await this.r1_2_12P.setValue('Yes')
        // await this.r1_2_13P.setValue('Yes')   pre-populated by answer above
        await this.r1_2_14P.setValue('Yes')
        await this.otherOffence.setValue('Another serious offence')
        await this.r1_2_16P.setValue('Yes')
        await this.r1_3_1.setValue('Yes')
        await this.r1_3_2.setValue('Yes')
        if (params?.layer != 'Layer 3') {
            await this.r1_3_20.setValue('Yes')    // pre-populated in fully popuplated layer 3
        }
        await this.r1_3_4.setValue('Yes')
        await this.r1_3_6.setValue('Yes')
        await this.r1_3_7.setValue('Yes')
        await this.r1_3_10.setValue('Yes')
        if (params?.layer == 'Layer 1V2') {
            await this.r1_3_12.setValue('Yes')    // pre-populated in fully populated layer 1 and layer 3
        }
        await this.r1_3_13.setValue('Yes')
        await this.r1_3_15.setValue('Yes')
        await this.r1_3_16.setValue('Yes')
        await this.r1_3_17.setValue('Yes')
        await this.r1_3_21.setValue('Yes')
        await this.r1_4.setValue('Yes')
        await this.r1_4_1.setValue('Yes')
        await this.r1_4_19.setValue('Yes')
        await this.r1_4_2.setValue('Yes')
        await this.r1_4_3.setValue('Yes')
        await this.r1_4_4.setValue('Yes')
        await this.r1_4_7.setValue('Yes')
        await this.r1_4_8.setValue('Yes')
        await this.r1_4_20.setValue('Yes')
        await this.r1_4_9.setValue('Yes')
        await this.r1_4_21.setValue('Yes')
        await this.r1_4_22.setValue('Yes')
        await this.r1_4_10.setValue('Yes')
        await this.r1_4_11.setValue('Yes')
        await this.r1_4_12.setValue('Yes')
        await this.r1_4_13.setValue('Yes')
        await this.r1_4_14.setValue('Yes')
        await this.r1_4_15.setValue('Yes')
        await this.r1_4_16.setValue('Yes')
        await this.r1_4_17.setValue('Yes')
        await this.r1_4_18.setValue('Yes')
    }
}

class AreasOfConcern {

    constructor(readonly page: Page) { }

    selector = 'table[summary="Areas with cause for concern in the context of harm"]'

    /**
     * Gets areas of concern listed on the page as a string array and returns them using the specified alias.
     */
    async getValues(): Promise<string[]> {

        const result: string[] = []

        const rows = await this.page.locator(this.selector).locator('tr').allTextContents()
        if (rows.length > 1) {
            for (let r = 1; r < rows.length; r++) {  // first row is heading, ignore it
                result.push(rows[r])
            }
        }
        return result
    }
    /**
     * Checks the areas of concern for a specific item
     */
    async checkValuesInclude(value: string) {

        log(`Checking that areas of concern includes ${value}`)

        const result = await this.getValues()
        expect(result).toContain(value)
    }
}