import React, {ReactElement, ReactNode, ButtonHTMLAttributes} from 'react';
import useMonnifyPayment from './use-monnify';
import {MonnifyProps} from './types';

interface MonnifyButtonProps extends MonnifyProps {
  text?: string;
  className?: string;
  children?: ReactNode;
  disabled?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
  onSuccess?: Function;
  onClose?: Function;
}

const MonnifyButton = ({
  text,
  className,
  children,
  disabled,
  type = 'button',
  onSuccess,
  onClose,
  ...others
}: MonnifyButtonProps): ReactElement => {
  const initializePayment = useMonnifyPayment(others);
  return (
    <button
      type={type}
      className={className}
      disabled={disabled}
      onClick={(): void => initializePayment(onSuccess, onClose)}
    >
      {text || children}
    </button>
  );
};

export default MonnifyButton;
