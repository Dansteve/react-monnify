import React from 'react';
// @ts-ignore
import {renderHook, cleanup, act} from '@testing-library/react-hooks';
import {render, fireEvent} from '@testing-library/react';
import {callMonnifySDK} from '../monnify-actions';
import useMonnifyScript from '../monnify-script';
import MonnifyButton from '../monnify-button';
import {config} from './fixtures';

jest.mock('../monnify-actions');

const componentProps = {
  ...config,
  className: 'btn',
  text: 'Pay my damn money',
  onSuccess: () => null,
  onClose: () => null,
};

describe('<MonnifyButton />', () => {
  beforeEach(() => {
    // @ts-ignore
    callMonnifySDK = jest.fn();
    renderHook(() => useMonnifyScript());
  });

  afterAll(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('render MonnifyButton', () => {
    const tree = <MonnifyButton {...componentProps} />;
    const {getByText}: Record<string, any> = render(tree);
    // Click button
    fireEvent.click(getByText('Pay my damn money'));
    // @ts-ignore
    expect(callMonnifySDK).toHaveBeenCalledTimes(1);
  });
});
