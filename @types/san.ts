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

declare type SanPopulation = { section: SanSection, steps: SanStep[] }[]

declare type SanIds = { [keys: string]: SanId }
declare type SanId = { type: 'radio' | 'checkbox' | 'textbox' | 'action' | 'date' | 'combo' | 'button' | 'select', id: string, options?: string[] }

declare type SanSection = 'Accommodation' | 'Employment and education' | 'Finances' | 'Drug use' | 'Alcohol use' | 'Health and wellbeing'
    | 'Personal relationships and community' | 'Thinking, behaviours and attitudes' | 'Offence analysis' | 'Sentence plan'


// Generic
declare type SanYesNo = 'yes' | 'no'
declare type SanYesNoConcerns = 'yes' | 'yesWithConcerns' | 'no'
declare type SanYesNoUnknown = 'yes' | 'no' | 'unknown'
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