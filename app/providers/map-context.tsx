import React, { createContext, useContext, useState, useRef } from 'react'
import LatLng = google.maps.LatLng

interface Marker {
  id: string
  name: string
  position: LatLng
}

interface Polygon {
  id: string
  name: string
  path: LatLng[]
}

interface MapContextProps {
  markers: Marker[]
  mapKey: number
  polygons: Polygon[]
  setMarkers: React.Dispatch<React.SetStateAction<Marker[]>>
  setPolygons: React.Dispatch<React.SetStateAction<Polygon[]>>
  setMapKey: React.Dispatch<React.SetStateAction<number>>
  drawingMode: google.maps.drawing.OverlayType | null
  setDrawingMode: React.Dispatch<
    React.SetStateAction<google.maps.drawing.OverlayType | null>
  >
  polygonRefs: React.MutableRefObject<{
    [key: string]: google.maps.Polygon | null
  }>
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
  const [mapKey, setMapKey] = useState(0)
  const [markers, setMarkers] = useState<Marker[]>([])
  const [polygons, setPolygons] = useState<Polygon[]>([])
  const [drawingMode, setDrawingMode] =
    useState<google.maps.drawing.OverlayType | null>(null)
  const polygonRefs = useRef<{ [key: string]: google.maps.Polygon | null }>({})

  return (
    <MapContext.Provider
      value={{
        mapKey,
        markers,
        polygons,
        drawingMode,
        setMarkers,
        setPolygons,
        setMapKey,
        setDrawingMode,
        polygonRefs,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}
