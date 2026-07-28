import React, { useState, useEffect, createContext, forwardRef, useContext } from 'react';

/**
 * Monnify's inline SDK is served from two different hosts. Loading the sandbox
 * bundle in production silently points live traffic at the test environment,
 * so these must stay distinct.
 */
const MONNIFY_SANDBOX_SDK_URL = 'https://sandbox.sdk.monnify.com/plugin/monnify.js';
const MONNIFY_PRODUCTION_SDK_URL = 'https://sdk.monnify.com/plugin/monnify.js';
const getMonnifyScriptUrl = (isTestMode = false) => isTestMode ? MONNIFY_SANDBOX_SDK_URL : MONNIFY_PRODUCTION_SDK_URL;
/**
 * One in-flight load per URL, shared across every hook consumer. Keyed by URL so
 * that a component rendered in test mode and one rendered in live mode do not
 * resolve each other's script.
 */
const pendingLoads = new Map();
const loadScript = (src) => {
    const existing = pendingLoads.get(src);
    if (existing)
        return existing;
    const pending = new Promise((resolve, reject) => {
        if (typeof document === 'undefined') {
            reject(new Error('react-monnify: no document available (server-side render?)'));
            return;
        }
        // A previous instance of the app may already have injected the tag.
        const mounted = document.querySelector(`script[src="${src}"]`);
        if (mounted && mounted.dataset.monnifyLoaded === 'true') {
            resolve();
            return;
        }
        const script = mounted || document.createElement('script');
        script.src = src;
        script.async = true;
        function cleanup() {
            script.removeEventListener('load', onLoad);
            script.removeEventListener('error', onError);
        }
        const onLoad = () => {
            script.dataset.monnifyLoaded = 'true';
            cleanup();
            resolve();
        };
        const onError = () => {
            cleanup();
            script.remove();
            // Drop the cached promise so a later mount can retry the load.
            pendingLoads.delete(src);
            reject(new Error(`react-monnify: unable to load the Monnify inline script from ${src}`));
        };
        script.addEventListener('load', onLoad);
        script.addEventListener('error', onError);
        if (!mounted)
            document.body.appendChild(script);
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
function useMonnifyScript(isTestMode = false) {
    const src = getMonnifyScriptUrl(isTestMode);
    const [state, setState] = useState({
        loaded: false,
        error: false,
    });
    useEffect(() => {
        let active = true;
        loadScript(src).then(() => {
            if (active)
                setState({ loaded: true, error: false });
        }, () => {
            if (active)
                setState({ loaded: false, error: true });
        });
        return () => {
            active = false;
        };
    }, [src]);
    return [state.loaded, state.error];
}

const getSDK = () => typeof window === 'undefined' ? undefined : window.MonnifySDK;
const callMonnifySDK = (monnifyArgs) => {
    const sdk = getSDK();
    if (!sdk || typeof sdk.initialize !== 'function') {
        throw new Error('react-monnify: the Monnify SDK is not available on window. ' +
            'Wait for the script to finish loading before starting a payment.');
    }
    sdk.initialize(monnifyArgs);
};

/** Strips null/undefined so the SDK never receives empty optional fields. */
const clean = (obj) => {
    const out = {};
    for (const key of Object.keys(obj)) {
        if (obj[key] !== null && obj[key] !== undefined)
            out[key] = obj[key];
    }
    return out;
};
function useMonnifyPayment(options) {
    const [scriptLoaded, scriptError] = useMonnifyScript(options.isTestMode);
    const { isTestMode, apiKey, contractCode, amount, reference, currency, customerFullName, customerEmail, customerMobileNumber, paymentDescription, redirectUrl, metadata, incomeSplitConfig, } = options;
    useEffect(() => {
        // Surface the failure without tearing down the host app — throwing from an
        // effect would unmount the whole tree for what is a recoverable condition.
        if (scriptError) {
            // eslint-disable-next-line no-console
            console.error('react-monnify: the Monnify inline script failed to load. Payments cannot start.');
        }
    }, [scriptError]);
    function initializePayment(onComplete, onClose) {
        if (scriptError) {
            throw new Error('react-monnify: unable to load the Monnify inline script');
        }
        // Previously this returned silently, so a click before the script finished
        // loading looked like nothing happened at all.
        if (!scriptLoaded) {
            throw new Error('react-monnify: the Monnify inline script is still loading. ' +
                'Disable your pay button until it is ready.');
        }
        const monnifyArgs = {
            onComplete: onComplete ? onComplete : () => null,
            onClose: onClose ? onClose : () => null,
            isTestMode,
            apiKey,
            contractCode,
            amount,
            reference,
            currency: currency || 'NGN',
            customerFullName: customerFullName || '',
            // The inline SDK reads `customerName` when it builds its /transaction/init
            // payload and ignores `customerFullName`, so sending only the latter meant
            // the customer's name never reached Monnify. Send both.
            customerName: customerFullName || '',
            customerEmail: customerEmail || '',
            customerMobileNumber: customerMobileNumber || '',
            paymentDescription: paymentDescription || '',
            redirectUrl: redirectUrl || '',
            metadata: metadata || {},
            incomeSplitConfig: incomeSplitConfig || null,
            'data-custom-button': options['data-custom-button'] || '',
        };
        callMonnifySDK(clean(monnifyArgs));
    }
    return initializePayment;
}

const MonnifyButton = ({ text, className, children, disabled, type = 'button', onSuccess, onClose, ...others }) => {
    const initializePayment = useMonnifyPayment(others);
    return (React.createElement("button", { type: type, className: className, disabled: disabled, onClick: () => initializePayment(onSuccess, onClose) }, text || children));
};

const MonnifyContext = createContext({
    initializePayment: () => null,
    onSuccess: () => null,
    onClose: () => null,
});

const MonnifyProvider = ({ children, onSuccess, onClose, ...others }) => {
    const initializePayment = useMonnifyPayment(others);
    return (React.createElement(MonnifyContext.Provider, { value: { initializePayment, onSuccess, onClose } }, children));
};

/**
 * `forwardedRef` is deliberately a plain prop rather than `ref`. A function
 * component cannot receive a `ref` prop on React 16-18 — React strips it and
 * warns — which is why the ref handed to the render prop used to be undefined.
 */
const MonnifyConsumerChild = ({ children, forwardedRef, }) => {
    const { initializePayment, onSuccess, onClose } = useContext(MonnifyContext);
    const completeInitializePayment = () => initializePayment(onSuccess, onClose);
    return children({ initializePayment: completeInitializePayment, ref: forwardedRef });
};
const MonnifyConsumer = forwardRef(({ children, onSuccess: paraSuccess, onClose: paraClose, ...others }, ref) => {
    const onSuccess = paraSuccess ? paraSuccess : () => null;
    const onClose = paraClose ? paraClose : () => null;
    return (React.createElement(MonnifyProvider, { ...others, onSuccess: onSuccess, onClose: onClose },
        React.createElement(MonnifyConsumerChild, { forwardedRef: ref }, children)));
});
MonnifyConsumer.displayName = 'MonnifyConsumer';

export { MONNIFY_PRODUCTION_SDK_URL, MONNIFY_SANDBOX_SDK_URL, MonnifyButton, MonnifyConsumer, MonnifyProvider, getMonnifyScriptUrl, useMonnifyPayment, useMonnifyScript };
//# sourceMappingURL=index.mjs.map
