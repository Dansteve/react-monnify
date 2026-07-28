# react-monnify

React hooks and components for accepting payments with the [Monnify](https://monnify.com) payment gateway.

[![npm](https://img.shields.io/npm/v/react-monnify.svg)](https://www.npmjs.com/package/react-monnify)
[![license](https://img.shields.io/npm/l/react-monnify.svg)](LICENSE.md)

![Monnify checkout: bank transfer, card and success states](App.png?raw=true 'Monnify checkout via react-monnify')

<p align="center">
  <img src="docs/demo-app.png?raw=true" alt="The bundled example app" width="380">
</p>

---

## ⚠️ Upgrading from 0.0.x — read this

0.0.x had a bug where the `isTestMode` check in `useMonnifyScript` had **identical URLs in both branches**, so the sandbox URL was requested regardless of the flag.

In practice this had **no runtime effect**: `sandbox.sdk.monnify.com/plugin/monnify.js` and `sdk.monnify.com/plugin/monnify.js` are byte-for-byte the same file, and the SDK picks its environment from your API key prefix (`MK_PROD_`), not from the script host. **Live payments were not being routed to sandbox.** The fix is still worth taking — relying on two URLs staying identical is fragile — but you do not have a historical incident to investigate.

The changes most likely to affect you are the [React peer range](#requirements), `initializePayment` now throwing instead of silently doing nothing, and the new build output. See [Migrating from 0.0.x](#migrating-from-00x).

---

## Requirements

- React **16.8 or later** (17, 18 and 19 are supported)
- Node 18+ to build from source

> 0.0.x declared support for React 15, but the library is built on hooks and has never worked below 16.8.

## Install

```sh
npm install react-monnify
```

```sh
yarn add react-monnify
```

## Quick start

```jsx
import {MonnifyButton} from 'react-monnify';

export default function Checkout() {
  return (
    <MonnifyButton
      text="Make Payment"
      className="payButton"
      apiKey="MK_TEST_SAF7HR5F3F"
      contractCode="4934121693"
      amount={5000}
      currency="NGN"
      reference={`ref-${Date.now()}`}
      customerFullName="John Doe"
      customerEmail="john@example.com"
      customerMobileNumber="08121281921"
      paymentDescription="Test Pay"
      isTestMode
      onSuccess={(response) => console.log('paid', response)}
      onClose={(response) => console.log('closed', response)}
    />
  );
}
```

### `isTestMode` controls which SDK is loaded

| `isTestMode` | Script loaded |
| --- | --- |
| `true` | `https://sandbox.sdk.monnify.com/plugin/monnify.js` |
| `false` *(default)* | `https://sdk.monnify.com/plugin/monnify.js` |

Use your **test** API key with `isTestMode`, and your **live** key without it. Passing a live key while `isTestMode` is set will fail.

## Usage

### `useMonnifyPayment` hook

```jsx
import {useMonnifyPayment} from 'react-monnify';

function DonateButton() {
  const config = {
    apiKey: 'MK_TEST_SAF7HR5F3F',
    contractCode: '4934121693',
    amount: 5000,
    currency: 'NGN',
    reference: `ref-${Date.now()}`,
    customerFullName: 'John Doe',
    customerEmail: 'john@example.com',
    customerMobileNumber: '08121281921',
    isTestMode: true,
  };

  const initializePayment = useMonnifyPayment(config);

  return (
    <button onClick={() => initializePayment(onSuccess, onClose)}>
      Donate
    </button>
  );
}
```

`initializePayment` **throws** if it is called before the Monnify script has loaded, or if the script failed to load. To avoid that, gate your button on the script state:

```jsx
import {useMonnifyScript, useMonnifyPayment} from 'react-monnify';

function PayButton(config) {
  const [ready, failed] = useMonnifyScript(config.isTestMode);
  const initializePayment = useMonnifyPayment(config);

  if (failed) return <p>Payment is unavailable right now.</p>;

  return (
    <button disabled={!ready} onClick={() => initializePayment(onSuccess, onClose)}>
      {ready ? 'Pay' : 'Loading…'}
    </button>
  );
}
```

### `MonnifyConsumer` render prop

```jsx
import {MonnifyConsumer} from 'react-monnify';

<MonnifyConsumer {...config} onSuccess={onSuccess} onClose={onClose}>
  {({initializePayment}) => (
    <button onClick={initializePayment}>Pay with Monnify</button>
  )}
</MonnifyConsumer>;
```

`MonnifyConsumer` forwards refs. The ref is handed to the render prop:

```jsx
<MonnifyConsumer {...config} ref={myRef}>
  {({initializePayment, ref}) => (
    <button ref={ref} onClick={initializePayment}>Pay</button>
  )}
</MonnifyConsumer>
```

### `MonnifyProvider`

Wrap a subtree so nested components share one payment configuration.

```jsx
import {MonnifyProvider} from 'react-monnify';

<MonnifyProvider {...config} onSuccess={onSuccess} onClose={onClose}>
  <Checkout />
</MonnifyProvider>;
```

## API

### Payment options

Accepted by `useMonnifyPayment`, `MonnifyButton`, `MonnifyConsumer` and `MonnifyProvider`.

| Option | Type | Required | Description |
| --- | --- | --- | --- |
| `apiKey` | `string` | ✅ | Merchant API key from the Monnify dashboard |
| `contractCode` | `string` | ✅ | Merchant contract code |
| `amount` | `number` | ✅ | Amount to charge |
| `reference` | `string` | ✅ | Your unique reference for this transaction |
| `currency` | `string` | ✅ | Defaults to `NGN` |
| `customerFullName` | `string` | ✅ | Customer's full name |
| `customerEmail` | `string` | ✅ | Customer's email |
| `customerMobileNumber` | `string` | ✅ | Customer's phone number |
| `isTestMode` | `boolean` | | Load the sandbox SDK. Defaults to `false` |
| `paymentDescription` | `string` | | Used as the account name for bank-transfer payments |
| `redirectUrl` | `string` | | Where to send the customer after payment |
| `metadata` | `object` | | Extra data passed through to the API |
| `incomeSplitConfig` | `MonnifySplitOptions[]` | | Split-payment configuration |
| `transactionHash` | `object` | | Transaction hash, for response verification |

### `MonnifyButton` props

Everything above, plus:

| Prop | Type | Description |
| --- | --- | --- |
| `text` | `string` | Button label |
| `children` | `ReactNode` | Used when `text` is absent |
| `className` | `string` | CSS class |
| `disabled` | `boolean` | Disable the button |
| `type` | `'button'`, `'submit'` or `'reset'` | Defaults to `'button'` |
| `onSuccess` | `Function` | Called on completion |
| `onClose` | `Function` | Called when the modal closes |

### Exports

```js
import {
  useMonnifyPayment,
  useMonnifyScript,
  MonnifyButton,
  MonnifyConsumer,
  MonnifyProvider,
  getMonnifyScriptUrl,
  MONNIFY_SANDBOX_SDK_URL,
  MONNIFY_PRODUCTION_SDK_URL,
} from 'react-monnify';
```

TypeScript types `MonnifyProps`, `MonnifySplitOptions`, `MonnifySDK` and `MonnifyRenderProps` are exported too.

## Migrating from 0.0.x

| Change | Impact |
| --- | --- |
| The correct host is now requested per `isTestMode` | No behavioural change — both hosts serve the same file (see above). Cosmetic in the Network tab. |
| **`customerName` is now sent to Monnify** | The SDK builds its transaction payload from `customerName`, but the library only ever set `customerFullName`, so the customer's name never reached Monnify. It does now. |
| `initializePayment` throws instead of silently doing nothing when the script is not ready | Gate the call on `useMonnifyScript`, or catch the error. |
| Script `error` no longer reports `loaded: true` | `useMonnifyScript` returns `[false, true]` on failure instead of `[true, true]`. |
| `MonnifyConsumer` ref actually reaches the render prop | It was always `undefined` before. |
| Peer range is now `react@^16.8 || ^17 || ^18 || ^19` | React 15 was never actually supported. |
| `react-dom` peer dependency removed | The library never imported it. |
| Build output is `dist/index.cjs` + `dist/index.mjs` with an `exports` map | Deep imports into `dist/` are no longer supported. |

## Development

```sh
npm install
npm run typecheck
npm test
npm run build
```

### Running the example app

```sh
npm run build                 # the example consumes the built library
cd example
cp .env.example .env          # add your sandbox API key + contract code
npm install
npm run dev                   # http://localhost:3000
```

Monnify's current public sandbox credentials are on the [developer docs](https://developers.monnify.com/api#description/introduction). Note that the demo key and contract code printed in this README before v1.0.0 have been retired — Monnify's API now answers `Could not find specified contract` for them.

Only the API key and contract code belong in a frontend integration. **Never put your Secret Key in browser code** — anything in a `VITE_`-prefixed variable is compiled into the public bundle. The Secret Key is for server-to-server calls such as verifying a transaction.

Each payment attempt needs a **fresh `reference`**; Monnify rejects one it has already seen. The example regenerates it per attempt.

## Documentation

See the [Monnify developer documentation](https://developers.monnify.com/) for the full list of SDK options and for how to verify a transaction server-side.

> **Always verify a payment on your server** before fulfilling an order. Never trust the browser callback alone.

## Contributing

1. Fork it
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Some commit message'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request 😉

## How can I thank you?

Star the repo, and share it! Don't forget to [follow me on twitter](https://twitter.com/dansteveade).

Thanks!
Adekanbi Dansteve.

## License

MIT — see [LICENSE.md](LICENSE.md).
