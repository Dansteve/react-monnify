import { ReactNode } from 'react';
import { GladepayProps } from './types';
interface GladepayButtonProps extends GladepayProps {
    text?: string;
    className?: string;
    children?: ReactNode;
    onSuccess?: Function;
    onClose?: Function;
}
declare const GladepayButton: ({ text, className, children, onSuccess, onClose, ...others }: GladepayButtonProps) => JSX.Element;
export default GladepayButton;
