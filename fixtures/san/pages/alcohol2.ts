import { Element } from 'classes'
import { BaseSanEditPage } from './baseSanEditPage'
import { sanWantChangesOptions } from '../sanIds'


export class Alcohol2 extends BaseSanEditPage {

    name = 'Alcohol2'
    title = 'Alcohol use - Strengths and Needs'

    howOftenLast3 = new Element.Radiogroup<HowOftenLast3>(this.page, '#alcohol_frequency', ['1PerMonth', '2-4PerMonth', '2-3PerWeek', 'more'])
    typicalUnits = new Element.Radiogroup<TypicalUnits>(this.page, '#alcohol_units', ['1To2', '3To4', '5To6', '7To9', '10orMore'])
    had8OrMore = new Element.Radiogroup<SanYesNo>(this.page, '#alcohol_binge_drinking', ['yes', 'no'])
    had8OrMoreFrequency = new Element.Radiogroup<'lessThanMonthly' | 'monthly' | 'weekly' | 'daily'>(this.page, '#alcohol_binge_drinking_frequency', ['lessThanMonthly', 'monthly', 'weekly', 'daily'])
    bingeDrinking = new Element.Radiogroup<BingeDrinking>(this.page, '#alcohol_evidence_of_excess_drinking', ['noEvidence', 'someEvidence', 'evidence'])
    pastIssues = new Element.Radiogroup<SanYesNo>(this.page, '#alcohol_past_issues', ['yes', 'no'])
    whyDrink = new Element.CheckboxGroup<'cultural' | 'curiosity' | 'enjoyment' | 'stress' | 'occasions' | 'peerPressure' | 'selfMedication' | 'socially' | 'other'>(this.page, '#alcohol_reasons_for_use', ['cultural', 'curiosity', 'enjoyment', 'stress', 'occasions', 'peerPressure', 'selfMedication', 'socially', 'other'])
    impactAlcohol = new Element.CheckboxGroup<'behavioural' | 'community' | 'finance' | 'offending' | 'health' | 'relationships' | 'other' | 'noImpact'>(this.page, '#alcohol_impact_of_use', ['behavioural', 'community', 'finance', 'offending', 'health', 'relationships', 'other', '-', 'noImpact'])
    anythingHelpedAlcohol = new Element.Radiogroup<SanYesNo>(this.page, '#alcohol_stopped_or_reduced', ['yes', 'no'])
    wantChangesAlcohol = new Element.Radiogroup<SanWantChanges>(this.page, '#alcohol_use_changes', sanWantChangesOptions)
}
