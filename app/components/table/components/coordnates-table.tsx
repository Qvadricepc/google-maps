import React, { useState } from 'react'
import { useMapContext } from '@/app/providers/map-context'
import { Tabs } from '@/app/const'

const CoordinatesTable = ({ activeTab }: { activeTab: string }) => {
  const {
    markers,
    polygons,
    handleDeletePolygon,
    handleDeleteMarker,
    handleEditMarker,
    handleEditPolygon,
    handleEditName,
    polygonRefs,
  } = useMapContext()

  const [editingId, setEditingId] = useState<string | null>(null)

  const handleMarkerChange = (id: string, field: string, value: string) => {
    const marker = markers.find((marker) => marker.id === id)
    if (!marker) return

    if (field === 'name') {
      handleEditName(id, value, 'marker')
    } else {
      const parsedValue = parseFloat(value)

      // Validate the parsed value
      if (
        isNaN(parsedValue) ||
        (field === 'lat' && (parsedValue < -90 || parsedValue > 90)) ||
        (field === 'lng' && (parsedValue < -180 || parsedValue > 180))
      ) {
        console.warn(`Invalid ${field} value: ${parsedValue}`)
        return
      }

      const lat = field === 'lat' ? parsedValue : marker.position.lat()
      const lng = field === 'lng' ? parsedValue : marker.position.lng()
      const newPosition = new google.maps.LatLng(lat, lng)

      handleEditMarker(id, newPosition)
    }
  }

  const handlePolygonChange = (
    id: string,
    idx: number,
    field: string,
    value: string
  ) => {
    const polygon = polygons.find((polygon) => polygon.id === id)
    if (!polygon) return

    if (field === 'name') {
      handleEditName(id, value, 'polygon')
    } else {
      const newPath = polygon.path.map((coord, index) => {
        if (index === idx) {
          const lat = field === 'lat' ? parseFloat(value) : coord.lat()
          const lng = field === 'lng' ? parseFloat(value) : coord.lng()
          return new google.maps.LatLng(lat, lng)
        }
        return coord
      })

      console.log(`Updating polygon ID: ${id}, New Path:`, newPath)

      const polygonRef = polygonRefs.current[id]
      if (polygonRef) {
        polygonRef.setPath(newPath)
        handleEditPolygon(id)
      }
    }
  }

  const toggleEdit = (id: string) => {
    setEditingId(editingId === id ? null : id)
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Name
            </th>
            <th scope="col" className="px-6 py-3">
              Coordinates
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {activeTab === Tabs.Markers &&
            markers.map((marker) => (
              <tr
                key={marker.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <input
                    type="text"
                    value={marker.name}
                    onChange={(e) =>
                      handleMarkerChange(marker.id, 'name', e.target.value)
                    }
                    className="bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 focus:outline-none"
                    readOnly={editingId !== marker.id}
                  />
                </th>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={marker.position.lat().toFixed(4)}
                    onChange={(e) =>
                      handleMarkerChange(marker.id, 'lat', e.target.value)
                    }
                    className="bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 focus:outline-none"
                    step="0.0001"
                    readOnly={editingId !== marker.id}
                  />
                  ° N,{' '}
                  <input
                    type="number"
                    value={marker.position.lng().toFixed(4)}
                    onChange={(e) =>
                      handleMarkerChange(marker.id, 'lng', e.target.value)
                    }
                    className="bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 focus:outline-none"
                    step="0.0001"
                    readOnly={editingId !== marker.id}
                  />
                  ° W
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => toggleEdit(marker.id)}
                  >
                    {editingId === marker.id ? 'Save' : 'Edit'}
                  </button>{' '}
                  |{' '}
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeleteMarker(marker.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          {activeTab === Tabs.Polygons &&
            polygons.map((polygon, index) => (
              <tr
                key={polygon.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <input
                    type="text"
                    value={polygon.name || `Polygon ${index + 1}`}
                    onChange={(e) =>
                      handlePolygonChange(
                        polygon.id,
                        index,
                        'name',
                        e.target.value
                      )
                    }
                    className="bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 focus:outline-none"
                    readOnly={editingId !== polygon.id}
                  />
                </th>
                <td className="px-6 py-4">
                  {polygon.path.map((coord, idx) => (
                    <div key={idx} className="mb-2">
                      Point {idx + 1}:{' '}
                      <input
                        type="number"
                        value={coord.lat().toFixed(4)}
                        onChange={(e) =>
                          handlePolygonChange(
                            polygon.id,
                            idx,
                            'lat',
                            e.target.value
                          )
                        }
                        className="bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 focus:outline-none"
                        step="0.0001"
                        readOnly={editingId !== polygon.id}
                      />
                      ° N,{' '}
                      <input
                        type="number"
                        value={coord.lng().toFixed(4)}
                        onChange={(e) =>
                          handlePolygonChange(
                            polygon.id,
                            idx,
                            'lng',
                            e.target.value
                          )
                        }
                        className="bg-transparent border-none text-gray-900 dark:text-white focus:ring-0 focus:outline-none"
                        step="0.0001"
                        readOnly={editingId !== polygon.id}
                      />
                      ° W
                    </div>
                  ))}
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => toggleEdit(polygon.id)}
                  >
                    {editingId === polygon.id ? 'Save' : 'Edit'}
                  </button>{' '}
                  |{' '}
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeletePolygon(polygon.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default CoordinatesTable
