export const callMonnifySDK = (monnifyArgs: Record<string, any>): void => {
  //@ts-ignore
  const handler = window.MonnifySDK && window.MonnifySDK.initialize(monnifyArgs);
};
