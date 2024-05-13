import type { GPSCoords, ManagerList } from '@/interface'

// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
export function setOptions(obj: any, options: any) {
  if (!Object.hasOwn(obj, 'options')) {
    obj._options = obj._options ? Object.create(obj._options) : {}
  }
  for (const i in options) {
    if (Object.hasOwn(options, i)) {
      obj._options[i] = options[i]
    }
  }
  return obj._options
}

export function latLngToMLPoints(coords: Array<GPSCoords>) {
  const points: Array<[lng: number, lat: number]> = []
  coords.forEach((value) => {
    points.push([value.lng, value.lat])
  })
  return points
}

export function pushParrent(arrList: Array<ManagerList>, insertedElement: ManagerList) {
  arrList.forEach((item) => {
    if (item.ID == insertedElement.parentID) {
      if (!item.items) item.items = []
      item.items.push(insertedElement)
    } else if (item.items) pushParrent(item.items, insertedElement)
  })
}
