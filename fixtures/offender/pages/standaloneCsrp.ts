import { OasysPage, Element } from 'classes'

export class StandaloneCsrp extends OasysPage {

    name = 'StandaloneCsrp'
    title = ''
    menu: Menu = { type: 'Subform', level1: 'CSRP' }

    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    calculateScores = new Element.Button(this.page, 'Calculate Predictor Scores')

    heading = new Element.Text(this.page, '#P5_HEADING_LABEL')
    offence = new Element.Textbox<string>(this.page, '#P5_CT_OFFENCE_CODE_TEXT')
    offenceDescription = new Element.Textbox<string>(this.page, '#LOVDSC_P5_CT_OFFENCE_CODE_TEXT')
    subcode = new Element.Textbox<string>(this.page, '#P5_CT_OFFENCE_SUBCODE_TEXT')
    subcodeDescription = new Element.Textbox<string>(this.page, '#LOVDSC_P5_CT_OFFENCE_SUBCODE_TEXT')
    offenceLov = new Element.Link(this.page, "//input[@id='P5_CT_OFFENCE_CODE_TEXT']/following::a/img")
    subcodeLov = new Element.Link(this.page, "//input[@id='P5_CT_OFFENCE_SUBCODE_TEXT']/following::a/img")
    /**
     *  Date of first sanction
     */
    dateFirstSanction = new Element.Textbox<OasysDate>(this.page, '#P5_QU_1_8_2', true)
    /**
     *  Age at first conviction (calculated from 1.8)
     */
    ageFirstSanction = new Element.Textbox<string>(this.page, '#P5_QU_1_8')
    /**
     *  Number of sanctions for all offences
     */
    o1_32 = new Element.Textbox<number>(this.page, '#P5_QU_1_32')
    /**
     *  How many of the sanctions involved violent offences?
     */
    o1_40 = new Element.Textbox<number>(this.page, '#P5_QU_1_40')
    /**
     *  Date of current conviction
     */
    o1_29 = new Element.Textbox<OasysDate>(this.page, '#P5_QU_1_29', true)
    /**
     *  Ever committed a sexual offence
     */
    o1_30 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_1_30')
    /**
     *  Does of the current offence have sexual motivation
     */
    o1_41 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_1_41')
    /**
     *  Does the current offence involve a victim who was a stranger?
     */
    o1_42 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_1_42')
    /**
     *  Date of most recent sexual offence
     */
    o1_33 = new Element.Textbox<OasysDate>(this.page, '#P5_QU_1_33', true)
    /**
     *  Number of adult sexual offences
     */
    o1_34 = new Element.Textbox<number>(this.page, '#P5_QU_1_34')
    /**
     *  Number of previous/current sanctions involving direct contact child sexual/sexually motivated offences
     */
    o1_45 = new Element.Textbox<number>(this.page, '#P5_QU_1_45')
    /**
     *  Number of previous/current sanctions involving indecent child image sexual/sexually motivated offences or indirect child contacts
     */
    o1_46 = new Element.Textbox<number>(this.page, '#P5_QU_1_46')
    /**
     *  Number of non-contact sexual offences
     */
    o1_37 = new Element.Textbox<number>(this.page, '#P5_QU_1_37')
    /**
     *  Date of commencement of community sentence
     */
    o1_38 = new Element.Textbox<OasysDate>(this.page, '#P5_QU_1_38', true)
    /**
     *  Have you completed an Offender interview?
     */
    o1_39 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_1_39')
    /**
     * Did the offence involve carrying or using a weapon
    */
    o2_2Weapon = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_2_2')
    /**
     * Specify which weapon
    */
    o2_2SpecifyWeapon = new Element.Textbox(this.page, '#P5_QU_2_2_TXT')
    /**
     *  Is the offender living in suitable accommodation?
     */
    o3_4 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_3_4')
    /**
     *  Is the person unemployed?
     */
    o4_2 = new Element.Select<'0-No' | '0-Not available for work' | '2-Yes' | 'Missing'>(this.page, '#P5_QU_4_2')
    /**
     *  What is the person's current relationship with partner?
     */
    o6_4 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_6_4')
    /**
     *  Is there evidence of current or previous domestic abuse?
     */
    o6_7 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7DA')
    o6_7VictimPartner = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_1_1DA')
    o6_7VictimFamily = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_1_2DA')
    o6_7PerpetratorPartner = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_2_1DA')
    o6_7PerpetratorFamily = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_6_7_2_2DA')
    o6_8 = new Element.Select<Q6_8Answer>(this.page, '#P5_QU_6_8')
    o7_2 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_7_2')
    o8_1 = new Element.Select<YesNoAnswer>(this.page, '#P5_QU_8_1')
    /** A Heroin */
    aCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_HEROIN_CURR_USE')
    aCurrentlyInjected = new Element.Checkbox(this.page, '#itm_HEROIN_CURR_INJ_NO')
    aPrevious = new Element.Checkbox(this.page, '#itm_HEROIN_PREV_USE_NO')
    aPreviouslyInjected = new Element.Checkbox(this.page, '#itm_HEROIN_PREV_INJ_NO')
    /** B Methadone (not prescribed) */
    bCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_METHADONE_CURR_USE')
    bCurrentlyInjected = new Element.Checkbox(this.page, '#itm_METHADONE_CURR_INJ_NO')
    bPrevious = new Element.Checkbox(this.page, '#itm_METHADONE_PREV_USE_NO')
    bPreviouslyInjected = new Element.Checkbox(this.page, '#itm_METHADONE_PREV_INJ_NO')
    /** C Other opiates */
    cCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_OTHER_OPIATE_CURR_USE')
    cCurrentlyInjected = new Element.Checkbox(this.page, '#itm_OTHER_OPIATE_CURR_INJ_NO')
    cPrevious = new Element.Checkbox(this.page, '#itm_OTHER_OPIATE_PREV_USE_NO')
    cPreviouslyInjected = new Element.Checkbox(this.page, '#itm_OTHER_OPIATE_PREV_INJ_NO')
    /** D Crack/Cocaine */
    dCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_CRACK_COCAINE_CURR_USE')
    dCurrentlyInjected = new Element.Checkbox(this.page, '#itm_CRACK_COCAINE_CURR_INJ_NO')
    dPrevious = new Element.Checkbox(this.page, '#itm_CRACK_COCAINE_PREV_USE_NO')
    dPreviouslyInjected = new Element.Checkbox(this.page, '#itm_CRACK_COCAINE_PREV_INJ_NO')
    /** E Cocaine Hydrochloride */
    eCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_COCAINE_HYDROCHLORIDE_CURR_USE')
    eCurrentlyInjected = new Element.Checkbox(this.page, '#itm_COCAINE_HYDROCHLORIDE_CURR_INJ_NO')
    ePrevious = new Element.Checkbox(this.page, '#itm_COCAINE_HYDROCHLORIDE_PREV_USE_NO')
    ePreviouslyInjected = new Element.Checkbox(this.page, '#itm_COCAINE_HYDROCHLORIDE_PREV_INJ_NO')
    /** F Misused prescribed drugs */
    fCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_MISUSED_PRESCRIBED_CURR_USE')
    fCurrentlyInjected = new Element.Checkbox(this.page, '#itm_MISUSED_PRESCRIBED_CURR_INJ_NO')
    fPrevious = new Element.Checkbox(this.page, '#itm_MISUSED_PRESCRIBED_PREV_USE_NO')
    fPreviouslyInjected = new Element.Checkbox(this.page, '#itm_MISUSED_PRESCRIBED_PREV_INJ_NO')
    /** G Benzodiazepines */
    gCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_BENZODIAZEPINES_CURR_USE')
    gCurrentlyInjected = new Element.Checkbox(this.page, '#itm_BENZODIAZEPINES_CURR_INJ_NO')
    gPrevious = new Element.Checkbox(this.page, '#itm_BENZODIAZEPINES_PREV_USE_NO')
    gPreviouslyInjected = new Element.Checkbox(this.page, '#itm_BENZODIAZEPINES_PREV_INJ_NO')
    /** H Amphetamines */
    hCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_AMPHETAMINES_CURR_USE')
    hCurrentlyInjected = new Element.Checkbox(this.page, '#itm_AMPHETAMINES_CURR_INJ_NO')
    hPrevious = new Element.Checkbox(this.page, '#itm_AMPHETAMINES_PREV_USE_NO')
    hPreviouslyInjected = new Element.Checkbox(this.page, '#itm_AMPHETAMINES_PREV_INJ_NO')
    /** I Hallucinogens */
    iCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_HALLUCINOGENS_CURR_USE')
    iPrevious = new Element.Checkbox(this.page, '#itm_HALLUCINOGENS_PREV_USE_NO')
    /** J Ecstasy */
    jCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_ECSTASY_CURR_USE')
    jPrevious = new Element.Checkbox(this.page, '#itm_ECSTASY_PREV_USE_NO')
    /** K Cannabis */
    kCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_CANNABIS_CURR_USE')
    kPrevious = new Element.Checkbox(this.page, '#itm_CANNABIS_PREV_USE_NO')
    /** L Solvents */
    lCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_SOLVENTS_CURR_USE')
    lPrevious = new Element.Checkbox(this.page, '#itm_SOLVENTS_PREV_USE_NO')
    /** M Steroids */
    mCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_STEROIDS_CURR_USE')
    mCurrentlyInjected = new Element.Checkbox(this.page, '#itm_STEROIDS_CURR_INJ_NO')
    mPrevious = new Element.Checkbox(this.page, '#itm_STEROIDS_PREV_USE_NO')
    mPreviouslyInjected = new Element.Checkbox(this.page, '#itm_STEROIDS_PREV_INJ_NO')
    /** P Spice */
    pCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_SPICE_CURR_USE')
    pPrevious = new Element.Checkbox(this.page, '#itm_SPICE_PREV_USE_NO')
    /** Q Ketamine */
    qCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_KETAMINE_CURR_USE')
    qCurrentlyInjected = new Element.Checkbox(this.page, '#itm_KETAMINE_CURR_INJ_NO')
    qPrevious = new Element.Checkbox(this.page, '#itm_KETAMINE_PREV_USE_NO')
    qPreviouslyInjected = new Element.Checkbox(this.page, '#itm_KETAMINE_PREV_INJ_NO')
    /** N Other */
    nCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_OTHER_CURR_USE')
    nCurrentlyInjected = new Element.Checkbox(this.page, '#itm_OTHER_CURR_INJ_NO')
    nPrevious = new Element.Checkbox(this.page, '#itm_OTHER_PREV_USE_NO')
    nPreviouslyInjected = new Element.Checkbox(this.page, '#itm_OTHER_PREV_INJ_NO')
    other = new Element.Textbox(this.page, '#textarea_OTHER_DRUG_TEXT')
    o8_8 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_8_8')
    /**
     * Is the person's current use of alcohol a problem
     */
    o9_1 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_9_1')
    /**
     * Is there evidence of binge drinking
     */
    o9_2 = new Element.Select<ProblemsMissingAnswer>(this.page, '#P5_QU_9_2')
    /**
     * Is impulsivity a problem for the offender
     */
    o11_2 = new Element.Select<ProblemsAnswer>(this.page, '#P5_QU_11_2')
    /**
     * Is temper control a problem for the offender
     */
    o11_4 = new Element.Select<ProblemsAnswer>(this.page, '#P5_QU_11_4')
    /**
     * Does the offender have pro-criminal attitudes
     */
    o12_1 = new Element.Select<ProblemsAnswer>(this.page, '#P5_QU_12_1')
    r1_2_13P = new Element.Select<YesNoAnswer>(this.page, '#P5_WEAPON_PREV')
    r1_2_1P = new Element.Select<YesNoAnswer>(this.page, '#P5_MURDER_PREV')
    r1_2_2P = new Element.Select<YesNoAnswer>(this.page, '#P5_WOUND_PREV')
    r1_2_6P = new Element.Select<YesNoAnswer>(this.page, '#P5_BURGLARY_PREV')
    r1_2_7P = new Element.Select<YesNoAnswer>(this.page, '#P5_ARSON_PREV')
    r1_2_8P = new Element.Select<YesNoAnswer>(this.page, '#P5_CRIMINAL_PREV')
    r1_2_9P = new Element.Select<YesNoAnswer>(this.page, '#P5_KIDNAP_PREV')
    r1_2_10P = new Element.Select<YesNoAnswer>(this.page, '#P5_FIREARM_PREV')
    r1_2_12P = new Element.Select<YesNoAnswer>(this.page, '#P5_ROBBERY_PREV')

    arpText = new Element.Text(this.page, "td:has-text('ALL REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td")
    vrpText = new Element.Text(this.page, ":nth-match(td:has-text('VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td,1)")
    svrpText = new Element.Text(this.page, "td:has-text('SERIOUS VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+td")
    dcSrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('DC-SRP')>text,1)")
    dcSrpText = new Element.Text(this.page, '#P5_OSPCD_TEXTAREA')
    iicSrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('IIC-SRP')>text,1)")
    iicSrpText = new Element.Text(this.page, '#P5_OSPIIC_TEXTAREA')
    csrpBand = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text,1)")
    csrpType = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text:nth-of-type(2),1)")
    csrpScore = new Element.Text(this.page, ":nth-match(svg:has-text('CSRP')>text:nth-of-type(4),1)")
    csrpText = new Element.Text(this.page, '#P5_RSR_TEXT_1')

    arpErrorText = new Element.Text(this.page, "tr:has-text('ALL REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+tr")
    vrpErrorText = new Element.Text(this.page, ":nth-match(tr:has-text('VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+tr,1)")
    svrpErrorText = new Element.Text(this.page, "tr:has-text('SERIOUS VIOLENT REOFFENDING PREDICTOR OVER THE NEXT TWO YEARS')+tr")
    csrpErrorText = new Element.Text(this.page, '#P5_RSR_TEXT_2')

    async populateMinimal() {

        await this.goto()
        await this.dateFirstSanction.setValue({ months: -6 })
        await this.o1_32.setValue(1)
        await this.o1_40.setValue(0)
        await this.o1_29.setValue({ months: -1 })
        await this.o1_30.setValue('No')
        await this.o1_38.setValue({})
        await this.o1_39.setValue('No')
    }

    async populateMinimalDynamic() {

        await this.o1_39.setValue('Yes')
        await this.o2_2Weapon.setValue('No')
        await this.o3_4.setValue('0-No problems')
        await this.o4_2.setValue('0-Not available for work')
        await this.o6_4.setValue('0-No problems')
        await this.o6_7.setValue('No')
        await this.o6_8.setValue('Not in a relationship')
        await this.o7_2.setValue('0-No problems')
        await this.o8_1.setValue('No')
        await this.o9_1.setValue('0-No problems')
        await this.o9_2.setValue('0-No problems')
        await this.o11_2.setValue('0-No problems')
        await this.o11_4.setValue('0-No problems')
        await this.o12_1.setValue('0-No problems')
        await this.r1_2_13P.setValue('No')
        await this.r1_2_1P.setValue('No')
        await this.r1_2_2P.setValue('No')
        await this.r1_2_6P.setValue('No')
        await this.r1_2_7P.setValue('No')
        await this.r1_2_8P.setValue('No')
        await this.r1_2_9P.setValue('No')
        await this.r1_2_10P.setValue('No')
        await this.r1_2_12P.setValue('No')

    }

    async populateAllDynamicQuestions() {

        await this.o2_2Weapon.setValue('Yes')
        await this.o2_2SpecifyWeapon.setValue('A dagger')
        await this.o3_4.setValue('2-Significant problems')
        await this.o4_2.setValue('0-Not available for work')
        await this.o6_4.setValue('2-Significant problems')
        await this.o6_7.setValue('Yes')
        await this.o6_7VictimPartner.setValue('Yes')
        await this.o6_7VictimFamily.setValue('No')
        await this.o6_7PerpetratorPartner.setValue('No')
        await this.o6_7PerpetratorFamily.setValue('Yes')
        await this.o6_8.setValue('In a relationship, living together')
        await this.o7_2.setValue('2-Significant problems')
        await this.o8_1.setValue('Yes')
        await this.aCurrent.setValue('Monthly')
        await this.aCurrentlyInjected.setValue(true)
        await this.aPrevious.setValue(true)
        await this.aPreviouslyInjected.setValue(true)
        await this.bCurrent.setValue('Weekly')
        await this.bCurrentlyInjected.setValue(true)
        await this.bPrevious.setValue(true)
        await this.bPreviouslyInjected.setValue(true)
        await this.cCurrent.setValue('Occasional')
        await this.cCurrentlyInjected.setValue(true)
        await this.cPrevious.setValue(true)
        await this.cPreviouslyInjected.setValue(true)
        await this.dCurrent.setValue('Daily')
        await this.dCurrentlyInjected.setValue(true)
        await this.dPrevious.setValue(true)
        await this.dPreviouslyInjected.setValue(true)
        await this.eCurrent.setValue('Daily')
        await this.eCurrentlyInjected.setValue(true)
        await this.ePrevious.setValue(true)
        await this.ePreviouslyInjected.setValue(true)
        await this.fCurrent.setValue('Monthly')
        await this.fCurrentlyInjected.setValue(true)
        await this.fPrevious.setValue(true)
        await this.fPreviouslyInjected.setValue(true)
        await this.gCurrent.setValue('Daily')
        await this.gCurrentlyInjected.setValue(true)
        await this.gPrevious.setValue(true)
        await this.gPreviouslyInjected.setValue(true)
        await this.hCurrent.setValue('Weekly')
        await this.hCurrentlyInjected.setValue(true)
        await this.hPrevious.setValue(true)
        await this.hPreviouslyInjected.setValue(true)
        await this.iCurrent.setValue('Occasional')
        await this.iPrevious.setValue(true)
        await this.jCurrent.setValue('Daily')
        await this.jPrevious.setValue(true)
        await this.kCurrent.setValue('Daily')
        await this.kPrevious.setValue(true)
        await this.lCurrent.setValue('Daily')
        await this.lPrevious.setValue(true)
        await this.mCurrent.setValue('Monthly')
        await this.mCurrentlyInjected.setValue(true)
        await this.mPrevious.setValue(true)
        await this.mPreviouslyInjected.setValue(true)
        await this.pCurrent.setValue('Monthly')
        await this.pPrevious.setValue(true)
        await this.qCurrent.setValue('Daily')
        await this.qCurrentlyInjected.setValue(true)
        await this.qPrevious.setValue(true)
        await this.qPreviouslyInjected.setValue(true)
        await this.nCurrent.setValue('Weekly')
        await this.nCurrentlyInjected.setValue(true)
        await this.nPrevious.setValue(true)
        await this.nPreviouslyInjected.setValue(true)
        await this.other.setValue('Other drugs')
        await this.o8_8.setValue('1-Some problems')
        await this.o9_1.setValue('0-No problems')
        await this.o9_2.setValue('2-Significant problems')
        await this.o11_2.setValue('1-Some problems')
        await this.o11_4.setValue('0-No problems')
        await this.o12_1.setValue('2-Significant problems')
        await this.r1_2_13P.setValue('No')
        await this.r1_2_1P.setValue('Yes')
        await this.r1_2_2P.setValue('No')
        await this.r1_2_6P.setValue('Yes')
        await this.r1_2_7P.setValue('Yes')
        await this.r1_2_8P.setValue('No')
        await this.r1_2_9P.setValue('Yes')
        await this.r1_2_10P.setValue('No')
        await this.r1_2_12P.setValue('Yes')
    }
}
