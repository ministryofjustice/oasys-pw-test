import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { mentalHealthProblemsOptions, sanYesNoUnknownOptions } from '../sanIds'

export class Health1 extends BaseSanEditPage {

    name = 'Health1'
    title = 'Health and wellbeing - Strengths and Needs'
    
    physicalHealthConditions = new Element.Radiogroup<SanYesNoUnknown>(this.page, '#health_wellbeing_physical_health_condition',  sanYesNoUnknownOptions)
    mentalHealthProblems = new Element.Radiogroup<MentalHealthProblems>(this.page, '#health_wellbeing_mental_health_condition', mentalHealthProblemsOptions )
}