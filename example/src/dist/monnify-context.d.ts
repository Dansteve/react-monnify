/// <reference types="react" />
declare type IMonnifyContext = {
    initializePayment: Function;
    onSuccess: Function;
    onClose: Function;
};
declare const MonnifyContext: import("react").Context<IMonnifyContext>;
export default MonnifyContext;
