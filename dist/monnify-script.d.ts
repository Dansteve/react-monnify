/**
 * Monnify's inline SDK is served from two different hosts. Loading the sandbox
 * bundle in production silently points live traffic at the test environment,
 * so these must stay distinct.
 */
export declare const MONNIFY_SANDBOX_SDK_URL = "https://sandbox.sdk.monnify.com/plugin/monnify.js";
export declare const MONNIFY_PRODUCTION_SDK_URL = "https://sdk.monnify.com/plugin/monnify.js";
export declare const getMonnifyScriptUrl: (isTestMode?: boolean) => string;
/**
 * Loads the Monnify inline SDK.
 *
 * @param isTestMode load the sandbox bundle instead of the production one.
 * @returns `[loaded, error]` — `loaded` only turns true once the script has
 *   actually executed, never merely because a load was started.
 */
export default function useMonnifyScript(isTestMode?: boolean): boolean[];
/** Exposed for tests — clears the shared load cache. */
export declare const __resetMonnifyScriptCache: () => void;
