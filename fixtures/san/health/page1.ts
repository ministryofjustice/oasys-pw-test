import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { mentalHealthProblemsOptions, sanYesNoUnknownOptions } from '../sanIds'

export class Page1 extends BaseSanEditPage {

    name = 'HealthPage1'
    title = 'Health and wellbeing - Strengths and Needs'

    physicalHealthConditions = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#health_wellbeing_physical_health_condition', sanYesNoUnknownOptions)
    mentalHealthProblems = new Element.Radiogroup<MentalHealthProblems>(this.page, '#health_wellbeing_mental_health_condition', mentalHealthProblemsOptions)


    async populateMinimal() {

        await this.physicalHealthConditions.setValue('no')
        await this.mentalHealthProblems.setValue('no')
    }
}