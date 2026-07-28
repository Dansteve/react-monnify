import React, { ReactElement, Ref } from 'react';
import { MonnifyProps } from './types';
export interface MonnifyRenderProps {
    initializePayment: () => void;
    ref?: Ref<any>;
}
interface MonnifyConsumerProps extends MonnifyProps {
    children: (props: MonnifyRenderProps) => ReactElement | null;
    onSuccess?: Function;
    onClose?: Function;
}
declare const MonnifyConsumer: React.ForwardRefExoticComponent<MonnifyConsumerProps & React.RefAttributes<any>>;
export default MonnifyConsumer;
