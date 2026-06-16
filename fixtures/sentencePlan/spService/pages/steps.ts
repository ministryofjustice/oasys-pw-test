import { OasysPage, Element } from 'classes'

export class Steps extends OasysPage {

    who = new Element.Dropdown<'person_on_probation' | 'probation_practitioner' | 'prison_offender_manager' | 'programme_staff' | 'partnership_agency' | 'crs_provider' | 'someone_else'>(this.page, '#step_actor_0')
    step = new Element.Textbox(this.page, '#step_description_0')
    status = new Element.Dropdown<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANNOT_BE_DONE_YET' | 'NO_LONGER_NEEDED'>(this.page, '#step_status_0')
    saveAndContinue = new Element.Button(this.page, 'Save and continue')
}