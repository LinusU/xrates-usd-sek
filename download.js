#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const eachDay = require('date-fns/each_day')
const endOfYear = require('date-fns/end_of_year')
const format = require('date-fns/format')
const soap = require('soap')

async function main (year) {
  const client = await soap.createClientAsync('https://swea.riksbank.se/sweaWS/wsdl/sweaWS_ssl.wsdl')

  const start = new Date(year, 0, 1)
  const end = endOfYear(start)

  const args = {
    crossRequestParameters: {
      aggregateMethod: 'D',
      crossPair: {
        seriesid1: 'SEK',
        seriesid2: 'SEKUSDPMI'
      },
      datefrom: format(start, 'YYYY-MM-DD'),
      dateto: format(end, 'YYYY-MM-DD'),
      languageid: 'en'
    }
  }

  const response = await client.getCrossRatesAsync(args)
  const result = response.return.groups.series.find(s => s.seriesname === '1 USD = ? SEK')
  const data = new Map(result.resultrows.map(row => [row.date, Number(row.value)]))

  const output = new Float32Array(eachDay(start, end).map((date) => {
    const key = format(date, 'YYYY-MM-DD')

    console.log(key, (data.has(key) ? data.get(key) : Number.NaN))
    return (data.has(key) ? data.get(key) : Number.NaN)
  }))

  const asBuffer = Buffer.from(output.buffer, output.byteOffset, output.byteLength)

  fs.writeFileSync(path.join(__dirname, `data/${year}`), asBuffer)
}

const year = Number(process.argv[2])

if (Number.isFinite(year)) {
  main(year).catch((err) => {
    process.exitCode = 1
    console.error(err.stack)
  })
} else {
  console.error('Usage:')
  console.error('  ./download.js <year>')
  process.exitCode = 1
}
