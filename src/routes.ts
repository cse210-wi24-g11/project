export type Route =
  | typeof ADD_ENTRY_ROUTE
  | typeof EDIT_ENTRY_ROUTE
  | typeof EDIT_MOOD_ROUTE
  | typeof CUSTOM_MOOD_ROUTE
  | typeof MOOD_COLLECTION_ROUTE
  | typeof SETTINGS_ROUTE
  | typeof SUMMARY_BASE_ROUTE
  | typeof DAY_SUMMARY_ROUTE
  | typeof WEEK_SUMMARY_ROUTE
  | typeof MONTH_SUMMARY_ROUTE

export const ADD_ENTRY_ROUTE = '/'

export const EDIT_ENTRY_BASE_ROUTE = '/edit-entry'
/**
 * the edit entry route exists in the context of an entry id as well.
 *
 * @example
 * ```ts
 * navigate(EDIT_ENTRY_ROUTE(entryId))
 * ```
 */
export const EDIT_ENTRY_ROUTE = <T extends string>(entryId: T) =>
  `${EDIT_ENTRY_BASE_ROUTE}/${entryId}` as const

export const EDIT_MOOD_ROUTE = '/edit-mood'
export const CUSTOM_MOOD_ROUTE = '/custom-mood'

export const MOOD_COLLECTION_ROUTE = '/mood-collection'

export const SETTINGS_ROUTE = '/settings'

export const SUMMARY_BASE_ROUTE = '/summary'
export const DAY_SUMMARY_ROUTE = `${SUMMARY_BASE_ROUTE}/day`
export const WEEK_SUMMARY_ROUTE = `${SUMMARY_BASE_ROUTE}/week`
export const MONTH_SUMMARY_ROUTE = `${SUMMARY_BASE_ROUTE}/month`
