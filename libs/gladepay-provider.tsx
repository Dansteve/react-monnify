import React from 'react';
import GladepayContext from './gladepay-context';
import useGladepayPayment from './use-gladepay';
import {GladepayProps} from './types';

interface GladepayProviderProps extends GladepayProps {
  children: JSX.Element;
  onSuccess: Function;
  onClose: Function;
}

const GladepayProvider = ({
  children,
  onSuccess,
  onClose,
  ...others
}: GladepayProviderProps): JSX.Element => {
  const initializePayment = useGladepayPayment(others);
  return (
    <GladepayContext.Provider value={{initializePayment, onSuccess, onClose}}>
      {children}
    </GladepayContext.Provider>
  );
};

export default GladepayProvider;
