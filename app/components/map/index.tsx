import React, { useCallback, useState, useRef, useEffect } from 'react'
import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
  Marker,
  Polygon,
} from '@react-google-maps/api'
import { Library } from '@googlemaps/js-api-loader'
import { useMapContext } from '@/app/providers/map-context'
import MapButtons from '@/app/components/map/components/map-buttons'
import { v4 as uuidv4 } from 'uuid'

const containerStyle = {
  width: '50vw',
  height: '100vh',
}

const usaBounds = {
  north: 49.38,
  south: 24.52,
  west: -125.0,
  east: -66.95,
}

const libraries: Library[] = ['drawing']

function MyMapComponent() {
  const {
    markers,
    polygons,
    mapKey,
    drawingMode,
    setDrawingMode,
    setMarkers,
    setPolygons,
    polygonRefs,
  } = useMapContext()

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries,
  })

  const drawingManagerRef = useRef<google.maps.drawing.DrawingManager | null>(
    null
  )

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new google.maps.LatLngBounds(
      { lat: usaBounds.south, lng: usaBounds.west }, // Southwest corner
      { lat: usaBounds.north, lng: usaBounds.east } // Northeast corner
    )
    map.fitBounds(bounds)
  }, [])

  const handleMarkerComplete = (marker: google.maps.Marker) => {
    const position = marker.getPosition()
    if (position) {
      const newMarker = {
        id: uuidv4(),
        position,
        name: `Marker ${markers.length + 1}`,
      }
      setMarkers((prevMarkers) => [...prevMarkers, newMarker])
    }
    marker.setMap(null)
    setDrawingMode(null)
  }

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath().getArray()
    const newPolygon = {
      id: uuidv4(),
      path,
      name: `Polygon ${polygons.length + 1}`,
    }
    setPolygons((prevPolygons) => [...prevPolygons, newPolygon])
    polygon.setMap(null)
    setDrawingMode(null)
  }

  const handleEditMarker = (id: string, newPosition: google.maps.LatLng) => {
    setMarkers((prevMarkers) =>
      prevMarkers.map((marker) =>
        marker.id === id ? { ...marker, position: newPosition } : marker
      )
    )
  }

  const handleEditPolygon = (id: string) => {
    const polygon = polygonRefs.current[id]
    if (polygon) {
      const newPath = polygon.getPath().getArray()
      setPolygons((prevPolygons) =>
        prevPolygons.map((poly) =>
          poly.id === id ? { ...poly, path: newPath } : poly
        )
      )
    }
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

  const handleMarkerDoubleClick = (markerId: string) => {
    const newName = prompt('Enter new name for marker:')
    if (newName) {
      handleEditName(markerId, newName, 'marker')
    }
  }

  const handlePolygonDoubleClick = (polygonId: string) => {
    const newName = prompt('Enter new name for polygon:')
    if (newName) {
      handleEditName(polygonId, newName, 'polygon')
    }
  }

  console.log(polygonRefs.current)

  return isLoaded ? (
    <div className="relative">
      <MapButtons />

      {/* Google Map */}
      <GoogleMap
        key={mapKey}
        mapContainerStyle={containerStyle}
        onLoad={onLoad}
        center={{ lat: 37.0902, lng: -95.7129 }} // Center of the USA
        zoom={4}
      >
        {/* DrawingManager to handle marker and polygon drawing */}
        <DrawingManager
          onLoad={(drawingManager) => {
            drawingManagerRef.current = drawingManager
          }}
          options={{
            drawingMode: drawingMode,
            drawingControl: false, // Hide default drawing controls
            markerOptions: {
              draggable: true,
            },
            polygonOptions: {
              fillColor: '#2196F3',
              strokeColor: '#2196F3',
              fillOpacity: 0.4,
              strokeWeight: 2,
              clickable: true,
              editable: true,
              draggable: true,
            },
          }}
          onMarkerComplete={handleMarkerComplete}
          onPolygonComplete={handlePolygonComplete}
        />

        {/* Render stored markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            draggable={true}
            onDragEnd={(e) =>
              handleEditMarker(marker.id, e.latLng as google.maps.LatLng)
            }
            onDblClick={() => handleMarkerDoubleClick(marker.id)}
          />
        ))}

        {/* Render stored polygons */}
        {polygons.map((polygon) => (
          <Polygon
            key={polygon.id}
            paths={polygon.path}
            options={{
              fillColor: '#2196F3',
              strokeColor: '#2196F3',
              fillOpacity: 0.4,
              strokeWeight: 2,
              clickable: true,
              editable: true,
              draggable: true,
            }}
            onLoad={(polygonInstance) =>
              (polygonRefs.current[polygon.id] = polygonInstance)
            }
            onMouseUp={() => handleEditPolygon(polygon.id)}
            onDblClick={() => handlePolygonDoubleClick(polygon.id)}
          />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <></>
  )
}

export default React.memo(MyMapComponent)
