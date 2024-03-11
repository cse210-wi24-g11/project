export type Route =
  | typeof ADD_ENTRY_ROUTE
  | typeof UPDATE_MOOD_ROUTE
  | typeof MOOD_COLLECTION_ROUTE
  | typeof SETTINGS_ROUTE
  | typeof SUMMARY_BASE_ROUTE
  | typeof DAY_SUMMARY_ROUTE
  | typeof WEEK_SUMMARY_ROUTE
  | typeof MONTH_SUMMARY_ROUTE
  | typeof CUSTOM_MOOD_ROUTE

export const ADD_ENTRY_ROUTE = '/'

export const UPDATE_MOOD_ROUTE = '/update-mood'

export const MOOD_COLLECTION_ROUTE = '/mood-collection'

export const SETTINGS_ROUTE = '/settings'

export const CUSTOM_MOOD_ROUTE = '/custom-mood'

export const SUMMARY_BASE_ROUTE = '/summary'
export const DAY_SUMMARY_ROUTE = `${SUMMARY_BASE_ROUTE}/day`
export const WEEK_SUMMARY_ROUTE = `${SUMMARY_BASE_ROUTE}/week`
export const MONTH_SUMMARY_ROUTE = `${SUMMARY_BASE_ROUTE}/month`
