# react-monnify

This is a react library for implementing monnify payment gateway

## Demo

![Demo](App.png?raw=true 'Demo Image')

## Get Started

This React library provides a wrapper to add Monnify Payments to your React application

### Install

```sh
npm install react-monnify --save
```

or with `yarn`

```sh
yarn add react-monnify
```

### Usage

```javascript
    import React, { Component } from 'react';
    //import the library
    import MonnifyButton from 'react-monnify';

    class App extends Component {

    	state = {
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
    	}

    	onComplete = (response) => {
    		console.log(response); // card charged successfully, get reference here
    	}

    	close = (response) => {
    		console.log(response);
    	}

      render() {
        return (
        <div>
          <MonnifyHookExample className="btn" />
        </div>
        <div>
            <p>
              <MonnifyButton
                text="Make Payment"
                className="payButton"
                onComplete={this.onComplete}
                close={this.close}
                disabled={true} {/*disable payment button*/}
                embed={true} {/*payment embed in your app instead of a pop up*/}
                customerFullName={this.state.customerFullName}
                customerEmail={this.state.customerEmail}
                customerMobileNumber={this.state.customerMobileNumber}
                amount={this.state.amount}
                apiKey={this.state.apiKey}
                contractCode={this.state.contractCode}
                reference={this.state.reference}
                tag="button"{/*it can be button or a or input tag */}
              />
            </p>
        </div>
        <div>
        <MonnifyConsumer {...componentProps} className="btn">
          {({initializePayment}) => (
            <button onClick={() => initializePayment()}>Monnify Consumer Implementation</button>
          )}
        </MonnifyConsumer>
      </div>
        );
      }
    }

    export default App;
```

Please checkout [Monnify Documentation](https://docs.teamapt.com/display/MON/Monnify+Web+SDK) for other available options you can add to the tag

## Deployment

REMEMBER TO CHANGE THE MID WHEN DEPLOYING ON A LIVE/PRODUCTION SYSTEM

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Some commit message'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request 😉😉

## How can I thank you?

Why not star the github repo? I'd love the attention! Why not share the link for this repository on Twitter or Any Social Media? Spread the word!

Don't forget to [follow me on twitter](https://twitter.com/dansteveade)!

Thanks!
Adekanbi Dansteve.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
