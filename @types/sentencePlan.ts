declare type ObjectiveStatus =
    'Not Started' |
    'Fully achieved' |
    'Ongoing' |
    'Not Achieved' |
    'Not Achieved - entered custody' |
    'Not Achieved - revoked early for good progress' |
    'Partially Achieved' |
    'No Longer Applicable / Required'

declare type ActionStatus =
    'Not Started' |
    'Fully achieved' |
    'Ongoing' |
    'Not Achieved' |
    'Not Achieved - entered custody' |
    'Not Achieved - revoked early for good progress' |
    'Not Achieved - programme not available' |
    'Not Achieved - offender declined' |
    'Not Achieved - failed assessment' |
    'Removed - Inappropriate' |
    'Removed - unsuitable' |
    'Not Achieved - Other' |
    'Recall/released' |
    'Removed - other' |
    'Termination' |
    'Transferred' |
    'Not Achieved - Other'

declare type ArnsSpScript = 'populateMinimal' | 'openAndReturn' | 'checkReadOnly' | 'checkZeroGoals' | 'populateTwoGoals' | 'addGoal' | 'checkGoalCount'

declare type ArnsSpParams = {
    script: ArnsSpScript,
    readonly: boolean,
    openFromOffender: boolean,
    currentGoals?: number,
    futureGoals?: number,
}

declare type SpType = 'spService' | 'psrOutline'

declare type SpSelectionType = 'Initial' | 'Review' | 'PSR Outline'