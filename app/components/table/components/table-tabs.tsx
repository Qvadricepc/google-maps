import React, { useState } from 'react'
import { Tabs } from '@/app/const'

const TableTabs = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<string>>
}) => {
  const activeState = 'text-[#57167E] border-b-2 border-[#57167E]'
  const defaultState =
    'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'

  return (
    <ul className="flex flex-wrap text-sm font-medium text-center">
      <li className="me-2">
        <a
          href="#"
          onClick={() => setActiveTab(Tabs.Polygons)}
          className={`inline-block p-4 rounded-t-lg ${
            activeTab === Tabs.Polygons ? activeState : defaultState
          }`}
        >
          Polygons management
        </a>
      </li>
      <li className="me-2">
        <a
          href="#"
          onClick={() => setActiveTab(Tabs.Markers)}
          className={`inline-block p-4 rounded-t-lg ${
            activeTab === Tabs.Markers ? activeState : defaultState
          }`}
        >
          Markers management
        </a>
      </li>
    </ul>
  )
}

export default TableTabs
