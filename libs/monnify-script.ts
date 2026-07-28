import {useState, useEffect} from 'react';

/**
 * Monnify's inline SDK is served from two different hosts. Loading the sandbox
 * bundle in production silently points live traffic at the test environment,
 * so these must stay distinct.
 */
export const MONNIFY_SANDBOX_SDK_URL = 'https://sandbox.sdk.monnify.com/plugin/monnify.js';
export const MONNIFY_PRODUCTION_SDK_URL = 'https://sdk.monnify.com/plugin/monnify.js';

export const getMonnifyScriptUrl = (isTestMode = false): string =>
  isTestMode ? MONNIFY_SANDBOX_SDK_URL : MONNIFY_PRODUCTION_SDK_URL;

/**
 * One in-flight load per URL, shared across every hook consumer. Keyed by URL so
 * that a component rendered in test mode and one rendered in live mode do not
 * resolve each other's script.
 */
const pendingLoads = new Map<string, Promise<void>>();

const loadScript = (src: string): Promise<void> => {
  const existing = pendingLoads.get(src);
  if (existing) return existing;

  const pending = new Promise<void>((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('react-monnify: no document available (server-side render?)'));
      return;
    }

    // A previous instance of the app may already have injected the tag.
    const mounted = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (mounted && mounted.dataset.monnifyLoaded === 'true') {
      resolve();
      return;
    }

    const script = mounted || document.createElement('script');
    script.src = src;
    script.async = true;

    function cleanup(): void {
      script.removeEventListener('load', onLoad);
      script.removeEventListener('error', onError);
    }

    const onLoad = (): void => {
      script.dataset.monnifyLoaded = 'true';
      cleanup();
      resolve();
    };

    const onError = (): void => {
      cleanup();
      script.remove();
      // Drop the cached promise so a later mount can retry the load.
      pendingLoads.delete(src);
      reject(new Error(`react-monnify: unable to load the Monnify inline script from ${src}`));
    };

    script.addEventListener('load', onLoad);
    script.addEventListener('error', onError);

    if (!mounted) document.body.appendChild(script);
  });

  pendingLoads.set(src, pending);
  return pending;
};

/**
 * Loads the Monnify inline SDK.
 *
 * @param isTestMode load the sandbox bundle instead of the production one.
 * @returns `[loaded, error]` — `loaded` only turns true once the script has
 *   actually executed, never merely because a load was started.
 */
export default function useMonnifyScript(isTestMode = false): boolean[] {
  const src = getMonnifyScriptUrl(isTestMode);
  const [state, setState] = useState<{loaded: boolean; error: boolean}>({
    loaded: false,
    error: false,
  });

  useEffect(() => {
    let active = true;

    loadScript(src).then(
      () => {
        if (active) setState({loaded: true, error: false});
      },
      () => {
        if (active) setState({loaded: false, error: true});
      },
    );

    return (): void => {
      active = false;
    };
  }, [src]);

  return [state.loaded, state.error];
}

/** Exposed for tests — clears the shared load cache. */
export const __resetMonnifyScriptCache = (): void => {
  pendingLoads.clear();
};
