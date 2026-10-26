export class ConnectCalcResult {

    sexDomainLevel: DomainResult
    sexDomainScore: number
    thinkingDomainLevel: DomainResult
    thinkingDomainScore: number
    relationshipDomainLevel: DomainResult
    relationshipDomainScore: number
    selfManagementDomainLevel: DomainResult
    selfManagementDomainScore: number
    totalDomainScore: number
    overallNeedLevel: string
    connectResult: ConnectResult
    missingFields: string

    loadOracleOutputValues(values: string[]) {

        let i = 0

        this.sexDomainLevel = values[i++] as DomainResult
        this.sexDomainScore = Number.parseInt(values[i++])
        this.thinkingDomainLevel = values[i++] as DomainResult
        this.thinkingDomainScore = Number.parseInt(values[i++])
        this.relationshipDomainLevel = values[i++] as DomainResult
        this.relationshipDomainScore = Number.parseInt(values[i++])
        this.selfManagementDomainLevel = values[i++] as DomainResult
        this.selfManagementDomainScore = Number.parseInt(values[i++])
        this.totalDomainScore = Number.parseInt(values[i++])
        this.overallNeedLevel = values[i++]
        this.connectResult = values[i++] as ConnectResult
        this.missingFields = values[i++]
    }

}
