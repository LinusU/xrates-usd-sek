const fs = require('fs')
const path = require('path')

const getDayOfYear = require('date-fns/get_day_of_year')
const getYear = require('date-fns/get_year')

const cache = new Map()

function loadFile (name) {
  if (!cache.has(name)) {
    const raw = fs.readFileSync(path.join(__dirname, `data/${name}`))
    const count = (raw.byteLength / Float32Array.BYTES_PER_ELEMENT) | 0

    cache.set(name, new Float32Array(raw.buffer, raw.byteOffset, count))
  }

  return cache.get(name)
}

exports.lookup = function (date) {
  const year = getYear(date)

  if (year < 2010) throw new RangeError('Exchange rates before 2010-01-01 aren\'t available')
  if (year > 2018) throw new RangeError('Exchange rates after 2018-12-31 aren\'t available')

  const data = loadFile(String(year))
  const offset = getDayOfYear(date) - 1

  if (Number.isFinite(data[offset + 0])) return Number(data[offset + 0].toFixed(4))
  if (Number.isFinite(data[offset - 1])) return Number(data[offset - 1].toFixed(4))
  if (Number.isFinite(data[offset + 1])) return Number(data[offset + 1].toFixed(4))
  if (Number.isFinite(data[offset - 2])) return Number(data[offset - 2].toFixed(4))
  if (Number.isFinite(data[offset + 2])) return Number(data[offset + 2].toFixed(4))
  if (Number.isFinite(data[offset - 3])) return Number(data[offset - 3].toFixed(4))
  if (Number.isFinite(data[offset + 3])) return Number(data[offset + 3].toFixed(4))

  throw new Error('No data could be find for the date: ' + date)
}
