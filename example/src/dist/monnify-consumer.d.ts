import React from 'react';
import { MonnifyProps } from './types';
interface MonnifyConsumerProps extends MonnifyProps {
    children: Function;
    onSuccess?: Function;
    onClose?: Function;
}
declare const MonnifyConsumer: React.ForwardRefExoticComponent<MonnifyConsumerProps & React.RefAttributes<unknown>>;
export default MonnifyConsumer;
