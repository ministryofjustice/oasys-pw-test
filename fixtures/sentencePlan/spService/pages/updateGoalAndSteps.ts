import { OasysPage, Element } from 'classes'

export class UpdateGoalAndSteps extends OasysPage {

    stepStatus = new Element.Select<'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANNOT_BE_DONE_YET' | 'NO_LONGER_NEEDED'>(this.page, '#step_status_0')
    markAsAchieved = new Element.Button(this.page, 'Mark as achieved')
}