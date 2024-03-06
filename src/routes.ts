export type Route =
  | typeof ADD_MOOD_ROUTE
  | typeof UPDATE_MOOD_ROUTE
  | typeof MOOD_COLLECTION_ROUTE
  | typeof SETTINGS_ROUTE
  | typeof DAY_SUMMARY_ROUTE
  | typeof WEEK_SUMMARY_ROUTE
  | typeof MONTH_SUMMARY_ROUTE

export const ADD_MOOD_ROUTE = '/'

export const UPDATE_MOOD_ROUTE = '/update-mood'

export const MOOD_COLLECTION_ROUTE = '/mood-collection'

export const SETTINGS_ROUTE = '/settings'

export const SUMMARY_BASE_ROUTE = '/summary'
export const DAY_SUMMARY_ROUTE = `${SUMMARY_BASE_ROUTE}/`
export const WEEK_SUMMARY_ROUTE = `${SUMMARY_BASE_ROUTE}/week`
export const MONTH_SUMMARY_ROUTE = `${SUMMARY_BASE_ROUTE}/month`
