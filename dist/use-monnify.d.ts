import { MonnifyProps } from './types';
export default function useMonnifyPayment(options: MonnifyProps): (onComplete?: Function, onClose?: Function) => void;
