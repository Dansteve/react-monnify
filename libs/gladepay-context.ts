import {createContext} from 'react';

type IGladepayContext = {
  initializePayment: Function;
  onSuccess: Function;
  onClose: Function;
};

const GladepayContext = createContext<IGladepayContext>({
  initializePayment: () => null,
  onSuccess: () => null,
  onClose: () => null,
});

export default GladepayContext;
