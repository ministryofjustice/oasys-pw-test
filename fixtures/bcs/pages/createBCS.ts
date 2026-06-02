import { OasysPage, Element } from 'classes'

export class CreateBCS extends OasysPage {

    name = 'CreateBCS'
    title = 'Create Basic Custody Screening'

    purposeOfAssessment = new Element.Select(this.page, '#P10_BCS_PURPOSE_ASSESSMENT_ELM')
    selectTeam = new Element.Select(this.page, '#P10_TEAM_UK')
    selectBcsScreener = new Element.Lov(this.page, '#P10_ASSESSOR_USER_CODE_LABEL')
    create = new Element.Button(this.page, 'Create')
    cancel = new Element.Button(this.page, 'Cancel')
}
