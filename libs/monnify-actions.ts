export const callMonnifySDK = (monnifyArgs: Record<string, any>): void => {
  console.log('callMonnifySDK', monnifyArgs);
  //@ts-ignore
  const handler = window.MonnifySDK && window.MonnifySDK.initialize(monnifyArgs);
  console.log('handler', window);
  // handler && handler.loadIframe(monnifyArgs);
};
