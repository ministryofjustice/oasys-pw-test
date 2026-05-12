import { OasysPage, Element } from 'classes'

export class MaintainFullUserProfile extends OasysPage {

    name = 'MaintainFullUserProfile'
    title = 'Maintain Full User Profile'

    disableProfile = new Element.Button(this.page, 'Disable Profile')
    save = new Element.Button(this.page, 'Save')
    close = new Element.Button(this.page, 'Close')
    userName = new Element.Textbox(this.page, '#P9_OASYS_USER_CODE')
    probationProviderEstablishment = new Element.Textbox(this.page, '#P9_TRUST_ESTABLISHMENT')
    forename1 = new Element.Textbox(this.page, '#P9_USER_FORENAME_1')
    forename2 = new Element.Textbox(this.page, '#P9_USER_FORENAME_2')
    surname = new Element.Textbox(this.page, '#P9_USER_FAMILY_NAME')
    phone = new Element.Textbox(this.page, '#P9_PHONE_NUMBER')
    email = new Element.Textbox(this.page, '#P9_EMAIL_ADDRESS')
    office = new Element.Select(this.page, '#P9_OFFICE')
    position = new Element.Textbox(this.page, '#P9_POSITION')
    privacyControls = new Element.Select(this.page, '#P9_RBAC_HIERARCHY')
    lau = new Element.Select(this.page, '#P9_LDU')
    mainTeam = new Element.Select(this.page, '#P9_DEFAULT_TEAM')
    defaultCountersigner = new Element.Lov(this.page, '#P9_DEFAULT_COUNTERSIGNER_LABEL')
    signingRole = new Element.Select(this.page, '#P9_SIGNING_ROLE')
    psrSigningLevel = new Element.Select<PsrSigningLevel>(this.page, '#P9_PSR_SIGNING_LEVEL')
    teams = new Element.Shuttle(this.page, 'PRO060_TEAMS')
    roles = new Element.Shuttle(this.page, 'PRO060_ROLES')
    frameworkRole = new Element.Select(this.page, '#P9_FRAMEWORK_ROLE')
}
