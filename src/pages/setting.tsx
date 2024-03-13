import React from 'react'
import { Picker, Item } from '@adobe/react-spectrum'
import { Button } from '@react-spectrum/button'
import { useNavigate } from 'react-router-dom'

import { MOOD_COLLECTION_ROUTE } from '@/routes.ts'
import { updateSettings, useSettings } from '@/db/actions.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'

import type {
  SettingsDefaultViewOption,
  SettingsRemindMeOption,
  SettingsReminderTimeOption,
} from '@/db/types.ts'

type PickerOptions<KeyType extends React.Key> = Array<{
  key: KeyType
  label: string
}>

const DEFAULT_VIEW_LABEL_ID = 'settings-default-view-label'
const REMIND_ME_LABEL_ID = 'settings-remind-me-label'
const REMINDER_TIMES_LABEL_ID = 'settings-reminder-times-label'

const defaultViewOptions: PickerOptions<SettingsDefaultViewOption> = [
  { key: 'lastVisited', label: 'Last Visited' },
  { key: 'week', label: 'Week' },
  { key: 'day', label: 'Day' },
]

const remindMeOptions: PickerOptions<SettingsRemindMeOption> = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekdays', label: 'Weekdays' },
  { key: 'weekends', label: 'Weekends' },
  { key: 'none', label: 'None' },
]

const reminderTimesOptions: PickerOptions<SettingsReminderTimeOption> = [
  { key: '9am', label: '9:00 AM' },
  { key: '3pm', label: '3:00 PM' },
  { key: '6pm', label: '6:00 PM' },
  { key: 'none', label: 'None' },
]

export function Settings() {
  const [{ defaultView, remindMe, reminderTimes }] = useSettings({
    defaultView: null,
    remindMe: null,
    reminderTimes: null,
  })

  const handleDefaultViewChange = (selectedKey: React.Key) => {
    const newDefaultView = selectedKey.toString() as SettingsDefaultViewOption

    void updateSettings({ defaultView: newDefaultView })
  }

  const handleRemindMeChange = (selectedKey: React.Key) => {
    const newRemindMe = selectedKey.toString() as SettingsRemindMeOption

    void updateSettings({ remindMe: newRemindMe })
  }

  const handleAtTimesChange = (selectedKey: React.Key) => {
    const newReminderTimes =
      selectedKey.toString() as SettingsReminderTimeOption

    void updateSettings({ reminderTimes: newReminderTimes })
  }

  const navigate = useNavigate()
  const addCustomMood = () => {
    navigate(MOOD_COLLECTION_ROUTE)
  }
  return (
    <div className="flex flex-col items-center">
      <div className="w-full p-4 pl-2 pr-6">
        <h2 className="mb-4 text-left text-base font-bold">
          Calendar Settings
        </h2>
        <h3
          id={DEFAULT_VIEW_LABEL_ID}
          className="mb-3 text-left text-xs font-semibold"
        >
          Default View
        </h3>
        <Picker
          aria-labelledby={DEFAULT_VIEW_LABEL_ID}
          selectedKey={defaultView}
          onSelectionChange={handleDefaultViewChange}
          items={defaultViewOptions}
        >
          {(item) => <Item key={item.key}>{item.label}</Item>}
        </Picker>
      </div>

      <section className="w-full p-4 pl-2 pr-6">
        <h2 className="mb-4 text-left text-base font-bold">
          Notification Settings
        </h2>
        <h3
          id={REMIND_ME_LABEL_ID}
          className="mb-3 text-left text-xs font-semibold"
        >
          Remind Me
        </h3>
        <Picker
          aria-labelledby={REMIND_ME_LABEL_ID}
          selectedKey={remindMe}
          onSelectionChange={handleRemindMeChange}
          items={remindMeOptions}
        >
          {(item) => <Item key={item.key}>{item.label}</Item>}
        </Picker>
        <h3
          id={REMINDER_TIMES_LABEL_ID}
          className=" mb-2 mt-3 text-left text-xs font-semibold"
        >
          At times
        </h3>
        <Picker
          aria-labelledby={REMINDER_TIMES_LABEL_ID}
          onSelectionChange={handleAtTimesChange}
          selectedKey={reminderTimes}
          items={reminderTimesOptions}
        >
          {(item) => <Item key={item.key}>{item.label}</Item>}
        </Picker>
      </section>

      <div className="w-full p-4">
        <h2 className="mb-4 text-left font-semibold">Mood collection</h2>
        <Button
          variant="primary"
          aria-label="customize mood collection"
          onPress={addCustomMood}
        >
          Customize Mood Collection
        </Button>
      </div>
      <MainNavBar />
    </div>
  )
}
