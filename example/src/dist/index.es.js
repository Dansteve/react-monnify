import React, { useState, useEffect, createContext, forwardRef, useContext } from 'react';

var cachedScripts = [];
function useMonnifyScript(isTestMode) {
    if (isTestMode === void 0) { isTestMode = false; }
    var src = '';
    if (isTestMode) {
        src = 'https://sandbox.sdk.monnify.com/plugin/monnify.js';
    }
    else {
        src = 'https://sandbox.sdk.monnify.com/plugin/monnify.js';
    }
    var _a = useState({
        loaded: false,
        error: false,
    }), state = _a[0], setState = _a[1];
    useEffect(function () {
        if (cachedScripts.includes(src)) {
            setState({
                loaded: true,
                error: false,
            });
        }
        else {
            cachedScripts.push(src);
            var script_1 = document.createElement('script');
            script_1.src = src;
            script_1.async = true;
            var onScriptLoad_1 = function () {
                setState({
                    loaded: true,
                    error: false,
                });
            };
            var onScriptError_1 = function () {
                var index = cachedScripts.indexOf(src);
                if (index >= 0)
                    cachedScripts.splice(index, 1);
                script_1.remove();
                setState({
                    loaded: true,
                    error: true,
                });
            };
            script_1.addEventListener('load', onScriptLoad_1);
            script_1.addEventListener('complete', onScriptLoad_1);
            script_1.addEventListener('error', onScriptError_1);
            document.body.appendChild(script_1);
            return function () {
                script_1.removeEventListener('load', onScriptLoad_1);
                script_1.removeEventListener('error', onScriptError_1);
            };
        }
    }, [src]);
    return [state.loaded, state.error];
}

var callMonnifySDK = function (monnifyArgs) {
    console.log('callMonnifySDK', monnifyArgs);
    //@ts-ignore
    var handler = window.MonnifySDK && window.MonnifySDK.initialize(monnifyArgs);
    console.log('handler', window);
    // handler && handler.loadIframe(monnifyArgs);
};

function useMonnifyPayment(options) {
    var _a = useMonnifyScript(options.isTestMode), scriptLoaded = _a[0], scriptError = _a[1];
    var isTestMode = options.isTestMode, apiKey = options.apiKey, contractCode = options.contractCode, amount = options.amount, reference = options.reference, currency = options.currency, customerFullName = options.customerFullName, customerEmail = options.customerEmail, customerMobileNumber = options.customerMobileNumber, paymentDescription = options.paymentDescription, redirectUrl = options.redirectUrl, metadata = options.metadata, incomeSplitConfig = options.incomeSplitConfig;
    function clean(obj) {
        // tslint:disable-next-line:prefer-const
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
        return obj;
    }
    function initializePayment(onComplete, onClose) {
        if (scriptError) {
            throw new Error('Unable to load monnify inline script');
        }
        if (scriptLoaded) {
            var monnifyArgs = {
                onComplete: onComplete ? onComplete : function () { return null; },
                onClose: onClose ? onClose : function () { return null; },
                isTestMode: isTestMode,
                apiKey: apiKey,
                contractCode: contractCode,
                amount: amount,
                reference: reference,
                currency: currency || 'NGN',
                customerFullName: customerFullName || '',
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
    }
    useEffect(function () {
        if (scriptError) {
            throw new Error('Unable to load monnify inline script');
        }
    }, [scriptError]);
    return initializePayment;
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

var MonnifyButton = function (_a) {
    var text = _a.text, className = _a.className, children = _a.children, onSuccess = _a.onSuccess, onClose = _a.onClose, others = __rest(_a, ["text", "className", "children", "onSuccess", "onClose"]);
    var initializePayment = useMonnifyPayment(others);
    return (React.createElement("button", { className: className, onClick: function () { return initializePayment(onSuccess, onClose); } }, text || children));
};

var MonnifyContext = createContext({
    initializePayment: function () { return null; },
    onSuccess: function () { return null; },
    onClose: function () { return null; },
});

var MonnifyProvider = function (_a) {
    var children = _a.children, onSuccess = _a.onSuccess, onClose = _a.onClose, others = __rest(_a, ["children", "onSuccess", "onClose"]);
    var initializePayment = useMonnifyPayment(others);
    return (React.createElement(MonnifyContext.Provider, { value: { initializePayment: initializePayment, onSuccess: onSuccess, onClose: onClose } }, children));
};

var MonnifyConsumerChild = function (_a) {
    var children = _a.children, ref = _a.ref;
    var _b = useContext(MonnifyContext), initializePayment = _b.initializePayment, onSuccess = _b.onSuccess, onClose = _b.onClose;
    var completeInitializePayment = function () { return initializePayment(onSuccess, onClose); };
    return children({ initializePayment: completeInitializePayment, ref: ref });
};
var MonnifyConsumer = forwardRef(function (_a, ref) {
    var children = _a.children, paraSuccess = _a.onSuccess, paraClose = _a.onClose, others = __rest(_a, ["children", "onSuccess", "onClose"]);
    var onSuccess = paraSuccess ? paraSuccess : function () { return null; };
    var onClose = paraClose ? paraClose : function () { return null; };
    return (React.createElement(MonnifyProvider, __assign({}, others, { onSuccess: onSuccess, onClose: onClose }),
        React.createElement(MonnifyConsumerChild, { ref: ref }, children)));
});

export { MonnifyButton, MonnifyConsumer, useMonnifyPayment };
//# sourceMappingURL=index.es.js.map
