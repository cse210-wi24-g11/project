import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
const SettingsPage = () => {
  // const [defaultView, setDefaultView] = useState('Month');
  // const [remindMe, setRemindMe] = useState('Daily');
  // const [reminderTimes, setReminderTimes] = useState(['9:00 AM', '3:00 PM', '6:00 PM']);

  return (
    <div className="flex flex-col">
      <header className="settings-header">
        <div className="settings-icons"></div>
      </header>

      <section className="bg-white p-4 pl-2 pr-6 shadow-md">
        <h2 className="mb-4 text-left text-base font-bold">
          Calendar Settings
        </h2>
        <h3 className="mb-3 text-left text-xs font-semibold">Default View</h3>
        <select
          id="default-view"
          className="mt-1 block w-3/4 rounded-md border border-gray-300 p-2"
        >
          <option value="Month">Month</option>
          <option value="Week">Week</option>
          <option value="Day">Day</option>
        </select>
      </section>

      <section className="bg-white p-4 pl-2 pr-6 shadow-md">
        <h2 className="mb-4 text-left text-base font-bold">
          Notification Settings
        </h2>
        <h3 className="mb-3 text-left text-xs font-semibold">Remind Me</h3>
        <select
          id="remind-me"
          className="mt-1 block w-3/4 rounded-md border border-gray-300 p-2"
        >
          <option value="Daily">Daily</option>
          <option value="Weekdays">Weekdays</option>
          <option value="Weekends">Weekends</option>
          <option value="None">None</option>
        </select>
        <h3 className=" mb-2 mt-3 text-left text-xs font-semibold">At times</h3>
        <select
          id="remind-me"
          className="block w-full rounded-md border border-gray-300 p-1"
        >
          <option value="9:00 AM">9:00 AM</option>
          <option value="3:00 PM">3:00 PM</option>
          <option value="6:00 PM">6:00 PM</option>
        </select>

        <button className="inline-flex items-center rounded bg-white px-4 py-2 font-semibold text-gray-800">
          <span>Add Time</span>
        </button>
      </section>

      <div className="bg-white p-4 shadow-md">
        <h2 className="mb-4 text-left font-semibold">Mood collection</h2>
        <button className="rounded-md bg-blue-800 px-4 py-1 text-white">
          Customize mood collection
        </button>
      </div>
    </div>
  )
}

export default SettingsPage
