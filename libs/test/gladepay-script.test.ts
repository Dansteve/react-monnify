// @ts-ignore
import {renderHook, cleanup} from '@testing-library/react-hooks';
import useMonnifyScript from '../monnify-script';

describe('useMonnifyScript()', () => {
  afterAll(() => {
    cleanup();
    document.body.innerHTML = '';
  });

  it('adds the script to the dom', () => {
    const {result} = renderHook(() => useMonnifyScript());

    expect(result.current[0]).toBe(false);
    expect(result.current[1]).toBe(false);
    expect(document.getElementsByTagName('script')).toBeDefined();
  });

  it('Will not load multi inline script', () => {
    renderHook(() => useMonnifyScript());
    const {result} = renderHook(() => useMonnifyScript());

    expect(result.current[0]).toBe(true);
    expect(result.current[1]).toBe(false);
    expect(document.getElementsByTagName('script').length).toBe(1);
    expect(document.body.innerHTML).toMatch(
      new RegExp('https://demo.api.monnify.com/checkout.js'),
    );
  });
});
