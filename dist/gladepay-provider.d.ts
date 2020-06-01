/// <reference types="react" />
import { GladepayProps } from './types';
interface GladepayProviderProps extends GladepayProps {
    children: JSX.Element;
    onSuccess: Function;
    onClose: Function;
}
declare const GladepayProvider: ({ children, onSuccess, onClose, ...others }: GladepayProviderProps) => JSX.Element;
export default GladepayProvider;
