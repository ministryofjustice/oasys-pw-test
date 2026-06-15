/**
 * The PageData type can be used for entering multiple values on a single page.  Key names need to match the names used on the page definition class.
 */
declare type PageData = { [keys: string]: string | OasysDate | number | boolean }

declare type ElementStatus = 'notVisible' | 'enabled' | 'readonly' | 'visible'
declare type ElementStatusAndValue = { status: ElementStatus, value: string }

declare type Menu = {
    type: 'Floating' | 'Main' | 'Subform' | 'San',
    level1: string,
    level2?: string
}

/**
 * Values that can be specified for the library function that searches for tasks (await tasks.search)
 */
declare type TaskSearch = {
    localAdministrationUnit?: string,
    team?: string,
    userName?: string,
    taskName?: string,
    offenderName?: string,
    showCompleted?: YesNoAnswer,
}
