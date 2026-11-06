import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'


export class Page2 extends BaseSanEditPage {

    drugType = new Element.CheckboxGroup<DrugType>(this.page, '#select_misused_drugs', ['amphetamines', 'benzodiazepines', 'cannabis', 'cocaine', 'crack', 'ecstasy', 'hallucinogenics', 'heroin', 'ketamine', 'mephedrone', 'methadone', 'prescribed', 'opiates', 'solvents', 'steroids', 'spice', 'other'])

}
