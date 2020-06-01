import React from 'react';
// @ts-ignore
import {renderHook, cleanup, act} from '@testing-library/react-hooks';
import {render, fireEvent} from '@testing-library/react';
import {callGladepaySDK} from '../gladepay-actions';
import useGladepayScript from '../gladepay-script';
import GladepayConsumer from '../gladepay-consumer';
import {config} from './fixtures';

jest.mock('../gladepay-actions');

const componentProps = {
  ...config,
  text: 'Pay my damn money',
  onSuccess: () => null,
  onClose: () => null,
};

describe('<GladepayProvider />', () => {
  beforeEach(() => {
    // @ts-ignore
    callGladepaySDK = jest.fn();
    renderHook(() => useGladepayScript());
  });

  afterAll(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('render GladepayProvider', () => {
    const tree = (
      <GladepayConsumer {...componentProps}>
        {({initializePayment}: Record<string, any>) => (
          <button onClick={() => initializePayment()}>Use render props 2000</button>
        )}
      </GladepayConsumer>
    );
    const {getByText}: Record<string, any> = render(tree);
    // Click button
    fireEvent.click(getByText('Use render props 2000'));
    // @ts-ignore
    expect(callGladepaySDK).toHaveBeenCalledTimes(1);
  });
});
