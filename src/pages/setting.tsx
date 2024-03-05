import React, { useState } from 'react'
import { useEffect } from 'react'
import { Picker, Item } from '@adobe/react-spectrum'
// import { NavLink } from 'react-router-dom'

import { MainNavBar } from '@/components/navigation/main-navbar.tsx'
import { useDb } from '@/context/db.tsx'

interface Settings {
  defaultView?: string;
  remindMe?: string;
  reminderTimes?: string;
}

export function Settings() {
  
  const [defaultView, setDefaultView] = useState<string>('Month')
  const [remindMe, setRemindMe] = useState<string>('Daily')
  const [reminderTimes, setReminderTimes] = useState<string>('9:00 AM')
  const { getDb, ready } = useDb();
  useEffect(() => {
    const fetchSettings = async () => {
      if (ready) {
        try {
          const db = await getDb();
          const transaction = db.transaction(['settings'], 'readonly');
          const store = transaction.objectStore('settings');
          const request = store.get('settings');
          request.onsuccess = () => {
            if (request.result) {
              setDefaultView(request.result.defaultView || 'Month');
              setRemindMe(request.result.remindMe || 'Daily');
              setReminderTimes(request.result.reminderTimes || '9:00 AM');
            }
          };
          request.onerror = (e) => {
            console.error('Error fetching settings from the database', e.target.error);
          };
        } catch (error) {
          console.error('Failed to fetch settings', error);
        }
      }
    };

    fetchSettings();
  }, [ready]);
  const handleDefaultViewChange = async (selectedKey: React.Key) => {
    const newDefaultView = selectedKey.toString()
    setDefaultView(newDefaultView)
    const db = await getDb();
    if (db) {
      updateSettingsInDb(db, { defaultView: newDefaultView })
    }
  }

  const handleRemindMeChange = async (selectedKey: React.Key) => {
    const newRemindMe = selectedKey.toString()
    setRemindMe(newRemindMe)
    const db = await getDb();
    if (db) {
      updateSettingsInDb(db, { remindMe: newRemindMe })
    }
  }

  const handleAtTimesChange = async (selectedKey: React.Key) => {
    const newReminderTimes = selectedKey.toString()
    setReminderTimes(newReminderTimes)
    const db = await getDb();
    if (db) {
      updateSettingsInDb(db, { reminderTimes: newReminderTimes })
    }
  }

  const updateSettingsInDb = (
    db: IDBDatabase,
    settings: Partial<Settings>,
  ) => {
    const transaction = db.transaction(['settings'], 'readwrite')
    const store = transaction.objectStore('settings')
    const request = store.get('settings')

    request.onsuccess = () => {
      // avoid undefined/any
      const data = (request.result || {}) as Partial<Settings>;
      const updatedData: Settings = { ...data, ...settings };
      store.put(updatedData, 'settings');
    }

    request.onerror = (e: Event) => {
      const error = (e.target as IDBRequest).error
      console.error('Error accessing settings:', error?.message)
    }
  }
  // // check and create default value
  // useEffect(() => {
  //   if (ready) {
  //     const checkAndInitializeSettings = (db: IDBDatabase) => {
  //       const transaction = db.transaction(['settings'], 'readwrite');
  //       const store = transaction.objectStore('settings');
  //       const request = store.get('settings');

  //       request.onsuccess = () => {
  //         if (!request.result) {
  //           store.put(
  //             {
  //               id: 'settings',
  //               defaultView: "Month",
  //               remindMe: "None",
  //               reminderTimes: "None",
  //             },
  //             'settings',
  //           );
  //           console.log('Initialized default settings');
  //         }
  //       }
  //       request.onerror = (e: Event) => {
  //         const error = (e.target as IDBRequest).error;
  //         console.error('Error accessing settings:', error?.message);
  //       };
  //     };
  //     getDb().then(db => checkAndInitializeSettings(db)).catch(error =>{
  //       console.error('Failed to initialize settings:', error);
  //     });
  //   }
  // }, [ready, getDb, defaultView, remindMe, reminderTimes]);

  return (
    <div className="flex flex-col items-center bg-white">
      <section className="w-full bg-white p-4 pl-2 pr-6 shadow-md">
        <h2 className="mb-4 text-left text-base font-bold">
          Calendar Settings
        </h2>
        <h3 className="mb-3 text-left text-xs font-semibold">Default View</h3>
        <Picker
          // label="Default View"
          selectedKey={defaultView}
          onSelectionChange={handleDefaultViewChange}
          items={[
            { key: 'Month', label: 'Month' },
            { key: 'Week', label: 'Week' },
            { key: 'Day', label: 'Day' },
          ]}
        >
          {(item) => <Item key={item.key}>{item.label}</Item>}
        </Picker>
      </section>

      <section className="w-full bg-white p-4 pl-2 pr-6 shadow-md">
        <h2 className="mb-4 text-left text-base font-bold">
          Notification Settings
        </h2>
        <h3 className="mb-3 text-left text-xs font-semibold">Remind Me</h3>
        <Picker
          //label="Remind Me"
          selectedKey={remindMe}
          onSelectionChange={handleRemindMeChange}
          items={[
            { key: 'Daily', label: 'Daily' },
            { key: 'Weekdays', label: 'Weekdays' },
            { key: 'Weekends', label: 'Weekends' },
            { key: 'None', label: 'None' },
          ]}
        >
          {(item) => <Item key={item.key}>{item.label}</Item>}
        </Picker>
        <h3 className=" mb-2 mt-3 text-left text-xs font-semibold">At times</h3>
        <Picker
          //label="Remind Me"
          onSelectionChange={handleAtTimesChange}
          selectedKey={reminderTimes}
          items={[
            { key: '9:00 AM', label: '9:00 AM' },
            { key: '3:00 PM', label: '3:00 PM' },
            { key: '6:00 PM', label: '6:00 PM' },
            { key: 'None', label: 'None' },
          ]}
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
