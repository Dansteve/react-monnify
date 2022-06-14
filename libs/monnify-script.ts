import {useState, useEffect} from 'react';

const cachedScripts: string[] = [];
interface IScriptResult {
  loaded: boolean;
  error: boolean;
}

export default function useMonnifyScript(isTestMode = false): boolean[] {
  let src = '';
  if (isTestMode) {
    src = 'https://sandbox.sdk.monnify.com/plugin/monnify.js';
  } else {
    src = 'https://sdk.monnify.com/plugin/monnify.js';
  }

  const [state, setState] = useState<IScriptResult>({
    loaded: false,
    error: false,
  });

  useEffect((): any => {
    if (cachedScripts.includes(src)) {
      setState({
        loaded: true,
        error: false,
      });
    } else {
      cachedScripts.push(src);

      const script = document.createElement('script');
      script.src = src;
      script.async = true;

      const onScriptLoad = (): void => {
        setState({
          loaded: true,
          error: false,
        });
      };

      const onScriptError = (): void => {
        const index = cachedScripts.indexOf(src);
        if (index >= 0) cachedScripts.splice(index, 1);
        script.remove();

        setState({
          loaded: true,
          error: true,
        });
      };

      script.addEventListener('load', onScriptLoad);
      script.addEventListener('complete', onScriptLoad);
      script.addEventListener('error', onScriptError);

      document.body.appendChild(script);

      return (): void => {
        script.removeEventListener('load', onScriptLoad);
        script.removeEventListener('error', onScriptError);
      };
    }
  }, [src]);

  return [state.loaded, state.error];
}
