//----------------------------------------------------------------------------------------------------------------------
//Format bytes into kB, MB, GB
//----------------------------------------------------------------------------------------------------------------------
export function formatBytes(bytes: number, decimals = 2): string {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
//----------------------------------------------------------------------------------------------------------------------
//Format seconds into minutes, hours and days
//----------------------------------------------------------------------------------------------------------------------
export function secondsToHms(t: number): string {
  t = Number(t)
  const d = Math.floor(t / (3600 * 24))
  t = t % (3600 * 24)
  const h = Math.floor(t / 3600)
  const m = Math.floor((t % 3600) / 60)
  const s = Math.floor((t % 3600) % 60)

  const dDisplay = d > 0 ? d + 'd ' : ''
  const hDisplay = h > 0 ? h + 'h ' : ''

  let mDisplay = ''

  if (h > 0) {
    if (m < 10) {
      mDisplay += '0'
    }
    mDisplay += m.toString() + 'm '
  } else {
    mDisplay = m > 0 ? m + 'm ' : ''
  }

  let sDisplay = ''

  if (m > 0) {
    if (s < 10) {
      sDisplay += '0'
    }
    sDisplay += s.toString() + 's'
  } else {
    sDisplay = s + 's'
  }

  return `${dDisplay}${hDisplay}${mDisplay}${sDisplay}`
}
//----------------------------------------------------------------------------------------------------------------------
//Format decimal coordinates into nautical style
//----------------------------------------------------------------------------------------------------------------------
export function ConvertDEGToDMS(deg: number, lat: boolean): string {
  const absolute = Math.abs(deg)

  const degrees = Math.floor(absolute)
  const minutesNotTruncated = (absolute - degrees) * 60
  const minutes = Math.floor(minutesNotTruncated)
  const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2)

  let direction = ''
  if (lat) {
    direction = deg >= 0 ? 'N' : 'S'
  } else {
    direction = deg >= 0 ? 'E' : 'W'
  }

  return degrees + '°' + minutes + "'" + seconds + '"' + direction
}
