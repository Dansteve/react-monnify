import React from 'react';
import logo from './logo.svg';
import {useMonnifyPayment, MonnifyButton, MonnifyConsumer} from 'react-monnify';
import './App.css';

const config = {
  amount: 5000,
  currency: 'NGN',
  reference: '' + Math.floor(Math.random() * 1000000000 + 1),
  customerFullName: 'John Doe',
  customerEmail: 'monnify@monnify.com',
  customerMobileNumber: '08121281921',
  apiKey: 'MK_TEST_SAF7HR5F3F',
  contractCode: '4934121693',
  paymentDescription: 'Test Pay',
  isTestMode: true,
  metadata: {
    name: 'Damilare',
    age: 45,
  },
};

const MonnifyHookExample = () => {
  const componentProps = {
    ...config,
    onSuccess: response => console.log(response),
    onClose: response => console.log(response),
  };
  const initializePayment = useMonnifyPayment(componentProps);
  return (
    <div>
      <button
        onClick={() => {
          initializePayment();
        }}
      >
        Monnify Hooks Implementation
      </button>
    </div>
  );
};

function App() {
  const componentProps = {
    ...config,
    text: 'Monnify Button Implementation',
    onSuccess: (response) => console.log(response),
    onClose: (response) => console.log(response),
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Implementation Monnify React
        </a>
      </header>
      <div>
        <MonnifyHookExample className="btn" />
      </div>
      <div>
        <MonnifyButton {...componentProps} className="btn" />
      </div>
      <div>
        <MonnifyConsumer {...componentProps} className="btn">
          {({initializePayment}) => (
            <button onClick={() => initializePayment()}>Monnify Consumer Implementation</button>
          )}
        </MonnifyConsumer>
      </div>
    </div>
  );
}

export default App;
