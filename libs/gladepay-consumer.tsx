import React, {forwardRef, useContext, FunctionComponentElement} from 'react';
import GladepayProvider from './gladepay-provider';
import {GladepayProps} from './types';
import GladepayContext from './gladepay-context';

interface GladepayConsumerProps extends GladepayProps {
  children: Function;
  onSuccess?: Function;
  onClose?: Function;
}

const GladepayConsumerChild = ({
  children,
  ref,
}: {
  children: Function;
  ref: any;
}): FunctionComponentElement<any> => {
  const {initializePayment, onSuccess, onClose} = useContext(GladepayContext);
  const completeInitializePayment = (): void => initializePayment(onSuccess, onClose);
  return children({initializePayment: completeInitializePayment, ref});
};

const GladepayConsumer = forwardRef(
  (
    {children, onSuccess: paraSuccess, onClose: paraClose, ...others}: GladepayConsumerProps,
    ref: any,
  ): JSX.Element => {
    const onSuccess = paraSuccess ? paraSuccess : (): any => null;
    const onClose = paraClose ? paraClose : (): any => null;
    return (
      <GladepayProvider {...others} onSuccess={onSuccess} onClose={onClose}>
        <GladepayConsumerChild ref={ref}>{children}</GladepayConsumerChild>
      </GladepayProvider>
    );
  },
);

export default GladepayConsumer;
