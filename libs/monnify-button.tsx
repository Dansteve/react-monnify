import React, {ReactNode} from 'react';
import useMonnifyPayment from './use-monnify';
import {MonnifyProps} from './types';

interface MonnifyButtonProps extends MonnifyProps {
  text?: string;
  className?: string;
  children?: ReactNode;
  onSuccess?: Function;
  onClose?: Function;
}

const MonnifyButton = ({
  text,
  className,
  children,
  onSuccess,
  onClose,
  ...others
}: MonnifyButtonProps): JSX.Element => {
  const initializePayment = useMonnifyPayment(others);
  return (
    <button className={className} onClick={(): void => initializePayment(onSuccess, onClose)}>
      {text || children}
    </button>
  );
};

export default MonnifyButton;
