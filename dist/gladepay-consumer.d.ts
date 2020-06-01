import React from 'react';
import { GladepayProps } from './types';
interface GladepayConsumerProps extends GladepayProps {
    children: Function;
    onSuccess?: Function;
    onClose?: Function;
}
declare const GladepayConsumer: React.ForwardRefExoticComponent<GladepayConsumerProps & React.RefAttributes<unknown>>;
export default GladepayConsumer;
