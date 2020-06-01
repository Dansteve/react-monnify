export const callGladepaySDK = (gladepayArgs: Record<string, any>): void => {
  console.log('callGladepaySDK', gladepayArgs);
  //@ts-ignore
  const handler = window.gladepaySDK && window.gladepaySDK.initialize(gladepayArgs);
  console.log('handler', window);
  handler && handler.loadIframe(gladepayArgs);
};
