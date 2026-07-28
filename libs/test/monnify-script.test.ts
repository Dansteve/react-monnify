import {renderHook, waitFor, act} from '@testing-library/react';
import useMonnifyScript, {
  getMonnifyScriptUrl,
  MONNIFY_SANDBOX_SDK_URL,
  MONNIFY_PRODUCTION_SDK_URL,
  __resetMonnifyScriptCache,
} from '../monnify-script';
import {fireScriptLoad, fireScriptError} from './fixtures';

const scriptSrcs = (): string[] =>
  Array.from(document.querySelectorAll('script')).map((s) => s.getAttribute('src') || '');

beforeEach(() => {
  __resetMonnifyScriptCache();
  document.body.innerHTML = '';
  document.head.innerHTML = '';
});

describe('getMonnifyScriptUrl()', () => {
  // Regression test for the bug where both branches returned the sandbox URL,
  // so production traffic silently ran against Monnify's test environment.
  it('uses the production host when not in test mode', () => {
    expect(getMonnifyScriptUrl(false)).toBe(MONNIFY_PRODUCTION_SDK_URL);
    expect(getMonnifyScriptUrl()).toBe(MONNIFY_PRODUCTION_SDK_URL);
  });

  it('uses the sandbox host in test mode', () => {
    expect(getMonnifyScriptUrl(true)).toBe(MONNIFY_SANDBOX_SDK_URL);
  });

  it('never returns the same URL for both modes', () => {
    expect(getMonnifyScriptUrl(true)).not.toBe(getMonnifyScriptUrl(false));
  });
});

describe('useMonnifyScript()', () => {
  it('injects the production script by default', () => {
    renderHook(() => useMonnifyScript());
    expect(scriptSrcs()).toContain(MONNIFY_PRODUCTION_SDK_URL);
  });

  it('injects the sandbox script in test mode', () => {
    renderHook(() => useMonnifyScript(true));
    expect(scriptSrcs()).toContain(MONNIFY_SANDBOX_SDK_URL);
  });

  it('does not report loaded until the script actually fires load', async () => {
    const {result} = renderHook(() => useMonnifyScript(true));

    expect(result.current[0]).toBe(false);
    expect(result.current[1]).toBe(false);

    await act(async () => {
      fireScriptLoad();
    });

    await waitFor(() => expect(result.current[0]).toBe(true));
    expect(result.current[1]).toBe(false);
  });

  it('reports an error and stays unloaded when the script fails', async () => {
    const {result} = renderHook(() => useMonnifyScript(true));

    await act(async () => {
      fireScriptError();
    });

    await waitFor(() => expect(result.current[1]).toBe(true));
    // The old implementation set loaded:true on error, which let callers
    // proceed to start a payment against an SDK that was never there.
    expect(result.current[0]).toBe(false);
  });

  it('injects only one tag when two consumers request the same script', async () => {
    renderHook(() => useMonnifyScript(true));
    const second = renderHook(() => useMonnifyScript(true));

    expect(scriptSrcs().filter((s) => s === MONNIFY_SANDBOX_SDK_URL)).toHaveLength(1);

    // A second consumer mounting mid-flight must wait for the real load event
    // rather than immediately believing the script is ready.
    expect(second.result.current[0]).toBe(false);

    await act(async () => {
      fireScriptLoad();
    });
    await waitFor(() => expect(second.result.current[0]).toBe(true));
  });

  it('loads separate scripts for test and live mode', () => {
    renderHook(() => useMonnifyScript(true));
    renderHook(() => useMonnifyScript(false));

    expect(scriptSrcs()).toEqual(
      expect.arrayContaining([MONNIFY_SANDBOX_SDK_URL, MONNIFY_PRODUCTION_SDK_URL]),
    );
  });
});
