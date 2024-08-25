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
  handleDeleteMarker: (id: string) => void
  handleDeletePolygon: (id: string) => void
  handleEditName: (
    id: string,
    newName: string,
    type: 'marker' | 'polygon'
  ) => void
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

  const handleDeleteMarker = (id: string) => {
    setMarkers((prevMarkers) =>
      prevMarkers.filter((marker) => marker.id !== id)
    )
  }

  const handleDeletePolygon = (id: string) => {
    // First, remove the polygon from the map
    const polygon = polygonRefs.current[id]
    if (polygon) {
      polygon.setMap(null) // Remove the polygon from the map
      delete polygonRefs.current[id] // Remove the reference
    }

    // Update the state to remove the polygon
    setPolygons((prevPolygons) =>
      prevPolygons.filter((polygon) => polygon.id !== id)
    )
    setMapKey((prevMapKeys) => prevMapKeys + 1)
  }

  const handleEditName = (
    id: string,
    newName: string,
    type: 'marker' | 'polygon'
  ) => {
    if (type === 'marker') {
      setMarkers((prevMarkers) =>
        prevMarkers.map((marker) =>
          marker.id === id ? { ...marker, name: newName } : marker
        )
      )
    } else if (type === 'polygon') {
      setPolygons((prevPolygons) =>
        prevPolygons.map((polygon) =>
          polygon.id === id ? { ...polygon, name: newName } : polygon
        )
      )
    }
  }

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
        handleDeleteMarker,
        handleDeletePolygon,
        handleEditName,
      }}
    >
      {children}
    </MapContext.Provider>
  )
}
