import React from 'react';
import MonnifyContext from './monnify-context';
import useMonnifyPayment from './use-monnify';
import {MonnifyProps} from './types';

interface MonnifyProviderProps extends MonnifyProps {
  children: JSX.Element;
  onSuccess: Function;
  onClose: Function;
}

const MonnifyProvider = ({
  children,
  onSuccess,
  onClose,
  ...others
}: MonnifyProviderProps): JSX.Element => {
  const initializePayment = useMonnifyPayment(others);
  return (
    <MonnifyContext.Provider value={{initializePayment, onSuccess, onClose}}>
      {children}
    </MonnifyContext.Provider>
  );
};

export default MonnifyProvider;
