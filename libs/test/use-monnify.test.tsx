// @ts-ignore
import {renderHook, cleanup, act} from '@testing-library/react-hooks';
import {render, fireEvent} from '@testing-library/react';
import React from 'react';
import useMonnifyPayment from '../use-monnify';
import {callMonnifySDK} from '../monnify-actions';
import useMonnifyScript from '../monnify-script';
import {config} from './fixtures';

jest.mock('../monnify-actions');

describe('useMonnifyPayment()', () => {
  beforeEach(() => {
    // @ts-ignore
    callMonnifySDK = jest.fn();
    renderHook(() => useMonnifyScript());
  });

  afterAll(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('should use useMonnifyPayment', () => {
    const {result, rerender} = renderHook(() => useMonnifyPayment(config));
    rerender();

    const onSuccess = jest.fn();
    const onClose = jest.fn();
    act(() => {
      result.current(onSuccess, onClose);
    });

    expect(onSuccess).toHaveBeenCalledTimes(0);
    expect(onClose).toHaveBeenCalledTimes(0);
    expect(callMonnifySDK).toHaveBeenCalledTimes(1);
  });

  it('should pass if initializePayment does not accept any args', () => {
    const {result, rerender} = renderHook(() => useMonnifyPayment(config));
    rerender();

    act(() => {
      result.current();
    });

    expect(callMonnifySDK).toHaveBeenCalledTimes(1);
  });

  it('should useMonnifyPayment accept all parameters', () => {
    const {result, rerender} = renderHook(() =>
      useMonnifyPayment({
        ...config,
        metadata: JSON.stringify({
          custom_field: [
            {
              display_name: 'Mobile Number',
              variable_name: 'mobile_number',
              value: '+2348143109254',
            },
          ],
        }),
        currency: 'NGN',
        payment_method: ['mobile_money', 'ussd'],
      }),
    );
    rerender();
    act(() => {
      result.current();
    });

    expect(callMonnifySDK).toHaveBeenCalledTimes(1);
  });

  it('should be accept trigger from other component', () => {
    const {result, rerender} = renderHook(() => useMonnifyPayment(config));
    rerender();
    const Btn = (): any => (
      <div>
        <button onClick={(): any => result.current()}>Donation</button>{' '}
      </div>
    );

    const {getByText}: Record<string, any> = render(<Btn />);
    // Click button
    fireEvent.click(getByText('Donation'));
    // @ts-ignore
    expect(callMonnifySDK).toHaveBeenCalledTimes(1);
  });

  it('should accept being rendered in a container', () => {
    const wrapper: React.FC = ({children}: Record<string, any>) => {
      return <div>{children}</div>;
    };

    const {result, rerender} = renderHook(() => useMonnifyPayment(config), {wrapper});

    rerender();
    act(() => {
      result.current();
    });

    // @ts-ignore
    expect(callMonnifySDK).toHaveBeenCalledTimes(1);
  });
});
