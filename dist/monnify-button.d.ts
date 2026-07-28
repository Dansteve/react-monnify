import { ReactElement, ReactNode, ButtonHTMLAttributes } from 'react';
import { MonnifyProps } from './types';
interface MonnifyButtonProps extends MonnifyProps {
    text?: string;
    className?: string;
    children?: ReactNode;
    disabled?: boolean;
    type?: ButtonHTMLAttributes<HTMLButtonElement>['type'];
    onSuccess?: Function;
    onClose?: Function;
}
declare const MonnifyButton: ({ text, className, children, disabled, type, onSuccess, onClose, ...others }: MonnifyButtonProps) => ReactElement;
export default MonnifyButton;
