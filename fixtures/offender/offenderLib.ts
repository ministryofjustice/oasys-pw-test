export const probation: { [keys: string]: OffenderDef } = {

    burglary: {
        forename1: 'Autotest',
        gender: 'Male',
        dateOfBirth: { years: -25 },

        event: {
            eventDetails: {
                sentenceType: 'Fine',
                sentenceDate: { months: -6 },
            },
            offences:
            {
                offence: '028',
                subcode: '01',
            },
        },
    },

    sexual: {
        forename1: 'Autotest',
        gender: 'Male',
        dateOfBirth: { years: -25 },

        event: {
            eventDetails: {
                sentenceType: 'Fine',
                sentenceDate: { months: -6 },
            },
            offences:
            {
                offence: '019',
                subcode: '08',
            },
        },
    },

    twoOffences: {
        forename1: 'Autotest',
        gender: 'Male',
        dateOfBirth: { years: -20 },

        event: {
            eventDetails: {
                sentenceType: 'Fine',
                sentenceDate: { months: -6 },
            },
            offences: [
                {
                    offence: '028',
                    subcode: '01',
                },
                {
                    offence: '020',
                    subcode: '00',
                    additionalOffence: true,
                },
            ],
        },
    },

    noEvent: {
        forename1: 'Autotest',
        gender: 'Male',
        dateOfBirth: { years: -40 },
    },
}

export const prison: { [keys: string]: OffenderDef } = {

    burglary: {
        forename1: 'Autotest',
        gender: 'Male',
        dateOfBirth: { years: -25 },

        event: {
            eventDetails: {
                sentenceType: 'Custody (1 to 4 yrs - ACR)',
                sentenceDate: { months: -6 },
                sentenceMonths: 24,
            },
            offences:
            {
                offence: '028',
                subcode: '01',
            },
        },
    },

    sexual: {
        forename1: 'Autotest',
        gender: 'Male',
        dateOfBirth: { years: -25 },

        event: {
            eventDetails: {
                sentenceType: 'Custody (1 to 4 yrs - ACR)',
                sentenceDate: { months: -6 },
                sentenceMonths: 24,
            },
            offences:
            {
                offence: '019',
                subcode: '08',
            },
        },
    },

    twoOffences: {
        forename1: 'Autotest',
        gender: 'Male',
        dateOfBirth: { years: -20 },

        event: {
            eventDetails: {
                sentenceType: 'Custody (1 to 4 yrs - ACR)',
                sentenceDate: { months: -6 },
                sentenceMonths: 24,
            },
            offences: [
                {
                    offence: '028',
                    subcode: '01',
                },
                {
                    offence: '030',
                    subcode: '01',
                    additionalOffence: true,
                },
            ],
        },
    },

    noEvent: {
        forename1: 'Autotest',
        gender: 'Male',
        dateOfBirth: { years: -40 },
    },
}

