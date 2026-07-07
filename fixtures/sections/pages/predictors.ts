import { BaseAssessmentPage, Element } from 'classes'

export class Predictors extends BaseAssessmentPage {

    name = 'Predictors'
    title = '1 - Predictors'
    menu: Menu = { type: 'Floating', level1: 'Section 1', level2: 'Predictors' }

    scoresChanged = new Element.Text(this.page, "p:contains('The following scores have now changed i.e.   OGRS3-1YEAR OGRS3 - 2YEAR')")
    dateFirstSanction = new Element.Textbox<OasysDate>(this.page, '#itm_1_8_2', true)
    ageFirstSanction = new Element.Textbox<string>(this.page, '#itm_1_8')
    /** Total number of sanctions */
    o1_32 = new Element.Textbox<number>(this.page, '#itm_1_32')
    /** Number of sanctions involving violent offences */
    o1_40 = new Element.Textbox<number>(this.page, '#itm_1_40')
    /** Date of current conviction */
    o1_29 = new Element.Textbox<OasysDate>(this.page, '#itm_1_29', true)
    /** Ever committed sexually motivated offence */
    o1_30 = new Element.Select<YesNoAnswer>(this.page, '#itm_1_30')
    o1_30RO = new Element.Textbox<string>(this.page, '#itm_1_30')
    /** Current offence has sexual motivation */
    o1_41 = new Element.Select<YesNoAnswer>(this.page, '#itm_1_41')
    /** Contact with stranger */
    o1_44 = new Element.Select<YesNoAnswer>(this.page, '#itm_1_44')
    /** Date of most recent sexual sanction */
    o1_33 = new Element.Textbox<OasysDate>(this.page, '#itm_1_33', true)
    /** Number of adult sexual offences */
    o1_34 = new Element.Textbox<number>(this.page, '#itm_1_34')
    /** Number of child sexual offences */
    o1_45 = new Element.Textbox<number>(this.page, '#itm_1_45')
    /** Number of indecent image offences */
    o1_46 = new Element.Textbox<number>(this.page, '#itm_1_46')
    /** Number of non-contact sexual offences */
    o1_37 = new Element.Textbox<number>(this.page, '#itm_1_37')
    /** Earliest release date */
    o1_38 = new Element.Textbox<OasysDate>(this.page, '#itm_1_38', true)
    /** Date of offence since 1.38 date
     *  Note: might not work if you try to go to it straight after 1.38 as field isn't necessarily visible yet */
    o1_43 = new Element.Textbox<OasysDate>(this.page, '#itm_1_43', true)

    predictorsText = new Element.Text(this.page, "tbody:has-text('ACTUARIAL PREDICTORS')")
    arpText = new Element.Text(this.page, "td:has-text('ALL REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td")
    vrpText = new Element.Text(this.page, ":nth-match(td:has-text('VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td,1)")
    svrpText = new Element.Text(this.page, "td:has-text('SERIOUS VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td")
    ospDcText = new Element.Textbox<string>(this.page, '#textarea_D6')
    ospIicText = new Element.Textbox<string>(this.page, '#textarea_D5')
    dcSrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('DC-SRP')>text,1)")
    dcSrpText = new Element.Text(this.page, '#textarea_D6')
    iicSrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('IIC-SRP')>text,1)")
    iicSrpText = new Element.Text(this.page, '#textarea_D5')
    csrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text,1)")
    csrpType = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text:nth-of-type(2),1)")
    csrpScore = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text:nth-of-type(4),1)")
    csrpText = new Element.Text(this.page, '#textarea_D3')


    async populateMinimal() {

        log('Minimally populating predictors page')
        await this.goto(true)
        await this.dateFirstSanction.setValue({ years: -2 })
        await this.o1_32.setValue(2)
        await this.o1_40.setValue(0)
        await this.o1_29.setValue({ months: -3 })
        await this.o1_30.setValue('No')
    }


    async populateFull(params: PopulateAssessmentParams) {

        log(`Fully populating Predictors page, parameters = ${JSON.stringify(params)}`)
        await this.goto()
        await this.dateFirstSanction.setValue({ years: -3 })
        await this.o1_32.setValue(2)
        await this.o1_40.setValue(0)
        await this.o1_29.setValue({ months: -6 })
        if (params.r1_30PrePopulated != true) {
            await this.o1_30.setValue('Yes')
        }
        if (params.r1_41PrePopulated != true) {
            await this.o1_41.setValue('Yes')
        }
        await this.o1_44.setValue('Yes')
        await this.o1_33.setValue({ months: -6 })
        await this.o1_34.setValue(1)
        await this.o1_45.setValue(1)
        await this.o1_46.setValue(1)
        await this.o1_38.setValue({ months: -1 })
        await this.o1_37.setValue(1)
        if (params.provider != 'pris') {
            await this.o1_43.setValue({ days: -5 })
        }
    }
}

