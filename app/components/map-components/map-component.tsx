import React, { useCallback, useState, useRef } from 'react'
import {
  GoogleMap,
  useJsApiLoader,
  DrawingManager,
  Marker,
  Polygon,
} from '@react-google-maps/api'
import { Library } from '@googlemaps/js-api-loader'
import { useMapContext } from '@/app/providers/map-context'
import MapButtons from '@/app/components/map-components/map-buttons'

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

function MyComponent() {
  const {
    markers,
    polygons,
    drawingMode,
    setDrawingMode,
    setMarkers,
    setPolygons,
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
      setMarkers((prevMarkers) => [...prevMarkers, position])
    }
    marker.setMap(null)
    setDrawingMode(null)
  }

  const handlePolygonComplete = (polygon: google.maps.Polygon) => {
    const path = polygon.getPath().getArray()
    setPolygons((prevPolygons) => [...prevPolygons, path])
    polygon.setMap(null)
    setDrawingMode(null)
  }

  return isLoaded ? (
    <div className="relative">
      <MapButtons />

      {/* Google Map */}
      <GoogleMap
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
        {markers.map((position, index) => (
          <Marker key={index} position={position} />
        ))}

        {/* Render stored polygons */}
        {polygons.map((path, index) => (
          <Polygon
            key={index}
            paths={path}
            options={{
              fillColor: '#2196F3',
              strokeColor: '#2196F3',
              fillOpacity: 0.4,
              strokeWeight: 2,
              clickable: true,
              editable: true,
              draggable: true,
            }}
          />
        ))}
      </GoogleMap>
    </div>
  ) : (
    <></>
  )
}

export default React.memo(MyComponent)
