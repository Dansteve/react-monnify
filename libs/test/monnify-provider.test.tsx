import React, {useRef} from 'react';
import {render, fireEvent, act, waitFor, screen} from '@testing-library/react';
import MonnifyConsumer from '../monnify-consumer';
import {__resetMonnifyScriptCache} from '../monnify-script';
import {config, fireScriptLoad, installFakeSDK} from './fixtures';

let initialize: jest.Mock;

const componentProps = {
  ...config,
  isTestMode: true,
  onSuccess: (): null => null,
  onClose: (): null => null,
};

beforeEach(() => {
  __resetMonnifyScriptCache();
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  initialize = installFakeSDK();
});

const loadScript = async (): Promise<void> => {
  await act(async () => {
    fireScriptLoad();
  });
  await waitFor(() => expect(document.querySelector('script')).toBeTruthy());
};

describe('<MonnifyConsumer />', () => {
  it('gives the render prop a working initializePayment', async () => {
    render(
      <MonnifyConsumer {...componentProps}>
        {({initializePayment}) => <button onClick={initializePayment}>Use render props</button>}
      </MonnifyConsumer>,
    );

    await loadScript();
    fireEvent.click(screen.getByText('Use render props'));

    expect(initialize).toHaveBeenCalledTimes(1);
  });

  it('wires onSuccess and onClose through the provider context', async () => {
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    render(
      <MonnifyConsumer {...componentProps} onSuccess={onSuccess} onClose={onClose}>
        {({initializePayment}) => <button onClick={initializePayment}>Pay</button>}
      </MonnifyConsumer>,
    );

    await loadScript();
    fireEvent.click(screen.getByText('Pay'));

    const args = initialize.mock.calls[0][0];
    expect(args.onComplete).toBe(onSuccess);
    expect(args.onClose).toBe(onClose);
  });

  // The ref used to arrive undefined: it was passed as a `ref` prop to a plain
  // function component, which React strips rather than forwards.
  it('forwards a ref through to the render prop', async () => {
    let seenRef: unknown = 'not-called';

    const Host = (): React.ReactElement => {
      const ref = useRef<HTMLButtonElement>(null);
      return (
        <MonnifyConsumer {...componentProps} ref={ref}>
          {({initializePayment, ref: innerRef}) => {
            seenRef = innerRef;
            return (
              <button ref={innerRef as React.Ref<HTMLButtonElement>} onClick={initializePayment}>
                Pay
              </button>
            );
          }}
        </MonnifyConsumer>
      );
    };

    render(<Host />);
    await loadScript();

    expect(seenRef).not.toBe('not-called');
    expect(seenRef).not.toBeUndefined();
  });
});
