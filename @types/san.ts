declare type SanStep = {
    item: string,
    value?: string,
}

declare type SanScript = {
    section: SanSection,
    scenarios: SanScenario[],
}

declare type SanScenario = {
    name: string,
    steps: SanStep[],
    oasysAnswers: OasysAnswer[],
}
declare type SanPopulationParams = {

    from?: 'assessment' | 'offender',
    o1_30Yes?: boolean,
}

declare type SanPopulation = { section: SanSection, steps: SanStep[] }[]

declare type SanIds = { [keys: string]: SanId }
declare type SanId = { type: 'radio' | 'checkbox' | 'textbox' | 'action' | 'date' | 'combo' | 'button' | 'select', id: string, options?: string[] }

declare type SanSection = 'Accommodation' | 'Employment and education' | 'Finances' | 'Drug use' | 'Alcohol use' | 'Health and wellbeing'
    | 'Personal relationships and community' | 'Thinking, behaviours and attitudes' | 'Offence analysis' | 'Sentence plan'


// Generic
declare type SanYesNo = 'yes' | 'no'
declare type SanYesNoNa = 'yes' | 'no' | 'na'
declare type SanYesNoConcerns = 'yes' | 'yesWithConcerns' | 'no'
declare type SanYesNoUnknown = 'yes' | 'no' | 'unknown'
declare type SanYesSometimesNo = 'yes' | 'sometimes' | 'no'
declare type SanYesPartlyNo = 'yes' | 'partly' | 'no'
declare type SanYesHasBeenNo = 'yes' | 'hasBeen' | 'no'
declare type SanYesUnsureNo = 'yes' | 'unsure' | 'no'
declare type SanYesLimitedNo = 'yes' | 'limited' | 'no'
declare type SanYesSometimesNoUnknown = 'yes' | 'sometimes' | 'no' | 'unknown'
declare type SanYesNoSome = 'yes' | 'some' | 'no'
declare type SanSignificantSome = 'significant' | 'some'
declare type SanExperience = 'positive' | 'mostlyPositive' | 'positiveNegative' | 'mostlyNegative' | 'negative' | 'unknown'
declare type SanPositiveMixedNegative = 'positive' | 'mixed' | 'negative'
declare type SanWantChanges = 'madeChanges' | 'makingChanges' | 'wantToChange' | 'needHelp' | 'thinking' | 'notWanted' | 'notAnswering' | 'notPresent' | 'notApplicable'

// Accommodation
declare type CurrentAccommodation = 'settled' | 'temporary' | 'noAccommodation'
declare type TemporaryAccommodation = 'approvedPremises' | 'cas2' | 'cas3' | 'immigration' | 'shortTerm'
declare type LivingWith = 'family' | 'friends' | 'partner' | 'child' | 'other' | 'unknown' | 'alone'

// Alcohol
declare type EverDrank = 'yesIncLast3' | 'yesNotLast3' | 'no'
declare type HowOftenLast3 = '1PerMonth' | '2-4PerMonth' | '2-3PerWeek' | 'more'
declare type TypicalUnits = '1To2' | '3To4' | '5To6' | '7To9' | '10orMore'
declare type BingeDrinking = 'noEvidence' | 'someEvidence' | 'evidence'

// Drugs
declare type DrugsFrequency = 'daily' | 'weekly' | 'monthly' | 'occasionally'
declare type DrugType = 'amphetamines' | 'benzodiazepines' | 'cannabis' | 'cocaine' | 'crack' | 'ecstasy' | 'hallucinogenics' | 'heroin' | 'methadone' | 'prescribed' | 'opiates' | 'solvents' | 'steroids' | 'spice' | 'other'
declare type InjectableDrugType = 'none' | 'amphetamines' | 'benzodiazepines' | 'cocaine' | 'crack' | 'heroin' | 'methadone' | 'prescribed' | 'opiates' | 'steroids' | 'other'

// Employment
declare type EmploymentStatus = 'employed' | 'selfEmployed' | 'retired' | 'unavailable' | 'unemployedLooking' | 'unemployedNotLooking'
declare type EmploymentType = 'fullTime' | 'partTime' | 'temporary' | 'apprenticeship'
declare type EmploymentHistory = 'continuous' | 'generallyEmployed' | 'unstable' | 'unknown'
declare type HighestQual = 'entryLevel' | 'level1' | 'level2' | 'level3' | 'level4' | 'level5' | 'level6' | 'level7' | 'level8' | 'none' | 'unknown'
declare type SanDifficulties = 'reading' | 'writing' | 'numeracy' | 'none'

// Finance
declare type IncomeSource = 'carersAllowance' | 'disabilityBenefits' | 'employment' | 'family' | 'offending' | 'pension' | 'studentLoan' | 'undeclared' | 'workBenefits' | 'other' | 'unknown' | 'noMoney'
declare type HowGoodManaging = 'ableStrength' | 'able' | 'unable' | 'unableProblems'

// Health
declare type MentalHealthProblems = 'yesOngoingSevere' | 'yesOngoing' | 'yesPast' | 'no' | 'unknown'
declare type PsychTreatment = 'yes' | 'pending' | 'no' | 'unknown'

// Relationships
declare type AnyChildren = 'yesLiveWith' | 'yesLiveElsewhere' | 'yesVisitRegularly' | 'no'
declare type ImportantPeople = 'partner' | 'ownChildren' | 'otherChildren' | 'family' | 'friends' | 'other'
declare type HappyWithStatus = 'happy' | 'someConcerns' | 'unhappy'
declare type RelationshipHistory = 'stable' | 'mixed' | 'unstable'
declare type CurrentFamilyRelationship = 'stable' | 'mixed' | 'unstable' | 'unknown'

// Offence analysis
declare type OffenceElements = 'arson' | 'domesticAbuse' | 'excessiveViolence' | 'hatred' | 'physicalDamage' | 'sexualElement' | 'victimTargeted' | 'violence' | 'weapon' | 'none'
declare type Motivations = 'addictions' | 'pressure' | 'emotional' | 'financial' | 'hatred' | 'power' | 'sexual' | 'thrill' | 'other'
declare type VictimType = 'people' | 'other'
declare type HowManyOthers = '0' | '1' | '2' | '3' | '4' | '5' | '6to10' | '11to15' | 'more'
declare type FamilyPartnerBoth = 'family' | 'partner' | 'both'

// Victims
declare type VictimRelationship = 'stranger' | 'staff' | 'parent' | 'partner' | 'exPartner' | 'child' | 'otherFamily' | 'other'
declare type VictimAge = '0to4' | '5to11' | '12to15' | '16to17' | '18to20' | '21to25' | '26to49' | '50to64' | '65plus'
declare type VictimSex = 'male' | 'female' | 'intersex' | 'unknown'
declare type VictimRace =
    'White - English, Welsh, Scottish, Northern Irish or British' |
    'White - Irish' |
    'White - Gypsy or Irish Traveller' |
    'White - Roma' |
    'White - Any other White background' |
    'Mixed - White and Black Caribbean' |
    'Mixed - White and Black African' |
    'Mixed - White and Asian' |
    'Mixed - Any other mixed or multiple ethnic background background' |
    'Asian or Asian British - Indian' |
    'Asian or Asian British - Pakistani' |
    'Asian or Asian British - Bangladeshi' |
    'Asian or Asian British - Chinese' |
    'Asian or Asian British - Any other Asian background' |
    'Black or Black British - Caribbean' |
    'Black or Black British - African' |
    'Black or Black British - Any other Black background' |
    'Arab' |
    'Any other ethnic group' |
    'Not stated' |
    'Unknown'