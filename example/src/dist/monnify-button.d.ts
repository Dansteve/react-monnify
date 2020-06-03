import { ReactNode } from 'react';
import { MonnifyProps } from './types';
interface MonnifyButtonProps extends MonnifyProps {
    text?: string;
    className?: string;
    children?: ReactNode;
    onSuccess?: Function;
    onClose?: Function;
}
declare const MonnifyButton: ({ text, className, children, onSuccess, onClose, ...others }: MonnifyButtonProps) => JSX.Element;
export default MonnifyButton;
