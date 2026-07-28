import {useEffect} from 'react';
import {MonnifyProps} from './types';
import useMonnifyScript from './monnify-script';
import {callMonnifySDK} from './monnify-actions';

/** Strips null/undefined so the SDK never receives empty optional fields. */
const clean = (obj: Record<string, any>): Record<string, any> => {
  const out: Record<string, any> = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== null && obj[key] !== undefined) out[key] = obj[key];
  }
  return out;
};

export default function useMonnifyPayment(
  options: MonnifyProps,
): (onComplete?: Function, onClose?: Function) => void {
  const [scriptLoaded, scriptError] = useMonnifyScript(options.isTestMode);
  const {
    isTestMode,
    apiKey,
    contractCode,
    amount,
    reference,
    currency,
    customerFullName,
    customerEmail,
    customerMobileNumber,
    paymentDescription,
    redirectUrl,
    metadata,
    incomeSplitConfig,
  } = options;

  useEffect(() => {
    // Surface the failure without tearing down the host app — throwing from an
    // effect would unmount the whole tree for what is a recoverable condition.
    if (scriptError) {
      // eslint-disable-next-line no-console
      console.error(
        'react-monnify: the Monnify inline script failed to load. Payments cannot start.',
      );
    }
  }, [scriptError]);

  function initializePayment(onComplete?: Function, onClose?: Function): void {
    if (scriptError) {
      throw new Error('react-monnify: unable to load the Monnify inline script');
    }

    // Previously this returned silently, so a click before the script finished
    // loading looked like nothing happened at all.
    if (!scriptLoaded) {
      throw new Error(
        'react-monnify: the Monnify inline script is still loading. ' +
          'Disable your pay button until it is ready.',
      );
    }

    const monnifyArgs: Record<string, any> = {
      onComplete: onComplete ? onComplete : (): any => null,
      onClose: onClose ? onClose : (): any => null,
      isTestMode,
      apiKey,
      contractCode,
      amount,
      reference,
      currency: currency || 'NGN',
      customerFullName: customerFullName || '',
      // The inline SDK reads `customerName` when it builds its /transaction/init
      // payload and ignores `customerFullName`, so sending only the latter meant
      // the customer's name never reached Monnify. Send both.
      customerName: customerFullName || '',
      customerEmail: customerEmail || '',
      customerMobileNumber: customerMobileNumber || '',
      paymentDescription: paymentDescription || '',
      redirectUrl: redirectUrl || '',
      metadata: metadata || {},
      incomeSplitConfig: incomeSplitConfig || null,
      'data-custom-button': options['data-custom-button'] || '',
    };
    callMonnifySDK(clean(monnifyArgs));
  }

  return initializePayment;
}
