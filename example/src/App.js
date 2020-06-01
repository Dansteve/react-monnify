import React from 'react';
import logo from './logo.svg';
import {useGladepayPayment, GladepayButton, GladepayConsumer} from 'react-gladepay-2';
import './App.css';

const config = {
  MID: 'GP0000001',
  title: 'GladePay Test',
  description: 'Experience GladePay Checkout',
  firstname: 'Customer',
  lastname: 'Customer',
  email: 'danstevea@gmail.com',
  amount: 1,
  country: 'NG',
  currency: 'NGN',
  payment_method: ['card', 'bank', 'ussd', 'qr', 'mobilemoney'],
  is_production:true,
  // logo: 'https://lh3.googleusercontent.com/-rOlOgqQu2gc/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucmWs88G4Uz3QL1uB6jPJAgatI0muQ/photo.jpg?sz=46'
  logo: 'https://www.glade.ng/favicon-32x32.png',
};

const GladepayHookExample = () => {
  const initializePayment = useGladepayPayment(config);
  return (
    <div>
      <button
        onClick={() => {
          initializePayment();
        }}
      >
        Gladepay Hooks Implementation
      </button>
    </div>
  );
};

function App() {
  const componentProps = {
    ...config,
    text: 'Gladepay Button Implementation',
    onSuccess: () => null,
    onClose: () => null,
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={config.logo} className="App-logo" alt="logo" />
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Implementation Gladepay React
        </a>
      </header>
      <div>
        <GladepayHookExample className="btn" />
      </div>
      <div>
      <GladepayButton {...componentProps} className="btn" />
      </div>
      <div>
      <GladepayConsumer {...componentProps} className="btn">
        {({initializePayment}) => (
          <button onClick={() => initializePayment()}>Gladepay Consumer Implementation</button>
        )}
      </GladepayConsumer>
       </div>
    </div>
  );
}

export default App;
