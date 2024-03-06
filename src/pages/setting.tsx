import React, { useState } from 'react'
import { useEffect } from 'react'
import { Picker, Item } from '@adobe/react-spectrum'
// import { NavLink } from 'react-router-dom'

import { DbRecord, getSettings } from '@/utils/db.ts'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { useDb } from '@/context/db.tsx'

type SettingsShape = DbRecord<'settings'>

type PickerOptions<KeyType extends React.Key> = Array<{
  key: KeyType,
  label: string
}>

const DEFAULT_VIEW_LABEL_ID = 'settings-default-view-label'
const REMIND_ME_LABEL_ID = 'settings-remind-me-label'
const REMINDER_TIMES_LABEL_ID = 'settings-reminder-times-label'

const defaultViewOptions: PickerOptions<Required<SettingsShape>['defaultView']> = [
  { key: 'month', label: 'Month' },
  { key: 'week', label: 'Week' },
  { key: 'day', label: 'Day' },
]

const remindMeOptions: PickerOptions<Required<SettingsShape>['remindMe']> = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekdays', label: 'Weekdays' },
  { key: 'weekends', label: 'Weekends' },
  { key: 'none', label: 'None' },
]

const reminderTimesOptions: PickerOptions<Required<SettingsShape>['reminderTimes']> = [
  { key: '9am', label: '9:00 AM' },
  { key: '3pm', label: '3:00 PM' },
  { key: '6pm', label: '6:00 PM' },
  { key: 'none', label: 'None' },
]

export function Settings() {
  const [defaultView, setDefaultView] = useState<SettingsShape['defaultView'] | null>(null)
  const [remindMe, setRemindMe] = useState<SettingsShape['remindMe'] | null>(null)
  const [reminderTimes, setReminderTimes] = useState<SettingsShape['reminderTimes'] | null>(
    null
  )
  const { getDb } = useDb()
  useEffect(() => {
    async function run() {
      const db = await getDb()
      const settings = await getSettings(db)
      setDefaultView(settings.defaultView)
      setRemindMe(settings.remindMe)
      setReminderTimes(settings.reminderTimes)
    }

    void run()
  }, [getDb])

  const handleDefaultViewChange = async (selectedKey: React.Key) => {
    const newDefaultView = selectedKey.toString() as SettingsShape['defaultView']
    setDefaultView(newDefaultView)
    const db = await getDb()
    if (db) {
      updateSettingsInDb(db, { defaultView: newDefaultView })
    }
  }

  const handleRemindMeChange = async (selectedKey: React.Key) => {
    const newRemindMe = selectedKey.toString() as SettingsShape['remindMe']
    setRemindMe(newRemindMe)
    const db = await getDb()
    if (db) {
      updateSettingsInDb(db, { remindMe: newRemindMe })
    }
  }

  const handleAtTimesChange = async (selectedKey: React.Key) => {
    const newReminderTimes = selectedKey.toString() as SettingsShape['reminderTimes']
    setReminderTimes(newReminderTimes)
    const db = await getDb()
    if (db) {
      updateSettingsInDb(db, { reminderTimes: newReminderTimes })
    }
  }

  const updateSettingsInDb = (db: IDBDatabase, settings: Partial<SettingsShape>) => {
    const transaction = db.transaction(['settings'], 'readwrite')
    const store = transaction.objectStore('settings')
    const request = store.get('settings')

    request.onsuccess = () => {
      // avoid undefined/any
      const data = (request.result || {}) as SettingsShape
      const updatedData: SettingsShape = { ...data, ...settings }
      store.put(updatedData, 'settings')
    }

    request.onerror = (e: Event) => {
      const error = (e.target as IDBRequest).error
      console.error('Error accessing settings:', error?.message)
    }
  }
  return (
    <div className="flex flex-col items-center bg-white">
      <section className="w-full bg-white p-4 pl-2 pr-6 shadow-md">
        <h2 className="mb-4 text-left text-base font-bold">
          Calendar Settings
        </h2>
        <h3 id={DEFAULT_VIEW_LABEL_ID} className="mb-3 text-left text-xs font-semibold">Default View</h3>
        <Picker
          aria-labelledby={DEFAULT_VIEW_LABEL_ID}
          selectedKey={defaultView}
          onSelectionChange={handleDefaultViewChange}
          items={defaultViewOptions}
        >
          {(item) => <Item key={item.key}>{item.label}</Item>}
        </Picker>
      </section>

      <section className="w-full bg-white p-4 pl-2 pr-6 shadow-md">
        <h2 className="mb-4 text-left text-base font-bold">
          Notification Settings
        </h2>
        <h3 id={REMIND_ME_LABEL_ID} className="mb-3 text-left text-xs font-semibold">Remind Me</h3>
        <Picker
          aria-labelledby={REMIND_ME_LABEL_ID}
          selectedKey={remindMe}
          onSelectionChange={handleRemindMeChange}
          items={remindMeOptions}
        >
          {(item) => <Item key={item.key}>{item.label}</Item>}
        </Picker>
        <h3 id={REMINDER_TIMES_LABEL_ID} className=" mb-2 mt-3 text-left text-xs font-semibold">At times</h3>
        <Picker
          aria-labelledby={REMINDER_TIMES_LABEL_ID}
          onSelectionChange={handleAtTimesChange}
          selectedKey={reminderTimes}
          items={reminderTimesOptions}
        >
          {(item) => <Item key={item.key}>{item.label}</Item>}
        </Picker>
      </section>

      <div className="bg-white p-4 shadow-md">
        <h2 className="mb-4 text-left font-semibold">Mood collection</h2>
        <button className="rounded-md bg-blue-500 px-4 py-1 text-white">
          Customize mood collection
        </button>
      </div>
      <MainNavBar />
    </div>
  )
}
