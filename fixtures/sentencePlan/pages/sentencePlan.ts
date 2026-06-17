import { OasysPage, Element } from 'classes'

export class SentencePlan extends OasysPage {

    returnToOASys = new Element.Button(this.page,'Return to OASys')
    createGoal = new Element.Button(this.page,'Create goal')
    agreePlan = new Element.Button(this.page,'Agree plan')
    currentGoalCount = new Element.Link(this.page,'Goals to work on now (')
    futureGoalCount = new Element.Link(this.page,'Future goals (')
    achievedGoalCount = new Element.Link(this.page,'Achieved goals (')

    update = new Element.Link(this.page, 'Update')
}