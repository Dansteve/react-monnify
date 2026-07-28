import {MonnifyProps} from '../types';

export const config: MonnifyProps = {
  apiKey: 'MK_TEST_SAF7HR5F3F',
  contractCode: '4934121693',
  amount: 10000,
  currency: 'NGN',
  reference: 'test-ref-0001',
  customerFullName: 'John Doe',
  customerEmail: 'user@example.com',
  customerMobileNumber: '08121281921',
  paymentDescription: 'Test Pay',
};

/**
 * jsdom never executes or fires load events for injected external scripts, so
 * tests drive the lifecycle by hand.
 */
export const fireScriptLoad = (): void => {
  document.querySelectorAll('script').forEach((script) => script.dispatchEvent(new Event('load')));
};

export const fireScriptError = (): void => {
  document.querySelectorAll('script').forEach((script) => script.dispatchEvent(new Event('error')));
};

/** Installs a fake Monnify SDK on window and returns the initialize spy. */
export const installFakeSDK = (): jest.Mock => {
  const initialize = jest.fn();
  (window as any).MonnifySDK = {initialize};
  return initialize;
};
