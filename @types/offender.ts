declare type Gender = 'Male' | 'Female' | 'Not specified' | 'Not known' | 'Other'

declare type OffenderDef = {

    // Omit these values to get auto-generated unique identifiers
    probationCrn?: string,
    pnc?: string | null,
    nomisId?: string,
    surname?: string,

    cro?: string,
    forename1: string,
    forename2?: string,
    forename3?: string,
    gender: 'Male' | 'Female' | 'Not specified' | 'Not known' | 'Other',
    ethnicity?: string,
    dateOfBirth: OasysDate,
    limitedAccessOffender?: boolean,
    language?: string,
    phoneNumber?: string,
    religion?: string,
    addressLine1?: string,
    addressLine2?: string,
    addressLine3?: string,
    addressLine4?: string,
    addressLine5?: string,
    addressLine6?: string,
    postcode?: string,
    receptionCode?: string,
    dischargeCode?: string,
    dischargeAddressLine1?: string,
    dischargeAddressLine2?: string,
    dischargeAddressLine3?: string,
    dischargeAddressLine4?: string,
    dischargeAddressLine5?: string,
    dischargePostcode?: string,
    dischargeTelephoneNumber?: string,
    event?: CmsEvent,
    aliases?: Alias | Alias[],

    pk?: number,
}

declare type CmsEvent = {

    eventDetails?: EventDetails,
    sentenceDetails?: SentenceDetails | SentenceDetails[],
    offences: Offence | Offence[]
}

declare type EventDetails = {

    sentenceType?: string,
    sentenceDate?: OasysDate,
    sentenceMonths?: number,
    sentenceHours?: number,
    releaseType?: string,
    releaseDate?: OasysDate,
    court?: string,
    courtType?: string,
    licenceCondition?: string,
}

declare type SentenceDetails = {

    detailCategory?: string,
    detailType?: string,
    lengthHours?: number,
    lengthMonths?: number,
    detailDescription?: string,
    displayOrder?: number,
}

declare type Offence = {

    offence: string,
    subcode: string,
    additionalOffence?: boolean,
}

declare type Alias = {
    surname?: string,
    forename1?: string,
    forename2?: string,
    gender?: string,
    dateOfBirth?: OasysDate,
}

declare type Provider = 'prob' | 'pris'
declare type StandardOffenderType = 'burglary' | 'sexual' | 'twoOffences' | 'noEvent'

declare type OffenderLibParams = { gender?: Gender, forename1?: string, type?: StandardOffenderType, age?: number }