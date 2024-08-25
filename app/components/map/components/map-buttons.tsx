import React from 'react'
import DrawIcon from '@/app/assets/icons/draw-icon'
import MapIcon from '@/app/assets/icons/map-icon'
import { useMapContext } from '@/app/providers/map-context'

const MapButtons = () => {
  const { setDrawingMode } = useMapContext()
  const buttonClass =
    'bg-white p-2 h-[40px] w-[138px] shadow rounded hover:bg-gray-200'

  const handleMarkerClick = () => {
    setDrawingMode(google.maps.drawing.OverlayType.MARKER)
  }

  const handlePolygonClick = () => {
    setDrawingMode(google.maps.drawing.OverlayType.POLYGON)
  }

  return (
    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 space-x-4 flex justify-center">
      <button onClick={handlePolygonClick} className={buttonClass}>
        <div className="flex space-x-1 justify-center">
          <DrawIcon />
          <span className="font-bold">Draw polygon</span>
        </div>
      </button>
      <button onClick={handleMarkerClick} className={buttonClass}>
        <div className="flex space-x-1 justify-center">
          <MapIcon />
          <span className="font-bold">Add marker</span>
        </div>
      </button>
    </div>
  )
}

export default MapButtons
