import React, {ReactNode} from 'react';
import useGladepayPayment from './use-gladepay';
import {GladepayProps} from './types';

interface GladepayButtonProps extends GladepayProps {
  text?: string;
  className?: string;
  children?: ReactNode;
  onSuccess?: Function;
  onClose?: Function;
}

const GladepayButton = ({
  text,
  className,
  children,
  onSuccess,
  onClose,
  ...others
}: GladepayButtonProps): JSX.Element => {
  const initializePayment = useGladepayPayment(others);
  return (
    <button className={className} onClick={(): void => initializePayment(onSuccess, onClose)}>
      {text || children}
    </button>
  );
};

export default GladepayButton;
