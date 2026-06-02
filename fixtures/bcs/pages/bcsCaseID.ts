import { BaseAssessmentPage, Element } from 'classes'

export class BcsCaseID extends BaseAssessmentPage {

    name = 'BCSCaseID'
    title = 'Case ID'
    menu: Menu = { type: 'Floating', level1: 'Case ID' }

    refreshOffenderDetails = new Element.Button(this.page, 'Refresh Offender Details')
    purposeOfBcs = new Element.Textbox(this.page, '#P2_PURPOSE_OF_BCS')
    receptionDate = new Element.Textbox<OasysDate>(this.page, '#P2_RECEPTION_DATE', true)
    surname = new Element.Textbox(this.page, '#P2_FAMILY_NAME')
    forenames = new Element.Textbox(this.page, '#P2_FORENAMES')
    gender = new Element.Textbox(this.page, '#P2_GENDER_ELM')
    dateofBirth = new Element.Textbox<OasysDate>(this.page, '#P2_DATE_OF_BIRTH', true)
    pNC = new Element.Textbox(this.page, '#P2_PNC')
    prisonNomisnumber = new Element.Textbox(this.page, '#P2_CMS_PRIS_NUMBER')
    prisonLidsnumber = new Element.Textbox(this.page, '#P2_PRISON_NUMBER')
    ethnicCategory = new Element.Select(this.page, '#P2_ETHNIC_CATEGORY_CODE_ELM')
    tierLevel = new Element.Select(this.page, '#P2_TIER_LEVEL_ELM')
    preferredSpokenLanguage = new Element.Select(this.page, '#P2_PREF_SPOKEN_LANGUAGE_ELM')
    interpreterRequired = new Element.Select(this.page, '#P2_INTERPRETER_REQUIRED_IND')
    spokenOther = new Element.Textbox(this.page, '#P2_PRF_SPKN_LNG_OFTXT')
    integratedOm = new Element.Select(this.page, '#P2_OFFDR_IDENT_PERSIST_IND')
    armedServices = new Element.Select(this.page, '#P2_ARMED_FORCES_IND')
    niNumber = new Element.Textbox(this.page, '#P2_NI_NUMBER')
    nhsNumber = new Element.Textbox(this.page, '#P2_NHS_NUMBER')
    laChildrensServices = new Element.Select(this.page, '#P2_CARED_FOR_ELM')
    sentenceDate = new Element.Textbox<OasysDate>(this.page, '#P2_SENTENCE_DATE', true)
    sentenceType = new Element.Select(this.page, '#P2_BCS_SENTENCE_TYPE_ELM')
    courtName = new Element.Textbox(this.page, '#P2_COURT_NAME')
    courtType = new Element.Textbox(this.page, '#P2_COURT_TYPE')
    actualReleaseDate = new Element.Textbox<OasysDate>(this.page, '#P2_DATE_OF_ACTUAL_RELEASE', true)
    hdcDate = new Element.Textbox<OasysDate>(this.page, '#P2_HOME_DETN_CURFEW_DATE', true)
    conditionalReleaseDate = new Element.Textbox<OasysDate>(this.page, '#P2_CONDITIONAL_RELEASE_DATE', true)
    automaticReleaseDate = new Element.Textbox<OasysDate>(this.page, '#P2_AUTOMATIC_RELEASE_DATE', true)
    paroleEligibilityDate = new Element.Textbox<OasysDate>(this.page, '#P2_PAROLE_ELIGIBILITY_DATE', true)
    licenceExpiryDate = new Element.Textbox<OasysDate>(this.page, '#P2_LICENCE_EXPIRY_DATE', true)
    sentenceExpiryDate = new Element.Textbox<OasysDate>(this.page, '#P2_SENTENCE_EXPIRY_DATE', true)
    nonParoleDate = new Element.Textbox<OasysDate>(this.page, '#P2_NON_PAROLE_DATE', true)
    postSentenceSupervisionExpiryDate = new Element.Textbox<OasysDate>(this.page, '#P2_POST_SENT_SUP_EXP', true)
    screening = new Element.Textbox(this.page, '#')
    bcsScreenerName = new Element.Textbox(this.page, '#P2_ASSESSOR_NAME')
    bcsScreenerPosition = new Element.Textbox(this.page, '#P2_ASSESSOR_POSITION')
    screeningDate = new Element.Textbox<OasysDate>(this.page, '#P2_TR_BCS_SCREENING_DATE', true)
    bcsResettlementOfficerName = new Element.Textbox(this.page, '#P2_RESET_OFF_NAME')
    bcsResettlementOfficerPosition = new Element.Textbox(this.page, '#P2_RESET_OFF_POS')
    resettlementPlanDate = new Element.Textbox<OasysDate>(this.page, '#P2_RESET_PLAN_DATE', true)
}
