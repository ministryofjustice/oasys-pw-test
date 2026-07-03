declare type AssessmentLayer = 'Basic (Layer 1)' | 'Full (Layer 3)'

declare type PurposeOfAssessment =
    'PSR Addendum' |
    'PSR - SDR' |
    'Deferred Sentence Report' |
    'Risk of Harm Assessment' |
    'RSR and Risk Assessment Only' |
    'Start of Community Order' |
    'Start Licence' |
    'Start of Suspended Sentence Order' |
    'Start custody' |
    'Start licence - YOI' |
    'Transfer in from YOT' |
    'Transfer in from non England / Wales Court' |
    'Fast Review' |
    'Review' |
    'Risk Review' |
    'HDC' |
    'Hostel Assessment' |
    'Parole' |
    'Pre release' |
    'Recall' |
    'ROTL' |
    'Significant Change' |
    'SSO Activated' |
    'Transfer Out' |
    'End of licence' |
    'Termination of Community Supervision' |
    'Non-statutory' |
    'Other' |
    'Re-categorisation to Open Conditions' |
    'Pre-handover' |
    'Impact Cohort Assessment' |
    'Standalone Unpaid Work' |
    'Final Third Suspension'

declare type YesNoAnswer = 'Yes' | 'No' | ''
declare type YesNoDKAnswer = 'Yes' | 'No' | `Don't Know` | ''
declare type YesNoDkAnswer = 'Yes' | 'No' | `Don't know` | ''
declare type YesNoMissingAnswer = 'Yes' | 'No' | 'Missing' | ''
declare type ProblemsAnswer = '0-No problems' | '1-Some problems' | '2-Significant problems' | ''
declare type ProblemsMissingAnswer = '0-No problems' | '1-Some problems' | '2-Significant problems' | 'Missing' | ''
declare type OasysDate = string | { days?: number, months?: number, years?: number }
declare type Q6_8Answer = 'In a relationship, living together' | 'In a relationship, not living together' | 'Not in a relationship'
declare type Q6_8AnswerNoCommas = 'In a relationship living together' | 'In a relationship not living together' | 'Not in a relationship'
declare type DrugsUsage = 'Daily' | 'Weekly' | 'Monthly' | 'Occasional'

declare type CreateAssessmentDetails = {

    purposeOfAssessment: PurposeOfAssessment
    otherPleaseSpecify?: string
    assessmentLayer?: AssessmentLayer
    sentencePlanType?: SpSelectionType
    includeCourtReportTemplate?: 'SDR' | 'FDR' | 'No'
    includeSanSections?: YesNoAnswer
    selectTeam?: string
    selectAssessor?: string
}

declare type Layer = 'Layer 1' | 'Layer 1V2' | 'Layer 3' | 'Layer 3V2'
declare type RiskLevel = 'Low' | 'Medium' | 'High' | 'Very High' | ''
declare type FrameworkRole = 'Legacy - Unapproved PSO & unapproved PQiP' | 'Legacy - Approved PSO, approved PQiP, NQO or unapproved PO' | 'Legacy - Approved PO' | 'Legacy - SPO' | 'Legacy - Head of PDU' |
    'Unapproved Prison POM & unapproved PQiP' | 'Approved Prison POM, approved PQiP, NQO or unapproved Probation POM' | 'Approved Probation POM' | 'HOMDs'
declare type PsrSigningLevel = 'Countersign All' | 'RoSH Screening Only' | 'Low' | 'Medium' | 'High' | 'Very High' | ''

declare type MenuStatus = { container: boolean, level1: string, level2: string, complete: boolean }

declare type ColumnValues = { name: string, values: string[] }

declare type AssessmentSigning = 'ASS_DEL_RESTORE' |
    'ASSMT_DEL_COUNTERSIGNING' |
    'ASSMT_DEL_REJECTION' |
    'ASSMT_DEL_SIGNING' |
    'AWAITING_SBC' |
    'BCS_DEL_COUNTERSIGNING' |
    'BCS_DEL_RESTORE' |
    'BCS_DEL_SIGNING' |
    'COUNTERSIGNING' |
    'LOCKED_INCOMPLETE' |
    'OFF_DEL_REJECTION' |
    'OFF_DEL_RESTORE' |
    'OFF_DEL_SIGNING' |
    'PART_1_LOCKED_INCOMPLETE' |
    'PART_1_SIGNED' |
    'PART_2_LOCKED_INCOMPLETE' |
    'PART_2_SIGNED' |
    'PSR_ABANDON' |
    'PSR_APPEND' |
    'PSR_COUNTERSIGNING' |
    'PSR_REJECTION' |
    'PSR_REMOVAL' |
    'PSR_ROLLBACK' |
    'PSR_SIGNING' |
    'REJECTION' |
    'ROLLBACK' |
    'SARA_DEL_COUNTERSIGNING' |
    'SARA_DEL_REJECTION' |
    'SARA_DEL_RESTORE' |
    'SARA_DEL_SIGNING' |
    'SARA_LOCKED_INCOMPLETE' |
    'SARA_ROLLBACK' |
    'SARA_SIGNING' |
    'SIGNING' |
    'TRF_GRANT_COUNTERSIGNING' |
    'TRF_GRANT_REJECTION' |
    'TRF_GRANT_SIGNING' |
    'TRF_REQ_COUNTERSIGNING' |
    'TRF_REQ_REJECTION'

declare type PopulateAssessmentParams = {

    layer?: Layer
    maxStrings?: boolean,
    provider?: Provider,
    sentencePlan?: SpType,
    r1_30PrePopulated?: boolean,
    r1_41PrePopulated?: boolean,
    populate6_11?: 'Yes' | 'No',
}

declare type SigningPage = 'spService' | 'rmp' | 'riskScreening' | 'psr'

declare type Sentence =
    '' |
    `+CPO hours for breach code 5` |
    `28 Day Bail Assessment for DTTO` |
    `ASPOS Case (Not Selectable - Historic) ` |
    `Absolute Discharge` |
    `Action Plan Order CDA1998 S69` |
    `Adjourned - Non-Attendance` |
    `Adjourned - Other Report` |
    `Adjourned - PSR` |
    `Adjourned For Reports` |
    `Adjourned Other Reason` |
    `Adjourned for Next Court Review` |
    `Adjourned for Sentence` |
    `Adult Custody (Migration)` |
    `Adult Custody (voluntary supervision)` |
    `Adult Custody Concurrent` |
    `Adult Custody Consecutive` |
    `Amended & Continued` |
    `Anti-Social Behaviour Order` |
    `Approved Premises Referral` |
    `Approved Premises Residence` |
    `Attendance Centre Order` |
    `Bail Assessment for Mental Health Institution` |
    `Bail/Case dealt with` |
    `Bail/Conditional` |
    `Bail/No Bail` |
    `Bail/Unconditional` |
    `Borstal` |
    `Bound Over` |
    `Breach - Amended & Continued` |
    `Breach - Cond Discharge Substtd` |
    `Breach - Continued/Att Centre` |
    `Breach - Continued/No action` |
    `Breach - Recalled to Prison` |
    `Breach - Revoked & Re-Sentenced` |
    `Breach - Revoked Good Progress` |
    `Breach - Revoked/Discharged NFA` |
    `Breach - Withdrawn` |
    `C & YP Act 1969 supervision order` |
    `CJA - Custody Plus` |
    `CJA - Suspended SO (unsupervised)` |
    `CJA - Trans Custody - Adult` |
    `CJA - Trans Custody - Youth` |
    `CJA Enforcement Order (C&AA 06)` |
    `CJA2003 - Community Order` |
    `CJA2003 - Deferred Sentence` |
    `CJA2003 - Extended Public Protection` |
    `CJA2003 - Indeterminate Public Protection` |
    `CJA2003 - Standard Determinate Sentence of 12 months or more` |
    `CJA2003 - Suspended Sentence Order` |
    `CPO component of CPRO` |
    `CPO for fine defaulters` |
    `CPO for persistent petty offenders` |
    `CPRO` |
    `Care & Sup'n Order Ch/Act 1989` |
    `Comm Pun/Rhb Order - Pun(conc)` |
    `Comm Pun/Rhb Order - Pun(cons)` |
    `Committed to Crown Court` |
    `Community Punishment Order` |
    `Community Rehabilitation component of CPRO` |
    `Community Rehabilitation order` |
    `Compensation` |
    `Conc/Consec Adult Custody <12 mths` |
    `Cond Discharge Substtd` |
    `Conditional Discharge` |
    `Confiscation/Forfeiture` |
    `Continued/Att Centre` |
    `Continued/Fine` |
    `Continued/No action` |
    `CtsMtl - Death` |
    `CtsMtl - Detention - Sec State` |
    `CtsMtl - Detention CTC` |
    `CtsMtl - Detention Cust Order` |
    `CtsMtl - Detention/HM Pleasure` |
    `CtsMtl - Dismissal Ship/Estab` |
    `CtsMtl - Dismissal TA/RAAF` |
    `CtsMtl - Dismissal from Service` |
    `CtsMtl - Dismissal w Disgrace` |
    `CtsMtl - Forfeiture Seniority` |
    `CtsMtl - Order for Restitution` |
    `CtsMtl - Reduction to Ranks` |
    `CtsMtl - Reprimand` |
    `CtsMtl - Severe Reprimand` |
    `CtsMtl - Stoppage of Pay` |
    `Curfew Order` |
    `Cus Ext Svn Sex Conc` |
    `Cus Ext Svn Sex Consec` |
    `Cus Ext Svn Violence Conc` |
    `Cus Ext Svn Violence Consec` |
    `Custody (1 to 4 yrs - ACR)` |
    `Custody (4+ years - DCR)` |
    `Custody (under 12 months - AUR)` |
    `DTTO - intensity not specified` |
    `Deferred Sentence` |
    `Deportation Recommended` |
    `Detained - S.53(1) or S.91` |
    `Detained - S.53(2) or S.91` |
    `Detention Centre` |
    `Detention and Training Conc` |
    `Detention and Training Consec` |
    `Detention and training order` |
    `Disc Release (parole) Adult and Youth` |
    `Disqualification Order` |
    `Drug Treatment and testing Order - Lower intensity` |
    `Drug Treatment and testing order - Higher intensity` |
    `Drug abstinence order` |
    `Enforcement Order (Pre-CJA)` |
    `Extended Determinate Sentence` |
    `Extended sentence (pre Oct 1992)` |
    `Extended sup. (Sex) Post Oct 1998` |
    `Extended sup. (Sex) Pre Oct 1998` |
    `Extended sup. (Violence)` |
    `Fam Assist Order Ch/Act 1989` |
    `Family Assistance Order` |
    `Final Review` |
    `Fine` |
    `Fine/Order Allowed to Continue` |
    `Football - Restrictn/Exclusion` |
    `Grant Parole` |
    `Guardianship Order MHA1983 S37` |
    `Guardianship Order MHA1983 S37 - No Conv` |
    `Guardianship Supervision Order` |
    `Guardianship of Minors Supervision Order` |
    `Historic Breach Outcome` |
    `ICMS Miscellaneous Event` |
    `IIMS IOM Referrals` |
    `Imprisonment - Concurrent` |
    `Imprisonment - Consecutive` |
    `Imprisonment - Fine - Fine Default &c` |
    `Imprisonment - No Supervision` |
    `Initial Court Review Requested` |
    `Intensive Alternative to Custody` |
    `Intensive Supervision and Control` |
    `Intermittent Weekday Custody` |
    `Intermittent Weekend Custody` |
    `Lie on File` |
    `Life` |
    `Life imprisonment (Youth)` |
    `Migrated Drug Test Event` |
    `Money payment supervision order` |
    `No Appropriate Proposal` |
    `No Further Review Requested` |
    `No Specific Proposal (Migrated Data)` |
    `Non statutory order  (deprecated - see ""Voluntary Supervision"")` |
    `Non-Appearance Breach Warrant` |
    `Non-Appearance Warrant` |
    `Not Guilty` |
    `Not Guilty - Insanity` |
    `ORA Adult Custody (inc PSS)` |
    `ORA Adult Custody (not PSS)` |
    `ORA Breach Committal` |
    `ORA Community Order` |
    `ORA Supervision Default Order` |
    `ORA Suspended Sentence Order` |
    `ORA Youth Custody (inc PSS)` |
    `ORA Youth Rehabilitation Order` |
    `One Day Imprisonment` |
    `Order to Continue` |
    `Other` |
    `Parenting Order CDA1998 S8` |
    `Parents Bound Over` |
    `Parents Pay Fine/Comp/Costs` |
    `Parole (before October 1992)` |
    `Part Suspended Sentence` |
    `Post Release Voluntary Supervision` |
    `Psych Hosp Order (Non-Prob)` |
    `Psych hospital/conditional discharge` |
    `Remanded In Custody` |
    `Remitted` |
    `Reparation order` |
    `Resentenced on Appeal` |
    `Restitution Order` |
    `Restriction Order (s.41 MHA83)` |
    `Return to prison (S.105 C&DA)` |
    `Revoked & Re-Sentenced` |
    `Revoked Good Progress` |
    `Revoked/Discharged NFA` |
    `SA2020 Community Order` |
    `SA2020 Suspended Sentence Order` |
    `SA2020 Youth Rehabilitation Order` |
    `SSSO` |
    `Scottish Community Order (CPA95)` |
    `Scottish community payback order` |
    `Section 40 Licence` |
    `Secure Training Order` |
    `Sentence Quashed` |
    `Sentence Terminated Pre-Migration` |
    `Sentence Varied` |
    `Sentenced in Migrated Data` |
    `Services Community Order` |
    `Services Suspended Sentence Order` |
    `Sex Offences Prevention Order` |
    `Special Cust Sentence (S236aCJA)` |
    `Stayed` |
    `Supervision Order - Adoption Act 1976` |
    `Supervision Order - Childrens Act 1975` |
    `Supervision Order - Family Courts` |
    `Supervision Order - Insanity Act` |
    `Supervision Order - Matrimonial Proc` |
    `Supervision Order - Wardship` |
    `Supervision and Control (Suspended Sentence)` |
    `Suspended Sent - Concurrent` |
    `Suspended Sent - Consecutive` |
    `Suspended Sentence` |
    `Transferred to Crown Court` |
    `Unfit to Plead` |
    `Voluntary supervision` |
    `Warrant with Bail` |
    `Warrant without Bail` |
    `Withdrawn` |
    `Withdrawn` |
    `YOI (over 1 year)` |
    `YOI (up to 1 year)` |
    `Youth Custody (migration)` |
    `Youth Custody Concurrent` |
    `Youth Custody Consecutive` |
    `Youth Rehabilitation Order`

declare type PniParams = {

    s1_30: string,
    s6_1: number,
    s6_6: number,
    s6_11: string,
    s6_12: number,
    s7_3: number,
    s10_1: number,
    s11_11: number,
    s11_12: number,
    s11_3: number,
    s11_2: number,
    s11_4: number,
    s11_6: number,
    s12_1: number,
    s12_9: number,
    ogrs3RiskRecon: string,
    ovpRisk: string,
    ospDc: string,
    ospIic: string,
    rsrPercentageScore: number,
    community: boolean,
    saraRiskPartner: number,
    saraRiskOther: number,
}


declare type PniCalcResult = {
    sexDomainLevel: string,
    sexDomainScore: number,
    thinkingDomainLevel: string,
    thinkingDomainScore: number,
    relationshipDomainLevel: string,
    relationshipDomainScore: number,
    selfManagementDomainLevel: string,
    selfManagementDomainScore: number,
    totalDomainScore: number,
    overallNeedLevel: string,
    riskLevel: string,
    pniCalculation: string,
    missingFields: string[],
    partResult: string,
}