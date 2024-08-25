'client component'
import React, { createContext, useContext, useState } from 'react'
import LatLng = google.maps.LatLng

interface MapContextProps {
  markers: LatLng[]
  polygons: LatLng[][]
  setMarkers: React.Dispatch<React.SetStateAction<LatLng[]>>
  setPolygons: React.Dispatch<React.SetStateAction<LatLng[][]>>
  drawingMode: google.maps.drawing.OverlayType | null
  setDrawingMode: React.Dispatch<
    React.SetStateAction<google.maps.drawing.OverlayType | null>
  >
}

const MapContext = createContext<MapContextProps | undefined>(undefined)

export const useMapContext = () => {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMapContext must be used within a MapProvider')
  }
  return context
}

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [markers, setMarkers] = useState<LatLng[]>([])
  const [polygons, setPolygons] = useState<LatLng[][]>([])
  const [drawingMode, setDrawingMode] =
    useState<google.maps.drawing.OverlayType | null>(null)

  return (
    <MapContext.Provider
      value={{
        markers,
        polygons,
        drawingMode,
        setMarkers,
        setPolygons,
        setDrawingMode,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}
