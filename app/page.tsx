'use client'
import MapComponent from '@/app/components/map-components/map-component'
import { MapProvider } from '@/app/providers/map-context'

export default function Home() {
  return (
    <MapProvider>
      <div>
        <div>
          <MapComponent />
        </div>
      </div>
    </MapProvider>
  )
}
