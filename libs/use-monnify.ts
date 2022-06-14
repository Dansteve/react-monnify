import {useEffect} from 'react';
import {MonnifyProps} from './types';
import useMonnifyScript from './monnify-script';
import {callMonnifySDK} from './monnify-actions';

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

  const clean = (obj: any): any => {
    // tslint:disable-next-line:prefer-const
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  };

  function initializePayment(onComplete?: Function, onClose?: Function): void {
    if (scriptError) {
      throw new Error('Unable to load monnify inline script');
    }

    if (scriptLoaded) {
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
  }

  useEffect(() => {
    if (scriptError) {
      throw new Error('Unable to load monnify inline script');
    }
  }, [scriptError]);

  return initializePayment;
}
