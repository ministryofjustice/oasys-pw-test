import { Element } from 'classes'

export class PredictorsTable extends Element.Table {

    scoreDescription = new Element.Column(this.page, Element.ColumnType.Column, `#DES_${this.id}`, this.id)
    oneYear = new Element.Column(this.page, Element.ColumnType.Column, `#YR1PCT_${this.id}`, this.id)
    twoYear = new Element.Column(this.page, Element.ColumnType.Column, `#YR2PCT_${this.id}`, this.id)
    category = new Element.Column(this.page, Element.ColumnType.Column, `#CAT_${this.id}`, this.id)
}

export class WeightedScoresTable extends Element.Table {

    section = new Element.Column(this.page, Element.ColumnType.Column, `#SECTION_${this.id}`, this.id)
    ogpScore = new Element.Column(this.page, Element.ColumnType.Column, `#OGP_SCORE_${this.id}`, this.id)
    ovpScore = new Element.Column(this.page, Element.ColumnType.Column, `#OVP_SCORE_${this.id}`, this.id)
}

export class ObjectivesTable extends Element.Table {

    description = new Element.Column(this.page, Element.ColumnType.Column, 'Objective Description')
    status = new Element.Column(this.page, Element.ColumnType.Column, 'Status')
    up = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Up')
    down = new Element.Column(this.page, Element.ColumnType.ImageColumn, 'Down')
}


export class SummarySheetCrimTable extends Element.Table {

    oasysSection = new Element.Column(this.page, Element.ColumnType.Column, `#OASYS_SECTION_${this.id}`, this.id)
    linkedToRosh = new Element.Column(this.page, Element.ColumnType.Column, `#LINKED_TO_RISK_SH_${this.id}`, this.id)
    linkedToReoffending = new Element.Column(this.page, Element.ColumnType.Column, `#LINKED_TO_RISK_RO_${this.id}`, this.id)
    criminogenicNeed = new Element.Column(this.page, Element.ColumnType.Column, `#CRIMINOGENIC_NEED_${this.id}`, this.id)
    scores = new Element.Column(this.page, Element.ColumnType.ScoresColumn, `#SECTION_SCORES_${this.id}`, this.id)
    lowScoringAreas = new Element.Column(this.page, Element.ColumnType.Column, `#LOW_SCORE_ATTN_${this.id}`, this.id)
    indentifiedOnSAQ = new Element.Column(this.page, Element.ColumnType.Column, `#ID_ON_SAQ_${this.id}`, this.id)
}
