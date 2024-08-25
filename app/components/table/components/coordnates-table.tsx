import React from 'react'
import { useMapContext } from '@/app/providers/map-context'
import { Tabs } from '@/app/const'

const CoordinatesTable = ({ activeTab }: { activeTab: string }) => {
  const { markers, polygons, handleDeletePolygon, handleDeleteMarker } =
    useMapContext()

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
                  {marker.name}
                </th>
                <td className="px-6 py-4">
                  {marker.position.lat().toFixed(4)}° N,{' '}
                  {marker.position.lng().toFixed(4)}° W
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:underline">
                    Edit
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
                  Polygon {index + 1}
                </th>
                <td className="px-6 py-4">
                  {polygon.path
                    .map(
                      (coord, idx) =>
                        `Point ${idx + 1}: ${coord.lat().toFixed(4)}° N, ${coord
                          .lng()
                          .toFixed(4)}° W`
                    )
                    .join('; ')}
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-500 hover:underline">
                    Edit
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
