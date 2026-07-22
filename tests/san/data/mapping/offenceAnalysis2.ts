export const script: SanScript = {
    section: 'Offence analysis',
    scenarios: [
        {
            name: '12 - ',
            steps: [
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `excessiveViolence,hatred,physicalDamage,sexualElement,victimTargeted,violence,weapon` },
                { item: 'victimTargetedDetails', value: `Victim targeted details` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `power,sexual,thrill,other,emotional` },
                { item: 'motivationOther', value: `Other motivation` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCDEF 400` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `1` },
                { item: 'saveAndContinue' },
                { item: 'leader', value: `yes` },
                { item: 'leaderYesDetails', value: `Leader yes details` },
                { item: 'impact', value: `yes` },
                { item: 'responsibility', value: `yes` },
                { item: 'responsibilityYesDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCDEF 400` },
                { item: 'patterns', value: `Patterns` },
                { item: 'escalation', value: `no` },
                { item: 'riskSeriousHarm', value: `yes` },
                { item: 'riskSeriousHarmYesDetails', value: `Risky` },
                { item: 'domesticAbusePerpertrator', value: `yes` },
                { item: 'domesticAbusePerpertratorType', value: `partner` },
                { item: 'partnerPerpetratorDetails', value: `Partner text` },
                { item: 'domesticAbuseVictim', value: `yes` },
                { item: 'domesticAbuseVictimType', value: `family` },
                { item: 'familyVictimDetails', value: `Family text` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: `YES` },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `YES` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `YES` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `YES` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.3', a: `DIRECTCONT,HATE,` },
                { section: '2', q: '2.6', a: `YES` },
                { section: '2', q: '2.7', a: `YES` },
                { section: '2', q: '2.7.1', a: `110` },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: `Yes - Leader yes details` },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `YES` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `YES` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `Other motivation` },
                { section: '2', q: '2.11', a: `YES` },
                { section: '2', q: '2.11.t', a: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCDEF 400` },
                { section: '2', q: '2.12', a: `Patterns` },
                { section: '2', q: '2.13', a: `NO` },
                { section: '2', q: '2.98', a: `Risky` },
                { section: '2', q: '2.99', a: `YES` },
                { section: '6', q: '6.7da', a: `YES` },
                { section: '6', q: '6.7.1.1da', a: `NO` },
                { section: '6', q: '6.7.1.2da', a: `YES` },
                { section: '6', q: '6.7.2.1da', a: `YES` },
                { section: '6', q: '6.7.2.2da', a: `NO` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: '13 - ',
            steps: [
                { item: 'back' },
                { item: 'back' },
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `hatred,physicalDamage,sexualElement,victimTargeted,violence,weapon` },
                { item: 'victimTargetedDetails', value: `Victim targeted details` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `sexual,thrill,other` },
                { item: 'motivationOther', value: `Other motivation` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `Victim details` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `2` },
                { item: 'saveAndContinue' },
                { item: 'leader', value: `no` },
                { item: 'leaderNoDetails', value: `Leader no details` },
                { item: 'impact', value: `no` },
                { item: 'responsibility', value: `no` },
                { item: 'responsibilityNoDetails', value: `Responsibility no details` },
                { item: 'patterns', value: `Patterns` },
                { item: 'escalation', value: `na` },
                { item: 'riskSeriousHarm', value: `yes` },
                { item: 'riskSeriousHarmYesDetails', value: `Risky` },
                { item: 'domesticAbusePerpertrator', value: `yes` },
                { item: 'domesticAbusePerpertratorType', value: `both` },
                { item: 'bothPerpetratorDetails', value: `Both text` },
                { item: 'domesticAbuseVictim', value: `yes` },
                { item: 'domesticAbuseVictimType', value: `partner` },
                { item: 'partnerVictimDetails', value: `Partner text` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: `YES` },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `YES` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `NO` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `YES` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.3', a: `DIRECTCONT,HATE,` },
                { section: '2', q: '2.6', a: `NO` },
                { section: '2', q: '2.7', a: `YES` },
                { section: '2', q: '2.7.1', a: `120` },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: `No - Leader no details` },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `NO` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `YES` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `Other motivation` },
                { section: '2', q: '2.11', a: `NO` },
                { section: '2', q: '2.11.t', a: `Responsibility no details` },
                { section: '2', q: '2.12', a: `Patterns` },
                { section: '2', q: '2.13', a: null },
                { section: '2', q: '2.98', a: `Risky` },
                { section: '2', q: '2.99', a: `YES` },
                { section: '6', q: '6.7da', a: `YES` },
                { section: '6', q: '6.7.1.1da', a: `YES` },
                { section: '6', q: '6.7.1.2da', a: `NO` },
                { section: '6', q: '6.7.2.1da', a: `YES` },
                { section: '6', q: '6.7.2.2da', a: `YES` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: '14 - ',
            steps: [
                { item: 'back' },
                { item: 'back' },
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `physicalDamage,sexualElement,victimTargeted,violence,weapon` },
                { item: 'victimTargetedDetails', value: `Victim targeted details` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `thrill,other` },
                { item: 'motivationOther', value: `Other motivation` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `Victim details` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `3` },
                { item: 'saveAndContinue' },
                { item: 'leader', value: `yes` },
                { item: 'leaderYesDetails', value: `Leader yes details` },
                { item: 'impact', value: `no` },
                { item: 'responsibility', value: `no` },
                { item: 'responsibilityNoDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'patterns', value: `Patterns` },
                { item: 'escalation', value: `yes` },
                { item: 'riskSeriousHarm', value: `yes` },
                { item: 'riskSeriousHarmYesDetails', value: `Risky` },
                { item: 'domesticAbusePerpertrator', value: `no` },
                { item: 'domesticAbuseVictim', value: `yes` },
                { item: 'domesticAbuseVictimType', value: `both` },
                { item: 'bothVictimDetails', value: `Both text` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: `YES` },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `YES` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `NO` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `YES` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.3', a: `DIRECTCONT,` },
                { section: '2', q: '2.6', a: `NO` },
                { section: '2', q: '2.7', a: `YES` },
                { section: '2', q: '2.7.1', a: `130` },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: `Yes - Leader yes details` },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `NO` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `YES` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `Other motivation` },
                { section: '2', q: '2.11', a: `NO` },
                { section: '2', q: '2.11.t', a: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.12', a: `Patterns` },
                { section: '2', q: '2.13', a: `YES` },
                { section: '2', q: '2.98', a: `Risky` },
                { section: '2', q: '2.99', a: `YES` },
                { section: '6', q: '6.7da', a: `YES` },
                { section: '6', q: '6.7.1.1da', a: `YES` },
                { section: '6', q: '6.7.1.2da', a: `YES` },
                { section: '6', q: '6.7.2.1da', a: `NO` },
                { section: '6', q: '6.7.2.2da', a: `NO` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: '15 - ',
            steps: [
                { item: 'back' },
                { item: 'back' },
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `sexualElement,victimTargeted,violence,weapon` },
                { item: 'victimTargetedDetails', value: `Victim targeted details` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `other` },
                { item: 'motivationOther', value: `Other motivation` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `Victim details` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `4` },
                { item: 'saveAndContinue' },
                { item: 'leader', value: `no` },
                { item: 'leaderNoDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'impact', value: `no` },
                { item: 'responsibility', value: `yes` },
                { item: 'responsibilityYesDetails', value: `Responsibility yes details` },
                { item: 'patterns', value: `Patterns` },
                { item: 'escalation', value: `no` },
                { item: 'riskSeriousHarm', value: `no` },
                { item: 'riskSeriousHarmNoDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'domesticAbusePerpertrator', value: `no` },
                { item: 'domesticAbuseVictim', value: `no` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: `YES` },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `YES` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `NO` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `NO` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.3', a: `DIRECTCONT,` },
                { section: '2', q: '2.6', a: `NO` },
                { section: '2', q: '2.7', a: `YES` },
                { section: '2', q: '2.7.1', a: `140` },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: `No - ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `NO` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `NO` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `Other motivation` },
                { section: '2', q: '2.11', a: `YES` },
                { section: '2', q: '2.11.t', a: `Responsibility yes details` },
                { section: '2', q: '2.12', a: `Patterns` },
                { section: '2', q: '2.13', a: `NO` },
                { section: '2', q: '2.98', a: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.99', a: `NO` },
                { section: '6', q: '6.7da', a: `NO` },
                { section: '6', q: '6.7.1.1da', a: `NO` },
                { section: '6', q: '6.7.1.2da', a: `NO` },
                { section: '6', q: '6.7.2.1da', a: `NO` },
                { section: '6', q: '6.7.2.2da', a: `NO` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: '16 - ',
            steps: [
                { item: 'back' },
                { item: 'back' },
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `victimTargeted,violence,weapon` },
                { item: 'victimTargetedDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCDEF 400` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `other` },
                { item: 'motivationOther', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD 128` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `Victim details` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `5` },
                { item: 'saveAndContinue' },
                { item: 'leader', value: `yes` },
                { item: 'leaderYesDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'impact', value: `no` },
                { item: 'responsibility', value: `yes` },
                { item: 'responsibilityYesDetails', value: `Responsibility yes details` },
                { item: 'patterns', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'escalation', value: `na` },
                { item: 'riskSeriousHarm', value: `no` },
                { item: 'riskSeriousHarmNoDetails', value: `Not risky` },
                { item: 'domesticAbusePerpertrator', value: `no` },
                { item: 'domesticAbuseVictim', value: `no` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: null },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `YES` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `NO` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `NO` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.3', a: `DIRECTCONT,` },
                { section: '2', q: '2.6', a: `NO` },
                { section: '2', q: '2.7', a: `YES` },
                { section: '2', q: '2.7.1', a: `150` },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: `Yes - ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `NO` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `NO` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD 128` },
                { section: '2', q: '2.11', a: `YES` },
                { section: '2', q: '2.11.t', a: `Responsibility yes details` },
                { section: '2', q: '2.12', a: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.13', a: null },
                { section: '2', q: '2.98', a: `Not risky` },
                { section: '2', q: '2.99', a: `NO` },
                { section: '6', q: '6.7da', a: `NO` },
                { section: '6', q: '6.7.1.1da', a: `NO` },
                { section: '6', q: '6.7.1.2da', a: `NO` },
                { section: '6', q: '6.7.2.1da', a: `NO` },
                { section: '6', q: '6.7.2.2da', a: `NO` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: '17 - ',
            steps: [
                { item: 'back' },
                { item: 'back' },
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `violence,weapon` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `other` },
                { item: 'motivationOther', value: `Some reason` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `Victim details` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `6to10` },
                { item: 'saveAndContinue' },
                { item: 'leader', value: `no` },
                { item: 'leaderNoDetails', value: `Leader no details` },
                { item: 'impact', value: `yes` },
                { item: 'responsibility', value: `no` },
                { item: 'responsibilityNoDetails', value: `Responsibility no details` },
                { item: 'patterns', value: `Patterns` },
                { item: 'escalation', value: `yes` },
                { item: 'riskSeriousHarm', value: `no` },
                { item: 'riskSeriousHarmNoDetails', value: `Not risky` },
                { item: 'domesticAbusePerpertrator', value: `yes` },
                { item: 'domesticAbusePerpertratorType', value: `family` },
                { item: 'familyPerpetratorDetails', value: `Family text` },
                { item: 'domesticAbuseVictim', value: `no` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: null },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `YES` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `NO` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `NO` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.3', a: null },
                { section: '2', q: '2.6', a: `YES` },
                { section: '2', q: '2.7', a: `YES` },
                { section: '2', q: '2.7.1', a: `160` },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: `No - Leader no details` },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `NO` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `NO` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `Some reason` },
                { section: '2', q: '2.11', a: `NO` },
                { section: '2', q: '2.11.t', a: `Responsibility no details` },
                { section: '2', q: '2.12', a: `Patterns` },
                { section: '2', q: '2.13', a: `YES` },
                { section: '2', q: '2.98', a: `Not risky` },
                { section: '2', q: '2.99', a: `NO` },
                { section: '6', q: '6.7da', a: `YES` },
                { section: '6', q: '6.7.1.1da', a: `NO` },
                { section: '6', q: '6.7.1.2da', a: `NO` },
                { section: '6', q: '6.7.2.1da', a: `NO` },
                { section: '6', q: '6.7.2.2da', a: `YES` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: '18 - ',
            steps: [
                { item: 'back' },
                { item: 'back' },
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `weapon` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `other` },
                { item: 'motivationOther', value: `Some reason` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `Victim details` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `11to15` },
                { item: 'saveAndContinue' },
                { item: 'leader', value: `yes` },
                { item: 'leaderYesDetails', value: `Leader yes details` },
                { item: 'impact', value: `yes` },
                { item: 'responsibility', value: `no` },
                { item: 'responsibilityNoDetails', value: `Responsibility no details` },
                { item: 'patterns', value: `Patterns` },
                { item: 'escalation', value: `no` },
                { item: 'riskSeriousHarm', value: `no` },
                { item: 'riskSeriousHarmNoDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'domesticAbusePerpertrator', value: `yes` },
                { item: 'domesticAbusePerpertratorType', value: `partner` },
                { item: 'partnerPerpetratorDetails', value: `Partner text` },
                { item: 'domesticAbuseVictim', value: `no` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: null },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `NO` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `NO` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `NO` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.3', a: null },
                { section: '2', q: '2.6', a: `YES` },
                { section: '2', q: '2.7', a: `YES` },
                { section: '2', q: '2.7.1', a: `170` },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: `Yes - Leader yes details` },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `NO` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `NO` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `Some reason` },
                { section: '2', q: '2.11', a: `NO` },
                { section: '2', q: '2.11.t', a: `Responsibility no details` },
                { section: '2', q: '2.12', a: `Patterns` },
                { section: '2', q: '2.13', a: `NO` },
                { section: '2', q: '2.98', a: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.99', a: `NO` },
                { section: '6', q: '6.7da', a: `YES` },
                { section: '6', q: '6.7.1.1da', a: `NO` },
                { section: '6', q: '6.7.1.2da', a: `NO` },
                { section: '6', q: '6.7.2.1da', a: `YES` },
                { section: '6', q: '6.7.2.2da', a: `NO` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: '19 - ',
            steps: [
                { item: 'back' },
                { item: 'back' },
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `weapon` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `other` },
                { item: 'motivationOther', value: `Some reason` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `Victim details` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `0` },
                { item: 'saveAndContinue' },
                { item: 'impact', value: `yes` },
                { item: 'responsibility', value: `yes` },
                { item: 'responsibilityYesDetails', value: `Responsibility yes details` },
                { item: 'patterns', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'escalation', value: `na` },
                { item: 'riskSeriousHarm', value: `yes` },
                { item: 'riskSeriousHarmYesDetails', value: `Risky` },
                { item: 'domesticAbusePerpertrator', value: `yes` },
                { item: 'domesticAbusePerpertratorType', value: `both` },
                { item: 'bothPerpetratorDetails', value: `Both text` },
                { item: 'domesticAbuseVictim', value: `yes` },
                { item: 'domesticAbuseVictimType', value: `both` },
                { item: 'bothVictimDetails', value: `Both text` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: null },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `NO` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `NO` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `NO` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.3', a: null },
                { section: '2', q: '2.6', a: `YES` },
                { section: '2', q: '2.7', a: `NO` },
                { section: '2', q: '2.7.1', a: null },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: null },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `NO` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `NO` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `Some reason` },
                { section: '2', q: '2.11', a: `YES` },
                { section: '2', q: '2.11.t', a: `Responsibility yes details` },
                { section: '2', q: '2.12', a: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.13', a: null },
                { section: '2', q: '2.98', a: `Risky` },
                { section: '2', q: '2.99', a: `YES` },
                { section: '6', q: '6.7da', a: `YES` },
                { section: '6', q: '6.7.1.1da', a: `YES` },
                { section: '6', q: '6.7.1.2da', a: `YES` },
                { section: '6', q: '6.7.2.1da', a: `YES` },
                { section: '6', q: '6.7.2.2da', a: `YES` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: '20 - ',
            steps: [
                { item: 'back' },
                { item: 'back' },
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `excessiveViolence,hatred,physicalDamage,sexualElement,victimTargeted,violence,weapon` },
                { item: 'victimTargetedDetails', value: `Victim targeted details` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `power,sexual,thrill,other` },
                { item: 'motivationOther', value: `Other motivation` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCDEF 400` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `1` },
                { item: 'saveAndContinue' },
                { item: 'leader', value: `yes` },
                { item: 'leaderYesDetails', value: `Leader yes details` },
                { item: 'impact', value: `yes` },
                { item: 'responsibility', value: `yes` },
                { item: 'responsibilityYesDetails', value: `Responsibility yes details` },
                { item: 'patterns', value: `Patterns` },
                { item: 'escalation', value: `yes` },
                { item: 'riskSeriousHarm', value: `yes` },
                { item: 'riskSeriousHarmYesDetails', value: `Risky` },
                { item: 'domesticAbusePerpertrator', value: `no` },
                { item: 'domesticAbuseVictim', value: `yes` },
                { item: 'domesticAbuseVictimType', value: `family` },
                { item: 'familyVictimDetails', value: `Family text` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: `YES` },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `YES` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `YES` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `YES` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.3', a: `DIRECTCONT,HATE,` },
                { section: '2', q: '2.6', a: `YES` },
                { section: '2', q: '2.7', a: `YES` },
                { section: '2', q: '2.7.1', a: `110` },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: `Yes - Leader yes details` },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `NO` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `YES` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `Other motivation` },
                { section: '2', q: '2.11', a: `YES` },
                { section: '2', q: '2.11.t', a: `Responsibility yes details` },
                { section: '2', q: '2.12', a: `Patterns` },
                { section: '2', q: '2.13', a: `YES` },
                { section: '2', q: '2.98', a: `Risky` },
                { section: '2', q: '2.99', a: `YES` },
                { section: '6', q: '6.7da', a: `YES` },
                { section: '6', q: '6.7.1.1da', a: `NO` },
                { section: '6', q: '6.7.1.2da', a: `YES` },
                { section: '6', q: '6.7.2.1da', a: `NO` },
                { section: '6', q: '6.7.2.2da', a: `NO` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: '21 - ',
            steps: [
                { item: 'back' },
                { item: 'back' },
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `hatred,physicalDamage,sexualElement,victimTargeted,violence,weapon` },
                { item: 'victimTargetedDetails', value: `Victim targeted details` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `sexual,thrill,other` },
                { item: 'motivationOther', value: `Other motivation` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `Victim details` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `2` },
                { item: 'saveAndContinue' },
                { item: 'leader', value: `no` },
                { item: 'leaderNoDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'impact', value: `no` },
                { item: 'responsibility', value: `no` },
                { item: 'responsibilityNoDetails', value: `Responsibility no details` },
                { item: 'patterns', value: `Patterns` },
                { item: 'escalation', value: `no` },
                { item: 'riskSeriousHarm', value: `yes` },
                { item: 'riskSeriousHarmYesDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'domesticAbusePerpertrator', value: `no` },
                { item: 'domesticAbuseVictim', value: `yes` },
                { item: 'domesticAbuseVictimType', value: `partner` },
                { item: 'partnerVictimDetails', value: `Partner text` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: `YES` },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `YES` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `NO` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `YES` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.3', a: `DIRECTCONT,HATE,` },
                { section: '2', q: '2.6', a: `NO` },
                { section: '2', q: '2.7', a: `YES` },
                { section: '2', q: '2.7.1', a: `120` },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: `No - ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `NO` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `YES` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `Other motivation` },
                { section: '2', q: '2.11', a: `NO` },
                { section: '2', q: '2.11.t', a: `Responsibility no details` },
                { section: '2', q: '2.12', a: `Patterns` },
                { section: '2', q: '2.13', a: `NO` },
                { section: '2', q: '2.98', a: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.99', a: `YES` },
                { section: '6', q: '6.7da', a: `YES` },
                { section: '6', q: '6.7.1.1da', a: `YES` },
                { section: '6', q: '6.7.1.2da', a: `NO` },
                { section: '6', q: '6.7.2.1da', a: `NO` },
                { section: '6', q: '6.7.2.2da', a: `NO` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
        {
            name: '22 - ',
            steps: [
                { item: 'back' },
                { item: 'back' },
                { item: 'offenceDescription', value: `Offence description` },
                { item: 'offenceElements', value: `physicalDamage,sexualElement,victimTargeted,violence,weapon` },
                { item: 'victimTargetedDetails', value: `Victim targeted details` },
                { item: 'reason', value: `Why it happened` },
                { item: 'motivations', value: `thrill,other` },
                { item: 'motivationOther', value: `Other motivation` },
                { item: 'victimType', value: `other` },
                { item: 'victimTypeDetails', value: `Victim details` },
                { item: 'saveAndContinue' },
                { item: 'howManyOthers', value: `3` },
                { item: 'saveAndContinue' },
                { item: 'leader', value: `yes` },
                { item: 'leaderYesDetails', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'impact', value: `no` },
                { item: 'responsibility', value: `no` },
                { item: 'responsibilityNoDetails', value: `Responsibility no details` },
                { item: 'patterns', value: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { item: 'escalation', value: `na` },
                { item: 'riskSeriousHarm', value: `yes` },
                { item: 'riskSeriousHarmYesDetails', value: `Risky` },
                { item: 'domesticAbusePerpertrator', value: `no` },
                { item: 'domesticAbuseVictim', value: `yes` },
                { item: 'domesticAbuseVictimType', value: `both` },
                { item: 'bothVictimDetails', value: `Both text` },
                { item: 'markAsComplete' },
            ],
            oasysAnswers: [
                { section: '1', q: '1.30', a: `YES` },
                { section: '2', q: '2.1', a: `Offence description` },
                { section: '2', q: '2.2_V2_WEAPON', a: `YES` },
                { section: '2', q: '2.2_V2_ANYVIOL', a: `YES` },
                { section: '2', q: '2.2_V2_ARSON', a: `NO` },
                { section: '2', q: '2.2_V2_DOM_ABUSE', a: `NO` },
                { section: '2', q: '2.2_V2_EXCESSIVE', a: `NO` },
                { section: '2', q: '2.2_V2_PHYSICALDAM', a: `YES` },
                { section: '2', q: '2.2_V2_SEXUAL', a: `YES` },
                { section: '2', q: '2.3', a: `DIRECTCONT,` },
                { section: '2', q: '2.6', a: `NO` },
                { section: '2', q: '2.7', a: `YES` },
                { section: '2', q: '2.7.1', a: `130` },
                { section: '2', q: '2.7.2', a: `NO` },
                { section: '2', q: '2.7.3', a: `Yes - ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.8', a: `Why it happened` },
                { section: '2', q: '2.9_V2_SEXUAL', a: `NO` },
                { section: '2', q: '2.9_V2_FINANCIAL', a: `NO` },
                { section: '2', q: '2.9_V2_ADDICTION', a: `NO` },
                { section: '2', q: '2.9_V2_EMOTIONAL', a: `NO` },
                { section: '2', q: '2.9_V2_RACIAL', a: `NO` },
                { section: '2', q: '2.9_V2_THRILL', a: `YES` },
                { section: '2', q: '2.9_V2_OTHER', a: `YES` },
                { section: '2', q: '2.9.t_V2', a: `Other motivation` },
                { section: '2', q: '2.11', a: `NO` },
                { section: '2', q: '2.11.t', a: `Responsibility no details` },
                { section: '2', q: '2.12', a: `ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......ABCD efg10ABCD efg20ABCD efg30ABCD efg40ABCD efg50ABCD efg60ABCD efg70ABCD efg80ABCD efg90ABCD ef100ABCD ef110ABCD ef120ABCD ef130ABCD ef140ABCD ef150ABCD ef160ABCD ef170ABCD ef180ABCD ef190ABCD ef200ABCD ef210ABCD ef220ABCD ef230ABCD ef240ABCD ef250ABCD ef260ABCD ef270ABCD ef280ABCD ef290ABCD ef300ABCD ef310ABCD ef320ABCD ef330ABCD ef340ABCD ef350ABCD ef360ABCD ef370ABCD ef380ABCD ef390ABCD ef400
ABCD ef412ABCD ef422ABCD ef432ABCD ef442ABCD ef452ABCD ef462ABCD ef472ABCD ef482ABCD ef492ABCD ef502ABCD ef512ABCD ef522ABCD ef532ABCD ef542ABCD ef552ABCD ef562ABCD ef572ABCD ef582ABCD ef592ABCD ef602ABCD ef612ABCD ef622ABCD ef632ABCD ef642ABCD ef652ABCD ef662ABCD ef672ABCD ef682ABCD ef692ABCD ef702ABCD ef712ABCD ef722ABCD ef732ABCD ef742ABCD ef752ABCD ef762ABCD ef772ABCD ef782ABCD ef792ABCD ef802
ABCD ef814ABCD ef824ABCD ef834ABCD ef844ABCD ef854ABCD ef864ABCD ef874ABCD ef884ABCD ef894ABCD ef904ABCD ef914ABCD ef924ABCD ef934ABCD ef944ABCD ef954ABCD ef964ABCD ef974ABCD ef984ABCD ef994......` },
                { section: '2', q: '2.13', a: null },
                { section: '2', q: '2.98', a: `Risky` },
                { section: '2', q: '2.99', a: `YES` },
                { section: '6', q: '6.7da', a: `YES` },
                { section: '6', q: '6.7.1.1da', a: `YES` },
                { section: '6', q: '6.7.1.2da', a: `YES` },
                { section: '6', q: '6.7.2.1da', a: `NO` },
                { section: '6', q: '6.7.2.2da', a: `NO` },
                { section: 'SAN', q: 'OA_SAN_SECTION_COMP', a: `YES` },
            ],
        },
    ]
}

