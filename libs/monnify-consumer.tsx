import React, {forwardRef, useContext, FunctionComponentElement} from 'react';
import MonnifyProvider from './monnify-provider';
import {MonnifyProps} from './types';
import MonnifyContext from './monnify-context';

interface MonnifyConsumerProps extends MonnifyProps {
  children: Function;
  onSuccess?: Function;
  onClose?: Function;
}

const MonnifyConsumerChild = ({
  children,
  ref,
}: {
  children: Function;
  ref: any;
}): FunctionComponentElement<any> => {
  const {initializePayment, onSuccess, onClose} = useContext(MonnifyContext);
  const completeInitializePayment = (): void => initializePayment(onSuccess, onClose);
  return children({initializePayment: completeInitializePayment, ref});
};

const MonnifyConsumer = forwardRef(
  (
    {children, onSuccess: paraSuccess, onClose: paraClose, ...others}: MonnifyConsumerProps,
    ref: any,
  ): JSX.Element => {
    const onSuccess = paraSuccess ? paraSuccess : (): any => null;
    const onClose = paraClose ? paraClose : (): any => null;
    return (
      <MonnifyProvider {...others} onSuccess={onSuccess} onClose={onClose}>
        <MonnifyConsumerChild ref={ref}>{children}</MonnifyConsumerChild>
      </MonnifyProvider>
    );
  },
);

export default MonnifyConsumer;
