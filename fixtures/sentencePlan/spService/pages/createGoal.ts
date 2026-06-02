import { OasysPage, Element } from 'classes'

export class CreateGoal extends OasysPage {

    goal = new Element.Textbox(this.page, '#goal_title')
    related = new Element.Radiogroup<'yes' | 'no'>(this.page, '#is_related_to_other_areas', ['yes', 'no'])
    startNow = new Element.Radiogroup<'yes' | 'no'>(this.page, '#can_start_now', ['yes', 'no'])
    targetDate = new Element.Radiogroup<'3months' | '6months' | '12months' | 'other'>(this.page, '#target_date_option', ['3months', '6months', '12months', 'other'])
    addSteps = new Element.Button(this.page, 'Add Steps')
    saveAndContinue = new Element.Button(this.page, 'Save and continue')
    saveWithoutSteps = new Element.Button(this.page, 'Save without steps')
}