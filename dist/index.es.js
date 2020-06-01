import React, { useState, useEffect, createContext, forwardRef, useContext } from 'react';

var cachedScripts = [];
function useGladepayScript(is_production) {
    if (is_production === void 0) { is_production = false; }
    var src = '';
    if (is_production) {
        src = 'https://api.gladepay.com/checkout.js';
    }
    else {
        src = 'https://demo.api.gladepay.com/checkout.js';
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

var callGladepaySDK = function (gladepayArgs) {
    console.log('callGladepaySDK', gladepayArgs);
    //@ts-ignore
    var handler = window.gladepaySDK && window.gladepaySDK.initialize(gladepayArgs);
    console.log('handler', window);
    handler && handler.loadIframe(gladepayArgs);
};

function useGladepayPayment(options) {
    var _a = useGladepayScript(options.is_production), scriptLoaded = _a[0], scriptError = _a[1];
    var MID = options.MID, email = options.email, amount = options.amount, firstname = options.firstname, lastname = options.lastname, title = options.title, description = options.description, country = options.country, metadata = options.metadata, _b = options.currency, currency = _b === void 0 ? 'NGN' : _b, payment_method = options.payment_method, logo = options.logo, bearer = options.bearer, recurrent = options.recurrent, installment = options.installment, split = options.split;
    function clean(obj) {
        // tslint:disable-next-line:prefer-const
        for (var propName in obj) {
            if (obj[propName] === null || obj[propName] === undefined) {
                delete obj[propName];
            }
        }
        return obj;
    }
    function initializePayment(callback, onclose) {
        if (scriptError) {
            throw new Error('Unable to load gladepay inline script');
        }
        if (scriptLoaded) {
            var gladepayArgs = {
                callback: callback ? callback : function () { return null; },
                onclose: onclose ? onclose : function () { return null; },
                MID: MID,
                email: email,
                amount: amount,
                firstname: firstname || '',
                lastname: lastname || '',
                title: title || '',
                description: description || '',
                country: country || '',
                metadata: JSON.stringify(metadata || {}),
                currency: currency || 'NGN',
                payment_method: payment_method || ['card'],
                logo: logo || '',
                bearer: bearer || '',
                recurrent: recurrent || null,
                installment: installment || null,
                split: split || null,
                'data-custom-button': options['data-custom-button'] || '',
            };
            callGladepaySDK(clean(gladepayArgs));
        }
    }
    useEffect(function () {
        if (scriptError) {
            throw new Error('Unable to load gladepay inline script');
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

var GladepayButton = function (_a) {
    var text = _a.text, className = _a.className, children = _a.children, onSuccess = _a.onSuccess, onClose = _a.onClose, others = __rest(_a, ["text", "className", "children", "onSuccess", "onClose"]);
    var initializePayment = useGladepayPayment(others);
    return (React.createElement("button", { className: className, onClick: function () { return initializePayment(onSuccess, onClose); } }, text || children));
};

var GladepayContext = createContext({
    initializePayment: function () { return null; },
    onSuccess: function () { return null; },
    onClose: function () { return null; },
});

var GladepayProvider = function (_a) {
    var children = _a.children, onSuccess = _a.onSuccess, onClose = _a.onClose, others = __rest(_a, ["children", "onSuccess", "onClose"]);
    var initializePayment = useGladepayPayment(others);
    return (React.createElement(GladepayContext.Provider, { value: { initializePayment: initializePayment, onSuccess: onSuccess, onClose: onClose } }, children));
};

var GladepayConsumerChild = function (_a) {
    var children = _a.children, ref = _a.ref;
    var _b = useContext(GladepayContext), initializePayment = _b.initializePayment, onSuccess = _b.onSuccess, onClose = _b.onClose;
    var completeInitializePayment = function () { return initializePayment(onSuccess, onClose); };
    return children({ initializePayment: completeInitializePayment, ref: ref });
};
var GladepayConsumer = forwardRef(function (_a, ref) {
    var children = _a.children, paraSuccess = _a.onSuccess, paraClose = _a.onClose, others = __rest(_a, ["children", "onSuccess", "onClose"]);
    var onSuccess = paraSuccess ? paraSuccess : function () { return null; };
    var onClose = paraClose ? paraClose : function () { return null; };
    return (React.createElement(GladepayProvider, __assign({}, others, { onSuccess: onSuccess, onClose: onClose }),
        React.createElement(GladepayConsumerChild, { ref: ref }, children)));
});

export { GladepayButton, GladepayConsumer, useGladepayPayment };
//# sourceMappingURL=index.es.js.map
