import React, { useState } from 'react'
import CoordinatesTable from '@/app/components/table/components/coordnates-table'
import TableTabs from '@/app/components/table/components/table-tabs'
import TableSearch from '@/app/components/table/components/table-search'

const Table = () => {
  const [activeTab, setActiveTab] = useState('Polygons management')
  return (
    <div className="w-full flex flex-col gap-2">
      <TableSearch />
      <TableTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <CoordinatesTable activeTab={activeTab} />
    </div>
  )
}

export default Table
