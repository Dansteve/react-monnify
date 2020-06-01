/// <reference types="react" />
declare type IGladepayContext = {
    initializePayment: Function;
    onSuccess: Function;
    onClose: Function;
};
declare const GladepayContext: import("react").Context<IGladepayContext>;
export default GladepayContext;
