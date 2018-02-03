# Exchange Rates: USD - SEK

Historical exchange rates for the USD/SEK pair.

## Installation

```sh
npm install --save @xrates/usd-sek
```

## Usage

```js
const usdToSek = require('@xrates/usd-sek')

console.log(usdToSek.lookup('2014-10-15'))
//=> 7.2696
```

## API

### `lookup(date: string | Date): number`

Get the exchange rate for the specified date. The return value is a number that fits the description "1 USD = ? SEK".

If the specific date requested is missing (e.g. due to bank holiday) the closest available date will be used.

If the specified date falls outside the span of the provided data, a RangeError will be thrown.

## Source

The data is collected from Sweden's central bank, **Sveriges Riksbank**, via their official API.
