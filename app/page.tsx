'use client'
import MapComponent from '@/app/components/map'
import { MapProvider } from '@/app/providers/map-context'
import Table from '@/app/components/table'

export default function Home() {
  return (
    <MapProvider>
      <div className={'flex'}>
        <MapComponent />
        <Table />
      </div>
    </MapProvider>
  )
}
