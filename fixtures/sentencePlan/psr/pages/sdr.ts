import { OasysPage, Element } from 'classes'

export class Sdr extends OasysPage {

    name = 'SDR'
    menu: Menu = { type: 'Floating', level1: 'Pre-Sentence Report' }

    saveAndPreview = new Element.Button(this.page, 'Save and Preview')
    convertToNilReport = new Element.Button(this.page, 'Convert to Nil Report')
    signAndLock = new Element.Button(this.page, 'Sign & Lock')
    abandonPsr = new Element.Button(this.page, 'Abandon PSR')
    viewReport = new Element.Button(this.page, 'View Report')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    status = new Element.Textbox(this.page, '#P0_COURT_REPORT_STATUS_DESC')
    offenderNameForAutotext = new Element.Textbox(this.page, '#P0_AUTOTEXT_NAME')
    offenderName = new Element.Textbox(this.page, '#P0_RO_OFFENDER_NAME')
    dateOfBirth = new Element.Textbox<OasysDate>(this.page, '#P0_RO_DATE_OF_BIRTH', true)
    age = new Element.Textbox(this.page, '#P0_RO_AGE')
    addressLine1 = new Element.Textbox(this.page, '#P0_RO_ADDRESS_LINE_1')
    addressLine2 = new Element.Textbox(this.page, '#P0_RO_ADDRESS_LINE_2')
    addressLine3 = new Element.Textbox(this.page, '#P0_RO_ADDRESS_LINE_3')
    addressLine4 = new Element.Textbox(this.page, '#P0_RO_ADDRESS_LINE_4')
    addressLine5 = new Element.Textbox(this.page, '#P0_RO_ADDRESS_LINE_5')
    addressLine6 = new Element.Textbox(this.page, '#P0_RO_ADDRESS_LINE_6')
    postcode = new Element.Textbox(this.page, '#P0_RO_POST_CODE')
    sentencingCourt = new Element.Textbox(this.page, '#P0_COURT_DESC')
    courtType = new Element.Textbox(this.page, '#P0_COURT_TYPE')
    localJusticeArea = new Element.Textbox(this.page, '#P0_LOCAL_JUSTICE_AREA')
    dateReportRequested = new Element.Textbox<OasysDate>(this.page, '#P0_COURT_DATE_REPORT_REQSTD', true)
    dateReportRequired = new Element.Textbox<OasysDate>(this.page, '#P0_COURT_DATE_REPORT_REQRD', true)
    purposeOfSentencing = new Element.Textbox(this.page, '#P0_PURPOSE_OF_SENTENCING')
    levelOfSeriousness = new Element.Textbox(this.page, '#P0_LEVEL_OF_SERIOUSNESS')
    excludeColumn = new Element.Column(this.page, Element.ColumnType.CheckboxColumn, 'Exclude')
    offenceDescriptionColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Offence Description')
    offenceDateColumn = new Element.Column(this.page, Element.ColumnType.Column, 'Offence Date')
    addOffence = new Element.Button(this.page, 'Add Offence')
    psrWriterName = new Element.Textbox(this.page, '#P0_AUTHOR_NAME')
    officialTitle = new Element.Textbox(this.page, '#P0_AUTHOR_POSITION')
    officeLocation = new Element.Textbox(this.page, '#P0_OFFICE_DETAILS')
    dateReportSigned = new Element.Textbox<OasysDate>(this.page, '#P0_DATE_REPORT_SIGNED', true)
    sourcesOfInformation = new Element.TextEditor(this.page, '#P200_SOURCES_OF_INFO_LABEL')
    offenceAnalysis = new Element.TextEditor(this.page, '#P200_OFFENCE_ANALYSIS_LABEL')
}
