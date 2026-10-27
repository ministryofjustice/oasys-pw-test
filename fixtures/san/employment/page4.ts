import { Element } from 'classes'
import { BaseSanEditPage } from '../pages/baseSanEditPage'
import { sanSignificantSomeOptions } from '../sanSection'


export class Page4 extends BaseSanEditPage {

    readingLevel = new Element.Radiogroup<SanSignificantSome>(this.page, '#education_difficulties_reading_severity', sanSignificantSomeOptions)
    writingLevel = new Element.Radiogroup<SanSignificantSome>(this.page, '#education_difficulties_writing_severity', sanSignificantSomeOptions)
    numeracyLevel = new Element.Radiogroup<SanSignificantSome>(this.page, '#education_difficulties_numeracy_severity', sanSignificantSomeOptions)

}
