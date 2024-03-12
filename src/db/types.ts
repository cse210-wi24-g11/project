export type MoodId = string

export type Mood = {
  id: MoodId
  color: string
  image: string
}

export type Entry = {
  id: string
  moodId: MoodId
  description: string
  // serializing the date, e.g. 2024.12.31
  date: string
  // storing Date as a number (Date.getTime())
  // this provides a convenient representation for e.g. querying on numbers
  timestamp: number
}

export type MoodCollectionCategory = 'favorites' | 'general' | 'archived'

export type MoodCollection = Record<MoodCollectionCategory, MoodId[]>

export type SummaryView = 'day' | 'week'
export type SettingsDefaultViewOption = 'lastVisited' | SummaryView
export type SettingsLastVisitedOption = SummaryView
export type SettingsRemindMeOption = 'daily' | 'weekdays' | 'weekends' | 'none'
export type SettingsReminderTimeOption = '9am' | '3pm' | '6pm' | 'none'

export type Settings = {
  defaultView: SettingsDefaultViewOption
  lastVisited?: SettingsLastVisitedOption
  remindMe?: SettingsRemindMeOption
  reminderTimes?: SettingsReminderTimeOption
}
