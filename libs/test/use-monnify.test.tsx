import React from 'react';
import {renderHook, render, fireEvent, act, waitFor} from '@testing-library/react';
import useMonnifyPayment from '../use-monnify';
import {__resetMonnifyScriptCache} from '../monnify-script';
import {config, fireScriptLoad, fireScriptError, installFakeSDK} from './fixtures';

let initialize: jest.Mock;

beforeEach(() => {
  __resetMonnifyScriptCache();
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  initialize = installFakeSDK();
});

/** Renders the hook and drives the script through a successful load. */
const renderReady = async (options = config) => {
  const view = renderHook(() => useMonnifyPayment(options));
  await act(async () => {
    fireScriptLoad();
  });
  await waitFor(() => expect(document.querySelector('script')).toBeTruthy());
  return view;
};

describe('useMonnifyPayment()', () => {
  it('calls the SDK once the script has loaded', async () => {
    const {result} = await renderReady();

    act(() => {
      result.current();
    });

    expect(initialize).toHaveBeenCalledTimes(1);
  });

  it('forwards onComplete and onClose to the SDK', async () => {
    const {result} = await renderReady();
    const onComplete = jest.fn();
    const onClose = jest.fn();

    act(() => {
      result.current(onComplete, onClose);
    });

    const args = initialize.mock.calls[0][0];
    expect(args.onComplete).toBe(onComplete);
    expect(args.onClose).toBe(onClose);
  });

  it('passes the merchant configuration through', async () => {
    const {result} = await renderReady();

    act(() => {
      result.current();
    });

    expect(initialize.mock.calls[0][0]).toMatchObject({
      apiKey: config.apiKey,
      contractCode: config.contractCode,
      amount: config.amount,
      reference: config.reference,
      currency: 'NGN',
      customerEmail: config.customerEmail,
    });
  });

  it('strips null and undefined values before calling the SDK', async () => {
    const {result} = await renderReady();

    act(() => {
      result.current();
    });

    const args = initialize.mock.calls[0][0];
    // incomeSplitConfig defaults to null internally and must not be forwarded.
    expect(args).not.toHaveProperty('incomeSplitConfig');
    Object.values(args).forEach((value) => expect(value).not.toBeNull());
  });

  // Previously this returned silently, so an early click looked like a no-op
  // to the user and to the merchant's own logging.
  it('throws a clear error if called before the script finishes loading', () => {
    const {result} = renderHook(() => useMonnifyPayment(config));

    expect(() => result.current()).toThrow(/still loading/i);
    expect(initialize).not.toHaveBeenCalled();
  });

  it('throws if the script failed to load', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const {result} = renderHook(() => useMonnifyPayment(config));

    await act(async () => {
      fireScriptError();
    });
    await waitFor(() => expect(consoleError).toHaveBeenCalled());

    expect(() => result.current()).toThrow(/unable to load/i);
    expect(initialize).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('can be triggered from another component', async () => {
    const {result} = await renderReady();

    const Btn = (): React.ReactElement => (
      <button onClick={(): void => result.current()}>Donation</button>
    );
    const {getByText} = render(<Btn />);
    fireEvent.click(getByText('Donation'));

    expect(initialize).toHaveBeenCalledTimes(1);
  });
});
