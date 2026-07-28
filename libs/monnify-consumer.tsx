import React, {forwardRef, useContext, ReactElement, Ref} from 'react';
import MonnifyProvider from './monnify-provider';
import {MonnifyProps} from './types';
import MonnifyContext from './monnify-context';

export interface MonnifyRenderProps {
  initializePayment: () => void;
  ref?: Ref<any>;
}

interface MonnifyConsumerProps extends MonnifyProps {
  children: (props: MonnifyRenderProps) => ReactElement | null;
  onSuccess?: Function;
  onClose?: Function;
}

/**
 * `forwardedRef` is deliberately a plain prop rather than `ref`. A function
 * component cannot receive a `ref` prop on React 16-18 — React strips it and
 * warns — which is why the ref handed to the render prop used to be undefined.
 */
const MonnifyConsumerChild = ({
  children,
  forwardedRef,
}: {
  children: (props: MonnifyRenderProps) => ReactElement | null;
  forwardedRef?: Ref<any>;
}): ReactElement | null => {
  const {initializePayment, onSuccess, onClose} = useContext(MonnifyContext);
  const completeInitializePayment = (): void => initializePayment(onSuccess, onClose);
  return children({initializePayment: completeInitializePayment, ref: forwardedRef});
};

const MonnifyConsumer = forwardRef<any, MonnifyConsumerProps>(
  ({children, onSuccess: paraSuccess, onClose: paraClose, ...others}, ref): ReactElement => {
    const onSuccess = paraSuccess ? paraSuccess : (): any => null;
    const onClose = paraClose ? paraClose : (): any => null;
    return (
      <MonnifyProvider {...others} onSuccess={onSuccess} onClose={onClose}>
        <MonnifyConsumerChild forwardedRef={ref}>{children}</MonnifyConsumerChild>
      </MonnifyProvider>
    );
  },
);

MonnifyConsumer.displayName = 'MonnifyConsumer';

export default MonnifyConsumer;
