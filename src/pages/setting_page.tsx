import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
const SettingsPage = () => {
  // const [defaultView, setDefaultView] = useState('Month');
  // const [remindMe, setRemindMe] = useState('Daily');
  // const [reminderTimes, setReminderTimes] = useState(['9:00 AM', '3:00 PM', '6:00 PM']);


  return (
    <div className="flex flex-col">
      <header className="settings-header">
        <div className="settings-icons">
        </div>
      </header>

      <section className="bg-white shadow-md p-4 pr-6 pl-2">
        <h2 className="text-left text-base font-bold mb-4">Calendar Settings</h2>
        <h3 className= "text-left text-xs font-semibold mb-3">Default View</h3>
          <select id="default-view" className = "border border-gray-300 block w-3/4 p-2 mt-1 rounded-md">
              <option value="Month">Month</option>
              <option value="Week">Week</option>
              <option value="Day">Day</option>
          </select>
      </section>


      <section className="bg-white shadow-md p-4 pr-6 pl-2">
      <h2 className="text-left text-base font-bold mb-4">Notification Settings</h2>
          <h3 className= "text-left text-xs font-semibold mb-3">Remind Me</h3>
          <select id="remind-me" className = "border border-gray-300 block w-3/4 p-2 mt-1 rounded-md">
            <option value="Daily">Daily</option>
            <option value="Weekdays">Weekdays</option>
            <option value="Weekends">Weekends</option>
            <option value="None">None</option>
          
          </select>
          <h3 className= " mt-3 text-left text-xs font-semibold mb-2">At times</h3>
          <select id="remind-me" className = "border border-gray-300 block w-full p-1 rounded-md">
            <option value="9:00 AM">9:00 AM</option>
            <option value="3:00 PM">3:00 PM</option>
            <option value="6:00 PM">6:00 PM</option>
          
          </select>

        <button className="bg-white text-gray-800 font-semibold py-2 px-4 rounded inline-flex items-center">
          <span>Add Time</span>
        </button>
      </section>

      <div className="bg-white shadow-md p-4">
        <h2 className="text-left font-semibold mb-4">Mood collection</h2>
        <button className="px-4 py-1 bg-blue-800 text-white rounded-md">Customize mood collection</button>
      </div>
    </div>

  );
};

export default SettingsPage;
