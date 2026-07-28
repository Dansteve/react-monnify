import { MonnifyProps } from '../types';
export declare const config: MonnifyProps;
/**
 * jsdom never executes or fires load events for injected external scripts, so
 * tests drive the lifecycle by hand.
 */
export declare const fireScriptLoad: () => void;
export declare const fireScriptError: () => void;
/** Installs a fake Monnify SDK on window and returns the initialize spy. */
export declare const installFakeSDK: () => jest.Mock;
