import { BaseAssessmentPage, Element } from 'classes'

export class PredictorQuestions extends BaseAssessmentPage {

    name = 'PredictorQuestions'
    title = 'Predictor Questions '
    menu: Menu = { type: 'Floating', level1: 'Predictor Questions' }

    pageHeader = new Element.Text(this.page, '#P5_TITLE_LABEL')
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
    aCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_1_1')
    aCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_1_2_YES')
    aPrevious = new Element.Checkbox(this.page, '#itm_8_2_1_3_YES')
    aPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_1_4_YES')
    /** B Methadone (not prescribed) */
    bCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_2_1')
    bCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_2_2_YES')
    bPrevious = new Element.Checkbox(this.page, '#itm_8_2_2_3_YES')
    bPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_2_4_YES')
    /** C Other opiates */
    cCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_3_1')
    cCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_3_2_YES')
    cPrevious = new Element.Checkbox(this.page, '#itm_8_2_3_3_YES')
    cPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_3_4_YES')
    /** D Crack/Cocaine */
    dCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_4_1')
    dCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_4_2_YES')
    dPrevious = new Element.Checkbox(this.page, '#itm_8_2_4_3_YES')
    dPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_4_4_YES')
    /** E Cocaine Hydrochloride */
    eCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_5_1')
    eCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_5_2_YES')
    ePrevious = new Element.Checkbox(this.page, '#itm_8_2_5_3_YES')
    ePreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_5_4_YES')
    /** F Misused prescribed drugs */
    fCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_6_1')
    fCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_6_2_YES')
    fPrevious = new Element.Checkbox(this.page, '#itm_8_2_6_3_YES')
    fPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_6_4_YES')
    /** G Benzodiazepines */
    gCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_7_1')
    gCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_7_2_YES')
    gPrevious = new Element.Checkbox(this.page, '#itm_8_2_7_3_YES')
    gPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_7_4_YES')
    /** H Amphetamines */
    hCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_8_1')
    hCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_8_2_YES')
    hPrevious = new Element.Checkbox(this.page, '#itm_8_2_8_3_YES')
    hPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_8_4_YES')
    /** I Hallucinogens */
    iCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_9_1')
    iPrevious = new Element.Checkbox(this.page, '#itm_8_2_9_3_YES')
    /** J Ecstasy */
    jCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_10_1')
    jPrevious = new Element.Checkbox(this.page, '#itm_8_2_10_3_YES')
    /** K Cannabis */
    kCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_11_1')
    kPrevious = new Element.Checkbox(this.page, '#itm_8_2_11_3_YES')
    /** L Solvents */
    lCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_12_1')
    lPrevious = new Element.Checkbox(this.page, '#itm_8_2_12_3_YES')
    /** M Steroids */
    mCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_13_1')
    mCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_13_2_YES')
    mPrevious = new Element.Checkbox(this.page, '#itm_8_2_13_3_YES')
    mPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_13_4_YES')
    /** P Spice */
    pCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_15_1')
    pPrevious = new Element.Checkbox(this.page, '#itm_8_2_15_3_YES')
    /** Q Ketamine */
    qCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_16_1')
    qCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_16_2_YES')
    qPrevious = new Element.Checkbox(this.page, '#itm_8_2_16_3_YES')
    qPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_16_4_YES')
    /** N Other */
    nCurrent = new Element.Select<DrugsUsage>(this.page, '#itm_8_2_14_1')
    nCurrentlyInjected = new Element.Checkbox(this.page, '#itm_8_2_14_2_YES')
    nPrevious = new Element.Checkbox(this.page, '#itm_8_2_14_3_YES')
    nPreviouslyInjected = new Element.Checkbox(this.page, '#itm_8_2_14_4_YES')
    other = new Element.Textbox(this.page, '#textarea_8_2_14_t')
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


    async populateFull(o6_7PrePopulated: boolean = false) {

        log('Fully populating Predictor Questions page')
        await this.goto(true)
        await this.o3_4.setValue('1-Some problems')
        await this.o4_2.setValue('2-Yes')
        await this.o6_4.setValue('2-Significant problems')
        if (!o6_7PrePopulated) {
            await this.o6_7.setValue('Yes')
        }
        await this.o6_7VictimPartner.setValue('No')
        await this.o6_7VictimFamily.setValue('Yes')
        await this.o6_7PerpetratorPartner.setValue('No')
        await this.o6_7PerpetratorFamily.setValue('No')
        await this.o6_8.setValue('In a relationship, living together')
        await this.o7_2.setValue('1-Some problems')
        await this.o8_1.setValue('Yes')
        await this.aCurrent.setValue('Daily')
        await this.aCurrentlyInjected.setValue(true)
        await this.aPrevious.setValue(true)
        await this.aPreviouslyInjected.setValue(true)
        await this.bCurrent.setValue('Weekly')
        await this.bCurrentlyInjected.setValue(true)
        await this.bPrevious.setValue(true)
        await this.bPreviouslyInjected.setValue(true)
        await this.cCurrent.setValue('Monthly')
        await this.cCurrentlyInjected.setValue(true)
        await this.cPrevious.setValue(true)
        await this.cPreviouslyInjected.setValue(true)
        await this.dCurrent.setValue('Occasional')
        await this.dCurrentlyInjected.setValue(true)
        await this.dPrevious.setValue(true)
        await this.dPreviouslyInjected.setValue(true)
        await this.eCurrent.setValue('Daily')
        await this.eCurrentlyInjected.setValue(true)
        await this.ePrevious.setValue(true)
        await this.ePreviouslyInjected.setValue(true)
        await this.fCurrent.setValue('Weekly')
        await this.fCurrentlyInjected.setValue(true)
        await this.fPrevious.setValue(true)
        await this.fPreviouslyInjected.setValue(true)
        await this.gCurrent.setValue('Monthly')
        await this.gCurrentlyInjected.setValue(true)
        await this.gPrevious.setValue(true)
        await this.gPreviouslyInjected.setValue(true)
        await this.hCurrent.setValue('Daily')
        await this.hCurrentlyInjected.setValue(true)
        await this.hPrevious.setValue(true)
        await this.hPreviouslyInjected.setValue(true)
        await this.iCurrent.setValue('Weekly')
        await this.iPrevious.setValue(true)
        await this.jCurrent.setValue('Monthly')
        await this.jPrevious.setValue(true)
        await this.kCurrent.setValue('Occasional')
        await this.kPrevious.setValue(true)
        await this.lCurrent.setValue('Daily')
        await this.lPrevious.setValue(true)
        await this.mCurrent.setValue('Weekly')
        await this.mCurrentlyInjected.setValue(true)
        await this.mPrevious.setValue(true)
        await this.mPreviouslyInjected.setValue(true)
        await this.pCurrent.setValue('Monthly')
        await this.pPrevious.setValue(true)
        await this.nCurrent.setValue('Occasional')
        await this.nCurrentlyInjected.setValue(true)
        await this.nPrevious.setValue(true)
        await this.nPreviouslyInjected.setValue(true)
        await this.other.setValue('Some other stuff from time to time')
        await this.o8_8.setValue('2-Significant problems')

        await this.o9_1.setValue('1-Some problems')
        await this.o9_2.setValue('0-No problems')
        await this.o11_2.setValue('0-No problems')
        await this.o11_4.setValue('1-Some problems')
        await this.o12_1.setValue('1-Some problems')
    }
}

