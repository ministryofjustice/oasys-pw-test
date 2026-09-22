declare type ReportMode = 'verbose' | 'normal' | 'minimal' | 'none'

declare type Tier = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'M'
declare type ScoreType = 'serious_violence_brief' | 'serious_violence_extended' | 'general_brief' | 'violence_brief' | 'general_extended' | 'violence_extended' | 'osp_c' | 'osp_i' | 'rsr'
declare type ScoreBand = 'Low' | 'Medium' | 'High' | 'Very High' | 'N/A'
declare type OgrsRecalcResult = { arpScore: boolean, arpBand: boolean, vrpScore: boolean, vrpBand: boolean, svrpScore: boolean, svrpBand: boolean, tier: boolean} 
