import { readSheet } from 'read-excel-file/node'

import { test, Oasys, Assessment, Sections, Risk, Offender, SentencePlan } from 'fixtures'
import { noDatabaseConnection, passwordLookup } from 'localSettings'


const filename = 'tests/supervisionPackages/data/OGRS4 test inputs.xlsx'
const crnSheetName = 'CRNs'
const maleWorksheetName = 'Male'
const femaleWorksheetName = 'Female'
const questionCol = 1
const typeCol = 3
const firstScenarioCol = 9
const lastScenarioCol = 23
const firstQuestionRow = 2
const lastQuestionRow = 56


type Scenario = 'Missing' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'A prov' | 'B prov' | 'C prov' | 'D prov' | 'E prov' | 'F prov' | 'G prov'
type TestData = { page: string, data: PageData }[]
type ScenarioTestData = { name: Scenario, testData: TestData }[]

test('Create assessments', async ({ oasysDb, oasys, user, offender, assessment, sections, risk, ogrs, sentencePlan }) => {

    test.setTimeout(0)

    // Get CRNs with test scenarios
    const crnData = (await readSheet(filename, crnSheetName)) as string[][]

    // Get scenario details for male and female offenders
    const maleData = (await readSheet(filename, maleWorksheetName)) as string[][]
    const femaleData = (await readSheet(filename, femaleWorksheetName)) as string[][]
    const standaloneScenariosMale = getTestData(maleData, 'standalone')
    const roshaScenariosMale = getTestData(maleData, 'rosha')
    const layer1ScenariosMale = getTestData(maleData, 'layer1')
    const layer3ScenariosMale = getTestData(maleData, 'layer3')
    const standaloneScenariosFemale = getTestData(femaleData, 'standalone')
    const roshaScenariosFemale = getTestData(femaleData, 'rosha')
    const layer1ScenariosFemale = getTestData(femaleData, 'layer1')
    const layer3ScenariosFemale = getTestData(femaleData, 'layer3')


    for (let i = 1; i < crnData.length; i++) {

        const probationCrn = crnData[i][0]
        const assessmentType = crnData[i][1]
        const scenarioName = crnData[i][2]
        const userName = crnData[i][3]

        if (probationCrn && assessmentType && scenarioName && userName) {

            // Find offender
            await user.adhocLogin(userName, passwordLookup[userName].password, passwordLookup[userName].provider)
            await offender.searchAndSelectByCrn(probationCrn)
            const male = (await offender.offenderDetails.gender.getValue()) == 'Male'

            // Lock incomplete if there is a WIP assessment
            if (assessmentType != 'standalone') {
                const wip = await assessment.assessmentsTab.assessments.lockAssessment.getValues()
                if (wip.includes('Lock Incomplete')) {
                    await assessment.lockIncomplete()
                }
            }

            // Create and populate the assessment and/or standalone CSRP
            let pk: number
            switch (assessmentType) {
                case 'standalone':
                    pk = await standaloneCsrp(male ? standaloneScenariosMale : standaloneScenariosFemale, scenarioName, probationCrn, offender)
                    break
                case 'rosha':
                    pk = await roshaAssessment(male ? roshaScenariosMale : roshaScenariosFemale, scenarioName, oasys, assessment, sections, risk)
                    break
                case 'layer1':
                    pk = await layer1Assessment(male ? layer1ScenariosMale : layer1ScenariosFemale, scenarioName, oasys, assessment, sections, risk)
                    break
                case 'layer3':
                    pk = await layer3Assessment(male ? layer3ScenariosMale : layer3ScenariosFemale, scenarioName, oasys, assessment, sections, risk, sentencePlan)
                    break
            }

            if (!noDatabaseConnection) {
                // Get the calculated predictor values and calculate the tier, write details to the log file
                const scoreQuery = assessmentType == 'standalone'
                    ? `select ogp2_calculated, ogrs4g_percentage_2yr, ogp2_percentage_2yr, rsr_static_or_dynamic, rsr_percentage_score from eor.offender_rsr_scores where offender_rsr_scores_pk = ${pk}`
                    : `select ogp2_calculated, ogrs4g_percentage_2yr, ogp2_percentage_2yr, rsr_static_or_dynamic, rsr_percentage_score from eor.oasys_set where oasys_set_pk = ${pk}`
                const scoreData = await oasysDb.getData(scoreQuery)
                const arp = utils.stringToFloat(scoreData[0][0] == 'Y' ? scoreData[0][2] : scoreData[0][1])
                const arpDynamic = arp ? scoreData[0][0] == 'Y' : null
                const csrp = utils.stringToFloat(scoreData[0][4])
                const csrpDynamic = csrp ? scoreData[0][3] == 'DYNAMIC' : null
                log(`arpDynamic: ${arpDynamic}, arp: ${arp}, csrpDynamic: ${csrpDynamic}, csrp: ${csrp}`)
                const predictorTier = ogrs.tiering.calculateArpCsrp(arp, csrp)
                const provisional = predictorTier ? !arpDynamic || !csrpDynamic : null
                log(`Tier: ${predictorTier}, provisional: ${provisional}`)
                fileLog(`${probationCrn}\t${assessmentType}\t${scenarioName}\t${arp}\t${arpDynamic}\t${csrp}\t${csrpDynamic}\t${predictorTier}\t${provisional}`, 'tierResults.csv')
            }

            await user.logout()
        }
    }
})


function getTestData(data: string[][], assessmentType: 'standalone' | 'rosha' | 'layer1' | 'layer3'): ScenarioTestData {

    const result: ScenarioTestData = []
    // const pages = data.map((row) => row[0]).filter(utils.onlyUnique).filter((value, index, array) => ![null, 'Page'].includes(array[index]))

    const pages = assessmentType == 'standalone' ? standalonePages : assessmentType == 'rosha' ? roshaPages : assessmentType == 'layer1' ? layer1Pages : layer3Pages

    for (let scenarioCol = firstScenarioCol - 1; scenarioCol < lastScenarioCol; scenarioCol++) {

        const scenarioName = data[0][scenarioCol] as Scenario
        const testData: TestData = []

        for (const page of pages) {

            const pageData: PageData = {}

            for (let row = firstQuestionRow - 1; row < lastQuestionRow; row++) {

                const questionName = data[row][questionCol - 1]
                const questionPage = assessmentType == 'standalone' ? 'standaloneCsrp' : questionLookup[questionName].pages[assessmentType]

                if (questionPage == page) {
                    const q = questionLookup[questionName].q
                    const a = data[row][scenarioCol]

                    // Special handling for 6.7 to deal with parent question
                    if (questionName == '6.7.2.1da') {
                        if (a == 'Yes') {
                            pageData['o6_7'] = 'Yes'
                            pageData['o6_7VictimPartner'] = 'No'
                            pageData['o6_7VictimFamily'] = 'No'
                            pageData['o6_7PerpetratorPartner'] = 'Yes'
                            pageData['o6_7PerpetratorFamily'] = 'No'
                        } else if (a == 'No') {
                            pageData['o6_7'] = 'No'
                        }
                    } else if (a != null) {
                        switch (data[row][typeCol - 1]) {
                            case 'String':
                            case 'Yes/No':
                                // handle some questions that have different formatting for the answers in layer 3
                                if (assessmentType == 'layer3' && q == 'o4_2') {
                                    pageData[q] = a.replace('-', ' - ')
                                } else if (assessmentType == 'layer3' && q == 'o6_8') {
                                    pageData[q] = a.replace(',', '')
                                } else {
                                    pageData[q] = a
                                }
                                break
                            case 'Month offset':
                                pageData[q] = oasysDateTime.oasysDateAsString({ months: utils.stringToInt(a) })
                                break
                            case 'Number':
                                pageData[q] = utils.stringToInt(a)
                                break
                        }
                        // Add weapon text if 2.2 is Yes
                        if (q == 'o2_2Weapon' && a == 'Yes') {
                            pageData['o2_2SpecifyWeapon'] = 'Weapon text'
                        }
                    }
                }
            }

            testData.push({ page: page, data: pageData })
        }
        result.push({ name: scenarioName, testData: testData })
    }
    return result
}

async function standaloneCsrp(scenarioData: ScenarioTestData, scenarioName: string, probationCrn: string, offender: Offender): Promise<number> {

    const testData = scenarioData.find((s) => s.name == scenarioName).testData

    await offender.standaloneCsrp.goto()

    const dateFirstSanctionStatus = await offender.standaloneCsrp.dateFirstSanction.getStatusAndValue()
    if (dateFirstSanctionStatus.status != 'enabled') {  // Cloned through, won't be changed
        delete testData[0].data['dateFirstSanction']
    }

    await offender.standaloneCsrp.o1_39.setValue('Yes')
    await offender.standaloneCsrp.setValues(testData[0].data)
    await offender.standaloneCsrp.calculateScores.click()

    const pk = await offender.queries.getLatestStandaloneCsrpPk(probationCrn)
    return pk
}

async function roshaAssessment(scenarioData: ScenarioTestData, scenarioName: string, oasys: Oasys, assessment: Assessment, sections: Sections, risk: Risk): Promise<number> {

    const pk = await assessment.createProb({ purposeOfAssessment: 'Risk of Harm Assessment' })

    // Complete minimal assessment to allow sign and lock
    await risk.screeningNoRisks()

    const testData = scenarioData.find((s) => s.name == scenarioName).testData

    for (const page of testData) {

        switch (page.page) {
            case 'predictors':
                await sections.roshaPredictors.goto()
                const dateFirstSanctionStatus = await sections.roshaPredictors.dateFirstSanction.getStatusAndValue()
                if (dateFirstSanctionStatus.status != 'enabled') {  // Cloned through, won't be changed
                    delete page.data['dateFirstSanction']
                }

                await sections.roshaPredictors.o1_39.setValue('Yes')
                await sections.roshaPredictors.setValues(page.data)
                break
            case 'roshScreening':
                await risk.screeningSection1.goto()
                await risk.screeningSection1.setValues(page.data)
                break
            default:
                throw (`Page name error: ${page.page}`)
        }
    }
    await oasys.clickButton('Save')
    return pk
}

async function layer1Assessment(scenarioData: ScenarioTestData, scenarioName: string, oasys: Oasys, assessment: Assessment, sections: Sections, risk: Risk): Promise<number> {

    const pk = await assessment.createProb({ purposeOfAssessment: 'Standalone Unpaid Work', assessmentLayer: 'Basic (Layer 1)' })

    // Complete minimal assessment to allow sign and lock
    await sections.offendingInformation.populateMinimal()
    await sections.layer1Section2.populateMinimal()
    await sections.selfAssessmentForm.populateMinimal()
    await risk.screeningNoRisks()

    const testData = scenarioData.find((s) => s.name == scenarioName).testData

    for (const page of testData) {

        switch (page.page) {
            case 'offendingInformation':
                await sections.offendingInformation.goto()
                await sections.offendingInformation.setValues(page.data)
                break
            case 'predictors':
                await sections.predictors.goto()
                const dateFirstSanctionStatus = await sections.predictors.dateFirstSanction.getStatusAndValue()
                if (dateFirstSanctionStatus.status != 'enabled') {  // Cloned through, won't be changed
                    delete page.data['dateFirstSanction']
                }
                await sections.predictors.setValues(page.data)
                break
            case 'offenceAnalysis':
                await sections.layer1Section2.goto()
                await sections.layer1Section2.setValues(page.data)
                break
            case 'predictorQuestions':
                await sections.predictorQuestions.goto()
                await sections.predictorQuestions.setValues(page.data)
                break
            case 'roshScreening':
                await risk.screeningSection1.goto()
                await risk.screeningSection1.setValues(page.data)
                break
            default:
                throw (`Page name error: ${page.page}`)
        }
    }
    await oasys.clickButton('Save')
    return pk
}

async function layer3Assessment(scenarioData: ScenarioTestData, scenarioName: string, oasys: Oasys, assessment: Assessment, sections: Sections, risk: Risk, sentencePlan: SentencePlan): Promise<number> {

    // Create layer 3 assessment, ensure non-SAN if that option is presented
    await assessment.getToCreateAssessmentPage(true)

    await assessment.createAssessmentPage.setValues({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' }, true)
    const san = await assessment.createAssessmentPage.includeSanSections.getStatusAndValue()
    if (san.status == 'enabled') {
        await assessment.createAssessmentPage.includeSanSections.setValue('No')
    }
    await assessment.createAssessmentPage.create.click()

    let pk = 0

    if (!noDatabaseConnection) {
        const pnc = await assessment.baseAssessmentPage.getPncFromScreenContext()
        pk = await assessment.getLatestSetPkByPnc(pnc)
    }

    log(`Created assessment PK ${pk}: ${JSON.stringify({ purposeOfAssessment: 'Start of Community Order', assessmentLayer: 'Full (Layer 3)' })}`, 'Assessment')

    // Complete minimal assessment to allow sign and lock
    await sections.offendingInformation.populateMinimal()
    await sections.sections2To13NoIssues()
    await sections.selfAssessmentForm.populateMinimal()
    await risk.screeningNoRisks()
    const sentencePlanComplete = await sentencePlan.sentencePlanService.getCompletionStatus()
    if (!sentencePlanComplete) {
        await sentencePlan.populateMinimal()
    }

    const testData = scenarioData.find((s) => s.name == scenarioName).testData

    for (const page of testData) {

        switch (page.page) {
            case 'offendingInformation':
                await sections.offendingInformation.goto()
                await sections.offendingInformation.setValues(page.data)
                break
            case 'predictors':
                await sections.predictors.goto()
                const dateFirstSanctionStatus = await sections.predictors.dateFirstSanction.getStatusAndValue()
                if (dateFirstSanctionStatus.status != 'enabled') {  // Cloned through, won't be changed
                    delete page.data['dateFirstSanction']
                }
                await sections.predictors.setValues(page.data)
                break
            case 'section2':
                await sections.section2.goto()
                await sections.section2.setValues(page.data)
                break
            case 'section3':
                await sections.section3.goto()
                await sections.section3.setValues(page.data)
                break
            case 'section4':
                await sections.section4.goto()
                await sections.section4.setValues(page.data)
                break
            case 'section6':
                await sections.section6.goto()
                await sections.section6.setValues(page.data)
                break
            case 'section7':
                await sections.section7.goto()
                await sections.section7.setValues(page.data)
                break
            case 'section8':
                await sections.section8.goto()
                await sections.section8.setValues(page.data)
                break
            case 'section9':
                await sections.section9.goto()
                await sections.section9.setValues(page.data)
                break
            case 'section11':
                await sections.section11.goto()
                await sections.section11.setValues(page.data)
                break
            case 'section12':
                await sections.section12.goto()
                await sections.section12.setValues(page.data)
                break
            case 'roshScreening':
                await risk.screeningSection1.goto()
                await risk.screeningSection1.setValues(page.data)
                break
            default:
                throw (`Page name error: ${page.page}`)
        }
    }
    await oasys.clickButton('Save')
    return pk
}

const standalonePages = ['standaloneCsrp']
const roshaPages = ['predictors', 'roshScreening']
const layer1Pages = ['offendingInformation', 'predictors', 'offenceAnalysis', 'predictorQuestions', 'roshScreening']
const layer3Pages = ['offendingInformation', 'predictors', 'section2', 'section3', 'section4', 'section6', 'section7', 'section8', 'section9', 'section11', 'section12', 'roshScreening']

const questionLookup: { [key: string]: { q: string, pages: { rosha: string, layer1: string, layer3: string } } } = {
    'Offence': { q: 'offence', pages: { rosha: 'predictors', layer1: 'offendingInformation', layer3: 'offendingInformation' } },
    'Subcode': { q: 'subcode', pages: { rosha: 'predictors', layer1: 'offendingInformation', layer3: 'offendingInformation' } },
    '1.8': { q: 'dateFirstSanction', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.32': { q: 'o1_32', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.40': { q: 'o1_40', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.29': { q: 'o1_29', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.30': { q: 'o1_30', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.41': { q: 'o1_41', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.44': { q: 'o1_44', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.33': { q: 'o1_33', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.34': { q: 'o1_34', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.45': { q: 'o1_45', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.46': { q: 'o1_46', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.37': { q: 'o1_37', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.38': { q: 'o1_38', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '1.43': { q: 'o1_43', pages: { rosha: 'predictors', layer1: 'predictors', layer3: 'predictors' } },
    '2.2': { q: 'o2_2Weapon', pages: { rosha: 'predictors', layer1: 'offenceAnalysis', layer3: 'section2' } },
    '3.4': { q: 'o3_4', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section3' } },
    '4.2': { q: 'o4_2', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section4' } },
    '6.4': { q: 'o6_4', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section6' } },
    '6.7da': { q: 'o6_7', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section6' } },
    '6.7.1.1da': { q: 'o6_7VictimPartner', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section6' } },
    '6.7.1.2da': { q: 'o6_7VictimFamily', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section6' } },
    '6.7.2.1da': { q: 'o6_7PerpetratorPartner', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section6' } },
    '6.7.2.2da': { q: 'o6_7PerpetratorFamily', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section6' } },
    '6.8': { q: 'o6_8', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section6' } },
    '7.2': { q: 'o7_2', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section7' } },
    '8.1': { q: 'o8_1', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.8.1': { q: 'hCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.7.1': { q: 'gCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.11.1': { q: 'kCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.4.1': { q: 'dCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.10.1': { q: 'jCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.9.1': { q: 'iCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.1.1': { q: 'aCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.16.1': { q: 'qCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.2.1': { q: 'bCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.6.1': { q: 'fCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.14.1': { q: 'nCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.3.1': { q: 'cCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.5.1': { q: 'eCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.12.1': { q: 'lCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.15.1': { q: 'pCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.2.13.1': { q: 'mCurrent', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '8.8': { q: 'o8_8', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section8' } },
    '9.1': { q: 'o9_1', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section9' } },
    '9.2': { q: 'o9_2', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section9' } },
    '11.2': { q: 'o11_2', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section11' } },
    '11.4': { q: 'o11_4', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section11' } },
    '12.1': { q: 'o12_1', pages: { rosha: 'predictors', layer1: 'predictorQuestions', layer3: 'section12' } },
    'R1.2.6': { q: 'r1_2_6P', pages: { rosha: 'roshScreening', layer1: 'roshScreening', layer3: 'roshScreening' } },
    'R1.2.7': { q: 'r1_2_7P', pages: { rosha: 'roshScreening', layer1: 'roshScreening', layer3: 'roshScreening' } },
    'R1.2.8': { q: 'r1_2_8P', pages: { rosha: 'roshScreening', layer1: 'roshScreening', layer3: 'roshScreening' } },
    'R1.2.10': { q: 'r1_2_10P', pages: { rosha: 'roshScreening', layer1: 'roshScreening', layer3: 'roshScreening' } },
    'R1.2.2': { q: 'r1_2_2P', pages: { rosha: 'roshScreening', layer1: 'roshScreening', layer3: 'roshScreening' } },
    'R1.2.1': { q: 'r1_2_1P', pages: { rosha: 'roshScreening', layer1: 'roshScreening', layer3: 'roshScreening' } },
    'R1.2.9': { q: 'r1_2_9P', pages: { rosha: 'roshScreening', layer1: 'roshScreening', layer3: 'roshScreening' } },
    'R1.2.12': { q: 'r1_2_12P', pages: { rosha: 'roshScreening', layer1: 'roshScreening', layer3: 'roshScreening' } },
    'R1.2.13': { q: 'r1_2_13P', pages: { rosha: 'roshScreening', layer1: 'roshScreening', layer3: 'roshScreening' } },

} 