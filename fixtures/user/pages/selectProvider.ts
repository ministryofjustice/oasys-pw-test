import { OasysPage, Element } from 'classes'

export class SelectProvider extends OasysPage {

    name = 'SelectProvider'
    title = 'Set Provider/Establishment'
    menu: Menu = { type: 'Main', level1: 'Admin', level2: 'Switch Profile' }

    chooseProviderEstablishment = new Element.Select(this.page, '#P10_CT_AREA_EST')
    setProviderEstablishment = new Element.Button(this.page, '#P10_CONTINUE_BT')
    cancel = new Element.Button(this.page, '#P10_BT_CANCEL')
}
