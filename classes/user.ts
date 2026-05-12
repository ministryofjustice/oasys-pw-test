import { userSuffixes } from '../localSettings'

/**
 * The User class is used to define standard users for regression testing.
 * 
 */

export class User {

    username: string
    forename1: string
    surname: string
    lovLookup: string
    surnameForename: string
    forenameSurname: string
    profile?: { provider: string, frameworkRole: FrameworkRole, defaultCountersigner: User, roles: string[], psrSigningLevel?: PsrSigningLevel }

    constructor(
        userDetails: { username: string, forename1?: string, surname?: string },
        profile?: { provider: string, frameworkRole: FrameworkRole, defaultCountersigner: User, roles: string[], psrSigningLevel?: PsrSigningLevel }
    ) {

        const testProcess = Number.parseInt(process.env.TEST_PARALLEL_INDEX)
        const suffix = userSuffixes[testProcess]

        this.username = `${userDetails.username}${suffix}`
        this.forename1 = userDetails.forename1
        this.surname = `${userDetails.surname}${suffix}`
        this.lovLookup = `[${this.username}]`
        this.surnameForename = `${this.surname} ${this.forename1}`
        this.forenameSurname = `${this.forename1} ${this.surname}`
        this.profile = profile
    }

}

