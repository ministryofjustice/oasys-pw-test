import { BaseAssessmentPage, Element } from 'classes'

export class ProposalInformation extends BaseAssessmentPage {

    name = 'ProposalInformation'
    title = 'Case ID - Proposal Information'
    menu: Menu = { type: 'Floating', level1: 'Case ID', level2: 'Proposal Information' }

    sources0 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_0')
    sources1 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_1')
    sources2 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_2')
    sources3 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_3')
    sources4 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_4')
    sources5 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_5')
    sources6 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_6')
    sources7 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_7')
    sources8 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_8')
    sources9 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_9')
    sources10 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_10')
    sources11 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_11')
    sources12 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_12')
    sources13 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_13')
    sources14 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_14')
    sources15 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_15')
    sources16 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_16')
    sources17 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_17')
    sources18 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_18')
    sources19 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_19')
    sources20 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_20')
    sources21 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_21')
    sources22 = new Element.Checkbox(this.page, '#P3_SOURCES_INFORMATON_ELM_22')
    sourcesOther = new Element.Textbox(this.page, '#P3_SOURCES_INFO_OTHER_FTXT')
}


