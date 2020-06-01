import {useEffect} from 'react';
import {GladepayProps} from './types';
import useGladepayScript from './gladepay-script';
import {callGladepaySDK} from './gladepay-actions';

export default function useGladepayPayment(
  options: GladepayProps,
): (callback?: Function, onClose?: Function) => void {
  const [scriptLoaded, scriptError] = useGladepayScript(options.is_production);
  const {
    MID,
    email,
    amount,
    firstname,
    lastname,
    title,
    description,
    country,
    metadata,
    currency = 'NGN',
    payment_method,
    logo,
    bearer,
    recurrent,
    installment,
    split,
  } = options;

  function clean(obj: any) {
    // tslint:disable-next-line:prefer-const
    for (const propName in obj) {
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
    return obj;
  }

  function initializePayment(callback?: Function, onclose?: Function): void {
    if (scriptError) {
      throw new Error('Unable to load gladepay inline script');
    }

    if (scriptLoaded) {
      const gladepayArgs: Record<string, any> = {
        callback: callback ? callback : (): any => null,
        onclose: onclose ? onclose : (): any => null,
        MID,
        email,
        amount,
        firstname: firstname || '',
        lastname: lastname || '',
        title: title || '',
        description: description || '',
        country: country || '',
        metadata: JSON.stringify(metadata || {}),
        currency: currency || 'NGN',
        payment_method: payment_method || ['card'],
        logo: logo || '',
        bearer: bearer || '',
        recurrent: recurrent || null,
        installment: installment || null,
        split: split || null,
        'data-custom-button': options['data-custom-button'] || '',
      };
      callGladepaySDK(clean(gladepayArgs));
    }
  }

  useEffect(() => {
    if (scriptError) {
      throw new Error('Unable to load gladepay inline script');
    }
  }, [scriptError]);

  return initializePayment;
}
