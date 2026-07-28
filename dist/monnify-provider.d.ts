import { ReactElement, ReactNode } from 'react';
import { MonnifyProps } from './types';
interface MonnifyProviderProps extends MonnifyProps {
    children: ReactNode;
    onSuccess: Function;
    onClose: Function;
}
declare const MonnifyProvider: ({ children, onSuccess, onClose, ...others }: MonnifyProviderProps) => ReactElement;
export default MonnifyProvider;
