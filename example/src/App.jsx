import React, {useMemo, useState} from 'react';
import logo from './logo.svg';
import {useMonnifyPayment, useMonnifyScript, MonnifyButton, MonnifyConsumer} from 'react-monnify';
import './App.css';

// Supply your own sandbox credentials from the Monnify dashboard via a .env
// file (see .env.example). The demo key/contract that used to be hardcoded here
// were retired by Monnify — its API answers "Could not find specified contract".
const API_KEY = import.meta.env.VITE_MONNIFY_API_KEY;
const CONTRACT_CODE = import.meta.env.VITE_MONNIFY_CONTRACT_CODE;

const baseConfig = {
  amount: 5000,
  currency: 'NGN',
  customerFullName: 'John Doe',
  customerEmail: 'monnify@monnify.com',
  customerMobileNumber: '08121281921',
  apiKey: API_KEY,
  contractCode: CONTRACT_CODE,
  paymentDescription: 'Test Pay',
  isTestMode: true,
  // Where Monnify sends the customer after payment. Must be a valid absolute
  // URL if set — the SDK validates it and rejects anything malformed.
  redirectUrl: 'https://dansteve.com',
  metadata: {
    name: 'Damilare',
    age: 45,
  },
};

const freshReference = () => `ref-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

const onSuccess = (response) => console.log('success', response);
const onClose = (response) => console.log('closed', response);

/**
 * Monnify burns a reference the moment it is used — reusing one comes back as
 * "Duplicate payment reference", which the checkout surfaces as the generic
 * "Unable to process your transaction request."
 *
 * So each demo below owns its OWN reference and rolls it immediately after
 * every click, not just on success. Sharing one config object across two
 * components means paying with either one spends the other's reference too.
 */
const useAttemptConfig = () => {
  const [reference, setReference] = useState(freshReference);
  const config = useMemo(() => ({...baseConfig, reference}), [reference]);
  return [config, () => setReference(freshReference())];
};

const MonnifyHookExample = () => {
  const [config, nextAttempt] = useAttemptConfig();
  // Gate the button on the script state — initializePayment throws if the
  // Monnify SDK has not finished loading yet.
  const [ready, failed] = useMonnifyScript(config.isTestMode);
  const initializePayment = useMonnifyPayment(config);

  if (failed) return <p>Could not load the Monnify SDK.</p>;

  return (
    <button
      disabled={!ready}
      onClick={() => {
        initializePayment(onSuccess, onClose);
        nextAttempt();
      }}
    >
      {ready ? 'Monnify Hooks Implementation' : 'Loading Monnify…'}
    </button>
  );
};

const MonnifyButtonExample = () => {
  const [config, nextAttempt] = useAttemptConfig();
  return (
    <MonnifyButton
      {...config}
      className="btn"
      text="Monnify Button Implementation"
      onSuccess={(r) => {
        nextAttempt();
        onSuccess(r);
      }}
      onClose={(r) => {
        nextAttempt();
        onClose(r);
      }}
    />
  );
};

const MonnifyConsumerExample = () => {
  const [config, nextAttempt] = useAttemptConfig();
  return (
    <MonnifyConsumer
      {...config}
      onSuccess={(r) => {
        nextAttempt();
        onSuccess(r);
      }}
      onClose={(r) => {
        nextAttempt();
        onClose(r);
      }}
    >
      {({initializePayment}) => (
        <button onClick={initializePayment}>Monnify Consumer Implementation</button>
      )}
    </MonnifyConsumer>
  );
};

function App() {
  if (!API_KEY || !CONTRACT_CODE) {
    return (
      <div className="App" style={{padding: 32}}>
        <h2>Missing Monnify credentials</h2>
        <p>
          Copy <code>example/.env.example</code> to <code>example/.env</code> and set{' '}
          <code>VITE_MONNIFY_API_KEY</code> and <code>VITE_MONNIFY_CONTRACT_CODE</code>, then
          restart the dev server.
        </p>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://github.com/Dansteve/react-monnify"
          target="_blank"
          rel="noopener noreferrer"
        >
          react-monnify
        </a>
      </header>

      <div>
        <MonnifyHookExample />
      </div>

      <div>
        <MonnifyButtonExample />
      </div>

      <div>
        <MonnifyConsumerExample />
      </div>
    </div>
  );
}

export default App;
