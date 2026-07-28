import React from 'react';
import {render, fireEvent, act, waitFor, screen} from '@testing-library/react';
import MonnifyButton from '../monnify-button';
import {__resetMonnifyScriptCache} from '../monnify-script';
import {config, fireScriptLoad, installFakeSDK} from './fixtures';

let initialize: jest.Mock;

const componentProps = {
  ...config,
  isTestMode: true,
  className: 'btn',
  text: 'Pay now',
  onSuccess: (): null => null,
  onClose: (): null => null,
};

beforeEach(() => {
  __resetMonnifyScriptCache();
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  initialize = installFakeSDK();
});

describe('<MonnifyButton />', () => {
  it('renders the button label', () => {
    render(<MonnifyButton {...componentProps} />);
    expect(screen.getByText('Pay now')).toBeInTheDocument();
  });

  it('renders children when no text prop is given', () => {
    const {text: _text, ...rest} = componentProps;
    render(<MonnifyButton {...rest}>Give</MonnifyButton>);
    expect(screen.getByText('Give')).toBeInTheDocument();
  });

  it('defaults to type="button" so it cannot submit a surrounding form', () => {
    render(<MonnifyButton {...componentProps} />);
    expect(screen.getByText('Pay now')).toHaveAttribute('type', 'button');
  });

  it('starts a payment on click once the script has loaded', async () => {
    render(<MonnifyButton {...componentProps} />);

    await act(async () => {
      fireScriptLoad();
    });
    await waitFor(() => expect(document.querySelector('script')).toBeTruthy());

    fireEvent.click(screen.getByText('Pay now'));
    expect(initialize).toHaveBeenCalledTimes(1);
  });

  it('honours the disabled prop', () => {
    render(<MonnifyButton {...componentProps} disabled />);
    fireEvent.click(screen.getByText('Pay now'));
    expect(initialize).not.toHaveBeenCalled();
  });
});
