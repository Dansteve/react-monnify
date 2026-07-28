import {MonnifySDK} from './types';

const getSDK = (): MonnifySDK | undefined =>
  typeof window === 'undefined' ? undefined : (window as any).MonnifySDK;

export const callMonnifySDK = (monnifyArgs: Record<string, any>): void => {
  const sdk = getSDK();
  if (!sdk || typeof sdk.initialize !== 'function') {
    throw new Error(
      'react-monnify: the Monnify SDK is not available on window. ' +
        'Wait for the script to finish loading before starting a payment.',
    );
  }
  sdk.initialize(monnifyArgs);
};
