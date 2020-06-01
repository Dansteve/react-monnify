# react-gladepay

This is a react library for implementing gladepay payment gateway

## Demo

![Demo](React_App.png?raw=true "Demo Image")

## Get Started

This React library provides a wrapper to add Gladepay Payments to your React application

### Install

```sh
npm install react-gladepay --save
```

or with `yarn`

```sh
yarn add react-gladepay
```

### Usage

```javascript
    import React, { Component } from 'react';
    //import the library
    import GladepayButton from 'react-gladepay';

    class App extends Component {

    	state = {
    		MID: "GP0000001", //Gladepay Merchant ID
    		email: "demo@gmail.com",  // customer email
        amount: 10000 //equals NGN100,
        is_production: false //is_production,
    	}

    	callback = (response) => {
    		console.log(response); // card charged successfully, get reference here
    	}

    	close = () => {
    		console.log("Payment closed");
    	}

      render() {
        return (
          <div>
            <p>
              <GladepayButton
                text="Make Payment"
                className="payButton"
                callback={this.callback}
                close={this.close}
                disabled={true} {/*disable payment button*/}
                embed={true} {/*payment embed in your app instead of a pop up*/}
                email={this.state.email}
                amount={this.state.amount}
                MID={this.state.MID}
                tag="button"{/*it can be button or a or input tag */}
              />
            </p>
          </div>
        );
      }
    }

    export default App;
```

Please checkout [Gladepay Documentation](https://developer.glade.ng/docs/#gladepay-inline-checkout) for other available options you can add to the tag

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
