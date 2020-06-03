/// <reference types="react" />
import { MonnifyProps } from './types';
interface MonnifyProviderProps extends MonnifyProps {
    children: JSX.Element;
    onSuccess: Function;
    onClose: Function;
}
declare const MonnifyProvider: ({ children, onSuccess, onClose, ...others }: MonnifyProviderProps) => JSX.Element;
export default MonnifyProvider;
