import {createContext} from 'react';

type IMonnifyContext = {
  initializePayment: Function;
  onSuccess: Function;
  onClose: Function;
};

const MonnifyContext = createContext<IMonnifyContext>({
  initializePayment: () => null,
  onSuccess: () => null,
  onClose: () => null,
});

export default MonnifyContext;
