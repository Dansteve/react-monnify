import { GladepayProps } from './types';
export default function useGladepayPayment(options: GladepayProps): (callback?: Function, onClose?: Function) => void;
