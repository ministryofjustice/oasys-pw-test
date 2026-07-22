declare type Environment = {
    url: string,
    name: string,
    database: {
        connection: string,
        user: string,
        password: string
    },
    rest: {
        clientId: string,
        clientSecret: string,
        baseUrl: string
    },
    iomStub: string,
    standardUserPassword: string,
    globalAdminUserPassword: string,
    ignoreOpdElogErrors: boolean,
}

declare type AppConfig = {

    probForceCrn: boolean,
    offences: { [key: string]: string },
    appVersions: { [key: string]: {} },
    currentVersion: string,
}

declare type SignificantAppVersions = '6.20' | '6.30' | '6.35' | '6.49' | '7.7'

declare type Log = { logText: string, type?: string }