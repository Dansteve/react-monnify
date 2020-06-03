import React from 'react';
// @ts-ignore
import {renderHook, cleanup, act} from '@testing-library/react-hooks';
import {render, fireEvent} from '@testing-library/react';
import {callMonnifySDK} from '../monnify-actions';
import useMonnifyScript from '../monnify-script';
import MonnifyConsumer from '../monnify-consumer';
import {config} from './fixtures';

jest.mock('../monnify-actions');

const componentProps = {
  ...config,
  text: 'Pay my damn money',
  onSuccess: () => null,
  onClose: () => null,
};

describe('<MonnifyProvider />', () => {
  beforeEach(() => {
    // @ts-ignore
    callMonnifySDK = jest.fn();
    renderHook(() => useMonnifyScript());
  });

  afterAll(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('render MonnifyProvider', () => {
    const tree = (
      <MonnifyConsumer {...componentProps}>
        {({initializePayment}: Record<string, any>) => (
          <button onClick={() => initializePayment()}>Use render props 2000</button>
        )}
      </MonnifyConsumer>
    );
    const {getByText}: Record<string, any> = render(tree);
    // Click button
    fireEvent.click(getByText('Use render props 2000'));
    // @ts-ignore
    expect(callMonnifySDK).toHaveBeenCalledTimes(1);
  });
});
